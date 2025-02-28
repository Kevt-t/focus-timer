import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';

const ToastManager: React.FC = () => {
    const { notifications, removeNotification } = useNotifications();

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            {notifications.map((note) => (
                <div
                    key={note.id}
                    className={`p-4 rounded shadow-lg ${note.type === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                    onClick={() => removeNotification(note.id)}
                >
                    {note.message}
                </div>
            ))}
        </div>
    );
};

export default ToastManager;
