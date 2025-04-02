import React, { useState } from 'react';
import { register } from '../services/api';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const RegisterComponent: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
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
      await register(formData);
      window.location.href = '/'; 
    } catch (error: any) {
      setError(error.message || 'Error al registrar el usuario');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="maze-login-container">
      <div className="maze-login">
        <div className="maze-header">
          <h1>Laberinto del Minotauro</h1>
          <p>Únete a la aventura...</p>
        </div>

        <form onSubmit={handleSubmit} className="maze-form">
          <div className="maze-input-group">
            <label htmlFor="username">Nombre de aventurero</label>
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
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Tu correo electrónico"
              required
            />
            <div className="maze-input-decoration"></div>
          </div>

          <div className="maze-input-group">
            <label htmlFor="password">Contraseña secreta</label>
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
            {isLoading ? 'Registrando...' : 'Unirse al Laberinto'}
            <span className="maze-button-corner maze-button-corner-tl"></span>
            <span className="maze-button-corner maze-button-corner-tr"></span>
            <span className="maze-button-corner maze-button-corner-bl"></span>
            <span className="maze-button-corner maze-button-corner-br"></span>
          </button>
        </form>

        <div className="maze-footer">
          <p>¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
        </div>
      </div>

      <div className="maze-decoration">
        <div className="maze-path maze-path-1"></div>
        <div className="maze-path maze-path-2"></div>
        <div className="maze-path maze-path-3"></div>
        <div className="maze-minotaur-icon">🐮</div>
      </div>
    </div>
  );
};

export default RegisterComponent;

