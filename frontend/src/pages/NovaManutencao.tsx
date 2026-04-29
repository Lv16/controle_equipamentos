import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioInspecaoManutencao } from '../components/FormularioInspecaoManutencao';
import { InspecaoManutencao } from '../types/manutencao';
import { useManutencoes } from '../hooks/useManutencoes';

export const NovaManutencao: React.FC = () => {
  const navigate = useNavigate();
  const { adicionarInspecao } = useManutencoes();

  const handleSalvarInspecao = async (inspecao: InspecaoManutencao) => {
    try {
      await adicionarInspecao(inspecao);
      alert('Inspecao salva com sucesso!');
      navigate('/manutencao');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar inspecao');
    }
  };

  return (
    <div className="manutencao-container">
      <FormularioInspecaoManutencao onSalvar={handleSalvarInspecao} />
    </div>
  );
};
