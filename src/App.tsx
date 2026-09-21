import React, { useState, useEffect, useRef } from 'react';
import { 
  FileDown, 
  Printer, 
  MessageSquare, 
  Mail, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  Check, 
  History, 
  Save, 
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { InvoiceData } from './types';
import { DEFAULT_INVOICE_DATA, calculateInvoiceTotals, formatCurrency } from './utils/invoiceUtils';
import { INVOICE_PRESETS } from './data/presets';
import { InvoiceFormBuilder } from './components/InvoiceFormBuilder';
import { InvoicePreview } from './components/InvoicePreview';
import { HeaderNavbar } from './components/HeaderNavbar';
import { WhatsAppModal } from './components/WhatsAppModal';
import { EmailModal } from './components/EmailModal';
import { exportInvoiceToPdf } from './utils/pdfExport';

const STORAGE_KEY = 'invoice_pro_current_data';

export default function App() {
  // Load initial data from localStorage if exists, or use default matching the user's uploaded image
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved invoice data', e);
    }
    return DEFAULT_INVOICE_DATA;
  });

  const [activeMobileView, setActiveMobileView] = useState<'split' | 'form' | 'preview'>('split');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(0.92);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const previewSheetRef = useRef<HTMLDivElement | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [invoice]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleApplyPreset = (presetId: string) => {
    const found = INVOICE_PRESETS.find((p) => p.id === presetId);
    if (found && found.data) {
      setInvoice(found.data as InvoiceData);
      showToast(`Preset "${found.name}" berhasil diterapkan.`);
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = invoice.design.themeStyle === 'classic' ? 'modern' : 'classic';
    setInvoice({
      ...invoice,
      design: {
        ...invoice.design,
        themeStyle: nextTheme,
      },
    });
    showToast(`Format tampilan diubah ke: ${nextTheme === 'classic' ? 'Klasik (Sesuai Lampiran)' : 'Modern Pro'}`);
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    const filename = `Invoice-${(invoice.invoiceNumber || 'Draft').replace(/[\/\\]/g, '_')}.pdf`;
    
    // Slight timeout to let any active state settle
    setTimeout(async () => {
      try {
        const success = await exportInvoiceToPdf('invoice-printable-sheet', filename);
        if (success) {
          showToast(`PDF berhasil diunduh: ${filename}`);
        } else {
          showToast('Mengalihkan ke dialog cetak / simpan PDF...');
        }
      } catch (err) {
        console.error('Export error:', err);
        showToast('Gagal memproses PDF, membuka dialog cetak browser...');
        window.print();
      } finally {
        setIsExportingPdf(false);
      }
    }, 150);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan data invoice ke contoh awal (Influencer / Toshiko Group)?')) {
      setInvoice(DEFAULT_INVOICE_DATA);
      showToast('Data invoice dikembalikan ke contoh awal.');
    }
  };

  const { total } = calculateInvoiceTotals(invoice);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <HeaderNavbar
        invoice={invoice}
        activeView={activeMobileView}
        setActiveView={setActiveMobileView}
        onApplyPreset={handleApplyPreset}
        onExportPdf={handleExportPdf}
        onPrint={() => window.print()}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenEmail={() => setIsEmailOpen(true)}
        onReset={handleResetToDefault}
        isExportingPdf={isExportingPdf}
        onToggleTheme={handleToggleTheme}
      />

      {/* Quick Summary Pill Banner on Mobile/Tablet */}
      <div className="no-print bg-white border-b border-slate-200 px-4 py-2 text-xs flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Klien:</span>
          <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-xs">
            {invoice.client.companyName || invoice.client.name}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 font-medium">Tagihan:</span>
          <span className="font-bold text-indigo-600">
            {formatCurrency(total, invoice.currency)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition-colors"
          >
            Gaya: {invoice.design.themeStyle === 'classic' ? 'Klasik' : 'Modern'}
          </button>
          <button
            type="button"
            onClick={handleResetToDefault}
            title="Reset ke contoh awal"
            className="text-slate-400 hover:text-slate-700 p-1 text-[11px] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: 2 Columns on Desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Form Builder (Dynamic Input) */}
        <div
          className={`xl:col-span-6 space-y-4 ${
            activeMobileView === 'preview' ? 'hidden xl:block' : 'block'
          }`}
        >
          <div className="no-print flex items-center justify-between pb-1">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Form Builder Invoice
              </h2>
              <p className="text-xs text-slate-500">
                Ubah teks, rincian layanan, rekening, dan tanda tangan secara langsung
              </p>
            </div>

            {/* Quick Switch to preview for mobile */}
            <button
              type="button"
              onClick={() => setActiveMobileView('preview')}
              className="xl:hidden px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              Lihat Invoice <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <InvoiceFormBuilder invoice={invoice} onChange={setInvoice} />
        </div>

        {/* RIGHT COLUMN: Live A4 Printable Preview */}
        <div
          className={`xl:col-span-6 space-y-3 sticky top-20 ${
            activeMobileView === 'form' ? 'hidden xl:block' : 'block'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="no-print bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                Pratinjau Lembar A4
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(0.92)}
                className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                title="Reset Zoom"
              >
                Pas Halaman
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-200 mx-1" />

              <button
                type="button"
                onClick={() => setIsWhatsAppOpen(true)}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                title="Kirim ke WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsEmailOpen(true)}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                title="Kirim ke Email"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
                title="Unduh PDF"
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scaled Preview Container */}
          <div className="bg-slate-200/70 p-3 sm:p-6 rounded-2xl overflow-x-auto flex justify-center shadow-inner border border-slate-200/90">
            <div 
              style={{ 
                transform: `scale(${zoomLevel})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                marginBottom: `${(zoomLevel - 1) * 350}px` 
              }}
            >
              <InvoicePreview 
                invoice={invoice} 
                previewRef={previewSheetRef}
              />
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        invoice={invoice}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Email Modal */}
      <EmailModal
        invoice={invoice}
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
