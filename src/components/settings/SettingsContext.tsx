import React, { createContext, useContext, useState } from 'react';

interface BreakConfig {
    position: number;  // Percentage of session complete (0-100)
    duration: number;  // Duration in seconds
}

interface Settings {
    focusDuration: number;
    breakCount: number;
    breaks: BreakConfig[];
    notificationsEnabled: boolean;
}

const SettingsContext = createContext<{
    settings: Settings;
    updateSettings: (updates: Partial<Settings>) => void;
}>({
    settings: {
        focusDuration: 0,
        breakCount: 0,
        breaks: [],
        notificationsEnabled: true
    },
    updateSettings: () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({
        focusDuration: 1500,
        breakCount: 0,
        breaks: [],
        notificationsEnabled: true
    });

    const updateSettings = (updates: Partial<Settings>) => {
        setSettings((prev) => {
            const newSettings = { ...prev, ...updates };

            // Ensure break list matches new break count (remove excess if reduced)
            if (updates.breakCount !== undefined) {
                newSettings.breaks = newSettings.breaks.slice(0, updates.breakCount);
                while (newSettings.breaks.length < updates.breakCount) {
                    newSettings.breaks.push({ position: 50, duration: 300 }); // Default 5 min break at 50%
                }
            }

            return newSettings;
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
