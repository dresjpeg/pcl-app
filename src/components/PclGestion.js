import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import { AddCircle, Edit, Delete } from "@mui/icons-material";

const PclGestion = ({ user }) => {
  const [pclData, setPclData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showForm, setShowForm] = useState("");
  const [currentPcl, setCurrentPcl] = useState({
    id: "",
    fecha: "",
    paciente: "",
    estado: "pendiente",
    dictamen: "",
    solicitante_id: user?.id || 1,
  });
  const [loading, setLoading] = useState(true);

  // Determinar rol del usuario (asumiendo que viene del login)
  const rolUsuario = user?.rol || localStorage.getItem("rol") || "usuario";
  const puedeEditar = rolUsuario === "medico" || rolUsuario === "admin";
  const puedeEliminar = rolUsuario === "admin";
  const puedeCrear = rolUsuario === "medico" || rolUsuario === "admin";

  useEffect(() => {
    fetchPcl();
  }, []);

  const fetchPcl = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/pcl");
      setPclData(response.data);
    } catch (err) {
      console.error("Error al obtener PCL:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = pclData.filter((pcl) => {
    const matchSearch =
      pcl.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcl.id.toString().includes(searchTerm);
    const matchEstado = filterEstado === "todos" || pcl.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const resetForm = () => {
    setCurrentPcl({
      id: "",
      fecha: "",
      paciente: "",
      estado: "pendiente",
      dictamen: "",
      solicitante_id: user?.id || 1,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/pcl", currentPcl);
      fetchPcl();
      setShowForm("");
      resetForm();
    } catch (err) {
      console.error("Error al añadir PCL:", err);
    }
  };

  const handleEdit = (pcl) => {
    if (!puedeEditar) return alert("No tienes permisos para editar.");
    setCurrentPcl({
      ...pcl,
      fecha: pcl.fecha.split("T")[0],
    });
    setShowForm("edit");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/pcl/${currentPcl.id}`,
        currentPcl
      );
      fetchPcl();
      setShowForm("");
      resetForm();
    } catch (err) {
      console.error("Error al actualizar PCL:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!puedeEliminar) return alert("Solo el administrador puede eliminar registros.");
    if (window.confirm("¿Está seguro de eliminar este PCL?")) {
      try {
        await axios.delete(`http://localhost:5000/api/pcl/${id}`);
        fetchPcl();
      } catch (err) {
        console.error("Error al eliminar PCL:", err);
      }
    }
  };

  const getChipColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "aprobado":
        return "success";
      case "rechazado":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: "#333" }}>
        Gestión de PCL
      </Typography>

      {/* FILTROS */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Buscar por paciente o ID"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            label="Estado"
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="aprobado">Aprobado</MenuItem>
            <MenuItem value="rechazado">Rechazado</MenuItem>
          </Select>
        </FormControl>

        {puedeCrear && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={() => {
              setShowForm("add");
              resetForm();
            }}
          >
            Añadir PCL
          </Button>
        )}
      </Box>

      {/* TABLA */}
      <Card sx={{ mb: 2, boxShadow: 3 }}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Solicitante</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((pcl) => (
                    <TableRow key={pcl.id} hover>
                      <TableCell>#{pcl.id}</TableCell>
                      <TableCell>
                        {new Date(pcl.fecha).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>{pcl.paciente}</TableCell>
                      <TableCell>{pcl.solicitante_nombre || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={pcl.estado.toUpperCase()}
                          color={getChipColor(pcl.estado)}
                        />
                      </TableCell>
                      <TableCell>
                        {puedeEditar && (
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEdit(pcl)}
                            sx={{ mr: 1 }}
                          >
                            Editar
                          </Button>
                        )}
                        {puedeEliminar && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(pcl.id)}
                          >
                            Eliminar
                          </Button>
                        )}
                        {!puedeEditar && !puedeEliminar && (
                          <Typography variant="caption" color="text.secondary">
                            Sin permisos
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">
                        No se encontraron resultados
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* FORMULARIO DESPLEGABLE */}
      <Collapse in={showForm === "add" || showForm === "edit"}>
        <Card
          sx={{
            mt: 2,
            boxShadow: 4,
            borderLeft: "6px solid",
            borderColor: showForm === "edit" ? "#f5b041" : "#3498db",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={showForm === "edit" ? "warning.main" : "primary.main"}
              mb={2}
            >
              {showForm === "edit"
                ? `Editar PCL #${currentPcl.id}`
                : "Añadir nuevo PCL"}
            </Typography>

            {/* Si no puede crear, no mostrar formulario */}
            {!puedeCrear ? (
              <Typography color="error">
                No tienes permisos para crear dictámenes.
              </Typography>
            ) : (
              <form onSubmit={showForm === "edit" ? handleUpdate : handleAdd}>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <TextField
                    label="Fecha"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={currentPcl.fecha}
                    onChange={(e) =>
                      setCurrentPcl({ ...currentPcl, fecha: e.target.value })
                    }
                    required
                  />
                  <TextField
                    label="Paciente"
                    value={currentPcl.paciente}
                    onChange={(e) =>
                      setCurrentPcl({ ...currentPcl, paciente: e.target.value })
                    }
                    required
                  />
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns="1fr 1fr"
                  gap={2}
                  mt={2}
                >
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={currentPcl.estado}
                      onChange={(e) =>
                        setCurrentPcl({
                          ...currentPcl,
                          estado: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="aprobado">Aprobado</MenuItem>
                      <MenuItem value="rechazado">Rechazado</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Dictamen"
                    multiline
                    rows={2}
                    value={currentPcl.dictamen}
                    onChange={(e) =>
                      setCurrentPcl({
                        ...currentPcl,
                        dictamen: e.target.value,
                      })
                    }
                    placeholder="Escribe el dictamen médico..."
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ flex: 1 }}
                  >
                    {showForm === "edit" ? "Actualizar" : "Añadir"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ flex: 1 }}
                    onClick={() => setShowForm("")}
                  >
                    Cancelar
                  </Button>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>
      </Collapse>

      {/* RESUMEN */}
      <Card sx={{ mt: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="body1">
            <strong>Total de registros:</strong> {filteredData.length}
            {filterEstado !== "todos" && ` (Filtrado por: ${filterEstado})`}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PclGestion;
