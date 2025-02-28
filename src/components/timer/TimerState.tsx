import React from "react";

// Updated props to also accept `phase`
interface TimerStateProps {
    isRunning: boolean;
    timeRemaining: number;
    phase: 'focus' | 'break';
}

// Component to display current status (Focus, Break, Completed)
const TimerState: React.FC<TimerStateProps> = ({ isRunning, timeRemaining, phase }) => {
    let status: string;

    if (phase === 'focus') {
        if (timeRemaining === 0) {
            status = "Focus Session Completed";
        } else if (isRunning) {
            status = "Focus Session Running";
        } else {
            status = "Focus Session Paused";
        }
    } else { // phase === 'break'
        if (timeRemaining === 0) {
            status = "Break Completed";
        } else if (isRunning) {
            status = `Break - ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')} Remaining`;
        } else {
            status = `Break Paused - ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')} Left`;
        }
    }

    return (
        <div className="text-lg font-medium text-gray-700">
            {status}
        </div>
    );
};

export default TimerState;
