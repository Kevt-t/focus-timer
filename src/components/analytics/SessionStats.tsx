import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const SessionStats: React.FC = () => {
    const { analytics } = useAnalytics();

    return (
        <div className="p-4 border rounded-md shadow">
            <h2 className="font-bold text-lg">Session Stats</h2>
            <p>Total Sessions: {analytics.sessions.length}</p>
            <p>Total Focus Time: {(analytics.totalFocusTime / 60).toFixed(1)} minutes</p>
            <p>Current Streak: {analytics.streak}</p>
        </div>
    );
};

export default SessionStats;
