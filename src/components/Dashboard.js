import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import { FaBell, FaClipboardList, FaCheckCircle, FaSyncAlt } from "react-icons/fa";

const Dashboard = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    // Simular datos que vienen del backend
    setTimeout(() => {
      setNotifications([
        { id: 1, text: "Nuevo PCL asignado", icon: <FaBell />, color: "info" },
        { id: 2, text: "Dictamen pendiente", icon: <FaClipboardList />, color: "warning" },
      ]);

      setCases([
        { id: "PCL-001", status: "En revisión", color: "primary" },
        { id: "PCL-002", status: "Aprobado", color: "success" },
      ]);
    }, 500);
  }, []);

  return (
    <div className="container-fluid py-4">
      <Row>
        <Col>
          <h2 className="text-dark fw-bold mb-4">
            Bienvenido, {user.email} <small className="text-muted">({user.role})</small>
          </h2>
        </Col>
      </Row>

      {/* Cards de estadísticas */}
      <Row>
        <Col lg="3" md="6" sm="12" className="mb-4">
          <Card className="card-stats shadow border-0">
            <CardBody>
              <Row>
                <Col xs="8">
                  <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                    Casos en revisión
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">3</span>
                </Col>
                <Col xs="4" className="text-end">
                  <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                    <FaSyncAlt />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6" sm="12" className="mb-4">
          <Card className="card-stats shadow border-0">
            <CardBody>
              <Row>
                <Col xs="8">
                  <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                    Casos aprobados
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">5</span>
                </Col>
                <Col xs="4" className="text-end">
                  <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                    <FaCheckCircle />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Notificaciones */}
      <Row className="mt-4">
        <Col md="6">
          <Card className="shadow border-0">
            <CardBody>
              <CardTitle tag="h5" className="text-uppercase text-muted mb-3">
                Notificaciones Automáticas
              </CardTitle>
              {notifications.map((n) => (
                <div key={n.id} className={`alert alert-${n.color} d-flex align-items-center`}>
                  <span className="me-2 fs-5">{n.icon}</span> {n.text}
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="shadow border-0">
            <CardBody>
              <CardTitle tag="h5" className="text-uppercase text-muted mb-3">
                Resumen de Casos
              </CardTitle>
              {cases.map((c) => (
                <div key={c.id} className={`alert alert-${c.color}`}>
                  <strong>{c.id}:</strong> {c.status}
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
