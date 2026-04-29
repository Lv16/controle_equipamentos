import React, { useState } from 'react';
import { useInspecoes } from '../hooks/useInspecoes';
import { InspecaoMontagem } from '../types/inspecao';
import { PdfExporterInspecao } from '../components/PdfExporterInspecao';
import '../pages/Producao.css';

interface SelectedInspecao {
  id: string;
  data: InspecaoMontagem;
}

const InspecaoMontagemPage: React.FC = () => {
  const { inspecoes, loading, error, salvarInspecao } = useInspecoes();
  const [selected, setSelected] = useState<SelectedInspecao | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelectInspecao = (inspecao: InspecaoMontagem) => {
    setSelected({
      id: inspecao.id || '',
      data: inspecao,
    });
  };

  const handleRegistroChange = (
    itemId: string,
    field: 'valorObservado' | 'instrumentoMedicao' | 'conformidade',
    value: string,
  ) => {
    if (!selected) return;

    setSelected({
      ...selected,
      data: {
        ...selected.data,
        verificacoesGeraisPremontagem: selected.data.verificacoesGeraisPremontagem.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item,
        ),
      },
    });
  };

  const handleSalvar = async () => {
    if (!selected) return;

    try {
      setSaving(true);
      await salvarInspecao(selected.data);
      alert('Inspecao de montagem salva com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar inspecao de montagem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Carregando...</p></div>;
  if (error) return <div className="container error"><p>Erro: {error}</p></div>;

  return (
    <div className="producao-page">
      <h2>Inspecao de Montagem</h2>

      <div className="page-content">
        <div className="page-list-section">
          <h3>Producoes ({inspecoes.length})</h3>
          {inspecoes.length === 0 ? (
            <p>Nenhuma producao encontrada</p>
          ) : (
            <ul className="page-list">
              {inspecoes.map((inspecao: InspecaoMontagem) => (
                <li
                  key={inspecao.id}
                  className={selected?.id === inspecao.id ? 'active' : ''}
                  onClick={() => handleSelectInspecao(inspecao)}
                >
                  <strong>{inspecao.numeroSerie || 'Sem serie'}</strong>
                  <small>{inspecao.modelo || 'Sem modelo'}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="page-detail-section">
          {selected ? (
            <div className="inspecao-detail">
              <h3>Registros da Inspecao</h3>
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
                  <label>Ultima Atualizacao:</label>
                  <p>{selected.data.updatedAt ? new Date(selected.data.updatedAt).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Resultado:</label>
                  <p>
                    <strong style={{ color: selected.data.resultadoFinal === 'APROVADO' ? '#4caf50' : '#f44336' }}>
                      {selected.data.resultadoFinal || 'PENDENTE'}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="registros-table" style={{ marginTop: '20px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Valor Observado</th>
                      <th>Instrumento</th>
                      <th>Conformidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.data.verificacoesGeraisPremontagem.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>
                          <input
                            type="text"
                            value={item.valorObservado || ''}
                            onChange={(event) => handleRegistroChange(item.id, 'valorObservado', event.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.instrumentoMedicao || ''}
                            onChange={(event) => handleRegistroChange(item.id, 'instrumentoMedicao', event.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            value={item.conformidade}
                            onChange={(event) => handleRegistroChange(item.id, 'conformidade', event.target.value)}
                          >
                            <option value="">Pendente</option>
                            <option value="SIM">SIM</option>
                            <option value="NÃƒO">NAO</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="page-toolbar" style={{ marginTop: '20px' }}>
                <button onClick={handleSalvar} className="btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Inspecao'}
                </button>
                <PdfExporterInspecao inspecao={selected.data} />
              </div>
            </div>
          ) : (
            <div className="page-detail-section">
              <p>Selecione uma producao para ver a inspecao de montagem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspecaoMontagemPage;
