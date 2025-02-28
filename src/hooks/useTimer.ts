import { useState, useEffect, useRef } from "react";
import { useSettings } from "../components/settings/SettingsContext";

// Define the structure of the timer state.
interface TimerState {
    timeRemaining: number;
    isRunning: boolean;
    phase: 'focus' | 'break';
    currentBreakIndex: number | null; // Tracks which break is active (null if in focus phase)
}

// Hook to manage the timer logic.
export const useTimer = () => {
    const { settings } = useSettings();
    
    // Ensure the timer initializes with the correct focus duration from settings
    const [timer, setTimer] = useState<TimerState>({
        timeRemaining: settings.focusDuration > 0 ? settings.focusDuration : 0,
        isRunning: false,
        phase: 'focus',
        currentBreakIndex: null,
    });

    const intervalRef = useRef<number | null>(null);
    const audioRef = useRef(new Audio('/Marconi Union  Weightless Official Extended Version.mp3'));

    // When the focus duration changes in settings, update the timer (but only if not running)
    useEffect(() => {
        if (!timer.isRunning && timer.phase === 'focus') {
            setTimer((prev) => ({
                ...prev,
                timeRemaining: settings.focusDuration > 0 ? settings.focusDuration : 0,
            }));
        }
    }, [settings.focusDuration]);

    useEffect(() => {
        if (timer.isRunning) {
            audioRef.current.play();

            intervalRef.current = window.setInterval(() => {
                setTimer((prev) => {
                    if (prev.timeRemaining <= 0) {
                        clearInterval(intervalRef.current!);
                        return handleSessionCompletion(prev);
                    }

                    const nextState = checkForBreakTrigger(prev);
                    if (nextState) {
                        clearInterval(intervalRef.current!);
                        return nextState;
                    }

                    return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current!);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        return () => clearInterval(intervalRef.current!);
    }, [timer.isRunning]);

    // Checks if a break should trigger based on % progress through focus time
    const checkForBreakTrigger = (currentTimer: TimerState): TimerState | null => {
        if (currentTimer.phase !== 'focus' || settings.breakCount === 0) return null;

        const elapsedTime = settings.focusDuration - currentTimer.timeRemaining;
        const progressPercentage = (elapsedTime / settings.focusDuration) * 100;

        const nextBreakIndex = settings.breaks.findIndex((breakConfig, index) => (
            index !== currentTimer.currentBreakIndex &&  // Ensure we don't trigger the same break twice
            progressPercentage >= breakConfig.position   // Check if we reached a break % mark
        ));

        if (nextBreakIndex !== -1 && nextBreakIndex !== currentTimer.currentBreakIndex) {
            return {
                ...currentTimer,
                phase: 'break',
                isRunning: false,  // Pause on break start
                timeRemaining: settings.breaks[nextBreakIndex].duration,
                currentBreakIndex: nextBreakIndex,
            };
        }

        return null;
    };

    // Handle transitioning between focus and breaks.
    const handleSessionCompletion = (prev: TimerState): TimerState => {
        if (prev.phase === 'focus') {
            // If focus time is over, reset to focus for next session
            return {
                ...prev,
                isRunning: false,
                phase: 'focus',
                timeRemaining: settings.focusDuration,
                currentBreakIndex: null,
            };
        } else {
            // Returning from break to focus
            return {
                ...prev,
                phase: 'focus',
                isRunning: false,
                timeRemaining: calculateNextFocusSegment(prev.currentBreakIndex! + 1),
            };
        }
    };

    // After a break, calculate how much focus time is left until the next break.
    const calculateNextFocusSegment = (nextBreakIndex: number): number => {
        if (nextBreakIndex >= settings.breaks.length) {
            return settings.focusDuration; // No more breaks, return full remaining focus time
        }

        const nextBreakPoint = (settings.breaks[nextBreakIndex].position / 100) * settings.focusDuration;
        return nextBreakPoint - getElapsedFocusTime();
    };

    // Calculate elapsed focus time (subtract break time and time remaining)
    const getElapsedFocusTime = () => {
        const elapsedBreakTime = settings.breaks
            .slice(0, (timer.currentBreakIndex ?? 0) + 1)
            .reduce((total, b) => total + b.duration, 0);

        return settings.focusDuration - timer.timeRemaining - elapsedBreakTime;
    };

    const startPause = () => {
        if (settings.focusDuration > 0) { // Ensure user has set a valid focus duration before starting
            setTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }));
        }
    };

    const reset = () => {
        setTimer({
            timeRemaining: settings.focusDuration,
            isRunning: false,
            phase: 'focus',
            currentBreakIndex: null,
        });
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    };

    return { timer, startPause, reset };
};

// import { useState, useEffect, useRef } from "react";
// import { useSettings } from "../components/settings/SettingsContext";

// // Define the structure of the timer state.
// interface TimerState {
//     timeRemaining: number;
//     isRunning: boolean;
//     phase: 'focus' | 'break';
//     currentBreakIndex: number | null; // Tracks which break is active (null if in focus phase)
// }

// // Hook to manage focus & break timer logic.
// export const useTimer = () => {
//     const { settings } = useSettings();

//     const [timer, setTimer] = useState<TimerState>({
//         timeRemaining: settings.focusDuration, // Always initialized from settings
//         isRunning: false,
//         phase: 'focus',
//         currentBreakIndex: null,
//     });

//     const intervalRef = useRef<number | null>(null);
//     const audioRef = useRef(new Audio('/Marconi Union  Weightless Official Extended Version.mp3'));

//     // Sync focus duration from settings if timer is in focus phase
//     useEffect(() => {
//         if (timer.phase === 'focus') {
//             setTimer((prev) => ({
//                 ...prev,
//                 timeRemaining: settings.focusDuration,
//             }));
//         }
//     }, [settings.focusDuration]);

//     useEffect(() => {
//         if (timer.isRunning) {
//             audioRef.current.play();

//             intervalRef.current = window.setInterval(() => {
//                 setTimer((prev) => {
//                     const nextState = checkForBreakTrigger(prev);
//                     if (nextState) {
//                         clearInterval(intervalRef.current!);
//                         return nextState;
//                     }

//                     if (prev.timeRemaining <= 0) {
//                         clearInterval(intervalRef.current!);
//                         return handleSessionCompletion(prev);
//                     }

//                     return { ...prev, timeRemaining: prev.timeRemaining - 1 };
//                 });
//             }, 1000);
//         } else {
//             clearInterval(intervalRef.current!);
//             audioRef.current.pause();
//             audioRef.current.currentTime = 0;
//         }

//         return () => clearInterval(intervalRef.current!);
//     }, [timer.isRunning]);

//     // Checks if a break should trigger based on percentage progress.
//     const checkForBreakTrigger = (currentTimer: TimerState): TimerState | null => {
//         if (currentTimer.phase !== 'focus') return null;

//         const progressPercentage = ((settings.focusDuration - currentTimer.timeRemaining) / settings.focusDuration) * 100;

//         const nextBreakIndex = settings.breaks.findIndex((breakConfig, index) => (
//             index !== currentTimer.currentBreakIndex && // Skip if already triggered
//             progressPercentage >= breakConfig.position
//         ));

//         if (nextBreakIndex !== -1 && nextBreakIndex !== currentTimer.currentBreakIndex) {
//             // Pause focus and start break
//             return {
//                 ...currentTimer,
//                 phase: 'break',
//                 isRunning: false,  // Pause when break starts
//                 timeRemaining: settings.breaks[nextBreakIndex].duration,
//                 currentBreakIndex: nextBreakIndex,
//             };
//         }

//         return null;
//     };

//     // Handle end-of-phase transitions (focus->break and break->focus).
//     const handleSessionCompletion = (prev: TimerState): TimerState => {
//         if (prev.phase === 'focus') {
//             // Session completed — reset to initial focus state
//             return {
//                 ...prev,
//                 isRunning: false,
//                 phase: 'focus',
//                 timeRemaining: settings.focusDuration,
//                 currentBreakIndex: null,
//             };
//         } else {
//             // Returning from break — calculate time to next break
//             return {
//                 ...prev,
//                 phase: 'focus',
//                 isRunning: false,
//                 timeRemaining: calculateTimeUntilNextBreak(prev.currentBreakIndex! + 1),
//             };
//         }
//     };

//     // Calculate time until next break (based on % positioning).
//     const calculateTimeUntilNextBreak = (nextBreakIndex: number): number => {
//         if (nextBreakIndex >= settings.breaks.length) {
//             // No more breaks — return the rest of the focus time
//             return settings.focusDuration - getElapsedFocusTime();
//         }

//         const nextBreak = settings.breaks[nextBreakIndex];
//         const nextBreakTime = (nextBreak.position / 100) * settings.focusDuration;
//         return Math.max(0, nextBreakTime - getElapsedFocusTime());
//     };

//     // Calculate how much focus time has passed so far.
//     const getElapsedFocusTime = (): number => {
//         const completedBreakDurations = settings.breaks
//             .slice(0, (timer.currentBreakIndex ?? 0) + 1)
//             .reduce((total, b) => total + b.duration, 0);

//         return settings.focusDuration - timer.timeRemaining - completedBreakDurations;
//     };

//     const startPause = () => {
//         setTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }));
//     };

//     const reset = () => {
//         setTimer({
//             timeRemaining: settings.focusDuration,
//             isRunning: false,
//             phase: 'focus',
//             currentBreakIndex: null,
//         });
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//     };

//     return { timer, startPause, reset };
// };
