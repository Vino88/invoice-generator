import React, { useRef, useState, useEffect } from 'react';
import { Edit3, Type, Upload, Trash2, Check, PenTool } from 'lucide-react';
import { InvoiceSignature } from '../types';

interface SignaturePadProps {
  signature: InvoiceSignature;
  onChange: (signature: InvoiceSignature) => void;
  onClose?: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signature,
  onChange,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'typed' | 'draw' | 'upload'>(
    signature.signatureType || 'typed'
  );
  const [typedName, setTypedName] = useState(signature.signerName || '');
  const [signerTitle, setSignerTitle] = useState(signature.signerTitle || '');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize canvas if in draw mode
  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // If dataUrl exists and is drawn before, restore it
        if (signature.dataUrl && signature.signatureType === 'draw') {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = signature.dataUrl;
        }
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange({
        ...signature,
        signatureType: 'draw',
        dataUrl,
        signerName: typedName,
        signerTitle,
      });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    onChange({
      ...signature,
      dataUrl: undefined,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          ...signature,
          signatureType: 'upload',
          dataUrl: result,
          signerName: typedName,
          signerTitle,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTyped = () => {
    onChange({
      ...signature,
      signatureType: 'typed',
      signerName: typedName,
      signerTitle,
    });
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <PenTool className="w-4 h-4 text-indigo-600" />
          Tanda Tangan Digital & Nama Terang
        </h4>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Tutup
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg mb-4 text-xs font-medium">
        <button
          type="button"
          onClick={() => {
            setActiveTab('typed');
            onChange({ ...signature, signatureType: 'typed', signerName: typedName, signerTitle });
          }}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'typed'
              ? 'bg-white text-slate-800 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Ketik Nama
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('draw');
            onChange({ ...signature, signatureType: 'draw', signerName: typedName, signerTitle });
          }}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'draw'
              ? 'bg-white text-slate-800 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Gambar (Tanda Tangan)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('upload');
            onChange({ ...signature, signatureType: 'upload', signerName: typedName, signerTitle });
          }}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-slate-800 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Unggah File
        </button>
      </div>

      {/* Inputs for Signer Name & Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Nama Penandatangan
          </label>
          <input
            type="text"
            value={typedName}
            onChange={(e) => {
              setTypedName(e.target.value);
              onChange({ ...signature, signerName: e.target.value });
            }}
            placeholder="cth: Pradita Cyntiawati Yoga"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Jabatan / Peran (Opsional)
          </label>
          <input
            type="text"
            value={signerTitle}
            onChange={(e) => {
              setSignerTitle(e.target.value);
              onChange({ ...signature, signerTitle: e.target.value });
            }}
            placeholder="cth: Content Creator / Influencer"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'typed' && (
        <div className="border border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 text-center">
          <p className="text-xs text-slate-500 mb-2">Pratinjau Tanda Tangan Kaligrafi:</p>
          <div className="font-handwriting text-3xl text-slate-800 min-h-[48px] flex items-center justify-center tracking-wide">
            {typedName || 'Nama Anda'}
          </div>
        </div>
      )}

      {activeTab === 'draw' && (
        <div>
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[140px] cursor-crosshair bg-white"
            />
            <button
              type="button"
              onClick={clearCanvas}
              title="Hapus coretan"
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-md border border-slate-200 text-xs flex items-center gap-1 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 text-center">
            Goreskan tanda tangan Anda dengan mouse atau jari pada area di atas.
          </p>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="border border-dashed border-slate-300 rounded-xl p-5 bg-slate-50 text-center">
          {signature.dataUrl && signature.signatureType === 'upload' ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={signature.dataUrl}
                alt="Uploaded Signature"
                className="max-h-24 object-contain border border-slate-200 bg-white p-2 rounded-lg"
              />
              <button
                type="button"
                onClick={() => onChange({ ...signature, dataUrl: undefined })}
                className="text-xs text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Gambar
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <span className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Pilih file tanda tangan (PNG/JPG transparan)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Maks 2MB, format transparan lebih baik</p>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};
