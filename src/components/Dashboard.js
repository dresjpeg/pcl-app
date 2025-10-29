import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  Notifications as NotificationsIcon,
  Folder as FolderIcon,
  AddCircle as AddIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobados: 0,
    rechazados: 0,
    recientes: [],
  });
  const [dictamenes, setDictamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsResponse = await axios.get(`${API_URL}/api/pcl/stats`);
      setStats(statsResponse.data);

      const dictamenesResponse = await axios.get(`${API_URL}/api/dictamen-medico`);
      setDictamenes(dictamenesResponse.data.slice(0, 5));

      setError(null);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setError("Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="primary" />
        <Typography variant="body1" mt={2}>
          Cargando dashboard...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box p={4}>
        <Alert severity="error" action={<Button onClick={fetchData}>Reintentar</Button>}>
          {error}
        </Alert>
      </Box>
    );

  return (
    <Box sx={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      {/* Barra superior */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <AssignmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Panel de Control - Bienvenido, {user.nombre || user.email}
          </Typography>
          <Tooltip title="Actualizar datos">
            <IconButton color="inherit" onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box p={4}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Rol: <strong>{user.role}</strong>
        </Typography>

        {/* Cards de estadísticas */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "#1976d2", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Total PCL</Typography>
                <Typography variant="h3">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "#ffb300", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Pendientes</Typography>
                <Typography variant="h3">{stats.pendientes}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "#2e7d32", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Aprobados</Typography>
                <Typography variant="h3">{stats.aprobados}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "#d32f2f", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Rechazados</Typography>
                <Typography variant="h3">{stats.rechazados}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Casos PCL recientes */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Casos PCL Recientes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recientes.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#1976d2" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>ID</TableCell>
                      <TableCell sx={{ color: "white" }}>Fecha</TableCell>
                      <TableCell sx={{ color: "white" }}>Paciente</TableCell>
                      <TableCell sx={{ color: "white" }}>Solicitante</TableCell>
                      <TableCell sx={{ color: "white" }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recientes.map((pcl) => (
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
                            color={
                              pcl.estado === "aprobado"
                                ? "success"
                                : pcl.estado === "rechazado"
                                ? "error"
                                : "warning"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No hay casos recientes</Typography>
            )}
          </CardContent>
        </Card>

        {/* Dictámenes médicos recientes */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Dictámenes Médicos Recientes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {dictamenes.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#0288d1" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>ID</TableCell>
                      <TableCell sx={{ color: "white" }}>Diagnóstico</TableCell>
                      <TableCell sx={{ color: "white" }}>CIE-10</TableCell>
                      <TableCell sx={{ color: "white" }}>Algoritmo</TableCell>
                      <TableCell sx={{ color: "white" }}>Resultado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dictamenes.map((d) => (
                      <TableRow key={d.id} hover>
                        <TableCell>#{d.id}</TableCell>
                        <TableCell>{d.diagnostico?.substring(0, 50)}...</TableCell>
                        <TableCell>{d.cie10}</TableCell>
                        <TableCell>{d.algoritmo}</TableCell>
                        <TableCell>
                          <Chip
                            label={d.resultado}
                            color={d.resultado?.includes("Alto") ? "error" : "success"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No hay dictámenes recientes</Typography>
            )}
          </CardContent>
        </Card>

        {/* Notificaciones y accesos rápidos */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <NotificationsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Notificaciones
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {stats.pendientes > 0 && (
                    <Typography>
                      <PendingIcon color="warning" /> Tienes {stats.pendientes} PCL pendientes
                    </Typography>
                  )}
                  {dictamenes.length > 0 && (
                    <Typography>
                      <CheckIcon color="success" /> {dictamenes.length} dictámenes registrados
                    </Typography>
                  )}
                  {stats.recientes.length > 0 && (
                    <Typography>
                      <ErrorIcon color="info" /> Último PCL ingresado:{" "}
                      {stats.recientes[0].paciente}
                    </Typography>
                  )}
                  {stats.total === 0 && dictamenes.length === 0 && (
                    <Typography color="text.secondary">
                      No hay notificaciones nuevas
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Accesos Rápidos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Button variant="outlined" startIcon={<FolderIcon />} href="/pcl/gestion">
                    Gestión de PCL
                  </Button>
                  {(user.role === "Evaluador Médico" || user.role === "Médico") && (
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<AddIcon />}
                      href="/dictamen/ingreso"
                    >
                      Ingresar Dictamen
                    </Button>
                  )}
                  {user.role === "Administrador" && (
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<GroupIcon />}
                      href="/admin/usuarios"
                    >
                      Administrar Usuarios
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
