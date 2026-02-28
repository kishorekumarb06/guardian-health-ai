import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/services/api';

export const ProtectedRoute = ({
    children,
    adminOnly = false
}: {
    children: JSX.Element,
    adminOnly?: boolean
}) => {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/home" replace />;
    }

    return children;
};
