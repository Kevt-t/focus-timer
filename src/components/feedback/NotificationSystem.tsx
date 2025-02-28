import React, { useEffect } from 'react';
import ToastManager from './ToastManager';
import { useNotifications } from '../../hooks/useNotifications';

// This can be extended in future to support more notification types like modals
const NotificationSystem: React.FC = () => {
    const { notifications, addNotification } = useNotifications();

    // Example: Automatically show a "Welcome Back!" message when app starts
    useEffect(() => {
        addNotification('Welcome back! Ready to focus?', 'info');
    }, [addNotification]);

    return (
        <>
            {/* Currently, we're only showing toasts */}
            <ToastManager />
        </>
    );
};

export default NotificationSystem;
