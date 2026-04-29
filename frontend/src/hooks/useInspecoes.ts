import { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { InspecaoMontagem, VerificacaoItem } from '../types/inspecao';

type ApiListResponse<T> = {
  data: T[];
};

const NAO = 'N' + String.fromCharCode(195, 131) + 'O';
const INSTRUMENTOS_KEY = 'instrumentosAferi' + String.fromCharCode(231) + String.fromCharCode(227) + 'o';

const VERIFICACOES_GERAIS_PREMONTAGEM = [
  'Check dos Itens dos Seriados',
  'Analise Dimensional de Carcaca',
  'Resultado Esperado: Modelo CSEX420RM entre 415 e 430mm',
  'Resultado Esperado: Modelo CSC3420AC entre 415 e 430mm',
  'Resultado Esperado: Modelo CSEX550AC entre 545 e 560mm',
  'Resultado Esperado: Modelo CSEX550SS entre 545 e 560mm',
  'Teste de Aterramento do Motor',
  'Teste de Isolacao do Motor',
  'Aplicacao e afericao de Torque do Motor M4',
  'Aplicacao e afericao de Torque do Motor M5',
  'Aplicacao e afericao de Torque da botoeira',
  'Teste de Funcionamento do Motor',
  'Teste de Rotacao do Motor - Modelo CSEX420RM',
  'Teste de Rotacao do Motor - Modelo CSEX420AC',
  'Teste de Rotacao do Motor - Modelo CSEX550AC',
  'Teste de Rotacao do Motor - Modelo CSEX550SS',
];

const conformidadeToFront = (value?: boolean | null) => {
  if (value === true) return 'SIM';
  if (value === false) return NAO;
  return '';
};

const conformidadeToApi = (value: string) => {
  if (value === 'SIM') return true;
  if (value === NAO) return false;
  return undefined;
};

const toDateInput = (value?: string | null) => {
  if (!value) return new Date().toISOString().split('T')[0];
  return value.split('T')[0];
};

const mapRegistros = (registros: any[] = []): VerificacaoItem[] => {
  const registrosPorOrdem = new Map(registros.map((registro) => [registro.ordem, registro]));

  return VERIFICACOES_GERAIS_PREMONTAGEM.map((nome, index) => {
    const ordem = index + 1;
    const registro = registrosPorOrdem.get(ordem);

    return {
      id: String(ordem),
      nome,
      valorObservado: registro?.valorObservado ?? '',
      instrumentoMedicao: registro?.instrumentoMedicao ?? '',
      conformidade: conformidadeToFront(registro?.conformidades) as VerificacaoItem['conformidade'],
    };
  });
};

const mapApiToInspecao = (producao: any): InspecaoMontagem => {
  const verificacoesGeraisPremontagem = mapRegistros(producao.registrosInspecaoMontagem);
  const reprovado = verificacoesGeraisPremontagem.some((item) => item.conformidade === NAO);
  const preenchidos = verificacoesGeraisPremontagem.some(
    (item) => item.valorObservado || item.instrumentoMedicao || item.conformidade,
  );

  return {
    id: producao.id,
    numeroSerie: producao.numeroSerie ?? '',
    dataInspecao: toDateInput(producao.atualizadoEm || producao.criadoEm),
    modelo: producao.modelo ?? '',
    [INSTRUMENTOS_KEY]: [],
    verificacoesGeraisPremontagem,
    verificacaoPosmontagem: [],
    resultadoFinal: preenchidos ? (reprovado ? 'REPROVADO' : 'APROVADO') : '',
    observacoes: '',
    responsavel: '',
    data: toDateInput(producao.atualizadoEm || producao.criadoEm),
    createdAt: producao.criadoEm,
    updatedAt: producao.atualizadoEm,
  } as unknown as InspecaoMontagem;
};

export const useInspecoes = () => {
  const [inspecoes, setInspecoes] = useState<InspecaoMontagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarInspecoes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ApiListResponse<any>>('/producoes', {
        params: { limit: 100 },
      });
      setInspecoes(response.data.data.map(mapApiToInspecao));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar inspecoes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarInspecoes();
  }, []);

  const salvarInspecao = async (inspecao: InspecaoMontagem) => {
    await Promise.all(
      inspecao.verificacoesGeraisPremontagem.map((item, index) =>
        axiosInstance.patch(`/producoes/${inspecao.id}/inspecao-montagem/${index + 1}`, {
          valorObservado: item.valorObservado || undefined,
          instrumentoMedicao: item.instrumentoMedicao || undefined,
          conformidades: conformidadeToApi(item.conformidade),
        }),
      ),
    );

    await carregarInspecoes();
  };

  return {
    inspecoes,
    loading,
    error,
    salvarInspecao,
    recarregar: carregarInspecoes,
  };
};
