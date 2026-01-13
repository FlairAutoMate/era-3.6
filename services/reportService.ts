
import { jsPDF } from 'jspdf';
import { MatrikkelData, FDVEvent } from '../types';

export const generatePropertyReport = async (
  type: 'bank' | 'insurance',
  property: MatrikkelData,
  stats: {
    currentValue: number;
    verifiedAppreciation: number;
    healthScore: number;
    index: number;
  },
  events: FDVEvent[]
) => {
  const doc = new jsPDF();
  const primaryColor = type === 'bank' ? '#4f46e5' : '#10b981';

  // Header
  doc.setFillColor(3, 3, 3);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('ERA OS PROPERTY REPORT', 20, 25);

  doc.setFontSize(10);
  doc.text(type === 'bank' ? 'FINANCIAL SUMMARY / BANK AUDIT' : 'RISK PROFILE / INSURANCE AUDIT', 20, 32);

  // Property Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EIENDOMSDATA', 20, 55);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Adresse: ${property.address}`, 20, 65);
  doc.text(`Gnr/Bnr: ${property.gnrBnr}`, 20, 70);
  doc.text(`Type: ${property.type} (${property.bra} m2)`, 20, 75);
  doc.text(`Byggeår: ${property.yearBuilt}`, 20, 80);

  // KPI Section
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 85, 190, 85);

  doc.setFont('helvetica', 'bold');
  doc.text('NØKKELTALL', 20, 95);

  doc.setFont('helvetica', 'normal');
  doc.text(`Markedsverdi (ERA Est.):`, 20, 105);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(stats.currentValue / 1000000).toFixed(2)} MNOK`, 100, 105);

  doc.setFont('helvetica', 'normal');
  doc.text(`Verifisert verdiøkning:`, 20, 110);
  doc.setFont('helvetica', 'bold');
  doc.text(`${stats.verifiedAppreciation.toLocaleString()} NOK`, 100, 110);

  doc.setFont('helvetica', 'normal');
  doc.text(`Bolighelse (Score):`, 20, 115);
  doc.setFont('helvetica', 'bold');
  doc.text(`${stats.healthScore}/100`, 100, 115);

  doc.setFont('helvetica', 'normal');
  doc.text(`Eiendomsindeks (EI):`, 20, 120);
  doc.setFont('helvetica', 'bold');
  doc.text(`${stats.index}`, 100, 120);

  // Event Log
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFISERT VEDLIKEHOLDSHISTORIKK', 20, 135);

  doc.setFontSize(8);
  let y = 145;
  events.slice(0, 10).forEach((event, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${event.date} - ${event.title}`, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${event.description.substring(0, 90)}...`, 20, y + 5);
    doc.text(`Utført av: ${event.performedBy || 'ERA Sertifisert'}`, 20, y + 9);
    y += 18;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Dette dokumentet er generert av ERA OS. Data er verifisert via AI-analyse og FDV-dokumentasjon.', 20, 285);

  doc.save(`ERA_Rapport_${property.address.split(',')[0].replace(' ', '_')}_${type}.pdf`);
};
