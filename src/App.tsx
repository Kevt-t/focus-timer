import React, { useEffect } from "react";
import TimerDisplay from "./components/timer/TimerDisplay";
import TimerControls from "./components/timer/TimerControls";
import TimerState from "./components/timer/TimerState";
import { useTimer } from "./hooks/useTimer";
import { useAnalytics } from "./hooks/useAnalytics";
import { useNotifications } from "./hooks/useNotifications";
import ProgressIndicator from "./components/analytics/ProgressIndicator";
import StreakCounter from "./components/analytics/StreakCounter";
import SessionStats from "./components/analytics/SessionStats";
import NotificationSystem from "./components/feedback/NotificationSystem";
import { useSettings } from "./components/settings/SettingsContext";

const App: React.FC = () => {
    const { settings } = useSettings();

    // Pass the current focusDuration from settings into useTimer
    const { timer, startPause, reset } = useTimer(settings.focusDuration);

    const { recordSession } = useAnalytics();
    const { addNotification } = useNotifications();

    // Calculate progress for circular progress bar (clamped to avoid negatives)
    const totalDuration = settings.focusDuration;
    const progress = Math.max(0, Math.min(1, (totalDuration - timer.timeRemaining) / totalDuration));

    // Track session completion and record data
    useEffect(() => {
        if (timer.timeRemaining === 0 && timer.isRunning) {
            handleSessionCompletion();
        }
    }, [timer.timeRemaining, timer.isRunning]);

    const handleSessionCompletion = () => {
        const sessionDuration = totalDuration;  // Full session completed

        recordSession({
            duration: sessionDuration,
            startTime: Date.now() - sessionDuration * 1000,
            endTime: Date.now(),
            type: 'focus',  // In future you could pass 'break' if needed
        });

        addNotification("🎉 Focus session completed!", "success");
        reset();  // Reset timer after session ends
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
            {/* Notification System at top-level */}
            <NotificationSystem />

            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold">Focus Timer</h1>

                {/* Display Current Streak */}
                <StreakCounter />

                {/* Display Session Stats */}
                <SessionStats />

                {/* Progress Indicator */}
                <ProgressIndicator progress={progress} />

                {/* Timer State */}
                <TimerState isRunning={timer.isRunning} timeRemaining={timer.timeRemaining} />

                {/* Timer Countdown */}
                <TimerDisplay timeRemaining={timer.timeRemaining} />

                {/* Timer Controls */}
                <TimerControls isRunning={timer.isRunning} onStartPause={startPause} onReset={reset} />
            </div>
        </div>
    );
};

export default App;
