import React from 'react';

const Dashboard = ({ user }) => {
  // Datos mock para notificaciones y casos
const notifications = ['Notificación 1: Nuevo PCL asignado.', 'Notificación 2: Dictamen pendiente.'];
const casos = ['Caso PCL-001: En revisión', 'Caso PCL-002: Aprobado'];

return (
    <div className="container mt-4">
    <h2>Bienvenido, {user.email} ({user.role})</h2>
    <div className="row">
        <div className="col-md-6">
        <h4>Notificaciones Automáticas</h4>
        <ul className="list-group">
            {notifications.map((notif, index) => (
            <li key={index} className="list-group-item">{notif}</li>
            ))}
        </ul>
        </div>
        <div className="col-md-6">
        <h4>Resumen de Casos</h4>
        <ul className="list-group">
            {casos.map((caso, index) => (
            <li key={index} className="list-group-item">{caso}</li>
            ))}
        </ul>
        </div>
    </div>
      {/* Simular fetch */}
    <p className="mt-3">Simulando carga de dashboard desde backend...</p>
    </div>
);
};

export default Dashboard;