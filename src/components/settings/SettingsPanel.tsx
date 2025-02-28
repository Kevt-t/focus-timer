import React from 'react';
import { useSettings } from './SettingsContext';

const SettingsPanel: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    const handleFocusDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettings({ focusDuration: Number(e.target.value) * 60 });  // Convert minutes to seconds
    };

    const handleBreakCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateSettings({ breakCount: Number(e.target.value) });
    };

    const handleBreakChange = (index: number, key: 'position' | 'duration', value: number) => {
        const newBreaks = [...settings.breaks];
        newBreaks[index] = { ...newBreaks[index], [key]: value };
        updateSettings({ breaks: newBreaks });
    };

    const handleNotificationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettings({ notificationsEnabled: e.target.checked });
    };

    return (
        <div className="p-4 border rounded-md bg-white shadow-md space-y-4">
            <h2 className="font-bold text-lg">Settings</h2>

            {/* Focus Duration */}
            <div className="space-y-2">
                <label className="block font-medium">Focus Duration (minutes)</label>
                <input
                    type="number"
                    value={Math.round(settings.focusDuration / 60)}
                    onChange={handleFocusDurationChange}
                    className="w-full p-2 border rounded"
                    min={1}
                    max={120}
                />
            </div>

            {/* Break Count */}
            <div className="space-y-2">
                <label className="block font-medium">Number of Breaks</label>
                <select
                    value={settings.breakCount}
                    onChange={handleBreakCountChange}
                    className="w-full p-2 border rounded"
                >
                    <option value={0}>No Breaks</option>
                    <option value={1}>1 Break</option>
                    <option value={2}>2 Breaks</option>
                    <option value={3}>3 Breaks</option>
                </select>
            </div>

            {/* Break Details */}
            {settings.breaks.map((breakConfig, index) => (
                <div key={index} className="p-3 border rounded space-y-2 bg-gray-50">
                    <h3 className="font-medium">Break {index + 1}</h3>
                    <div>
                        <label className="block">Timing (% through focus)</label>
                        <input
                            type="number"
                            value={breakConfig.position}
                            onChange={(e) => handleBreakChange(index, 'position', Number(e.target.value))}
                            className="w-full p-2 border rounded"
                            min={1}
                            max={99}
                        />
                    </div>
                    <div>
                        <label className="block">Duration (minutes)</label>
                        <input
                            type="number"
                            value={Math.round(breakConfig.duration / 60)}
                            onChange={(e) => handleBreakChange(index, 'duration', Number(e.target.value) * 60)}
                            className="w-full p-2 border rounded"
                            min={1}
                            max={30}
                        />
                    </div>
                </div>
            ))}

            {/* Notifications */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.notificationsEnabled}
                    onChange={handleNotificationToggle}
                    className="w-5 h-5"
                />
                <label className="font-medium">Enable Notifications</label>
            </div>
        </div>
    );
};

export default SettingsPanel;
