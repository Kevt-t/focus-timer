import React, { createContext, useContext, useState } from 'react';

interface Settings {
    focusDuration: number;
    breakDuration: number;
    notificationsEnabled: boolean;
}

const SettingsContext = createContext<{
    settings: Settings;
    updateSettings: (updates: Partial<Settings>) => void;
}>({
    settings: { focusDuration: 1500, breakDuration: 300, notificationsEnabled: true },
    updateSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({
        focusDuration: 25,
        breakDuration: 300,
        notificationsEnabled: true,
    });

    const updateSettings = (updates: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...updates }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
