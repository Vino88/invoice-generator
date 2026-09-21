import React from 'react';
import { 
  FileDown, 
  Printer, 
  MessageSquare, 
  Mail, 
  Sparkles, 
  RotateCcw,
  LayoutTemplate,
  Check,
  Eye,
  Edit3
} from 'lucide-react';
import { InvoiceData } from '../types';
import { INVOICE_PRESETS } from '../data/presets';

interface HeaderNavbarProps {
  invoice: InvoiceData;
  activeView: 'split' | 'form' | 'preview';
  setActiveView: (view: 'split' | 'form' | 'preview') => void;
  onApplyPreset: (presetId: string) => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onOpenWhatsApp: () => void;
  onOpenEmail: () => void;
  onReset: () => void;
  isExportingPdf: boolean;
  onToggleTheme: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  invoice,
  activeView,
  setActiveView,
  onApplyPreset,
  onExportPdf,
  onPrint,
  onOpenWhatsApp,
  onOpenEmail,
  onReset,
  isExportingPdf,
  onToggleTheme,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Preset Selection */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs">
            INV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                Invoice Generator
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Buat & Kirim Invoice Profesional Siap Cetak & Kirim WA
            </p>
          </div>
        </div>

        {/* Center: Presets & Theme Style Switch */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <span className="text-slate-400 px-2 flex items-center gap-1 text-[11px]">
              <LayoutTemplate className="w-3.5 h-3.5" /> Preset:
            </span>
            {INVOICE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  preset.id === 'preset-influencer' && invoice.sender.name.includes('Cyntia')
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {preset.category}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Tema: {invoice.design.themeStyle === 'classic' ? 'Klasik (Lampiran)' : 'Modern Pro'}
          </button>
        </div>

        {/* Right: Actions (WhatsApp, Email, Export PDF, Print) */}
        <div className="flex items-center gap-2">
          {/* Mobile view switchers */}
          <div className="flex xl:hidden bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveView('form')}
              className={`p-1.5 rounded-md ${activeView === 'form' ? 'bg-white shadow-2xs font-bold text-slate-900' : 'text-slate-500'}`}
              title="Edit Form"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`p-1.5 rounded-md ${activeView === 'preview' ? 'bg-white shadow-2xs font-bold text-slate-900' : 'text-slate-500'}`}
              title="Lihat Invoice"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Kirim Otomatis via WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Kirim WhatsApp</span>
          </button>

          {/* Email Button */}
          <button
            type="button"
            onClick={onOpenEmail}
            className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Kirim Otomatis via Email"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Kirim Email</span>
          </button>

          {/* Native Print */}
          <button
            type="button"
            onClick={onPrint}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Cetak Langsung"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Cetak</span>
          </button>

          {/* PDF Download Button */}
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            title="Unduh format PDF A4"
          >
            <FileDown className="w-3.5 h-3.5 text-white" />
            <span>{isExportingPdf ? 'Membuat PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
