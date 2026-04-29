import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <button onClick={() => handleNavigate('/producao')} className="nav-link">
            Producao
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigate('/manutencao')} className="nav-link">
            Manutencao
          </button>
        </li>
        {authService.isAuthenticated() && (
          <li>
            <button onClick={handleLogout} className="nav-link">
              Sair
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
