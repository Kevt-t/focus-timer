import React from "react";

// Define the props expected by the Button component.
interface ButtonProps {
  onClick: () => void; // Click handler function.
  children: React.ReactNode; // Button label or content.
}

// Reusable button component.
const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
      {children}
    </button>
  );
};

export default Button;