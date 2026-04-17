import jsPDF from 'jspdf';
import { InspecaoMontagem } from '../types/inspecao';

export const usePdfExportInspecao = () => {
    const exportInspecaoToPdf = async (inspecao: InspecaoMontagem, filename: string, logoPath?: string) => {
        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const marginLeft = 15;
            const marginRight = 15;
            const maxWidth = pageWidth - marginLeft - marginRight;
            
            let yPosition = 15;

            // Logo
            if (logoPath) {
                try {
                    const img = new Image();
                    img.src = logoPath;
                    await new Promise((resolve) => {
                        img.onload = () => {
                            pdf.addImage(img, 'PNG', marginLeft, yPosition + 2, 27, 20);
                            resolve(undefined);
                        };
                    });
                    yPosition += 15;
                } catch (e) {
                    console.error('Erro ao adicionar logo:', e);
                }
            }

            // Cabeçalho
            pdf.setFontSize(14);
            pdf.text('INSPEÇÃO DE MONTAGEM', pageWidth / 2, yPosition, { align: 'center' });
            
            pdf.setFontSize(9);
            pdf.text('FOR-MAN-005 - Rev. 5', pageWidth - marginRight - 5, yPosition, { align: 'right' });
            
            yPosition += 8;

            // Linha divisória
            pdf.setDrawColor(0, 0, 0);
            pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
            yPosition += 7;

            // Função auxiliar para seções
            const addSection = (title: string) => {
                pdf.setFontSize(10);
                pdf.setFillColor(178, 204, 33);
                pdf.rect(marginLeft, yPosition, maxWidth, 7, 'F');
                pdf.text(title, marginLeft + 2, yPosition + 4.5);
                yPosition += 14;
            };

            const addField = (label: string, value: string | number) => {
                pdf.setFontSize(9);
                const labelWidth = maxWidth * 0.35;
                const valueX = marginLeft + labelWidth;
                
                pdf.text(label + ':', marginLeft + 3, yPosition);
                pdf.text(String(value), valueX, yPosition);
                
                yPosition += 6;
            };

            // Dados básicos
            addSection('DADOS DA INSPEÇÃO');
            addField('Número de Série', inspecao.numeroSerie);
            addField('Modelo', inspecao.modelo);
            addField('Data de Inspeção', inspecao.dataInspecao);
            addField('Responsável', inspecao.responsavel);
            yPosition += 1;

            // Descrição
            if (inspecao.descricao) {
                addSection('DESCRIÇÃO');
                pdf.setFontSize(9);
                const descricaoLines = pdf.splitTextToSize(inspecao.descricao, maxWidth - 6);
                pdf.text(descricaoLines, marginLeft + 3, yPosition);
                yPosition += descricaoLines.length * 5 + 5;
            }

            // Verificações Gerais
            if (inspecao.verificacoesGerais && inspecao.verificacoesGerais.length > 0) {
                addSection('VERIFICAÇÕES GERAIS');
                
                inspecao.verificacoesGerais.forEach((verif) => {
                    pdf.setFontSize(8);
                    const lines = pdf.splitTextToSize(`${verif.nome} - ${verif.resultado}`, maxWidth - 4);
                    lines.forEach((line: string) => {
                        pdf.text('• ' + line, marginLeft + 5, yPosition);
                        yPosition += 3.5;
                    });
                    if (verif.observacao) {
                        const obsLines = pdf.splitTextToSize(`   ${verif.observacao}`, maxWidth - 10);
                        obsLines.forEach((line: string) => {
                            pdf.text(line, marginLeft + 8, yPosition);
                            yPosition += 3;
                        });
                    }
                    yPosition += 1;
                });
                yPosition += 2;
            }

            // Verificações Pós-Montagem
            if (inspecao.verificacoesPosmontagem && inspecao.verificacoesPosmontagem.length > 0) {
                addSection('VERIFICAÇÕES PÓS-MONTAGEM');
                
                inspecao.verificacoesPosmontagem.forEach((verif) => {
                    pdf.setFontSize(8);
                    const lines = pdf.splitTextToSize(`${verif.nome} - ${verif.resultado}`, maxWidth - 4);
                    lines.forEach((line: string) => {
                        pdf.text('• ' + line, marginLeft + 5, yPosition);
                        yPosition += 3.5;
                    });
                    if (verif.observacao) {
                        const obsLines = pdf.splitTextToSize(`   ${verif.observacao}`, maxWidth - 10);
                        obsLines.forEach((line: string) => {
                            pdf.text(line, marginLeft + 8, yPosition);
                            yPosition += 3;
                        });
                    }
                    yPosition += 1;
                });
                yPosition += 2;
            }

            // Análise Dimensional
            if (inspecao.analiseDimensional) {
                addSection('ANÁLISE DIMENSIONAL');
                pdf.setFontSize(9);
                const analiseLines = pdf.splitTextToSize(inspecao.analiseDimensional, maxWidth - 6);
                pdf.text(analiseLines, marginLeft + 3, yPosition);
                yPosition += analiseLines.length * 5 + 5;
            }

            // Testes de Motor
            if (inspecao.testesMotor && inspecao.testesMotor.length > 0) {
                addSection('TESTES DE MOTOR');
                
                inspecao.testesMotor.forEach((teste) => {
                    pdf.setFontSize(8);
                    const lines = pdf.splitTextToSize(`${teste.nome} - ${teste.resultado}`, maxWidth - 4);
                    lines.forEach((line: string) => {
                        pdf.text('• ' + line, marginLeft + 5, yPosition);
                        yPosition += 3.5;
                    });
                    if (teste.observacao) {
                        const obsLines = pdf.splitTextToSize(`   ${teste.observacao}`, maxWidth - 10);
                        obsLines.forEach((line: string) => {
                            pdf.text(line, marginLeft + 8, yPosition);
                            yPosition += 3;
                        });
                    }
                    yPosition += 1;
                });
                yPosition += 2;
            }

            // Testes Adicionais
            if (inspecao.testesAdicionar && inspecao.testesAdicionar.length > 0) {
                addSection('TESTES ADICIONAIS');
                
                inspecao.testesAdicionar.forEach((teste) => {
                    pdf.setFontSize(8);
                    const lines = pdf.splitTextToSize(`${teste.nome} - ${teste.resultado}`, maxWidth - 4);
                    lines.forEach((line: string) => {
                        pdf.text('• ' + line, marginLeft + 5, yPosition);
                        yPosition += 3.5;
                    });
                    if (teste.observacao) {
                        const obsLines = pdf.splitTextToSize(`   ${teste.observacao}`, maxWidth - 10);
                        obsLines.forEach((line: string) => {
                            pdf.text(line, marginLeft + 8, yPosition);
                            yPosition += 3;
                        });
                    }
                    yPosition += 1;
                });
                yPosition += 2;
            }

            // Resultado Final
            addSection('RESULTADO FINAL');
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            if (inspecao.resultadoFinal === 'APROVADO') {
                pdf.setTextColor(0, 128, 0);
            } else {
                pdf.setTextColor(255, 0, 0);
            }
            pdf.text(inspecao.resultadoFinal || '—', marginLeft + 3, yPosition);
            pdf.setTextColor(0, 0, 0);
            yPosition += 8;

            // Observações
            if (inspecao.observacoes) {
                addSection('OBSERVAÇÕES');
                pdf.setFontSize(9);
                const obsLines = pdf.splitTextToSize(inspecao.observacoes, maxWidth - 6);
                pdf.text(obsLines, marginLeft + 3, yPosition);
                yPosition += obsLines.length * 5 + 5;
            }

            // Assinaturas
            yPosition += 10;
            addSection('RECEBIMENTO DA INSPEÇÃO');
            yPosition += 25;
            
            const signatureY = yPosition;
            const col1 = marginLeft + 20;
            const col2 = pageWidth / 2;
            const col3 = pageWidth - marginRight - 20;
            
            pdf.line(col1 - 25, signatureY, col1 + 25, signatureY);
            pdf.line(col2 - 25, signatureY, col2 + 25, signatureY);
            pdf.line(col3 - 25, signatureY, col3 + 25, signatureY);
            
            yPosition = signatureY + 6;
            pdf.setFontSize(8);
            pdf.text('Nome', col1, yPosition, { align: 'center' });
            pdf.text('Data', col2, yPosition, { align: 'center' });
            pdf.text('Assinatura', col3, yPosition, { align: 'center' });

            pdf.save(filename);
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            alert('Erro ao exportar PDF!');
        }
    };

    return { exportInspecaoToPdf };
};
