import React, { useState } from 'react';
import { MatchPair } from '../types';
import { Link, RefreshCcw } from 'lucide-react';

const PAIRS: MatchPair[] = [
  { id: '1', left: 'Tàu cau', right: 'Tay xoè rộng', color: 'bg-green-100 border-green-400' },
  { id: '2', left: 'Trăng tròn', right: 'Cái đĩa', color: 'bg-yellow-100 border-yellow-400' },
  { id: '3', left: 'Sương trắng', right: 'Chiếc khăn bông', color: 'bg-gray-100 border-gray-400' },
  { id: '4', left: 'Lá mềm', right: 'Mây', color: 'bg-sky-100 border-sky-400' },
];

const Exercise3: React.FC = () => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [incorrect, setIncorrect] = useState<string | null>(null);

  const handleLeftClick = (id: string) => {
    if (matches.has(id)) return;
    setSelectedLeft(id);
    setIncorrect(null);
  };

  const handleRightClick = (id: string) => {
    if (matches.has(id)) return;
    if (!selectedLeft) return;

    if (selectedLeft === id) {
      // Match found
      const newMatches = new Set(matches);
      newMatches.add(id);
      setMatches(newMatches);
      setSelectedLeft(null);
    } else {
      // Incorrect match
      setIncorrect(id);
      setTimeout(() => setIncorrect(null), 1000);
    }
  };

  const resetGame = () => {
    setMatches(new Set());
    setSelectedLeft(null);
    setIncorrect(null);
  };

  const isComplete = matches.size === PAIRS.length;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-8 text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-2">
          <Link /> Bài 3: Tìm hình ảnh so sánh
        </h2>
        <p className="text-gray-600">Em hãy nối hình ảnh ở cột trái với hình ảnh so sánh tương ứng ở cột phải.</p>
      </div>

      <div className="flex-1 flex justify-between gap-12 relative">
        {/* Connection Lines (Visual logic simplified for DOM implementation) */}
        
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          <h3 className="text-xl font-bold text-center text-gray-700 mb-4">Sự vật</h3>
          {PAIRS.map((pair) => {
            const isMatched = matches.has(pair.id);
            const isSelected = selectedLeft === pair.id;
            
            return (
              <button
                key={`left-${pair.id}`}
                onClick={() => handleLeftClick(pair.id)}
                disabled={isMatched}
                className={`w-full p-6 text-lg font-bold rounded-2xl border-4 shadow-sm transition-all transform duration-300 relative
                  ${isMatched 
                    ? `${pair.color} opacity-50 scale-95` 
                    : isSelected 
                      ? 'bg-purple-100 border-purple-500 scale-105 shadow-xl z-10' 
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }
                `}
              >
                {pair.left}
                {isMatched && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-green-600">✓</div>}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          <h3 className="text-xl font-bold text-center text-gray-700 mb-4">Hình ảnh so sánh</h3>
          {/* Shuffling logic could be added here, but mapped directly for simplicity in code generation */}
          {[...PAIRS].sort((a,b) => parseInt(b.id) - parseInt(a.id)).map((pair) => {
             const isMatched = matches.has(pair.id);
             const isError = incorrect === pair.id;

             return (
              <button
                key={`right-${pair.id}`}
                onClick={() => handleRightClick(pair.id)}
                disabled={isMatched}
                className={`w-full p-6 text-lg font-bold rounded-2xl border-4 shadow-sm transition-all transform duration-300 relative
                  ${isMatched 
                    ? `${pair.color} opacity-50 scale-95` 
                    : isError
                      ? 'bg-red-100 border-red-500 animate-shake'
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }
                `}
              >
                {pair.right}
                {isMatched && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-green-600">✓</div>}
              </button>
            );
          })}
        </div>
      </div>

      {isComplete && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-10 rounded-3xl shadow-2xl text-center animate-bounce-in">
              <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                Tuyệt vời!
              </h3>
              <p className="text-xl text-gray-600 mb-6">Em đã tìm ra tất cả các phép so sánh!</p>
              <button 
                onClick={resetGame}
                className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-600 transition-colors shadow-lg"
              >
                <RefreshCcw size={20} /> Chơi lại bài này
              </button>
           </div>
         </div>
      )}
    </div>
  );
};

export default Exercise3;