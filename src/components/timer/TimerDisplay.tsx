// Define the props expected by the TimerDisplay component.
interface TimerDisplayProps {
  timeRemaining: number; // Time left in seconds
}

// Component to display the remaining timer countdown.
const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60); // Convert seconds to minutes.
  const seconds = timeRemaining % 60; // Get the remaining seconds.
  return (
    <div className="text-4xl font-bold text-center">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds} {/* Display time in MMSS format */}
    </div>
  );
};

export default TimerDisplay;