import { useState, useEffect, useRef } from "react";

// Define the structure of the timer state.
interface TimerState {
    timeRemaining: number; // Time left in seconds
    isRunning: boolean; // Indicates whether the timer is currently running
}

// Hook to manage the timer logic.
export const useTimer = (initialTime: number = 1500) => {
    const [timer, setTimer] = useState<TimerState>({
        timeRemaining: initialTime,
        isRunning: false,
    });

    const intervalRef = useRef<number | null>(null);
    const audioRef = useRef(new Audio('/Marconi Union  Weightless Official Extended Version.mp3'));

    // ⚠️ Add this effect to reset time when initialTime changes (e.g., new focus duration from settings)
    useEffect(() => {
        setTimer((prev) => ({
            ...prev,
            timeRemaining: initialTime,  // Sync new initial time
        }));
    }, [initialTime]);  // Depend on initialTime (from settings)

    useEffect(() => {
        if (timer.isRunning) {
            audioRef.current.play();

            intervalRef.current = window.setInterval(() => {
                setTimer((prev) => {
                    if (prev.timeRemaining <= 0) {
                        clearInterval(intervalRef.current!);
                        return { ...prev, isRunning: false };
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

    const startPause = () => {
        setTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    };

    const reset = () => {
        setTimer({ timeRemaining: initialTime, isRunning: false });
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    };

    return { timer, startPause, reset };
};
