// Verificação Individual
export interface VerificacaoItem {
  id: string;
  nome: string;
  resultado: 'SIM' | 'NÃO' | '';
  observacao: string;
}

// Para ENVIAR (criar novo)
export interface CreateInspecaoMontageDto {
  numeroSerie: string;
  dataInspecao: string;
  modelo: string;
  descricao: string;
  verificacoesGerais: VerificacaoItem[];
  verificacoesPosmontagem: VerificacaoItem[];
  analiseDimensional: string;
  testesMotor: VerificacaoItem[];
  testesAdicionar: VerificacaoItem[];
  resultadoFinal: 'APROVADO' | 'REPROVADO' | '';
  observacoes: string;
  responsavel: string;
  assinatura?: string;
}

// Para RECEBER (resposta do backend)
export interface InspecaoMontagem extends CreateInspecaoMontageDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
