import React, { useState } from 'react';
import { InspecaoMontagem, CreateInspecaoMontageDto, VerificacaoItem } from '../types/inspecao';
import './FormularioInspecao.css';

interface FormularioInspecaoProps {
  onSubmit: (inspecao: InspecaoMontagem) => void;
  onCancel: () => void;
}

export const FormularioInspecao: React.FC<FormularioInspecaoProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateInspecaoMontageDto>({
    numeroSerie: '',
    dataInspecao: new Date().toISOString().split('T')[0],
    modelo: '',
    descricao: '',
    verificacoesGerais: [],
    verificacoesPosmontagem: [],
    analiseDimensional: '',
    testesMotor: [],
    testesAdicionar: [],
    resultadoFinal: '',
    observacoes: '',
    responsavel: '',
  });

  const [novaVerificacao, setNovaVerificacao] = useState({
    nome: '',
    resultado: '' as 'SIM' | 'NÃO' | '',
    observacao: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdicionarVerificacao = (secao: keyof Pick<CreateInspecaoMontageDto, 'verificacoesGerais' | 'verificacoesPosmontagem' | 'testesMotor' | 'testesAdicionar'>) => {
    if (!novaVerificacao.nome.trim()) {
      alert('Digite o nome da verificação');
      return;
    }

    const novaVerif: VerificacaoItem = {
      id: String(Date.now()),
      nome: novaVerificacao.nome,
      resultado: novaVerificacao.resultado as 'SIM' | 'NÃO' | '',
      observacao: novaVerificacao.observacao,
    };

    setFormData((prev) => ({
      ...prev,
      [secao]: [...(prev[secao] as VerificacaoItem[]), novaVerif],
    }));

    setNovaVerificacao({ nome: '', resultado: '', observacao: '' });
  };

  const handleRemoverVerificacao = (secao: keyof Pick<CreateInspecaoMontageDto, 'verificacoesGerais' | 'verificacoesPosmontagem' | 'testesMotor' | 'testesAdicionar'>, id: string) => {
    setFormData((prev) => ({
      ...prev,
      [secao]: (prev[secao] as VerificacaoItem[]).filter((v) => v.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numeroSerie.trim() || !formData.modelo.trim()) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const novaInspecao: InspecaoMontagem = {
      ...formData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(novaInspecao);
  };

  const renderVerificacoes = (secao: keyof Pick<CreateInspecaoMontageDto, 'verificacoesGerais' | 'verificacoesPosmontagem' | 'testesMotor' | 'testesAdicionar'>, titulo: string) => (
    <div className="form-section">
      <h3>{titulo}</h3>
      {(formData[secao] as VerificacaoItem[]).length > 0 && (
        <ul className="items-list">
          {(formData[secao] as VerificacaoItem[]).map((verif) => (
            <li key={verif.id}>
              <strong>{verif.nome}</strong> - {verif.resultado || '—'}
              {verif.observacao && ` (${verif.observacao})`}
              <button
                type="button"
                className="btn-remove"
                onClick={() => handleRemoverVerificacao(secao, verif.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="add-item">
        <input
          type="text"
          placeholder="Nome da verificação"
          value={novaVerificacao.nome}
          onChange={(e) => setNovaVerificacao((prev) => ({ ...prev, nome: e.target.value }))}
        />
        <select
          value={novaVerificacao.resultado}
          onChange={(e) => setNovaVerificacao((prev) => ({ ...prev, resultado: e.target.value as 'SIM' | 'NÃO' | '' }))}
        >
          <option value="">Resultado</option>
          <option value="SIM">SIM</option>
          <option value="NÃO">NÃO</option>
        </select>
        <input
          type="text"
          placeholder="Observação"
          value={novaVerificacao.observacao}
          onChange={(e) => setNovaVerificacao((prev) => ({ ...prev, observacao: e.target.value }))}
        />
        <button type="button" className="btn-add" onClick={() => handleAdicionarVerificacao(secao)}>
          + Adicionar
        </button>
      </div>
    </div>
  );

  return (
    <form className="formulario-inspecao" onSubmit={handleSubmit}>
      <h2>Nova Inspeção de Montagem (FOR-MAN-005)</h2>

      {/* Informações Básicas */}
      <div className="form-section">
        <h3>Informações Básicas</h3>
        <div className="form-grid">
          <div>
            <label>Número da Série *</label>
            <input
              type="text"
              name="numeroSerie"
              value={formData.numeroSerie}
              onChange={handleInputChange}
              placeholder="Ex: CEEV2030ACM-0559"
              required
            />
          </div>
          <div>
            <label>Data da Inspeção *</label>
            <input
              type="date"
              name="dataInspecao"
              value={formData.dataInspecao}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Modelo *</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
              placeholder="Ex: EXAUSTOR 420 MONOFASICO"
              required
            />
          </div>
          <div>
            <label>Responsável</label>
            <input
              type="text"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleInputChange}
              placeholder="Nome do inspetor"
            />
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="form-section">
        <h3>Descrição</h3>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleInputChange}
          placeholder="Descrição do equipamento"
          rows={3}
        />
      </div>

      {/* Verificações */}
      {renderVerificacoes('verificacoesGerais', 'Verificações Gerais')}
      {renderVerificacoes('verificacoesPosmontagem', 'Verificações Pós-Montagem')}

      {/* Análise Dimensional */}
      <div className="form-section">
        <h3>Análise Dimensional</h3>
        <textarea
          name="analiseDimensional"
          value={formData.analiseDimensional}
          onChange={handleInputChange}
          placeholder="Resultados da análise dimensional"
          rows={3}
        />
      </div>

      {/* Testes */}
      {renderVerificacoes('testesMotor', 'Testes de Motor')}
      {renderVerificacoes('testesAdicionar', 'Testes Adicionais')}

      {/* Resultado Final */}
      <div className="form-section">
        <h3>Resultado Final</h3>
        <select
          name="resultadoFinal"
          value={formData.resultadoFinal}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="APROVADO">APROVADO</option>
          <option value="REPROVADO">REPROVADO</option>
        </select>
      </div>

      {/* Observações */}
      <div className="form-section">
        <h3>Observações Adicionais</h3>
        <textarea
          name="observacoes"
          value={formData.observacoes}
          onChange={handleInputChange}
          placeholder="Observações gerais sobre a inspeção"
          rows={4}
        />
      </div>

      {/* Botões */}
      <div className="form-buttons">
        <button type="submit" className="btn-salvar">
          ✓ Salvar Inspeção
        </button>
        <button type="button" className="btn-cancelar" onClick={onCancel}>
          ✕ Cancelar
        </button>
      </div>
    </form>
  );
};
