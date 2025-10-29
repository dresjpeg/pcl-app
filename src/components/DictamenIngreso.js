import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Slider,
  Alert,
  Divider,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

const DictamenIngreso = () => {
  const [formData, setFormData] = useState({
    cie10: "",
    algoritmoBaltazar: "",
    paciente: "",
    diagnostico: "",
    fecha: "",
    observaciones: "",
    puntuacionBaltazar: 0,
    resultado: "",
    medicoId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBaltazarChange = (_, value) => {
    setFormData({ ...formData, puntuacionBaltazar: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.medicoId) {
      alert("Por favor ingresa el ID del médico evaluador.");
      return;
    }

    const mockResultado =
      formData.puntuacionBaltazar > 5
        ? "Alto riesgo (Requiere intervención inmediata)"
        : "Bajo riesgo (Monitoreo estándar)";

    const payload = {
      diagnostico: formData.diagnostico,
      cie10: formData.cie10,
      evaluador_id: formData.medicoId,
      algoritmo: "Baltazar",
      resultado: mockResultado,
    };

    try {
      const res = await fetch("http://localhost:5000/api/dictamen-medico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje || "Dictamen registrado correctamente.");
        setFormData({
          cie10: "",
          algoritmoBaltazar: "",
          paciente: "",
          diagnostico: "",
          fecha: "",
          observaciones: "",
          puntuacionBaltazar: 0,
          resultado: "",
          medicoId: "",
        });
      } else {
        alert("Error guardando dictamen");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Ingreso de Dictamen Médico
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Formulario para registrar dictámenes médicos y aplicar el algoritmo Baltazar.
      </Typography>

      <Card sx={{ boxShadow: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* ID Médico */}
            <TextField
              label="ID Evaluador Médico"
              name="medicoId"
              type="number"
              fullWidth
              required
              value={formData.medicoId}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* Paciente y Fecha */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Nombre del Paciente"
                name="paciente"
                fullWidth
                required
                value={formData.paciente}
                onChange={handleChange}
              />
              <TextField
                label="Fecha de Evaluación"
                name="fecha"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.fecha}
                onChange={handleChange}
              />
            </Box>

            {/* CIE10 */}
            <TextField
              select
              label="Código CIE-10"
              name="cie10"
              fullWidth
              required
              value={formData.cie10}
              onChange={handleChange}
              sx={{ mt: 3 }}
              helperText="Selecciona un código para el diagnóstico principal"
            >
              <MenuItem value="">Seleccionar Código</MenuItem>
              <MenuItem value="A00">A00 - Cólera</MenuItem>
              <MenuItem value="J45">J45 - Asma</MenuItem>
              <MenuItem value="K21">K21 - Reflujo gastroesofágico</MenuItem>
              <MenuItem value="M79">M79 - Trastornos musculares</MenuItem>
              <MenuItem value="R10">R10 - Dolor abdominal y pélvico</MenuItem>
              <MenuItem value="I10">I10 - Hipertensión esencial</MenuItem>
              <MenuItem value="E11">E11 - Diabetes mellitus tipo 2</MenuItem>
            </TextField>

            {/* Diagnóstico */}
            <TextField
              label="Diagnóstico Detallado"
              name="diagnostico"
              multiline
              rows={4}
              fullWidth
              required
              sx={{ mt: 3 }}
              value={formData.diagnostico}
              onChange={handleChange}
            />

            {/* Algoritmo Baltazar */}
            <Box sx={{ mt: 4 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                El algoritmo Baltazar evalúa el riesgo pancreático. Asigna una
                puntuación (0–10) simulada.
              </Alert>

              <Typography gutterBottom>
                Puntuación Baltazar: {formData.puntuacionBaltazar}
              </Typography>
              <Slider
                name="puntuacionBaltazar"
                value={formData.puntuacionBaltazar}
                onChange={handleBaltazarChange}
                step={1}
                min={0}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
              <Typography
                color={
                  formData.puntuacionBaltazar > 5 ? "error.main" : "success.main"
                }
              >
                {formData.puntuacionBaltazar > 5
                  ? "Alto riesgo simulado"
                  : "Bajo riesgo simulado"}
              </Typography>
            </Box>

            {/* Observaciones */}
            <TextField
              label="Observaciones Adicionales"
              name="observaciones"
              multiline
              rows={3}
              fullWidth
              sx={{ mt: 3 }}
              value={formData.observaciones}
              onChange={handleChange}
            />

            <Divider sx={{ my: 3 }} />

            {/* Botones */}
            <Box display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AssessmentIcon />}
                sx={{ flex: 1 }}
              >
                Ingresar Dictamen
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                startIcon={<CleaningServicesIcon />}
                sx={{ flex: 1 }}
                onClick={() =>
                  setFormData({
                    cie10: "",
                    algoritmoBaltazar: "",
                    paciente: "",
                    diagnostico: "",
                    fecha: "",
                    observaciones: "",
                    puntuacionBaltazar: 0,
                    resultado: "",
                    medicoId: "",
                  })
                }
              >
                Limpiar Formulario
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Resultado */}
      {formData.resultado && (
        <Card sx={{ mt: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6">Resultado Simulado del Dictamen</Typography>
            <Typography>
              <strong>Resultado Algoritmo Baltazar:</strong>{" "}
              {formData.resultado}
            </Typography>
            <Typography>
              <strong>CIE-10 Seleccionado:</strong> {formData.cie10}
            </Typography>
            <Typography>
              <strong>Diagnóstico:</strong>{" "}
              {formData.diagnostico.substring(0, 100)}...
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DictamenIngreso;
