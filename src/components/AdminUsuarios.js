import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Save,
  Cancel,
  Add,
  PersonAddAlt1,
} from '@mui/icons-material';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [openForm, setOpenForm] = useState(false);

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
    const res = await fetch('http://localhost:5000/api/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  const fetchRoles = async () => {
    const res = await fetch('http://localhost:5000/api/roles');
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
    setEditData({ ...usuarios[index], password: '' });
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
      if (!bodyData.password) delete bodyData.password;
      const res = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
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
      const res = await fetch('http://localhost:5000/api/usuarios', {
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
        setOpenForm(false);
        fetchUsuarios();
      } else {
        alert('Error creando usuario');
      }
    } catch {
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Gestión de Usuarios (Administrador)
      </Typography>

      <Button
        variant="contained"
        startIcon={<PersonAddAlt1 />}
        sx={{
          mb: 2,
          background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
          color: 'white',
          fontWeight: 'bold',
        }}
        onClick={() => setOpenForm(!openForm)}
      >
        {openForm ? 'Cerrar formulario' : 'Agregar nuevo usuario'}
      </Button>

      <Collapse in={openForm}>
        <Card sx={{ mb: 3, p: 2 }}>
          <CardHeader title="Nuevo Usuario" />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="rol_id"
                  value={formData.rol_id}
                  label="Rol"
                  onChange={handleChange}
                  required
                >
                  {roles.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Activo</Typography>
                <Switch
                  checked={formData.activo}
                  name="activo"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, activo: e.target.checked }))
                  }
                />
              </Box>
              <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                Crear Usuario
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><b>Nombre</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Rol</b></TableCell>
              <TableCell><b>Activo</b></TableCell>
              <TableCell align="center"><b>Acciones</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u, index) => (
              <TableRow key={u.id}>
                <TableCell>
                  {editIndex === index ? (
                    <TextField
                      name="nombre"
                      value={editData.nombre}
                      onChange={handleEditChange}
                    />
                  ) : (
                    u.nombre
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <TextField
                      name="email"
                      type="email"
                      value={editData.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    u.email
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <FormControl fullWidth>
                      <Select
                        name="rol_id"
                        value={editData.rol_id}
                        onChange={handleEditChange}
                      >
                        {roles.map((r) => (
                          <MenuItem key={r.id} value={r.id}>
                            {r.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    u.rol
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <Switch
                      checked={editData.activo}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          activo: e.target.checked,
                        }))
                      }
                    />
                  ) : u.activo ? (
                    'Sí'
                  ) : (
                    'No'
                  )}
                </TableCell>
                <TableCell align="center">
                  {editIndex === index ? (
                    <>
                      <TextField
                        name="password"
                        type="password"
                        placeholder="Nuevo password (opcional)"
                        value={editData.password || ''}
                        onChange={handleEditChange}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Guardar cambios">
                        <IconButton color="success" onClick={() => handleSaveClick(u.id)}>
                          <Save />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancelar">
                        <IconButton color="secondary" onClick={handleCancelClick}>
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => handleEditClick(index)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => handleDeleteClick(u.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsuarios;
