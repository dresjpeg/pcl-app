import React, { useState } from 'react';

const DictamenIngreso = () => {
  const [formData, setFormData] = useState({
    cie10: '',
    algoritmoBaltazar: '',
    paciente: '',
    diagnostico: '',
    fecha: '',
    observaciones: '',
    puntuacionBaltazar: 0,
    resultado: '',
    medicoId: '', // Campo para ID del médico
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBaltazarChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({ ...formData, puntuacionBaltazar: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.medicoId) {
      alert('Por favor ingresa el ID del médico evaluador.');
      return;
    }

    const mockResultado = formData.puntuacionBaltazar > 5
      ? 'Alto riesgo (Requiere intervención inmediata)'
      : 'Bajo riesgo (Monitoreo estándar)';

    const payload = {
      diagnostico: formData.diagnostico,
      cie10: formData.cie10,
      evaluador_id: formData.medicoId,
      algoritmo: 'Baltazar',
      resultado: mockResultado,
    };

    try {
      const res = await fetch('http://localhost:5000/api/dictamen-medico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        setFormData({
          cie10: '',
          algoritmoBaltazar: '',
          paciente: '',
          diagnostico: '',
          fecha: '',
          observaciones: '',
          puntuacionBaltazar: 0,
          resultado: '',
          medicoId: '',
        });
      } else {
        alert('Error guardando dictamen');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="container mt-4 form-section">
      <h2>Ingreso de Dictamen (Evaluador Médico)</h2>
      <p className="text-muted">
        Formulario extenso para ingresar dictamen médico. Simulación de catálogos y algoritmos.
      </p>
      <form onSubmit={handleSubmit} className="card p-4">

        <div className="mb-3">
          <label htmlFor="medicoId" className="form-label">
            ID Evaluador Médico
          </label>
          <input
            type="number"
            className="form-control"
            id="medicoId"
            name="medicoId"
            value={formData.medicoId}
            onChange={handleChange}
            required
          />
        </div>

        {/* Resto de campos que ya tenías */}
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="paciente" className="form-label">Nombre del Paciente</label>
              <input
                type="text"
                className="form-control"
                id="paciente"
                name="paciente"
                value={formData.paciente}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="fecha" className="form-label">Fecha de Evaluación</label>
              <input
                type="date"
                className="form-control"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="cie10" className="form-label">Catálogo CIE-10 (Selección simulada)</label>
          <select
            className="form-control"
            id="cie10"
            name="cie10"
            value={formData.cie10}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Código CIE-10</option>
            <option value="A00">A00 - Cólera</option>
            <option value="J45">J45 - Asma</option>
            <option value="K21">K21 - Enfermedad por reflujo gastroesofágico</option>
            <option value="M79">M79 - Trastornos musculares</option>
            <option value="R10">R10 - Dolor abdominal y pélvico</option>
            <option value="I10">I10 - Hipertensión esencial</option>
            <option value="E11">E11 - Diabetes mellitus tipo 2</option>
          </select>
          <div className="form-text">Selecciona un código para el diagnóstico principal.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="diagnostico" className="form-label">Diagnóstico Detallado</label>
          <textarea
            className="form-control"
            id="diagnostico"
            name="diagnostico"
            rows="4"
            value={formData.diagnostico}
            onChange={handleChange}
            required
          />
          <div className="form-text">Describe el diagnóstico basado en el CIE-10 seleccionado.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Aplicación del Algoritmo Baltazar (Simulación)</label>
          <div className="alert alert-info">
            <p>
              El Algoritmo Baltazar evalúa el riesgo pancreático. Ingresa una puntuación simulada (0-10) basada en factores clínicos (ej: amilasa, leucocitos, etc.).
            </p>
          </div>
          <div className="input-group">
            <span className="input-group-text">Puntuación Baltazar</span>
            <input
              type="range"
              className="form-range"
              id="puntuacionBaltazar"
              name="puntuacionBaltazar"
              min="0"
              max="10"
              value={formData.puntuacionBaltazar}
              onChange={handleBaltazarChange}
              required
            />
            <span className="input-group-text">{formData.puntuacionBaltazar}</span>
          </div>
          <div className="form-text">
            {formData.puntuacionBaltazar > 5 ? 'Alto riesgo simulado' : 'Bajo riesgo simulado'}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="observaciones" className="form-label">Observaciones Adicionales</label>
          <textarea
            className="form-control"
            id="observaciones"
            name="observaciones"
            rows="3"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Ingresar Dictamen</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() =>
            setFormData({
              cie10: '',
              algoritmoBaltazar: '',
              paciente: '',
              diagnostico: '',
              fecha: '',
              observaciones: '',
              puntuacionBaltazar: 0,
              resultado: '',
              medicoId: '',
            })
          }
        >
          Limpiar Formulario
        </button>
      </form>

      {formData.resultado && (
        <div className="mt-4 card p-3">
          <h5>Resultado Simulado del Dictamen</h5>
          <p><strong>Resultado Algoritmo Baltazar:</strong> {formData.resultado}</p>
          <p><strong>CIE-10 Seleccionado:</strong> {formData.cie10}</p>
          <p><strong>Diagnóstico:</strong> {formData.diagnostico.substring(0, 100)}...</p>
        </div>
      )}

      <div className="mt-3 alert alert-secondary">
        <small>Simulando conexión con backend (API REST): POST /api/dictamen con datos del formulario.</small>
      </div>
    </div>
  );
};

export default DictamenIngreso;
