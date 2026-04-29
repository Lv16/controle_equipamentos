import React, { useState } from 'react';
import { useHistorico } from '../hooks/useHistorico';
import { HistoricoEquipamentoData } from '../types/historico';
import { PdfExporterHistorico } from '../components/PdfExporterHistorico';
import '../pages/Producao.css';

interface SelectedHistorico {
  id: string;
  data: HistoricoEquipamentoData;
}

const HistoricoEquipamento: React.FC = () => {
  const { historicos, loading, error } = useHistorico();
  const [selected, setSelected] = useState<SelectedHistorico | null>(null);

  const handleSelectHistorico = (historico: HistoricoEquipamentoData) => {
    setSelected({
      id: historico.id || '',
      data: historico,
    });
  };

  if (loading) return <div className="container"><p>Carregando...</p></div>;
  if (error) return <div className="container error"><p>Erro: {error}</p></div>;

  return (
    <div className="producao-page">
      <h2>Historico do Equipamento</h2>

      <div className="page-content">
        <div className="page-list-section">
          <h3>Producoes ({historicos.length})</h3>
          {historicos.length === 0 ? (
            <p>Nenhuma producao encontrada</p>
          ) : (
            <ul className="page-list">
              {historicos.map((historico: HistoricoEquipamentoData) => (
                <li
                  key={historico.id}
                  className={selected?.id === historico.id ? 'active' : ''}
                  onClick={() => handleSelectHistorico(historico)}
                >
                  <strong>{historico.numeroSerie || 'Sem serie'}</strong>
                  <small>{historico.modelo || 'Sem modelo'}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="page-detail-section">
          {selected ? (
            <div className="historico-detail">
              <h3>Historico de Alteracoes</h3>
              <div className="page-detail-grid">
                <div className="detail-item">
                  <label>Numero de Serie:</label>
                  <p>{selected.data.numeroSerie || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Modelo:</label>
                  <p>{selected.data.modelo || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Data de Criacao:</label>
                  <p>{selected.data.createdAt ? new Date(selected.data.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Ultima Atualizacao:</label>
                  <p>{selected.data.updatedAt ? new Date(selected.data.updatedAt).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
              </div>

              <div className="section-registros">
                <h3>Registros</h3>
                {selected.data.registros.length === 0 ? (
                  <p>Nenhuma alteracao registrada para esta producao.</p>
                ) : (
                  <div className="registros-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Historico</th>
                          <th>Alterado por</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.data.registros.map((registro) => (
                          <tr key={registro.id}>
                            <td>{new Date(registro.data).toLocaleDateString('pt-BR')}</td>
                            <td>{registro.historico}</td>
                            <td>{registro.assinatura}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <PdfExporterHistorico historico={selected.data} logoPath="/logo.png" />
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Selecione uma producao para visualizar o historico</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricoEquipamento;
