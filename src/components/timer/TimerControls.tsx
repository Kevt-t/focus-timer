import React from "react";
import Button from "../common/Button";

// Define the props expected by the TimerControls component.
interface TimerControlsProps {
  isRunning: boolean; // Indicates whether the timer is running.
  onStartPause: () => void; // Function to toggle start/pause.
  onReset: () => void; // Function to reset the timer.
}

// Component providing controls to start/pause and reset the timer.
const TimerControls: React.FC<TimerControlsProps> = ({ isRunning, onStartPause, onReset }) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button onClick={onStartPause}>{isRunning ? "Pause" : "Start"}</Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};

export default TimerControls;
