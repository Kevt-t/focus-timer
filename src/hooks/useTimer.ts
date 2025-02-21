// src/hooks/useTimer.ts

import { useState, useEffect, useRef } from "react";

// Define the structure of the timer state.
interface TimerState {
  timeRemaining: number; // Time left in seconds
  isRunning: boolean; // Indicates whether the timer is currently running
}

// Hook to manage the timer logic.
export const useTimer = (initialTime: number = 1500) => {
  // State to track the timer's remaining time and running status.
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: initialTime,
    isRunning: false,
  });

  // Reference to store the interval ID for cleanup purposes.
  const intervalRef = useRef<number | null>(null);

  // Reference to the audio file for playback during the timer.
  const audioRef = useRef(new Audio('/Marconi Union  Weightless Official Extended Version.mp3'));

  // Effect to handle timer countdown and audio playback.
  useEffect(() => {
    if (timer.isRunning) {
      audioRef.current.play(); // Play audio when the timer starts.

      // Start the countdown interval.
      intervalRef.current = window.setInterval(() => {
        setTimer((prev) => {
          if (prev.timeRemaining <= 0) {
            clearInterval(intervalRef.current!); // Stop the interval when time runs out.
            return { ...prev, isRunning: false }; // Set the timer to stopped state.
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }; // Decrease time remaining.
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!); // Clear the interval when paused.
      audioRef.current.pause(); // Pause the audio.
      audioRef.current.currentTime = 0; // Reset the audio to the beginning.
    }

    return () => clearInterval(intervalRef.current!); // Cleanup function to prevent memory leaks.
  }, [timer.isRunning]);

  // Function to toggle between start and pause states.
  const startPause = () => {
    setTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  // Function to reset the timer to its initial state.
  const reset = () => {
    setTimer({ timeRemaining: initialTime, isRunning: false }); // Reset timer values.
    audioRef.current.pause(); // Stop the audio playback.
    audioRef.current.currentTime = 0; // Reset audio position.
  };

  // Return the timer state and control functions.
  return { timer, startPause, reset };
};