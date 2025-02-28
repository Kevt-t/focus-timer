import { useState } from 'react';

type Notification = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
};

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (message: string, type: Notification['type'] = 'info') => {
        setNotifications((prev) => [...prev, { id: Date.now(), message, type }]);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return { notifications, addNotification, removeNotification };
};
