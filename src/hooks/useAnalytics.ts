import { useState, useEffect } from 'react';

interface SessionRecord {
    duration: number;
    startTime: number;
    endTime: number;
    type: 'focus' | 'break';
}

interface AnalyticsState {
    sessions: SessionRecord[];
    streak: number;
    totalFocusTime: number;
}

// Load initial state from localStorage
const loadFromStorage = (): AnalyticsState => {
    const data = localStorage.getItem('focusTimerAnalytics');
    return data ? JSON.parse(data) : { sessions: [], streak: 0, totalFocusTime: 0 };
};

export const useAnalytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsState>(loadFromStorage);

    // Save to localStorage whenever analytics changes
    useEffect(() => {
        localStorage.setItem('focusTimerAnalytics', JSON.stringify(analytics));
    }, [analytics]);

    const recordSession = (session: SessionRecord) => {
        setAnalytics((prev) => {
            const isFocusSession = session.type === 'focus';
            const isValidFocusSession = isFocusSession && session.duration >= 20;  // or even 1 if needed

            // ⚠️ Streak only resets if this is a break session.
            // ✅ Only increment streak if this is a valid focus session.
            const newStreak = session.type === 'break'
                ? 0
                : isValidFocusSession
                    ? prev.streak + 1
                    : prev.streak;  // carry streak forward if focus session too short

            return {
                ...prev,
                sessions: [...prev.sessions, session],
                streak: newStreak,
                totalFocusTime: isFocusSession
                    ? prev.totalFocusTime + session.duration
                    : prev.totalFocusTime,
            };
        });
    };

    return {
        analytics,
        recordSession,
    };
};
