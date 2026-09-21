import { InvoiceTemplatePreset } from '../types';
import { DEFAULT_INVOICE_DATA } from '../utils/invoiceUtils';

export const INVOICE_PRESETS: InvoiceTemplatePreset[] = [
  {
    id: 'preset-influencer',
    name: 'Influencer & KOL (Sesuai Lampiran)',
    description: 'Template untuk endorsement, reels visit, TikTok promo, dan collab media sosial.',
    category: 'Influencer',
    data: DEFAULT_INVOICE_DATA,
  },
  {
    id: 'preset-creative-agency',
    name: 'Creative Agency & Design Studio',
    description: 'Template untuk desain brand identity, UI/UX, dan social media management bulanan.',
    category: 'Agency',
    data: {
      ...DEFAULT_INVOICE_DATA,
      id: 'inv-agency-02',
      invoiceNumber: 'INV/2026/09/088',
      sender: {
        roleLabel: 'Creative Agency',
        name: 'Studio Karsa Kreasi',
        businessName: 'PT Karsa Kreasi Digital',
        email: 'billing@karsakreasi.id',
        phone: '08119876543',
        address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
        socials: {
          instagram: '@karsakreasi.studio',
          website: 'www.karsakreasi.id',
        },
      },
      client: {
        name: 'Bapak Hendra Wijaya',
        companyName: 'PT Nusantara Retail Global',
        email: 'hendra@nusantararetail.com',
        phone: '081299887766',
        address: 'Menara Astra Lt. 24, Jl. Jend. Sudirman, Jakarta',
      },
      items: [
        {
          id: 'item-ag-1',
          description: 'Brand Identity & Visual Guidelines',
          subDetails: ['Logo pack, Color palette, Typography, Brand book PDF'],
          quantity: 1,
          unit: 'Paket',
          unitPrice: 8500000,
        },
        {
          id: 'item-ag-2',
          description: 'UI/UX Design Mobile Application',
          subDetails: ['Figma Prototype, Design System, 25 Screens, 2x Revision'],
          quantity: 1,
          unit: 'Proyek',
          unitPrice: 12000000,
        },
      ],
      paymentMethods: [
        {
          id: 'pay-ag-1',
          type: 'bank',
          providerName: 'Bank Mandiri',
          accountName: 'PT Karsa Kreasi Digital',
          accountNumber: '1270009876543',
          isPrimary: true,
        },
      ],
      design: {
        ...DEFAULT_INVOICE_DATA.design,
        themeStyle: 'modern',
        primaryColor: '#047857', // Emerald
        showTax: true,
        taxRate: 11,
      },
    },
  },
  {
    id: 'preset-developer',
    name: 'Freelance Software Engineer',
    description: 'Template untuk jasa pembuatan website, integrasi API, dan maintenance server.',
    category: 'IT & Freelance',
    data: {
      ...DEFAULT_INVOICE_DATA,
      id: 'inv-dev-03',
      invoiceNumber: 'INV/2026/09/104',
      sender: {
        roleLabel: 'Freelancer',
        name: 'Rian Pratama, S.Kom',
        businessName: 'Rian Codecraft',
        email: 'rian@codecraft.dev',
        phone: '085712345678',
        address: 'Bandung, Jawa Barat',
        socials: {
          linkedin: 'linkedin.com/in/rianpratama',
          website: 'codecraft.dev',
        },
      },
      client: {
        name: 'Ibu Sarah Amelia',
        companyName: 'Klinik Sehat Harmoni',
        email: 'sarah@sehatharmoni.id',
        phone: '081377889900',
        address: 'Jl. R.E. Martadinata No. 15, Bandung',
      },
      items: [
        {
          id: 'item-dev-1',
          description: 'Website Booking & Pasien Management',
          subDetails: ['Fullstack React + Node.js, Integrasi WhatsApp Gateway, Cloud Hosting'],
          quantity: 1,
          unit: 'Modul',
          unitPrice: 6500000,
        },
        {
          id: 'item-dev-2',
          description: 'Maintenance & SSL Security Support (3 Bulan)',
          subDetails: ['Bug fixing bulanan, Backup harian otomatis'],
          quantity: 3,
          unit: 'Bulan',
          unitPrice: 750000,
        },
      ],
      paymentMethods: [
        {
          id: 'pay-dev-1',
          type: 'bank',
          providerName: 'Bank BCA',
          accountName: 'Rian Pratama',
          accountNumber: '8290123456',
          isPrimary: true,
        },
      ],
      design: {
        ...DEFAULT_INVOICE_DATA.design,
        themeStyle: 'modern',
        primaryColor: '#1d4ed8', // Blue 700
      },
    },
  },
];
