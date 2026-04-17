import React, { useState } from 'react';
import { useProducoesMock } from '../hooks/useProducoesMock';
import { Producao, CreateProducaoDto } from '../types/producao';
import { PdfExporter } from '../components/PdfExporter';
import { FormularioOrdem } from '../components/FormularioOrdem';
import './OrdemProducao.css';

interface SelectedProducao {
  id: string;
  data: Producao;
}

const OrdemProducao: React.FC = () => {
  const { producoes, loading, error, criarProducao } = useProducoesMock();
  const [selected, setSelected] = useState<SelectedProducao | null>(null);
  const [modo, setModo] = useState<'lista' | 'criar'>('lista');

  const handleSelectProducao = (producao: Producao) => {
    setSelected({
      id: producao.id || '',
      data: producao,
    });
  };

  const handleCriarOrdem = (novaProducao: CreateProducaoDto) => {
    criarProducao(novaProducao);
    setModo('lista');
    alert('Ordem de produção criada com sucesso!');
  };

  if (loading) return <div className="container"><p>Carregando...</p></div>;
  if (error) return <div className="container error"><p>Erro: {error}</p></div>;

  if (modo === 'criar') {
    return (
      <div className="container">
        <FormularioOrdem
          onSalvar={handleCriarOrdem}
          onCancelar={() => setModo('lista')}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Ordem de Produção</h1>
      
      <div className="toolbar">
        <button 
          onClick={() => setModo('criar')}
          className="btn-novo"
        >
          Gerar Ordem de Produção
        </button>
      </div>
      
      <div className="content">
        <div className="list-section">
          <h2>Produções ({producoes.length})</h2>
          {producoes.length === 0 ? (
            <p>Nenhuma produção encontrada</p>
          ) : (
            <ul className="producao-list">
              {producoes.map((producao: Producao) => (
                <li
                  key={producao.id}
                  className={selected?.id === producao.id ? 'active' : ''}
                  onClick={() => handleSelectProducao(producao)}
                >
                  <strong>{producao.numeroOrdem}</strong>
                  <small>{producao.modelo}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="detail-section">
          {selected ? (
            <div className="producao-detail">
              <h2>Detalhes da Ordem</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Número Ordem:</label>
                  <p>{selected.data.numeroOrdem}</p>
                </div>
                <div className="detail-item">
                  <label>Série:</label>
                  <p>{selected.data.numeroSerie}</p>
                </div>
                <div className="detail-item">
                  <label>Modelo:</label>
                  <p>{selected.data.modelo}</p>
                </div>
                <div className="detail-item">
                  <label>Data Solicitação:</label>
                  <p>{selected.data.dataSolicitacao}</p>
                </div>
              </div>
              <div className="detail-item full">
                <label>Descrição:</label>
                <p>{selected.data.descricao}</p>
              </div>

              {selected.data.itensSeriados && selected.data.itensSeriados.length > 0 && (
                <div className="documents-section">
                  <h3>Itens Serializados</h3>
                  {selected.data.itensSeriados.map((item) => (
                    <div key={item.id} className="doc-item">
                      <strong>{item.numero}</strong>
                      <p>{item.descricao}</p>
                      <small>Série: {item.numeroSerie}</small>
                    </div>
                  ))}
                </div>
              )}

              {selected.data.documentos && selected.data.documentos.length > 0 && (
                <div className="documents-section">
                  <h3>Documentos Relacionados</h3>
                  {selected.data.documentos.map((doc) => (
                    <div key={doc.id} className="doc-item">
                      <strong>{doc.nome}</strong>
                      <small>Código: {doc.codigo}</small>
                    </div>
                  ))}
                </div>
              )}

              {selected.data.listaPecas && (
                <div className="documents-section">
                  <h3>Lista de Peças</h3>
                  <p>{selected.data.listaPecas}</p>
                </div>
              )}

              {selected.data.sequencialMontagem && (
                <div className="documents-section">
                  <h3>Sequencial de Montagem</h3>
                  <p>{selected.data.sequencialMontagem}</p>
                </div>
              )}

              {selected.data.inspecaoMontagem && (
                <div className="documents-section">
                  <h3>Inspeção de Montagem</h3>
                  <p>{selected.data.inspecaoMontagem}</p>
                </div>
              )}

              {selected.data.historicoEquipamento && (
                <div className="documents-section">
                  <h3>Histórico do Equipamento</h3>
                  <p>{selected.data.historicoEquipamento}</p>
                </div>
              )}

              {selected.data.observacoes && (
                <div className="documents-section">
                  <h3>Observações Adicionais</h3>
                  <p>{selected.data.observacoes}</p>
                </div>
              )}

              <PdfExporter 
                producao={selected.data}
              />
            </div>
          ) : (
            <div className="empty-state">
              <p>Selecione uma ordem para visualizar detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdemProducao;
