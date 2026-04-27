import { useEffect, useState } from 'react';
import { InspecaoMontagem } from '../types/inspecao';

// Importar dados mock completos
import { mockInspecaoAprovada, mockInspecaoReprovada } from './useInspecaoMontagemMock';

export const useInspecoesMock = () => {
    const [inspecoes, setInspecoes] = useState<InspecaoMontagem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simula delay de API
        const timer = setTimeout(() => {
            const mockInspecoes: InspecaoMontagem[] = [
                {
                    id: '1',
                    ...mockInspecaoAprovada,
                    createdAt: '2026-04-24T10:30:00',
                    updatedAt: '2026-04-24T10:30:00',
                },
                {
                    id: '2',
                    ...mockInspecaoReprovada,
                    createdAt: '2026-04-23T14:15:00',
                    updatedAt: '2026-04-23T14:15:00',
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
        setInspecoes((prev) => [...prev, inspecaoComId]);
    };

    const atualizarInspecao = (id: string, inspecaoAtualizada: InspecaoMontagem) => {
        setInspecoes((prev) =>
            prev.map((insp) =>
                insp.id === id
                    ? { ...inspecaoAtualizada, updatedAt: new Date().toISOString() }
                    : insp
            )
        );
    };

    const deletarInspecao = (id: string) => {
        setInspecoes((prev) => prev.filter((insp) => insp.id !== id));
    };

    return {
        inspecoes,
        loading,
        criarInspecao,
        atualizarInspecao,
        deletarInspecao,
    };
};
