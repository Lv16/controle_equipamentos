import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePdfExport = () => {
    const exportToPdf =  async (elementId: string, filename: string) => {
        try {
            const element = document.getElementById(elementId);
            if(!element) {
                console.error('Elemento não encontrado:');
                return;
            }
        //converte HTML para imagem
            const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        //cria PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
        }   catch (error) {
            console.error('Erro ao exportar PDF:', error);
            }
    };

    return { exportToPdf };
};
