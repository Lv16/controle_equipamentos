import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css';
import './pages/Producao.css';
import Header from './components/Layout/Header';
import Navbar from './components/Layout/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Producao from './pages/Producao';
import OrdemProducao from './pages/OrdemProducao';
import InspecaoMontagem from './pages/InspecaoMontagem';
import HistoricoEquipamento from './pages/HistoricoEquipamento';
import { Manutencao } from './pages/Manutencao';
import { NovaManutencao } from './pages/NovaManutencao';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header title="Sistema de Controle de Equipamentos" />
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/producao" element={<ProtectedRoute><Producao><Outlet /></Producao></ProtectedRoute>}>
            <Route path="ordem" element={<OrdemProducao />} />
            <Route path="inspecao" element={<InspecaoMontagem />} />
            <Route path="historico" element={<HistoricoEquipamento />} />
            <Route index element={<Navigate to="/producao/ordem" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/producao/ordem" replace />} />
          <Route path="/manutencao" element={<ProtectedRoute><Manutencao /></ProtectedRoute>} />
          <Route path="/manutencao/criar" element={<ProtectedRoute><NovaManutencao /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

