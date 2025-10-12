import React, { useState, useEffect } from 'react';

// Configuración de la URL del backend desde variable de entorno
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol_id: '',
    activo: true,
  });

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    const res = await fetch(`${API_URL}/api/usuarios`);
    const data = await res.json();
    setUsuarios(data);
  };

  const fetchRoles = async () => {
    const res = await fetch(`${API_URL}/api/roles`);
    const data = await res.json();
    setRoles(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData({ ...usuarios[index], password: '' });  // Password vacío por seguridad
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveClick = async (id) => {
    try {
      const bodyData = { ...editData };
      if (!bodyData.password) delete bodyData.password; // Solo envía si se llenó nueva contraseña
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (res.ok) {
        alert('Usuario actualizado');
        setEditIndex(null);
        fetchUsuarios();
      } else {
        alert('Error actualizando usuario');
      }
    } catch {
      alert('Error al conectar con el servidor');
    }
  };

  const handleCancelClick = () => {
    setEditIndex(null);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('¿Seguro deseas eliminar este usuario?')) return;
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Usuario eliminado');
        fetchUsuarios();
      } else {
        alert('Error eliminando usuario');
      }
    } catch {
      alert('Error al conectar con el servidor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('Usuario creado');
        setFormData({
          nombre: '',
          email: '',
          password: '',
          rol_id: '',
          activo: true,
        });
        fetchUsuarios();
      } else {
        alert('Error creando usuario');
      }
    } catch {
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Usuarios (Administrador)</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, index) => (
            <tr key={u.id}>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    name="nombre"
                    value={editData.nombre}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  u.nombre
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  u.email
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <select
                    name="rol_id"
                    value={editData.rol_id}
                    onChange={handleEditChange}
                    className="form-select"
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  u.rol
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="checkbox"
                    name="activo"
                    checked={editData.activo}
                    onChange={handleEditChange}
                  />
                ) : u.activo ? (
                  'Sí'
                ) : (
                  'No'
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <>
                    <input
                      type="password"
                      name="password"
                      value={editData.password || ''}
                      onChange={handleEditChange}
                      className="form-control mb-2"
                      placeholder="Nuevo password (opcional)"
                      autoComplete="new-password"
                    />
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleSaveClick(u.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={handleCancelClick}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(u.id)}
                    >
                      Eliminar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(index)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(u.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Agregar Usuario</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Rol</label>
          <select
            name="rol_id"
            value={formData.rol_id}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccionar rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="form-check-input"
            id="activo"
          />
          <label htmlFor="activo" className="form-check-label">
            Activo
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default AdminUsuarios;

