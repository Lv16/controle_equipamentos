import React, { useState } from 'react';
import { FormularioInspecaoManutencao } from '../components/FormularioInspecaoManutencao';
import { InspecaoManutencao } from '../types/manutencao';
import { usePdfExportManutencao } from '../hooks/usePdfExportManutencao';
import './Manutencao.css';

type AbaAtiva = 'nova' | 'historico';

export const Manutencao: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('nova');
  const [historicoManutencoes, setHistoricoManutencoes] = useState<InspecaoManutencao[]>([]);
  const { exportInspecaoToPdf } = usePdfExportManutencao();

  const handleSalvarInspecao = (inspecao: InspecaoManutencao) => {
    const novoRegistro: InspecaoManutencao = {
      ...inspecao,
      id: Math.random().toString(36).substr(2, 9),
      criadoEm: new Date().toISOString(),
    };

    setHistoricoManutencoes((prev) => [novoRegistro, ...prev]);
    alert('Inspeção salva com sucesso!');
    setAbaAtiva('historico');

    // Aqui você poderia enviar para o backend
    console.log('Inspeção salva:', novoRegistro);
  };

  const handleExportarPDF = async (inspecao: InspecaoManutencao) => {
    try {
      const nomeArquivo = `inspecao_manutencao_${inspecao.numeroSerie || 'equipamento'}_${new Date().toISOString().split('T')[0]}.pdf`;
      await exportInspecaoToPdf(inspecao, nomeArquivo);
    } catch (error) {
      alert('Erro ao gerar PDF: ' + error);
    }
  };

  return (
    <div className="manutencao-container">
      <div className="manutencao-header">
        <h1>Manutenção</h1>
        <div className="manutencao-tabs">
          <button
            className={`tab-button ${abaAtiva === 'nova' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('nova')}
          >
            Nova Inspeção
          </button>
          <button
            className={`tab-button ${abaAtiva === 'historico' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('historico')}
          >
            Histórico
          </button>
        </div>
      </div>

      <div className="manutencao-content">
        <div className="manutencao-page">
          {/* Aba de Nova Inspeção */}
          {abaAtiva === 'nova' && (
            <div className="tab-nova-inspecao">
              <FormularioInspecaoManutencao onSalvar={handleSalvarInspecao} />
            </div>
          )}

          {/* Aba de Histórico */}
          {abaAtiva === 'historico' && (
            <div className="tab-historico">
              <h2>Histórico de Manutenções</h2>
              {historicoManutencoes.length === 0 ? (
                <div className="sem-dados">
                  <p>Nenhuma manutenção registrada</p>
                </div>
              ) : (
                <div className="tabela-container">
                  <table className="tabela-historico">
                    <thead>
                      <tr>
                        <th>Número de Série</th>
                        <th>Fabricante / Modelo</th>
                        <th>Data da Manutenção</th>
                        <th>Responsável</th>
                        <th>Avaliação</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicoManutencoes.map((inspecao) => (
                        <tr key={inspecao.id}>
                          <td>
                            <strong>{inspecao.numeroSerie || '—'}</strong>
                            {inspecao.tag && <div style={{ fontSize: '12px', color: '#666' }}>TAG: {inspecao.tag}</div>}
                          </td>
                          <td>{inspecao.fabricante || '—'} / {inspecao.modelo || '—'}</td>
                          <td>{new Date(inspecao.dataManutencao).toLocaleDateString('pt-BR')}</td>
                          <td>{inspecao.responsavel || '—'}</td>
                          <td>
                            <span
                              className={`badge badge-${inspecao.avaliacaoFinal === 'CONFORME' ? 'success' : 'danger'}`}
                            >
                              {inspecao.avaliacaoFinal || '—'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-exportar-historico"
                              onClick={() => handleExportarPDF(inspecao)}
                              title="Exportar inspeção em PDF"
                            >
                              📄 PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
