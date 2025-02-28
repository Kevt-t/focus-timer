import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const StreakCounter: React.FC = () => {
    const { analytics } = useAnalytics();

    return <div className="text-xl font-bold">🔥 Current Streak: {analytics.streak}</div>;
};

export default StreakCounter;