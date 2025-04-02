import React, { useState } from 'react';
import '../styles/login.css';
import { login } from '../services/api';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      await login(formData.username, formData.password);
      window.location.href = '/';
    } catch (error: any) {
      setError(error.message || 'Credenciales inválidas o error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <div className="maze-login-container">
      <div className="maze-login">
        <div className="maze-header">
          <h1>Laberinto del Minotauro</h1>
          <p>Encuentra la salida... si puedes</p>
        </div>

        <form onSubmit={handleSubmit} className="maze-form">
          <div className="maze-input-group">
            <label htmlFor="username">Aventurero</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Tu nombre de héroe"
              required
            />
            <div className="maze-input-decoration"></div>
          </div>

          <div className="maze-input-group">
            <label htmlFor="password">Contraseña Secreta</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Tu hechizo de acceso"
              required
            />
            <div className="maze-input-decoration"></div>
          </div>

          {error && <div className="maze-error">{error}</div>}

          <button type="submit" className="maze-button" disabled={isLoading}>
            {isLoading ? 'Cargando mapa...' : 'Entrar al Laberinto'}
            <span className="maze-button-corner maze-button-corner-tl"></span>
            <span className="maze-button-corner maze-button-corner-tr"></span>
            <span className="maze-button-corner maze-button-corner-bl"></span>
            <span className="maze-button-corner maze-button-corner-br"></span>
          </button>
        </form>

        <div className="maze-footer">
          <p>¿Nuevo aventurero? <a href="/register" className="maze-link">Registrarse</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;