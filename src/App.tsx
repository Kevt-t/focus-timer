// Import React and components for the app.
import React from "react";
import TimerDisplay from "./components/timer/TimerDisplay";
import TimerControls from "./components/timer/TimerControls";
import { useTimer } from "./hooks/useTimer";

// Main App component rendering the focus timer.
const App: React.FC = () => {
  const { timer, startPause, reset } = useTimer(); // Initialize timer with 25 minutes.

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold">Focus Timer</h1>
        <TimerDisplay timeRemaining={timer.timeRemaining} />
        <TimerControls isRunning={timer.isRunning} onStartPause={startPause} onReset={reset} />
      </div>
    </div>
  );
};

export default App;
