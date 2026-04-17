import { useEffect, useState } from 'react';
import { InspecaoMontagem, VerificacaoItem } from '../types/inspecao';

export const useInspecoesMock = () => {
    const [inspecoes, setInspecoes] = useState<InspecaoMontagem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simula delay de API
        const timer = setTimeout(() => {
            const mockInspecoes: InspecaoMontagem[] = [
                {
                    id: '1',
                    numeroSerie: 'CEEV2030ACM-0559',
                    dataInspecao: '2024-01-15',
                    modelo: 'EXAUSTOR 420 MONOFASICO',
                    descricao: 'Inspeção de montagem e funcionamento',
                    verificacoesGerais: [
                        { id: '1', nome: 'Inspeção visual com limpeza em periferia', resultado: 'SIM', observacao: 'OK' },
                        { id: '2', nome: 'Instrumentos calibrados', resultado: 'SIM', observacao: 'Dentro do prazo' },
                    ],
                    verificacoesPosmontagem: [
                        { id: '3', nome: 'Teste de isolamento', resultado: 'SIM', observacao: '500 MOhm' },
                        { id: '4', nome: 'Teste de impedância', resultado: 'SIM', observacao: 'Normal' },
                    ],
                    analiseDimensional: 'Todas as dimensões dentro da tolerância. Carcaça íntegra.',
                    testesMotor: [
                        { id: '5', nome: 'Teste de rotação', resultado: 'SIM', observacao: '1800 RPM' },
                        { id: '6', nome: 'Teste de temperatura', resultado: 'SIM', observacao: '45°C' },
                    ],
                    testesAdicionar: [
                        { id: '7', nome: 'Afastamento', resultado: 'SIM', observacao: 'Normal' },
                        { id: '8', nome: 'Torque aplicado', resultado: 'SIM', observacao: '25 Nm' },
                    ],
                    resultadoFinal: 'APROVADO',
                    observacoes: 'Equipamento aprovado para uso. Todas as verificações realizadas com sucesso.',
                    responsavel: 'João da Silva',
                    createdAt: '2024-01-15T10:30:00',
                    updatedAt: '2024-01-15T10:30:00',
                },
                {
                    id: '2',
                    numeroSerie: 'CEEV2030ACM-0560',
                    dataInspecao: '2024-01-16',
                    modelo: 'EXAUSTOR 420 MONOFASICO',
                    descricao: 'Inspeção de montagem e funcionamento',
                    verificacoesGerais: [
                        { id: '9', nome: 'Inspeção visual com limpeza em periferia', resultado: 'SIM', observacao: 'OK' },
                    ],
                    verificacoesPosmontagem: [
                        { id: '10', nome: 'Teste de isolamento', resultado: 'SIM', observacao: '600 MOhm' },
                    ],
                    analiseDimensional: 'Verificação pendente',
                    testesMotor: [
                        { id: '11', nome: 'Teste de rotação', resultado: '', observacao: '' },
                    ],
                    testesAdicionar: [
                        { id: '12', nome: 'Afastamento', resultado: '', observacao: '' },
                    ],
                    resultadoFinal: '',
                    observacoes: 'Inspeção em andamento',
                    responsavel: 'Maria Santos',
                    createdAt: '2024-01-16T14:20:00',
                    updatedAt: '2024-01-16T14:20:00',
                },
            ];

            setInspecoes(mockInspecoes);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const criarInspecao = (novaInspecao: InspecaoMontagem) => {
        const inspecaoComId = {
            ...novaInspecao,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setInspecoes([...inspecoes, inspecaoComId]);
    };

    return { inspecoes, loading, error, criarInspecao };
};
