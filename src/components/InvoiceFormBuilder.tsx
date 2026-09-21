import React, { useState } from 'react';
import { 
  User, 
  Building, 
  FileText, 
  Plus, 
  Trash2, 
  CreditCard, 
  PenTool, 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  HelpCircle,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { InvoiceData, InvoiceItem, PaymentMethod } from '../types';
import { SignaturePad } from './SignaturePad';

interface InvoiceFormBuilderProps {
  invoice: InvoiceData;
  onChange: (updatedInvoice: InvoiceData) => void;
}

export const InvoiceFormBuilder: React.FC<InvoiceFormBuilderProps> = ({
  invoice,
  onChange,
}) => {
  const [activeSection, setActiveSection] = useState<string>('items');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  // Helper to update top-level fields
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({
      ...invoice,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  // Helper to update sender info
  const updateSender = (field: string, value: any) => {
    onChange({
      ...invoice,
      sender: {
        ...invoice.sender,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Helper to update sender socials
  const updateSocials = (platform: string, value: string) => {
    onChange({
      ...invoice,
      sender: {
        ...invoice.sender,
        socials: {
          ...invoice.sender.socials,
          [platform]: value,
        },
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Helper to update client info
  const updateClient = (field: string, value: any) => {
    onChange({
      ...invoice,
      client: {
        ...invoice.client,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Helper to update design options
  const updateDesign = (field: string, value: any) => {
    onChange({
      ...invoice,
      design: {
        ...invoice.design,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Items Management
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      subDetails: [''],
      quantity: 1,
      unitPrice: 0,
      unit: 'Paket',
    };
    onChange({
      ...invoice,
      items: [...invoice.items, newItem],
    });
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoice.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange({
      ...invoice,
      items: newItems,
    });
  };

  const handleDeleteItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    const newItems = invoice.items.filter((_, i) => i !== index);
    onChange({
      ...invoice,
      items: newItems,
    });
  };

  // Sub-detail management for line items (e.g. "1x instagram reels collab @cyntiayoga")
  const handleAddSubDetail = (itemIndex: number) => {
    const newItems = [...invoice.items];
    const currentSubs = newItems[itemIndex].subDetails || [];
    newItems[itemIndex].subDetails = [...currentSubs, ''];
    onChange({ ...invoice, items: newItems });
  };

  const handleUpdateSubDetail = (itemIndex: number, subIndex: number, text: string) => {
    const newItems = [...invoice.items];
    const currentSubs = [...(newItems[itemIndex].subDetails || [])];
    currentSubs[subIndex] = text;
    newItems[itemIndex].subDetails = currentSubs;
    onChange({ ...invoice, items: newItems });
  };

  const handleDeleteSubDetail = (itemIndex: number, subIndex: number) => {
    const newItems = [...invoice.items];
    const currentSubs = (newItems[itemIndex].subDetails || []).filter((_, i) => i !== subIndex);
    newItems[itemIndex].subDetails = currentSubs;
    onChange({ ...invoice, items: newItems });
  };

  // Payment method management
  const handleUpdatePayment = (index: number, field: keyof PaymentMethod, value: any) => {
    const newPayments = [...invoice.paymentMethods];
    newPayments[index] = {
      ...newPayments[index],
      [field]: value,
    };
    onChange({
      ...invoice,
      paymentMethods: newPayments,
    });
  };

  const handleAddPayment = () => {
    const newPay: PaymentMethod = {
      id: `pay-${Date.now()}`,
      type: 'bank',
      providerName: 'Bank Mandiri',
      accountName: invoice.sender.name,
      accountNumber: '',
      isPrimary: false,
    };
    onChange({
      ...invoice,
      paymentMethods: [...invoice.paymentMethods, newPay],
    });
  };

  const handleDeletePayment = (index: number) => {
    if (invoice.paymentMethods.length <= 1) return;
    onChange({
      ...invoice,
      paymentMethods: invoice.paymentMethods.filter((_, i) => i !== index),
    });
  };

  // Auto generate invoice number
  const handleGenerateInvoiceNo = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const randomSeq = Math.floor(100 + Math.random() * 900);
    updateField('invoiceNumber', `INV/${year}/${month}/${randomSeq}`);
  };

  const colorPresets = [
    { name: 'Slate Black (Klasik)', color: '#0f172a' },
    { name: 'Navy Blue (Formal)', color: '#1e3a8a' },
    { name: 'Emerald Green (Segar)', color: '#047857' },
    { name: 'Indigo Purple (Modern)', color: '#4338ca' },
    { name: 'Terracotta (Hangat)', color: '#c2410c' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* SECTION 1: DATA LAYANAN & ITEM (PRIMARY FOCUS) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('items')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Deskripsi Layanan & Rincian Tagihan</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
              {invoice.items.length} Item
            </span>
          </div>
          {activeSection === 'items' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {activeSection === 'items' && (
          <div className="p-5 space-y-4">
            {/* Invoice Meta details: No, Dates, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Nomor Invoice</label>
                  <button
                    type="button"
                    onClick={handleGenerateInvoiceNo}
                    title="Buat nomor otomatis"
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto
                  </button>
                </div>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  placeholder="INV/2026/09/001"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Invoice
                </label>
                <input
                  type="text"
                  value={invoice.invoiceDate}
                  onChange={(e) => updateField('invoiceDate', e.target.value)}
                  placeholder="cth: 21 September 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Pembayaran
                </label>
                <select
                  value={invoice.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                >
                  <option value="pending">Menunggu Pembayaran (Unpaid)</option>
                  <option value="paid">Lunas (Paid)</option>
                  <option value="overdue">Jatuh Tempo</option>
                  <option value="draft">Draft Tagihan</option>
                </select>
              </div>
            </div>

            {/* List of Dynamic Items */}
            <div className="space-y-4">
              {invoice.items.map((item, itemIdx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 relative group space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                        {itemIdx + 1}
                      </span>
                      Layanan / Item
                    </span>
                    {invoice.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(itemIdx)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Hapus item ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block font-medium text-slate-600 mb-1">
                        Nama / Judul Layanan
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateItem(itemIdx, 'description', e.target.value)
                        }
                        placeholder="cth: 1x visit atau Jasa Desain Logo"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-medium text-slate-600 mb-1">
                        Harga Satuan (Rp)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={item.unitPrice || ''}
                        onChange={(e) =>
                          handleUpdateItem(
                            itemIdx,
                            'unitPrice',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="1000000"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-medium text-slate-600 mb-1">
                        Jumlah (Qty)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleUpdateItem(
                            itemIdx,
                            'quantity',
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Sub-details / deliverables sub-bullets */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-600">
                        Rincian Tambahan / Sub-Deliverables (cth: 1x reels collab @cyntiayoga):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddSubDetail(itemIdx)}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Rincian
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {(item.subDetails || []).map((sub, subIdx) => (
                        <div key={subIdx} className="flex items-center gap-2">
                          <span className="text-slate-400">•</span>
                          <input
                            type="text"
                            value={sub}
                            onChange={(e) =>
                              handleUpdateSubDetail(itemIdx, subIdx, e.target.value)
                            }
                            placeholder="cth: 1x instagram reels collab @cyntiayoga"
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteSubDetail(itemIdx, subIdx)}
                            className="text-slate-300 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Button */}
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 border-2 border-dashed border-indigo-200 hover:border-indigo-400 text-indigo-600 font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-indigo-50/50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Baris Layanan Baru
            </button>

            {/* Tax / PPN Toggle */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={invoice.design.showTax}
                  onChange={(e) => updateDesign('showTax', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-700">
                  Tambahkan PPN / Pajak (Opsional)
                </span>
              </label>

              {invoice.design.showTax && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Tarif PPN:</span>
                  <input
                    type="number"
                    value={invoice.design.taxRate}
                    onChange={(e) =>
                      updateDesign('taxRate', parseFloat(e.target.value) || 0)
                    }
                    className="w-16 px-2 py-1 border border-slate-200 rounded text-center text-xs font-semibold"
                  />
                  <span className="text-slate-500">%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: IDENTITAS PENGIRIM (DARI: INFLUENCER / BISNIS) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sender')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Identitas Pengirim (Dari: Influencer / Kreator / Bisnis)</span>
          </div>
          {activeSection === 'sender' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {activeSection === 'sender' && (
          <div className="p-5 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Label Profesi / Peran
                </label>
                <input
                  type="text"
                  value={invoice.sender.roleLabel}
                  onChange={(e) => updateSender('roleLabel', e.target.value)}
                  placeholder="cth: Influencer / Content Creator / Agency"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={invoice.sender.name}
                  onChange={(e) => updateSender('name', e.target.value)}
                  placeholder="cth: Pradita Cyntiawati Yoga"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={invoice.sender.socials.instagram || ''}
                  onChange={(e) => updateSocials('instagram', e.target.value)}
                  placeholder="cth: @cyntiayoga"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  value={invoice.sender.socials.tiktok || ''}
                  onChange={(e) => updateSocials('tiktok', e.target.value)}
                  placeholder="cth: cyntiayoga"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={invoice.sender.email}
                  onChange={(e) => updateSender('email', e.target.value)}
                  placeholder="cyntiayoga@gmail.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={invoice.sender.phone}
                  onChange={(e) => updateSender('phone', e.target.value)}
                  placeholder="082214001177"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat / Lokasi (Opsional)
              </label>
              <input
                type="text"
                value={invoice.sender.address || ''}
                onChange={(e) => updateSender('address', e.target.value)}
                placeholder="Jakarta Selatan, Indonesia"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: DATA KLIEN / KEPADA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('client')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
            <Building className="w-4 h-4 text-indigo-600" />
            <span>Penerima Tagihan (Kepada: Nama Perusahaan / Klien)</span>
          </div>
          {activeSection === 'client' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {activeSection === 'client' && (
          <div className="p-5 space-y-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Perusahaan / Brand Klien
              </label>
              <input
                type="text"
                value={invoice.client.companyName}
                onChange={(e) => updateClient('companyName', e.target.value)}
                placeholder="cth: Toshiko Group Indonesia"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kontak / PIC (Opsional)
                </label>
                <input
                  type="text"
                  value={invoice.client.name}
                  onChange={(e) => updateClient('name', e.target.value)}
                  placeholder="cth: Ibu Sarah / Tim Finance"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. WhatsApp Klien (Untuk 1-Klik Kirim WA)
                </label>
                <input
                  type="text"
                  value={invoice.client.phone || ''}
                  onChange={(e) => updateClient('phone', e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Klien (Untuk Pengiriman Email)
                </label>
                <input
                  type="email"
                  value={invoice.client.email || ''}
                  onChange={(e) => updateClient('email', e.target.value)}
                  placeholder="finance@toshikogroup.co.id"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Kantor Klien
                </label>
                <input
                  type="text"
                  value={invoice.client.address || ''}
                  onChange={(e) => updateClient('address', e.target.value)}
                  placeholder="cth: Sudirman, Jakarta"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: METODE PEMBAYARAN */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('payment')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Metode Pembayaran & Rekening Bank</span>
          </div>
          {activeSection === 'payment' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {activeSection === 'payment' && (
          <div className="p-5 space-y-4">
            {invoice.paymentMethods.map((pay, payIdx) => (
              <div
                key={pay.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">
                    Rekening Pembayaran #{payIdx + 1}
                  </span>
                  {invoice.paymentMethods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(payIdx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      Nama Bank / E-Wallet
                    </label>
                    <input
                      type="text"
                      value={pay.providerName}
                      onChange={(e) =>
                        handleUpdatePayment(payIdx, 'providerName', e.target.value)
                      }
                      placeholder="cth: Bank BCA, Bank Mandiri, QRIS"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      Atas Nama (a/n)
                    </label>
                    <input
                      type="text"
                      value={pay.accountName}
                      onChange={(e) =>
                        handleUpdatePayment(payIdx, 'accountName', e.target.value)
                      }
                      placeholder="cth: Pradita Cyntiawati Yoga"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={pay.accountNumber}
                      onChange={(e) =>
                        handleUpdatePayment(payIdx, 'accountNumber', e.target.value)
                      }
                      placeholder="cth: 5486009841"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPayment}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Rekening Lain
            </button>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Instruksi Konfirmasi Transfer
              </label>
              <input
                type="text"
                value={invoice.paymentConfirmationNote}
                onChange={(e) =>
                  updateField('paymentConfirmationNote', e.target.value)
                }
                placeholder="Bukti transfer dapat dikirim ke email: cyntiayoga@gmail.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: TANDA TANGAN & PENUTUP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('signature')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
            <PenTool className="w-4 h-4 text-indigo-600" />
            <span>Tanda Tangan Digital & Catatan Penutup</span>
          </div>
          {activeSection === 'signature' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {activeSection === 'signature' && (
          <div className="p-5 space-y-4">
            <SignaturePad
              signature={invoice.signature}
              onChange={(sig) => updateField('signature', sig)}
            />

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Penutup / Ucapan Terima Kasih
              </label>
              <input
                type="text"
                value={invoice.closingNote}
                onChange={(e) => updateField('closingNote', e.target.value)}
                placeholder="Terima kasih atas kerjasama yang baik."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Syarat & Ketentuan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={invoice.termsAndConditions || ''}
                onChange={(e) => updateField('termsAndConditions', e.target.value)}
                placeholder="cth: Pembayaran maksimal 7 hari kerja setelah penayangan konten."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: KUSTOMISASI DESAIN & TEMA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('design')}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span>Kustomisasi Desain UI & Tema Invoice</span>
          </div>
          {activeSection === 'design' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {activeSection === 'design' && (
          <div className="p-5 space-y-4">
            {/* Style Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Pilih Format Tampilan Invoice
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateDesign('themeStyle', 'modern')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    invoice.design.themeStyle === 'modern'
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-slate-900 block text-xs">
                    Modern Pro (Rekomendasi)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Desain visual rapi, aksen warna elegan, status badge, dan layout profesional.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateDesign('themeStyle', 'classic')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    invoice.design.themeStyle === 'classic'
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-slate-900 block text-xs">
                    Klasik (Sesuai Lampiran)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Format tabel hitam-putih presisi persis seperti gambar yang Anda kirimkan.
                  </span>
                </button>
              </div>
            </div>

            {/* Accent Color Picker (for modern theme) */}
            {invoice.design.themeStyle === 'modern' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Pilihan Warna Aksen
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => updateDesign('primaryColor', preset.color)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        invoice.design.primaryColor === preset.color
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={invoice.design.showTerbilang}
                  onChange={(e) => updateDesign('showTerbilang', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Tampilkan Ejaan Terbilang ("Satu Juta Rupiah")</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={invoice.design.showSignature}
                  onChange={(e) => updateDesign('showSignature', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Tampilkan Area Tanda Tangan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={invoice.design.showWatermark}
                  onChange={(e) => updateDesign('showWatermark', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Tampilkan Badge Status (Lunas / Menunggu)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={invoice.design.showQrCode}
                  onChange={(e) => updateDesign('showQrCode', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Tampilkan Placeholder QRIS untuk Pembayaran Cepat</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
