import React from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  Instagram, 
  Video, 
  Globe, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  QrCode,
  Sparkles
} from 'lucide-react';
import { InvoiceData } from '../types';
import { formatCurrency, calculateInvoiceTotals } from '../utils/invoiceUtils';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  scale?: number;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  scale = 1,
  previewRef,
}) => {
  const { subtotal, taxAmount, discountAmount, total, terbilangText } =
    calculateInvoiceTotals(invoice);

  const { themeStyle = 'modern', primaryColor = '#0f172a' } = invoice.design;

  // Status Badge Helper
  const renderStatusBadge = () => {
    if (!invoice.design.showWatermark) return null;
    
    switch (invoice.status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Lunas / Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-100 text-rose-800 border border-rose-300">
            Jatuh Tempo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-300">
            Draft Tagihan
          </span>
        );
    }
  };

  // -------------------------------------------------------------
  // CLASSIC TEMPLATE (Direct match with the user's uploaded image)
  // -------------------------------------------------------------
  if (themeStyle === 'classic') {
    return (
      <div 
        ref={previewRef}
        id="invoice-printable-sheet"
        className="a4-sheet bg-white text-slate-900 shadow-xl relative mx-auto transition-all text-[13px] leading-relaxed"
        style={{
          fontFamily: invoice.design.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' : 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">Invoice</h1>
              <p className="text-sm text-slate-800 mt-1">
                Tanggal Invoice : {invoice.invoiceDate || '21 September 2026'}
              </p>
              {invoice.invoiceNumber && (
                <p className="text-xs text-slate-500 mt-0.5">
                  No. Ref: {invoice.invoiceNumber}
                </p>
              )}
            </div>
            <div>
              {renderStatusBadge()}
            </div>
          </div>
        </div>

        {/* Sender Info: Dari (Influencer): */}
        <div className="mb-6">
          <h2 className="font-bold text-black text-sm mb-1">
            Dari ({invoice.sender.roleLabel || 'Influencer'}):
          </h2>
          <div className="space-y-0.5 text-slate-900">
            <p className="font-medium">Nama: {invoice.sender.name || 'Pradita Cyntiawati Yoga'}</p>
            {invoice.sender.socials.instagram && (
              <p>Instagram: {invoice.sender.socials.instagram}</p>
            )}
            {invoice.sender.socials.tiktok && (
              <p>Tiktok: {invoice.sender.socials.tiktok}</p>
            )}
            {invoice.sender.email && (
              <p>
                Email: <span className="text-blue-600 underline">{invoice.sender.email}</span>
              </p>
            )}
            {invoice.sender.phone && (
              <p>Telp: {invoice.sender.phone}</p>
            )}
          </div>
        </div>

        {/* Client Info: Kepada : */}
        <div className="mb-6">
          <h2 className="font-bold text-black text-sm mb-1">
            Kepada :
          </h2>
          <p className="font-medium text-slate-900">
            {invoice.client.companyName || invoice.client.name || 'Toshiko Group Indonesia'}
          </p>
          {invoice.client.address && (
            <p className="text-xs text-slate-600 mt-0.5">{invoice.client.address}</p>
          )}
        </div>

        {/* Table: Deskripsi Layanan */}
        <div className="mb-6">
          <h2 className="font-bold text-black text-sm mb-2">
            Deskripsi Layanan:
          </h2>
          <table className="w-full border-collapse border border-black text-left">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black p-2 font-bold text-black w-1/2">
                  Deskripsi
                </th>
                <th className="border-r border-black p-2 font-bold text-black text-center w-[18%]">
                  Unit Price
                </th>
                <th className="border-r border-black p-2 font-bold text-black text-center w-[12%]">
                  Qty
                </th>
                <th className="p-2 font-bold text-black text-right w-[20%]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => {
                const itemTotal = (item.unitPrice || 0) * (item.quantity || 1);
                return (
                  <tr key={item.id} className="border-b border-black align-top">
                    <td className="border-r border-black p-2.5">
                      <p className="font-medium text-black">{item.description}</p>
                      {item.subDetails && item.subDetails.map((sub, i) => (
                        <p key={i} className="text-slate-800 text-[12px]">{sub}</p>
                      ))}
                    </td>
                    <td className="border-r border-black p-2.5 text-center">
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="border-r border-black p-2.5 text-center">
                      {item.quantity}
                    </td>
                    <td className="p-2.5 text-right font-medium">
                      {formatCurrency(itemTotal, invoice.currency)}
                    </td>
                  </tr>
                );
              })}

              {/* Total Tagihan Row */}
              <tr className="border-t border-black font-bold">
                <td className="border-r border-black p-2 text-black">
                  Total Tagihan
                </td>
                <td className="border-r border-black p-2"></td>
                <td className="border-r border-black p-2"></td>
                <td className="p-2 text-right text-black font-bold">
                  {formatCurrency(total, invoice.currency)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Terbilang */}
          {invoice.design.showTerbilang && (
            <p className="text-xs italic text-slate-700 mt-2">
              Terbilang: <span className="font-semibold capitalize">{terbilangText}</span>
            </p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h2 className="font-bold text-black text-sm mb-1.5">
            Metode Pembayaran:
          </h2>
          <div className="space-y-1">
            {invoice.paymentMethods.map((pay) => (
              <div key={pay.id} className="text-slate-900">
                <p className="font-bold">{pay.providerName}</p>
                <p>a/n: {pay.accountName}</p>
                <p>No. Rekening: {pay.accountNumber}</p>
              </div>
            ))}
          </div>

          {invoice.paymentConfirmationNote && (
            <p className="mt-4 text-slate-900">
              {invoice.paymentConfirmationNote}
            </p>
          )}
        </div>

        {/* Closing & Signature */}
        <div className="mt-8">
          <p className="text-slate-900 mb-4">
            {invoice.closingNote || 'Terima kasih atas kerjasama yang baik.'}
          </p>

          {invoice.design.showSignature && (
            <div className="w-56">
              {invoice.signature.signatureType === 'typed' && (
                <div className="font-handwriting text-3xl text-black py-2 tracking-wide">
                  {invoice.signature.signerName || invoice.sender.name}
                </div>
              )}
              {invoice.signature.signatureType === 'draw' && invoice.signature.dataUrl && (
                <img
                  src={invoice.signature.dataUrl}
                  alt="Tanda tangan"
                  className="h-16 object-contain"
                />
              )}
              {invoice.signature.signatureType === 'upload' && invoice.signature.dataUrl && (
                <img
                  src={invoice.signature.dataUrl}
                  alt="Tanda tangan"
                  className="h-16 object-contain"
                />
              )}
              
              {/* Fallback authentic graphic signature if none drawn */}
              {!invoice.signature.dataUrl && invoice.signature.signatureType !== 'typed' && (
                <svg className="w-28 h-14 text-black" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10,35 C20,10 30,45 40,20 C45,10 50,40 60,25 C70,15 75,30 90,20 M20,40 L80,38" />
                </svg>
              )}

              <div className="border-t border-slate-400 pt-1 mt-1 text-xs">
                <p className="font-bold text-black">{invoice.signature.signerName || invoice.sender.name}</p>
                {invoice.signature.signerTitle && (
                  <p className="text-slate-600 text-[11px]">{invoice.signature.signerTitle}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODERN PRO TEMPLATE (Elevated, Sleek, Professional)
  // -------------------------------------------------------------
  return (
    <div
      ref={previewRef}
      id="invoice-printable-sheet"
      className="a4-sheet bg-white text-slate-800 shadow-2xl relative mx-auto transition-all text-[13px] leading-relaxed flex flex-col justify-between"
      style={{
        fontFamily: invoice.design.fontFamily === 'serif' 
          ? 'Playfair Display, Georgia, serif' 
          : invoice.design.fontFamily === 'mono'
          ? 'JetBrains Mono, monospace'
          : 'Plus Jakarta Sans, system-ui, sans-serif'
      }}
    >
      <div>
        {/* Top Accent Strip */}
        <div 
          className="h-2 w-full rounded-t-sm mb-6"
          style={{ backgroundColor: primaryColor }}
        />

        {/* Header Bar */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              {invoice.design.showLogo && invoice.sender.logoUrl ? (
                <img
                  src={invoice.sender.logoUrl}
                  alt="Logo"
                  className="w-12 h-12 object-contain rounded-lg border border-slate-200"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(invoice.sender.businessName || invoice.sender.name || 'I').charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  {invoice.sender.businessName || invoice.sender.name}
                </h1>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {invoice.sender.roleLabel || 'Official Invoice'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-1.5">{renderStatusBadge()}</div>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
              INVOICE
            </h2>
            <p className="text-xs font-bold text-slate-700 tracking-wide">
              #{invoice.invoiceNumber || 'INV/2026/09/001'}
            </p>
          </div>
        </div>

        {/* Meta & Info Columns */}
        <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-100">
          {/* Dari / Sender */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Dari (Pengirim / {invoice.sender.roleLabel || 'Influencer'}):
            </span>
            <p className="font-bold text-slate-900 text-sm">{invoice.sender.name}</p>
            
            {invoice.design.showSocials && (
              <div className="mt-1.5 space-y-1 text-xs text-slate-600">
                {invoice.sender.socials.instagram && (
                  <p className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span className="font-medium">{invoice.sender.socials.instagram}</span>
                  </p>
                )}
                {invoice.sender.socials.tiktok && (
                  <p className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-slate-800" />
                    <span>{invoice.sender.socials.tiktok}</span>
                  </p>
                )}
              </div>
            )}

            <div className="mt-2 space-y-0.5 text-xs text-slate-600">
              {invoice.sender.email && (
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{invoice.sender.email}</span>
                </p>
              )}
              {invoice.sender.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{invoice.sender.phone}</span>
                </p>
              )}
              {invoice.sender.address && (
                <p className="text-slate-500 mt-1">{invoice.sender.address}</p>
              )}
            </div>
          </div>

          {/* Kepada / Client & Dates */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Ditujukan Kepada:
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {invoice.client.companyName || invoice.client.name}
            </p>
            {invoice.client.name && invoice.client.companyName && (
              <p className="text-xs text-slate-600 font-medium">u.p. {invoice.client.name}</p>
            )}
            {invoice.client.address && (
              <p className="text-xs text-slate-500 mt-1">{invoice.client.address}</p>
            )}
            {invoice.client.email && (
              <p className="text-xs text-slate-500">{invoice.client.email}</p>
            )}

            {/* Date Details Box */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tanggal Invoice</span>
                <span className="font-semibold text-slate-800">{invoice.invoiceDate}</span>
              </div>
              {invoice.dueDate && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Jatuh Tempo</span>
                  <span className="font-semibold text-rose-700">{invoice.dueDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table of Services / Items */}
        <div className="my-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-[50%]">Deskripsi Layanan / Item</th>
                  <th className="py-3 px-3 text-center w-[16%]">Harga Satuan</th>
                  <th className="py-3 px-3 text-center w-[12%]">Qty</th>
                  <th className="py-3 px-4 text-right w-[22%]">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item) => {
                  const itemTotal = (item.unitPrice || 0) * (item.quantity || 1);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 align-top">
                        <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                        {item.subDetails && item.subDetails.length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-slate-500 text-[11px]">
                            {item.subDetails.map((sub, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <span className="text-slate-400">•</span>
                                <span>{sub}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 align-top">
                        {formatCurrency(item.unitPrice, invoice.currency)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700 font-medium align-top">
                        {item.quantity} {item.unit ? <span className="text-[10px] text-slate-400">{item.unit}</span> : ''}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 align-top">
                        {formatCurrency(itemTotal, invoice.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Total Summary Box */}
          <div className="flex justify-between items-start mt-4">
            <div className="max-w-md">
              {invoice.design.showTerbilang && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Terbilang:
                  </span>
                  <p className="text-xs font-semibold text-slate-700 capitalize italic">
                    "{terbilangText}"
                  </p>
                </div>
              )}
            </div>

            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 py-1">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal, invoice.currency)}</span>
              </div>

              {invoice.design.showTax && (
                <div className="flex justify-between text-slate-600 py-1">
                  <span>{invoice.design.taxLabel || `PPN (${invoice.design.taxRate}%)`}</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(taxAmount, invoice.currency)}</span>
                </div>
              )}

              <div 
                className="flex justify-between items-center py-2.5 px-3 rounded-lg text-white font-bold text-sm shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Total Tagihan</span>
                <span className="text-base">{formatCurrency(total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Banking Information */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            Instruksi & Rekening Pembayaran
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {invoice.paymentMethods.map((pay) => (
              <div 
                key={pay.id} 
                className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-black text-slate-900 text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {pay.providerName}
                    </span>
                    {pay.isPrimary && (
                      <span className="text-[10px] text-emerald-600 font-semibold">Utama</span>
                    )}
                  </div>
                  <p className="text-sm font-mono-code font-bold text-slate-900 tracking-wider">
                    {pay.accountNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    a/n <span className="font-semibold text-slate-700">{pay.accountName}</span>
                  </p>
                </div>

                {invoice.design.showQrCode && (
                  <div className="text-center pl-2 border-l border-slate-100">
                    <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center p-1 border border-slate-200">
                      <QrCode className="w-8 h-8 text-slate-800" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">QRIS</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {invoice.paymentConfirmationNote && (
            <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200/60 font-medium">
              🔔 {invoice.paymentConfirmationNote}
            </p>
          )}
        </div>
      </div>

      {/* Footer & Signature Section */}
      <div className="pt-4 border-t border-slate-200 flex items-end justify-between">
        <div className="max-w-xs text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">
            {invoice.closingNote || 'Terima kasih atas kerjasama yang baik.'}
          </p>
          {invoice.termsAndConditions && (
            <p className="text-[11px] text-slate-400 leading-tight">
              {invoice.termsAndConditions}
            </p>
          )}
        </div>

        {invoice.design.showSignature && (
          <div className="text-center min-w-[180px]">
            <p className="text-xs text-slate-500 mb-1">
              Hormat kami,
            </p>

            <div className="h-16 flex items-center justify-center">
              {invoice.signature.signatureType === 'typed' && (
                <span className="font-handwriting text-3xl text-slate-900 font-bold">
                  {invoice.signature.signerName || invoice.sender.name}
                </span>
              )}
              {invoice.signature.signatureType === 'draw' && invoice.signature.dataUrl && (
                <img
                  src={invoice.signature.dataUrl}
                  alt="Signature"
                  className="max-h-16 object-contain"
                />
              )}
              {invoice.signature.signatureType === 'upload' && invoice.signature.dataUrl && (
                <img
                  src={invoice.signature.dataUrl}
                  alt="Signature"
                  className="max-h-16 object-contain"
                />
              )}
              {!invoice.signature.dataUrl && invoice.signature.signatureType !== 'typed' && (
                <svg className="w-24 h-12 text-slate-700" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10,35 C20,10 30,45 40,20 C45,10 50,40 60,25 C70,15 75,30 90,20 M20,40 L80,38" />
                </svg>
              )}
            </div>

            <div className="border-t border-slate-300 pt-1 mt-1">
              <p className="font-bold text-slate-900 text-xs">
                {invoice.signature.signerName || invoice.sender.name}
              </p>
              {invoice.signature.signerTitle && (
                <p className="text-[10px] text-slate-500">{invoice.signature.signerTitle}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
