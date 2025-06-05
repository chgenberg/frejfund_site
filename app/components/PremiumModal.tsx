"use client"

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 max-w-md w-full border border-yellow-200 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold">×</button>
        <div className="text-center mb-6">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Uppgradera till Premium</h2>
          <p className="text-gray-600">Få tillgång till alla våra kraftfulla funktioner!</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Obegränsade analyser</h3>
              <p className="text-gray-600 text-sm">Skapa hur många affärsplaner du vill</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">AI-drivna insikter</h3>
              <p className="text-gray-600 text-sm">Få djupare analyser och rekommendationer</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900 mb-2">197 kr engångsavgift</p>
          <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all">
            Börja din Premium-resa
          </button>
        </div>
      </div>
    </div>
  );
} 