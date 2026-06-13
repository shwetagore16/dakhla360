'use client';
import { useState } from 'react';
import { FileText } from 'lucide-react';

interface Props {
  asset: any;
  reviews: any[];
}

export default function ExportPDF({ asset, reviews }: Props) {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      const addText = (text: string, size = 10, bold = false, color = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text, margin, y);
        y += size * 0.5 + 4;
      };

      const addLine = () => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      };

      const addBox = (label: string, value: string, x: number, boxY: number, width: number) => {
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(x, boxY, width, 16, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(label, x + 4, boxY + 6);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(value || '-', x + 4, boxY + 13);
      };

      doc.setFillColor(0, 212, 255);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Dakhla360', margin, 15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Blockchain Asset Verification Report', margin, 24);
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text('Generated: ' + new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      }), pageWidth - margin - 60, 24);

      y = 48;

      addText(asset.name, 18, true, [20, 20, 20]);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Asset ID: ' + asset.assetId + '   |   Type: ' + asset.type.toUpperCase(), margin, y);
      y += 8;
      addLine();

      const scoreColor = asset.trustScore > 70 ? [16, 185, 129] : asset.trustScore > 40 ? [245, 158, 11] : [239, 68, 68];
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.roundedRect(margin, y, 50, 22, 3, 3, 'F');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(String(asset.trustScore) + '/100', margin + 6, y + 14);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('TRUST SCORE', margin + 6, y + 20);
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text('Status: ' + asset.status.toUpperCase(), margin + 60, y + 8);
      doc.text('Verified: ' + (asset.isVerified ? 'YES' : 'Not Yet'), margin + 60, y + 16);
      doc.text('Reviews: ' + reviews.length, margin + 120, y + 8);
      doc.text('On Blockchain: YES', margin + 120, y + 16);
      y += 30;
      addLine();

      addText('Location', 12, true, [30, 30, 30]);
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(
        [asset.location?.address, asset.location?.city, asset.location?.country].filter(Boolean).join(', '),
        margin, y
      );
      y += 10;
      if (asset.attributes?.pincode) { doc.text('Pincode: ' + asset.attributes.pincode, margin, y); y += 8; }
      if (asset.attributes?.landmark) { doc.text('Landmark: ' + asset.attributes.landmark, margin, y); y += 8; }
      addLine();

      if (asset.attributes && Object.keys(asset.attributes).length > 0) {
        addText('Property Details', 12, true, [30, 30, 30]);
        const colW = (pageWidth - margin * 2 - 10) / 3;
        const details = [
          { label: 'Size', value: asset.attributes.size },
          { label: 'Bedrooms', value: asset.attributes.bedrooms ? asset.attributes.bedrooms + ' BHK' : null },
          { label: 'Bathrooms', value: asset.attributes.bathrooms },
          { label: 'Furnishing', value: asset.attributes.furnishing },
          { label: 'Floor', value: asset.attributes.floors && asset.attributes.totalFloors ? asset.attributes.floors + '/' + asset.attributes.totalFloors : null },
          { label: 'Age', value: asset.attributes.propertyAge },
          { label: 'Facing', value: asset.attributes.facing },
          { label: 'Legal Status', value: asset.attributes.legalStatus },
          { label: 'Reg Number', value: asset.attributes.registrationNumber },
        ].filter(d => d.value);

        let col = 0;
        const rowStart = y;
        details.forEach((d, idx) => {
          const x = margin + col * (colW + 5);
          const boxY = rowStart + Math.floor(idx / 3) * 22;
          addBox(d.label, d.value || '', x, boxY, colW);
          col = (col + 1) % 3;
        });
        y = rowStart + Math.ceil(details.length / 3) * 22 + 6;

        if (asset.attributes.expectedPrice) {
          doc.setFillColor(0, 212, 255);
          doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'F');
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(
            'Expected Price: Rs.' + Number(asset.attributes.expectedPrice).toLocaleString('en-IN') +
            (asset.attributes.isNegotiable ? '  (Negotiable)' : ''),
            margin + 4, y + 11
          );
          y += 22;
        }

        if (asset.attributes.amenities?.length > 0) {
          addText('Amenities: ' + asset.attributes.amenities.join(', '), 9, false, [60, 60, 60]);
        }
        addLine();
      }

      if (asset.description) {
        addText('Description', 12, true, [30, 30, 30]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(70, 70, 70);
        const descLines = doc.splitTextToSize(asset.description, pageWidth - margin * 2);
        doc.text(descLines, margin, y);
        y += descLines.length * 5 + 6;
        addLine();
      }

      addText('Blockchain Verification', 12, true, [30, 30, 30]);
      doc.setFillColor(245, 240, 255);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 3, 3, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 60, 200);
      doc.text('Network: Algorand Testnet', margin + 4, y + 8);
      doc.text('Asset ID: ' + asset.assetId, margin + 4, y + 15);
      if (asset.algorandTxHash) {
        doc.text('Transaction Hash:', margin + 4, y + 22);
        const hashLines = doc.splitTextToSize(asset.algorandTxHash, pageWidth - margin * 2 - 8);
        doc.text(hashLines, margin + 4, y + 28);
        y += hashLines.length * 5;
      }
      y += 36;
      addLine();

      addText('Ownership History', 12, true, [30, 30, 30]);
      asset.ownershipHistory?.forEach((entry: any, i: number) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text((i + 1) + '. ' + (entry.owner?.name || 'Unknown'), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Acquired: ' + new Date(entry.acquiredAt).toLocaleDateString('en-IN'), margin + 60, y);
        y += 8;
      });
      addLine();

      if (reviews.length > 0) {
        addText('Community Reviews (' + reviews.length + ')', 12, true, [30, 30, 30]);
        const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text('Average Rating: ' + avgRating.toFixed(1) + '/5', margin, y);
        y += 8;

        reviews.slice(0, 5).forEach((review: any) => {
          if (y > 260) { doc.addPage(); y = 20; }
          doc.setFillColor(248, 248, 248);
          doc.roundedRect(margin, y, pageWidth - margin * 2, 20, 2, 2, 'F');
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(40, 40, 40);
          doc.text(review.reviewer?.name || 'Anonymous', margin + 4, y + 7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          doc.text('Rating: ' + review.rating + '/5', margin + 60, y + 7);
          const bodyLines = doc.splitTextToSize(review.body || '', pageWidth - margin * 2 - 8);
          doc.setFontSize(8);
          doc.text(bodyLines[0] + (bodyLines.length > 1 ? '...' : ''), margin + 4, y + 15);
          y += 26;
        });
        addLine();
      }

      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setFillColor(240, 240, 240);
      doc.rect(0, footerY - 5, pageWidth, 20, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Generated by Dakhla360 - Blockchain Asset Verification Platform', margin, footerY + 5);
      doc.text('Verified on Algorand Blockchain', pageWidth - margin - 50, footerY + 5);

      doc.save('Dakhla360-' + asset.assetId + '-Report.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className="flex items-center gap-2 bg-[#12141A] border border-[#1E2130] text-[#8892A4] hover:text-white hover:border-[#00D4FF]/50 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
    >
      <FileText className="w-4 h-4" />
      {generating ? 'Generating...' : 'Export PDF'}
    </button>
  );
}