import { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { HistoricoEquipamentoData } from '../types/historico';

type ApiListResponse<T> = {
  data: T[];
};

const toDateInput = (value?: string | null) => {
  if (!value) return new Date().toISOString();
  return value;
};

const formatRegistro = (registro: any) => {
  const anterior = registro.valorAnterior ?? 'vazio';
  const novo = registro.valorNovo ?? 'vazio';

  return {
    id: registro.id,
    data: toDateInput(registro.criadoEm),
    historico: `${registro.campo}: ${anterior} -> ${novo}`,
    assinatura: registro.alteradoPor || 'Sistema',
  };
};

const mapApiToHistorico = (producao: any): HistoricoEquipamentoData => ({
  id: producao.id,
  numeroSerie: producao.numeroSerie ?? '',
  modelo: producao.modelo ?? '',
  registros: (producao.historicoAlteracoes ?? []).map(formatRegistro),
  notas: producao.descricao ?? '',
  createdAt: producao.criadoEm,
  updatedAt: producao.atualizadoEm,
});

export const useHistorico = () => {
  const [historicos, setHistoricos] = useState<HistoricoEquipamentoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarHistoricos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ApiListResponse<any>>('/producoes', {
        params: { limit: 100 },
      });
      setHistoricos(response.data.data.map(mapApiToHistorico));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar historico');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHistoricos();
  }, []);

  return {
    historicos,
    loading,
    error,
    recarregar: carregarHistoricos,
  };
};
