import React, { useState } from 'react';

const Login = ({ onLogin }) => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
};

return (
    <div className="container mt-5">
    <div className="row justify-content-center">
        <div className="col-md-6">
        <div className="card">
            <div className="card-header">
            <h3>Iniciar Sesión</h3>
            </div>
            <div className="card-body">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="form-text">Contraseña demo: 123</div>
                </div>
                <button type="submit" className="btn btn-primary">Ingresar</button>
            </form>
            </div>
        </div>
        </div>
    </div>
    </div>
  );
};


export default Login;