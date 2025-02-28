import React, { useState, useEffect } from "react";
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
import SettingsPanel from "./components/settings/SettingsPanel";
import Button from "./components/common/Button";

const App: React.FC = () => {
    const { settings } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    // Remove passing focusDuration here — useTimer now pulls it directly from settings.
    const { timer, startPause, reset } = useTimer();

    const { recordSession } = useAnalytics();
    const { addNotification } = useNotifications();

    // Calculate progress for circular progress bar (clamped to avoid negatives)
    const totalDuration = settings.focusDuration;
    const progress = totalDuration > 0
        ? Math.max(0, Math.min(1, (totalDuration - timer.timeRemaining) / totalDuration))
        : 0;

    // Track session completion and record data
    useEffect(() => {
        if (timer.timeRemaining === 0 && timer.isRunning) {
            handleSessionCompletion();
        }
    }, [timer.timeRemaining, timer.isRunning]);

    const handleSessionCompletion = () => {
        const sessionDuration = totalDuration;

        recordSession({
            duration: sessionDuration,
            startTime: Date.now() - sessionDuration * 1000,
            endTime: Date.now(),
            type: 'focus',
        });

        addNotification("🎉 Focus session completed!", "success");
        reset();
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
            <NotificationSystem />

            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold">Focus Timer</h1>

                <Button onClick={() => setShowSettings(!showSettings)}>
                    {showSettings ? "Close Settings" : "Open Settings"}
                </Button>

                {showSettings && <SettingsPanel />}

                {!showSettings && (
                    <>
                        {/* Guard: Require focusDuration to be set */}
                        {settings.focusDuration > 0 ? (
                            <>
                                <StreakCounter />
                                <SessionStats />
                                <ProgressIndicator progress={progress} />
                                <TimerState
                                    isRunning={timer.isRunning}
                                    timeRemaining={timer.timeRemaining}
                                    phase={timer.phase}  // Include phase here
                                />
                                <TimerDisplay timeRemaining={timer.timeRemaining} />
                                <TimerControls isRunning={timer.isRunning} onStartPause={startPause} onReset={reset} />
                            </>
                        ) : (
                            <div className="text-red-500 font-medium">
                                Please set your focus duration in the settings.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default App;
