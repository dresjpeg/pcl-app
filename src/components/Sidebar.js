import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
const navigate = useNavigate();

const handleLogout = () => {
    onLogout();
    navigate('/login');
};

const getMenuItems = (role) => {
    const baseItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/pcl/gestion', label: 'Gestión PCL' },
    ];

    if (role === 'Administrador') {
    baseItems.push({ path: '/admin/usuarios', label: 'Gestión Usuarios' });
    } else if (role === 'Evaluador Médico') {
    baseItems.push({ path: '/dictamen/ingreso', label: 'Ingreso Dictamen' });
    } else if (role === 'Revisor de recursos') {
    baseItems.push({ path: '/apelaciones/trazabilidad', label: 'Trazabilidad Apelaciones' });
    }

    return baseItems;
};

return (
    <div className="sidebar">
    <h4 className="text-center">PCL App</h4>
    <p className="text-center">Rol: {user.role}</p>
    <ul>
        {getMenuItems(user.role).map((item) => (
        <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
        </li>
        ))}
        <li>
        <button className="btn btn-link text-white" onClick={handleLogout}>Logout</button>
        </li>
    </ul>
    </div>
);
};

export default Sidebar;