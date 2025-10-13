import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PclGestion = ({ user }) => {
  const [pclData, setPclData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showForm, setShowForm] = useState('');
  const [currentPcl, setCurrentPcl] = useState({
    id: '',
    fecha: '',
    paciente: '',
    estado: 'pendiente',
    solicitante_id: user.id || 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPcl();
  }, []);

  const fetchPcl = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/pcl');
      setPclData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener PCL:', err);
      setError('Error al cargar los datos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = pclData.filter(pcl => {
    const matchSearch = pcl.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pcl.id.toString().includes(searchTerm);
    const matchEstado = filterEstado === 'todos' || pcl.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/pcl', currentPcl);
      alert('PCL añadido exitosamente');
      fetchPcl();
      setShowForm('');
      resetForm();
    } catch (err) {
      console.error('Error al añadir PCL:', err);
      alert('Error al añadir PCL');
    }
  };

  const handleEdit = (pcl) => {
    setCurrentPcl({
      ...pcl,
      fecha: pcl.fecha.split('T')[0] // Formatear fecha para input type="date"
    });
    setShowForm('edit');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/pcl/${currentPcl.id}`, currentPcl);
      alert('PCL actualizado exitosamente');
      fetchPcl();
      setShowForm('');
      resetForm();
    } catch (err) {
      console.error('Error al actualizar PCL:', err);
      alert('Error al actualizar PCL');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este PCL?')) {
      try {
        await axios.delete(`http://localhost:5000/api/pcl/${id}`);
        alert('PCL eliminado exitosamente');
        fetchPcl();
      } catch (err) {
        console.error('Error al eliminar PCL:', err);
        alert('Error al eliminar PCL');
      }
    }
  };

  const resetForm = () => {
    setCurrentPcl({
      id: '',
      fecha: '',
      paciente: '',
      estado: 'pendiente',
      solicitante_id: user.id || 1
    });
  };

  const canEdit = user.role === 'Administrador' || user.role === 'Evaluador Médico' || user.role === 'Médico';

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'aprobado':
        return 'bg-success';
      case 'rechazado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchPcl}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de PCL</h2>

      {/* Filtros y búsqueda */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por paciente o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <div className="col-md-3">
          {canEdit && (
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                setShowForm('add');
                resetForm();
              }}
            >
              <i className="bi bi-plus-circle"></i> Añadir PCL
            </button>
          )}
        </div>
      </div>

      {/* Tabla de PCL */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Solicitante</th>
                  <th>Estado</th>
                  {canEdit && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((pcl) => (
                    <tr key={pcl.id}>
                      <td>#{pcl.id}</td>
                      <td>{new Date(pcl.fecha).toLocaleDateString('es-ES')}</td>
                      <td>{pcl.paciente}</td>
                      <td>{pcl.solicitante_nombre || 'N/A'}</td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(pcl.estado)}`}>
                          {pcl.estado.toUpperCase()}
                        </span>
                      </td>
                      {canEdit && (
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(pcl)}
                          >
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(pcl.id)}
                          >
                            <i className="bi bi-trash"></i> Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canEdit ? 6 : 5} className="text-center text-muted">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Formulario de Añadir */}
      {showForm === 'add' && (
        <div className="card mt-3">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Añadir Nuevo PCL</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAdd}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentPcl.fecha}
                    onChange={(e) => setCurrentPcl({ ...currentPcl, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Paciente</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del paciente"
                    value={currentPcl.paciente}
                    onChange={(e) => setCurrentPcl({ ...currentPcl, paciente: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={currentPcl.estado}
                  onChange={(e) => setCurrentPcl({ ...currentPcl, estado: e.target.value })}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle"></i> Añadir
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm('')}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulario de Editar */}
      {showForm === 'edit' && (
        <div className="card mt-3">
          <div className="card-header bg-warning">
            <h5 className="mb-0">Editar PCL #{currentPcl.id}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdate}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentPcl.fecha}
                    onChange={(e) => setCurrentPcl({ ...currentPcl, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Paciente</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del paciente"
                    value={currentPcl.paciente}
                    onChange={(e) => setCurrentPcl({ ...currentPcl, paciente: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={currentPcl.estado}
                  onChange={(e) => setCurrentPcl({ ...currentPcl, estado: e.target.value })}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle"></i> Actualizar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm('')}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="card mt-3">
        <div className="card-body">
          <p className="mb-0">
            <strong>Total de registros:</strong> {filteredData.length}
            {filterEstado !== 'todos' && ` (Filtrado por: ${filterEstado})`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PclGestion;