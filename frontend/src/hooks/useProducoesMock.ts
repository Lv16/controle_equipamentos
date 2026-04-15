import { useState, useEffect } from 'react';
import { Producao } from '../types/producao';

// Dados simulados para testes - Informações Reais
const MOCK_PRODUCOES: Producao[] = [
  {
    id: '1',
    numeroOrdem: '0559',
    numeroSerie: 'CSEX420ACM-0559',
    modelo: 'CSEX420ACM',
    dataSolicitacao: '18/03/2026',
    descricao: 'EXAUSTOR 420 MONOFÁSICO - 220V 50/60 Hz',
    itensSeriados: [
      {
        id: '1-1',
        numero: 'CSEX420ACM-0559-1',
        descricao: 'CSEX420 MONOFÁSICO - W22Xdb – carcaça 80 – 1,1 kW (1,5 cv) – 220 Vca – 50/60 Hz – 2 pólos',
      },
      {
        id: '1-2',
        numero: 'CSEX420ACM-0559-2',
        descricao: 'CSEX420 MONOFÁSICO - Boteira BTEx 56571/015 (TRAMONTINA)',
      },
      {
        id: '1-3',
        numero: 'CSEX420ACM-0559-3',
        descricao: 'CSEX420 MONOFÁSICO - PCX PRE316PB (APPLETON)',
      },
    ],
    listaPecas: true,
    sequencialMontagem: true,
    inspecaoMontagem: true,
    historicoEquipamento: true,
  },
  {
    id: '2',
    numeroOrdem: '0560',
    numeroSerie: 'CSEX320ACM-0560',
    modelo: 'CSEX320ACM',
    dataSolicitacao: '19/03/2026',
    descricao: 'EXAUSTOR 320 MONOFÁSICO - W222xdb Carcaça 80 - 1,1 kW',
    itensSeriados: [
      {
        id: '2-1',
        numero: 'CSEX320ACM-0560-1',
        descricao: 'CSEX320 MONOFÁSICO - W22Xdb – carcaça 71 – 0,75 kW (1 cv) – 220 Vca – 50/60 Hz – 2 pólos',
      },
      {
        id: '2-2',
        numero: 'CSEX320ACM-0560-2',
        descricao: 'CSEX320 MONOFÁSICO - Chave ALW 1.5/3 (SCHNEIDER)',
      },
    ],
    listaPecas: true,
    sequencialMontagem: true,
    inspecaoMontagem: true,
    historicoEquipamento: true,
  },
  {
    id: '3',
    numeroOrdem: '0561',
    numeroSerie: 'CVA500ACM-0561',
    modelo: 'CVA500ACM',
    dataSolicitacao: '20/03/2026',
    descricao: 'CENTRÍFUGO 500 MONOFÁSICO - Boteira BTEx 56571/015',
    itensSeriados: [
      {
        id: '3-1',
        numero: 'CVA500ACM-0561-1',
        descricao: 'CVA500 MONOFÁSICO - Motor 2 cv – 3600 rpm – 110/220 Vca – Eixo 14 mm',
      },
      {
        id: '3-2',
        numero: 'CVA500ACM-0561-2',
        descricao: 'CVA500 MONOFÁSICO - Rotor 500 mm – carcaça alumínio – classe F',
      },
      {
        id: '3-3',
        numero: 'CVA500ACM-0561-3',
        descricao: 'CVA500 MONOFÁSICO - Rolamento 6205 2Z SKF',
      },
    ],
    listaPecas: true,
    sequencialMontagem: true,
    inspecaoMontagem: false,
    historicoEquipamento: true,
  },
];

export const useProducoesMock = () => {
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula delay de carregamento
    const timer = setTimeout(() => {
      setProducoes(MOCK_PRODUCOES);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { producoes, loading, error: null };
};
