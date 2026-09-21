import { InvoiceData, InvoiceItem } from '../types';

/**
 * Format numbers to Indonesian Rupiah or selected currency
 */
export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }
  
  if (currency === 'IDR') {
    // Format as: "Rp 1.000.000" or "Rp. 1.000.000"
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert numbers to Indonesian words (Terbilang)
 * e.g., 1000000 -> "Satu Juta Rupiah"
 */
export function terbilang(angka: number): string {
  if (angka === 0) return 'Nol Rupiah';
  if (angka < 0) return 'Minus ' + terbilang(Math.abs(angka));

  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  function konversi(n: number): string {
    n = Math.floor(n);
    if (n < 12) {
      return bilangan[n];
    } else if (n < 20) {
      return konversi(n - 10) + ' Belas';
    } else if (n < 100) {
      return konversi(Math.floor(n / 10)) + ' Puluh ' + konversi(n % 10);
    } else if (n < 200) {
      return 'Seratus ' + konversi(n - 100);
    } else if (n < 1000) {
      return konversi(Math.floor(n / 100)) + ' Ratus ' + konversi(n % 100);
    } else if (n < 2000) {
      return 'Seribu ' + konversi(n - 1000);
    } else if (n < 1000000) {
      return konversi(Math.floor(n / 1000)) + ' Ribu ' + konversi(n % 1000);
    } else if (n < 1000000000) {
      return konversi(Math.floor(n / 1000000)) + ' Juta ' + konversi(n % 1000000);
    } else if (n < 1000000000000) {
      return konversi(Math.floor(n / 1000000000)) + ' Miliar ' + konversi(n % 1000000000);
    } else if (n < 1000000000000000) {
      return konversi(Math.floor(n / 1000000000000)) + ' Triliun ' + konversi(n % 1000000000000);
    }
    return '';
  }

  const hasil = konversi(angka).replace(/\s+/g, ' ').trim();
  return hasil ? `${hasil} Rupiah` : 'Nol Rupiah';
}

/**
 * Calculate totals for the invoice
 */
export function calculateInvoiceTotals(invoice: InvoiceData) {
  const subtotal = invoice.items.reduce((sum, item) => {
    const itemTotal = (item.unitPrice || 0) * (item.quantity || 1);
    const itemDiscount = item.discount ? (itemTotal * item.discount) / 100 : 0;
    return sum + (itemTotal - itemDiscount);
  }, 0);

  const discountAmount = invoice.design.showDiscount ? 0 : 0; // if overall discount is needed
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  
  const taxAmount = invoice.design.showTax 
    ? Math.round((taxableAmount * (invoice.design.taxRate || 11)) / 100) 
    : 0;
    
  const total = taxableAmount + taxAmount;

  return {
    subtotal,
    taxAmount,
    discountAmount,
    total,
    terbilangText: terbilang(total),
  };
}

/**
 * Generate formatted WhatsApp message
 */
export function generateWhatsAppMessage(invoice: InvoiceData): string {
  const { total } = calculateInvoiceTotals(invoice);
  const formattedTotal = formatCurrency(total, invoice.currency);
  
  const primaryPayment = invoice.paymentMethods[0] || {
    providerName: 'Bank BCA',
    accountName: invoice.sender.name,
    accountNumber: '-',
  };

  let itemsList = '';
  invoice.items.forEach((item, index) => {
    const sub = item.subDetails && item.subDetails.length > 0 
      ? `\n   _${item.subDetails.join(', ')}_` 
      : '';
    itemsList += `\n${index + 1}. *${item.description}* (${item.quantity}x @ ${formatCurrency(item.unitPrice, invoice.currency)})${sub}`;
  });

  const message = 
`Halo *${invoice.client.name || invoice.client.companyName}*,

Berikut kami kirimkan rincian invoice penagihan:
📄 *No. Invoice:* ${invoice.invoiceNumber}
📅 *Tanggal:* ${invoice.invoiceDate}
${invoice.dueDate ? `⏳ *Jatuh Tempo:* ${invoice.dueDate}\n` : ''}
*Rincian Layanan / Produk:*${itemsList}

💰 *TOTAL TAGIHAN: ${formattedTotal}*

*Informasi Pembayaran:*
🏦 *${primaryPayment.providerName}*
• No. Rekening: *${primaryPayment.accountNumber}*
• Atas Nama: *${primaryPayment.accountName}*

${invoice.paymentConfirmationNote ? `📝 _${invoice.paymentConfirmationNote}_\n` : ''}
${invoice.closingNote || 'Terima kasih atas kerjasama yang baik.'}

Salam hormat,
*${invoice.sender.name}*
${invoice.sender.phone ? `📱 ${invoice.sender.phone}` : ''}
${invoice.sender.email ? `✉️ ${invoice.sender.email}` : ''}`;

  return message;
}

/**
 * Generate WhatsApp URL
 */
export function generateWhatsAppLink(invoice: InvoiceData): string {
  let phone = (invoice.client.phone || '').replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }
  const text = encodeURIComponent(generateWhatsAppMessage(invoice));
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

/**
 * Generate Email mailto link and content
 */
export function generateEmailContent(invoice: InvoiceData) {
  const { total } = calculateInvoiceTotals(invoice);
  const formattedTotal = formatCurrency(total, invoice.currency);
  const subject = `Invoice ${invoice.invoiceNumber} - ${invoice.sender.name} (${invoice.client.companyName || invoice.client.name})`;
  
  const body = generateWhatsAppMessage(invoice)
    .replace(/\*/g, '') // remove markdown bold
    .replace(/_/g, ''); // remove markdown italic
    
  const mailtoLink = `mailto:${invoice.client.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    subject,
    body,
    mailtoLink,
  };
}

/**
 * Pre-filled sample data corresponding to the user's uploaded image
 */
export const DEFAULT_INVOICE_DATA: InvoiceData = {
  id: 'inv-sample-01',
  invoiceNumber: 'INV/2026/09/001',
  invoiceDate: '21 September 2026',
  dueDate: '28 September 2026',
  status: 'pending',
  currency: 'IDR',
  sender: {
    roleLabel: 'Influencer',
    name: 'Pradita Cyntiawati Yoga',
    businessName: 'Cyntia Yoga Creator',
    email: 'cyntiayoga@gmail.com',
    phone: '082214001177',
    address: 'Jakarta Selatan, Indonesia',
    socials: {
      instagram: '@cyntiayoga',
      tiktok: 'cyntiayoga',
    },
  },
  client: {
    name: 'Finance Team',
    companyName: 'Toshiko Group Indonesia',
    email: 'finance@toshikogroup.co.id',
    phone: '081234567890',
    address: 'Gedung Wisma Toshiko Lt. 8, Sudirman, Jakarta',
  },
  items: [
    {
      id: 'item-1',
      description: '1x visit',
      subDetails: ['1x instagram reels collab @cyntiayoga'],
      quantity: 1,
      unit: 'Paket',
      unitPrice: 1000000,
    },
  ],
  paymentMethods: [
    {
      id: 'pay-1',
      type: 'bank',
      providerName: 'Bank BCA',
      accountName: 'Pradita Cyntiawati Yoga',
      accountNumber: '5486009841',
      isPrimary: true,
    },
  ],
  paymentConfirmationNote: 'Bukti transfer dapat dikirim ke email: cyntiayoga@gmail.com',
  closingNote: 'Terima kasih atas kerjasama yang baik.',
  termsAndConditions: 'Pembayaran dilakukan maksimal 7 hari setelah invoice diterima.',
  signature: {
    signatureType: 'typed',
    signerName: 'Pradita Cyntiawati Yoga',
    signerTitle: 'Content Creator / Influencer',
    date: '21 September 2026',
  },
  design: {
    themeStyle: 'modern',
    primaryColor: '#0f172a', // Slate 900
    fontFamily: 'sans',
    showLogo: true,
    showSocials: true,
    showTax: false,
    taxRate: 11,
    taxLabel: 'PPN (11%)',
    showDiscount: false,
    showTerbilang: true,
    showQrCode: true,
    showWatermark: true,
    showSignature: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
