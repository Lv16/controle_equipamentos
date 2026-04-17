import React, { useState } from 'react';
import { useInspecoesMock } from '../hooks/useInspecoesMock';
import { InspecaoMontagem, CreateInspecaoMontageDto } from '../types/inspecao';
import { PdfExporterInspecao } from '../components/PdfExporterInspecao';
import { FormularioInspecao } from '../components/FormularioInspecao';
import './InspecaoMontagem.css';

interface SelectedInspecao {
  id: string;
  data: InspecaoMontagem;
}

const InspecaoMontagemPage: React.FC = () => {
  const { inspecoes, loading, error, criarInspecao } = useInspecoesMock();
  const [selected, setSelected] = useState<SelectedInspecao | null>(null);
  const [modo, setModo] = useState<'lista' | 'criar'>('lista');

  const handleSelectInspecao = (inspecao: InspecaoMontagem) => {
    setSelected({
      id: inspecao.id || '',
      data: inspecao,
    });
  };

  const handleCriarInspecao = (novaInspecao: InspecaoMontagem) => {
    criarInspecao(novaInspecao);
    setModo('lista');
    alert('Inspeção de montagem criada com sucesso!');
  };

  if (loading) return <div className="container"><p>Carregando...</p></div>;
  if (error) return <div className="container error"><p>Erro: {error}</p></div>;

  if (modo === 'criar') {
    return (
      <div className="container">
        <FormularioInspecao
          onSubmit={handleCriarInspecao}
          onCancel={() => setModo('lista')}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Inspeção de Montagem</h1>
      
      <div className="toolbar">
        <button 
          onClick={() => setModo('criar')}
          className="btn-novo"
        >
          Criar Inspeção de Montagem
        </button>
      </div>
      
      <div className="content">
        <div className="list-section">
          <h2>Inspeções ({inspecoes.length})</h2>
          {inspecoes.length === 0 ? (
            <p>Nenhuma inspeção encontrada</p>
          ) : (
            <ul className="inspecao-list">
              {inspecoes.map((inspecao: InspecaoMontagem) => (
                <li
                  key={inspecao.id}
                  className={selected?.id === inspecao.id ? 'active' : ''}
                  onClick={() => handleSelectInspecao(inspecao)}
                >
                  <strong>{inspecao.numeroSerie}</strong>
                  <small>{inspecao.modelo}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="detail-section">
          {selected ? (
            <div className="inspecao-detail">
              <h2>Detalhes da Inspeção</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Número de Série:</label>
                  <p>{selected.data.numeroSerie}</p>
                </div>
                <div className="detail-item">
                  <label>Modelo:</label>
                  <p>{selected.data.modelo}</p>
                </div>
                <div className="detail-item">
                  <label>Data de Inspeção:</label>
                  <p>{selected.data.dataInspecao}</p>
                </div>
                <div className="detail-item">
                  <label>Responsável:</label>
                  <p>{selected.data.responsavel}</p>
                </div>
              </div>

              {selected.data.descricao && (
                <div className="detail-section-item">
                  <label>Descrição:</label>
                  <p>{selected.data.descricao}</p>
                </div>
              )}

              {selected.data.verificacoesGerais && selected.data.verificacoesGerais.length > 0 && (
                <div className="detail-section-item">
                  <label>Verificações Gerais:</label>
                  <ul>
                    {selected.data.verificacoesGerais.map((verif) => (
                      <li key={verif.id}>
                        <strong>{verif.nome}</strong> - {verif.resultado}
                        {verif.observacao && ` (${verif.observacao})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.data.verificacoesPosmontagem && selected.data.verificacoesPosmontagem.length > 0 && (
                <div className="detail-section-item">
                  <label>Verificações Pós-Montagem:</label>
                  <ul>
                    {selected.data.verificacoesPosmontagem.map((verif) => (
                      <li key={verif.id}>
                        <strong>{verif.nome}</strong> - {verif.resultado}
                        {verif.observacao && ` (${verif.observacao})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.data.analiseDimensional && (
                <div className="detail-section-item">
                  <label>Análise Dimensional:</label>
                  <p>{selected.data.analiseDimensional}</p>
                </div>
              )}

              {selected.data.testesMotor && selected.data.testesMotor.length > 0 && (
                <div className="detail-section-item">
                  <label>Testes de Motor:</label>
                  <ul>
                    {selected.data.testesMotor.map((teste) => (
                      <li key={teste.id}>
                        <strong>{teste.nome}</strong> - {teste.resultado}
                        {teste.observacao && ` (${teste.observacao})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.data.testesAdicionar && selected.data.testesAdicionar.length > 0 && (
                <div className="detail-section-item">
                  <label>Testes Adicionais:</label>
                  <ul>
                    {selected.data.testesAdicionar.map((teste) => (
                      <li key={teste.id}>
                        <strong>{teste.nome}</strong> - {teste.resultado}
                        {teste.observacao && ` (${teste.observacao})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.data.resultadoFinal && (
                <div className="detail-section-item">
                  <label>Resultado Final:</label>
                  <p style={{
                    fontWeight: 'bold',
                    color: selected.data.resultadoFinal === 'APROVADO' ? '#008000' : '#FF0000',
                    fontSize: '16px'
                  }}>
                    {selected.data.resultadoFinal}
                  </p>
                </div>
              )}

              {selected.data.observacoes && (
                <div className="detail-section-item">
                  <label>Observações:</label>
                  <p>{selected.data.observacoes}</p>
                </div>
              )}

              <div className="action-buttons">
                <PdfExporterInspecao inspecao={selected.data} />
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Selecione uma inspeção para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspecaoMontagemPage;
