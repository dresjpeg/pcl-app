import React, { useState, useEffect } from 'react';

const PclGestion = ({ user }) => {
  const [pclData, setPclData] = useState([]); // Mock data
const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(''); // 'add', 'edit', 'delete'
const [currentPcl, setCurrentPcl] = useState({ id: '', nombre: '', descripcion: '' });

useEffect(() => {
    // Simular fetch de lista PCL
    const mockData = [
    { id: 1, nombre: 'PCL-001', descripcion: 'Caso de prueba 1' },
    { id: 2, nombre: 'PCL-002', descripcion: 'Caso de prueba 2' },
    ];
    setPclData(mockData);
    console.log('Simulando GET /api/pcl');
}, []);

const filteredData = pclData.filter(pcl =>
    pcl.nombre.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleAdd = (e) => {
    e.preventDefault();
    // Simular POST
    console.log('Simulando POST /api/pcl', currentPcl);
    alert('PCL añadido (simulado)');
    setPclData([...pclData, { ...currentPcl, id: Date.now() }]);
    setShowForm('');
};

const handleEdit = (pcl) => {
    setCurrentPcl(pcl);
    setShowForm('edit');
};

const handleUpdate = (e) => {
    e.preventDefault();
    // Simular PUT
    console.log('Simulando PUT /api/pcl/' + currentPcl.id, currentPcl);
    alert('PCL actualizado (simulado)');
    setPclData(pclData.map(p => p.id === currentPcl.id ? currentPcl : p));
    setShowForm('');
};

const handleDelete = (id) => {
    if (window.confirm('Eliminar?')) {
      // Simular DELETE
    console.log('Simulando DELETE /api/pcl/' + id);
    alert('PCL eliminado (simulado)');
    setPclData(pclData.filter(p => p.id !== id));
    }
};

  const canEdit = user.role === 'Administrador' || user.role === 'Evaluador Médico'; // Asumir permisos

return (
    <div className="container mt-4 table-section">
    <h2>Gestión de PCL</h2>
    <div className="mb-3">
        <input
        type="text"
        className="form-control"
        placeholder="Buscar PCL..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>
    <table className="table table-striped">
        <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            {canEdit && <th>Acciones</th>}
        </tr>
        </thead>
        <tbody>
        {filteredData.map(pcl => (
            <tr key={pcl.id}>
            <td>{pcl.id}</td>
            <td>{pcl.nombre}</td>
            <td>{pcl.descripcion}</td>
            {canEdit && (
                <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(pcl)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pcl.id)}>Eliminar</button>
                </td>
            )}
            </tr>
        ))}
        </tbody>
    </table>

    {canEdit && (
        <>
        <button className="btn btn-primary mb-3" onClick={() => { setShowForm('add'); setCurrentPcl({ id: '', nombre: '', descripcion: '' }); }}>
            Añadir PCL
        </button>

        {showForm === 'add' && (
            <form onSubmit={handleAdd} className="card p-3">
            <h4>Añadir PCL</h4>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Nombre" value={currentPcl.nombre} onChange={(e) => setCurrentPcl({ ...currentPcl, nombre: e.target.value })} required />
            </div>
            <div className="mb-3">
                <textarea className="form-control" placeholder="Descripción" value={currentPcl.descripcion} onChange={(e) => setCurrentPcl({ ...currentPcl, descripcion: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-success">Añadir</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm('')}>Cancelar</button>
            </form>
        )}

        {showForm === 'edit' && (
            <form onSubmit={handleUpdate} className="card p-3">
            <h4>Editar PCL</h4>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Nombre" value={currentPcl.nombre} onChange={(e) => setCurrentPcl({ ...currentPcl, nombre: e.target.value })} required />
            </div>
            <div className="mb-3">
                <textarea className="form-control" placeholder="Descripción" value={currentPcl.descripcion} onChange={(e) => setCurrentPcl({ ...currentPcl, descripcion: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-success">Actualizar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm('')}>Cancelar</button>
            </form>
        )}
        </>
    )}
    </div>
);
};

export default PclGestion