import React from "react";

interface TimerStateProps {
  isRunning: boolean;
  timeRemaining: number;
}

const TimerState: React.FC<TimerStateProps> = ({ isRunning, timeRemaining }) => {
  let status = isRunning ? "Running" : timeRemaining === 0 ? "Completed" : "Paused";

  return <div className="text-lg font-medium text-gray-700">Status: {status}</div>;
};

export default TimerState;