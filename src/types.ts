export interface InvoiceItem {
  id: string;
  description: string;
  subDetails?: string[]; // e.g. ["1x visit", "1x instagram reels collab @cyntiayoga"]
  quantity: number;
  unit?: string; // e.g. "paket", "pcs", "jam", "post"
  unitPrice: number;
  discount?: number; // percentage or fixed
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'ewallet' | 'qris';
  providerName: string; // e.g. "Bank BCA", "Bank Mandiri", "GoPay"
  accountName: string; // a/n e.g. "Pradita Cyntiawati Yoga"
  accountNumber: string; // e.g. "5486009841"
  qrImageUrl?: string;
  isPrimary?: boolean;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface InvoiceSender {
  roleLabel: string; // e.g. "Influencer", "Freelancer", "Agency", "Vendor"
  name: string; // e.g. "Pradita Cyntiawati Yoga"
  businessName?: string;
  email: string;
  phone: string;
  address?: string;
  logoUrl?: string;
  socials: SocialLinks;
}

export interface InvoiceClient {
  name: string; // Contact person or representative
  companyName: string; // e.g. "Toshiko Group Indonesia"
  email?: string;
  phone?: string;
  address?: string;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export type InvoiceThemeStyle = 'modern' | 'classic' | 'minimal' | 'elegant';

export interface InvoiceDesign {
  themeStyle: InvoiceThemeStyle;
  primaryColor: string; // e.g. "#1e293b", "#0f766e", "#1e3a8a", "#b45309"
  fontFamily: 'sans' | 'serif' | 'mono';
  showLogo: boolean;
  showSocials: boolean;
  showTax: boolean;
  taxRate: number; // e.g. 11 for 11% PPN
  taxLabel: string; // e.g. "PPN (11%)"
  showDiscount: boolean;
  showTerbilang: boolean;
  showQrCode: boolean;
  showWatermark: boolean;
  showSignature: boolean;
}

export interface InvoiceSignature {
  signatureType: 'draw' | 'upload' | 'typed';
  dataUrl?: string; // canvas drawing or uploaded image dataUrl
  signerName: string;
  signerTitle?: string;
  date?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD or formatted string
  dueDate?: string;
  status: InvoiceStatus;
  currency: string; // "IDR"
  sender: InvoiceSender;
  client: InvoiceClient;
  items: InvoiceItem[];
  paymentMethods: PaymentMethod[];
  paymentConfirmationNote: string; // "Bukti transfer dapat dikirim ke email: cyntiayoga@gmail.com"
  closingNote: string; // "Terima kasih atas kerjasama yang baik."
  termsAndConditions?: string;
  signature: InvoiceSignature;
  design: InvoiceDesign;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTemplatePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  data: Partial<InvoiceData>;
}
