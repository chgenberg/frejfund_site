import React, { useState } from 'react';

interface PitchDeckCustomizationProps {
  onGenerate: (config: PitchDeckConfig) => void;
  onClose: () => void;
}

export interface PitchDeckConfig {
  logo?: File;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fontFamily: string;
}

const FONT_OPTIONS = [
  { value: 'Helvetica', label: 'Helvetica (Modern)', preview: 'font-sans' },
  { value: 'Times', label: 'Times (Klassisk)', preview: 'font-serif' },
  { value: 'Lato', label: 'Lato (Professionell)', preview: 'font-sans' },
  { value: 'Pacifico', label: 'Pacifico (Kreativ)', preview: 'font-sans' },
];

const COLOR_PRESETS = [
  { primary: '#16475b', secondary: '#7edcff', accent: '#ff6b6b' },
  { primary: '#2c3e50', secondary: '#3498db', accent: '#e74c3c' },
  { primary: '#27ae60', secondary: '#2ecc71', accent: '#f39c12' },
  { primary: '#8e44ad', secondary: '#9b59b6', accent: '#e67e22' },
];

export default function PitchDeckCustomization({ onGenerate, onClose }: PitchDeckCustomizationProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [colors, setColors] = useState({
    primary: '#16475b',
    secondary: '#7edcff',
    accent: '#ff6b6b'
  });
  const [fontFamily, setFontFamily] = useState('Helvetica');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    onGenerate({
      logo: logo || undefined,
      colors,
      fontFamily
    });
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#16475b]">Anpassa din Pitch Deck</h2>
          <button
            onClick={onClose}
            className="text-[#16475b] text-2xl font-bold hover:text-[#2a6b8a] focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Logo Upload */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#16475b] mb-3">Företagslogo</h3>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-[#7edcff] rounded-xl flex items-center justify-center bg-[#f5f7fa]">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <svg className="w-12 h-12 text-[#7edcff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div>
              <label className="bg-[#16475b] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-[#2a6b8a] transition-colors inline-block">
                Ladda upp logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-[#16475b]/60 mt-2">PNG eller JPG, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#16475b] mb-3">Signaturfärger</h3>
          
          {/* Color Presets */}
          <div className="flex gap-3 mb-4">
            {COLOR_PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => setColors(preset)}
                className="flex gap-1 p-2 rounded-lg border-2 border-[#eaf6fa] hover:border-[#7edcff] transition-colors"
              >
                <div className="w-8 h-8 rounded" style={{ backgroundColor: preset.primary }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: preset.secondary }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: preset.accent }}></div>
              </button>
            ))}
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#16475b] mb-1">Primär</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#16475b] mb-1">Sekundär</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#16475b] mb-1">Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.accent}
                  onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Font Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#16475b] mb-3">Typsnitt</h3>
          <div className="grid grid-cols-2 gap-3">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => setFontFamily(font.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  fontFamily === font.value
                    ? 'border-[#16475b] bg-[#eaf6fa]'
                    : 'border-[#eaf6fa] hover:border-[#7edcff]'
                }`}
              >
                <div className={`text-2xl mb-1 ${font.preview}`}>Aa</div>
                <div className="text-sm text-[#16475b]">{font.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-8 p-6 bg-[#f5f7fa] rounded-xl">
          <h4 className="text-sm font-semibold text-[#16475b] mb-3">Förhandsvisning</h4>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              {logoPreview && (
                <img src={logoPreview} alt="Logo" className="h-12 object-contain" />
              )}
              <div className="text-right">
                <h5 className="text-xl font-bold" style={{ color: colors.primary, fontFamily }}>
                  Företagsnamn
                </h5>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  Pitch Deck 2024
                </p>
              </div>
            </div>
            <div className="h-px bg-gray-200 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 rounded" style={{ backgroundColor: colors.primary, width: '80%' }}></div>
              <div className="h-3 rounded" style={{ backgroundColor: colors.secondary, width: '60%' }}></div>
              <div className="h-3 rounded" style={{ backgroundColor: colors.accent, width: '40%' }}></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-[#16475b] hover:bg-[#f5f7fa] rounded-full transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-gradient-to-r from-[#16475b] to-[#2a6b8a] text-white font-bold rounded-full hover:shadow-lg transition-all"
          >
            Generera Pitch Deck
          </button>
        </div>
      </div>
    </div>
  );
} 