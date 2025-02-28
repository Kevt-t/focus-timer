import React from 'react';
import { buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Import CircularProgressbar and cast to any to bypass TS type issues
// You may need to suppress ESLint if you use it.
import { CircularProgressbar as RawCircularProgressbar } from 'react-circular-progressbar';

const CircularProgressbar = RawCircularProgressbar as any;  // <-- This is the key hack

interface ProgressIndicatorProps {
    progress: number;  // Expect progress as a value between 0 and 1
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
    return (
        <div className="w-32 h-32">
            <CircularProgressbar
                value={progress * 100}
                text={`${Math.round(progress * 100)}%`}
                styles={buildStyles({
                    pathColor: '#3b82f6',
                    textColor: '#1f2937'
                })}
            />
        </div>
    );
};

export default ProgressIndicator;
    