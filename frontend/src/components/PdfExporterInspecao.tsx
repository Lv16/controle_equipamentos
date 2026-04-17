import React from 'react';
import { usePdfExportInspecao } from '../hooks/usePdfExportInspecao';
import { InspecaoMontagem } from '../types/inspecao';

interface PdfExporterInspecaoProps {
  inspecao: InspecaoMontagem;
  filename?: string;
}

export const PdfExporterInspecao: React.FC<PdfExporterInspecaoProps> = ({ 
  inspecao,
  filename = 'inspecao_montagem.pdf' 
}) => {
  const { exportInspecaoToPdf } = usePdfExportInspecao();

  const handleExport = async () => {
    const nomeArquivo = `inspecao_${inspecao.numeroSerie}_${inspecao.dataInspecao}.pdf`;
    const logoPath = '/logo.png';
    await exportInspecaoToPdf(inspecao, nomeArquivo, logoPath);
  };

  return (
    <button 
      onClick={handleExport}
      style={{
        backgroundColor: '#B2CC21',
        color: '#333',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
      }}
    >
      📄 Exportar PDF
    </button>
  );
};
