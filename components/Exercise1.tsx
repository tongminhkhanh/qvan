import React, { useState, useEffect, useRef } from 'react';
import { SortItem } from '../types';
import { Cat, Sofa, CheckCircle, RefreshCcw, Loader2, Sparkles, Clock, Trophy, User, Play, XCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// Fallback items in case API fails
const FALLBACK_ITEMS: SortItem[] = [
  { id: '1', text: 'Con Mèo', category: 'pet' },
  { id: '2', text: 'Cái Quạt điện', category: 'furniture' },
  { id: '3', text: 'Con Chó cún', category: 'pet' },
  { id: '4', text: 'Cái Bàn', category: 'furniture' },
  { id: '5', text: 'Cái Tủ lạnh', category: 'furniture' },
  { id: '6', text: 'Con Gà con', category: 'pet' },
  { id: '7', text: 'Cái Giường ngủ', category: 'furniture' },
  { id: '8', text: 'Con Vẹt', category: 'pet' },
  { id: '9', text: 'Cái Đèn học', category: 'furniture' },
  { id: '10', text: 'Con Cá vàng', category: 'pet' },
];

interface LeaderboardEntry {
  id: number;
  playerName: string;
  timestamp: number;
  duration: number;
  correct: number;
  incorrect: number;
}

const Exercise1: React.FC = () => {
  const [items, setItems] = useState<SortItem[]>([]);
  const [currentItem, setCurrentItem] = useState<SortItem | null>(null);
  
  // Score tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error' | null}>({ text: '', type: null });
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  // Player & Game State
  const [playerName, setPlayerName] = useState('');
  const [isGameActive, setIsGameActive] = useState(false);

  // Timer & Leaderboard State
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastDuration, setLastDuration] = useState<number | null>(null);

  // Load leaderboard from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pet_furniture_leaderboard_v2');
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse leaderboard", e);
      }
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !completed && !isLoading) {
      interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, completed, isLoading]);

  const fetchAIQuestions = async () => {
    if (!process.env.API_KEY) return FALLBACK_ITEMS;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Hãy đóng vai một giáo viên tiểu học. Tạo danh sách ngẫu nhiên 10 từ vựng tiếng Việt về đồ vật và vật nuôi trong gia đình cho học sinh lớp 3. \n" +
                  "Yêu cầu bắt buộc:\n" +
                  "1. Đối với vật nuôi (category: 'pet'): Tên phải bắt đầu bằng từ 'Con' (ví dụ: Con mèo, Con chó).\n" +
                  "2. Đối với đồ đạc (category: 'furniture'): Tên phải bắt đầu bằng từ 'Cái' (ví dụ: Cái bàn, Cái ghế, Cái quạt).\n" +
                  "3. Đảm bảo danh sách có cả vật nuôi và đồ đạc trộn lẫn nhau.",
        config: {
          thinkingConfig: { thinkingBudget: 1024 }, // Enable Flash Thinking
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING, description: "Tên có kèm từ loại 'Con' hoặc 'Cái'" },
                category: { type: Type.STRING, enum: ['pet', 'furniture'] }
              },
              required: ['id', 'text', 'category']
            }
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        return data.map((item: any, index: number) => ({
          ...item,
          id: `ai-${index}-${Date.now()}`
        }));
      }
      return FALLBACK_ITEMS;
    } catch (error) {
      console.error("AI Generation failed, using fallback:", error);
      return FALLBACK_ITEMS;
    }
  };

  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert("Em hãy nhập tên trước khi chơi nhé!");
      return;
    }
    setIsGameActive(true);
    startNewGame();
  };

  const startNewGame = async () => {
    setIsLoading(true);
    setCompleted(false);
    setMessage({ text: 'Đang suy nghĩ câu hỏi mới...', type: null });
    setStartTime(null);
    setCurrentTime(0);
    setLastDuration(null);
    setCorrectCount(0);
    setIncorrectCount(0);

    let newItems = await fetchAIQuestions();
    
    // Fallback if AI returns empty array
    if (!newItems || newItems.length === 0) {
        newItems = FALLBACK_ITEMS;
    }

    // Shuffle
    const shuffled = [...newItems].sort(() => 0.5 - Math.random());
    
    setItems(shuffled);
    setCurrentItem(shuffled[0]);
    setTotalQuestions(shuffled.length);
    setMessage({ text: 'Hãy giúp tớ phân loại nhé!', type: null });
    setIsLoading(false);
    setStartTime(Date.now()); // Start timer
  };

  const handleSort = (category: 'pet' | 'furniture') => {
    if (!currentItem) return;

    if (currentItem.category === category) {
      // Correct
      setCorrectCount(prev => prev + 1);
      setMessage({ text: 'Chính xác! Giỏi quá!', type: 'success' });
    } else {
      // Incorrect - skip to next
      setIncorrectCount(prev => prev + 1);
      setMessage({ text: 'Tiếc quá! Sai rồi.', type: 'error' });
    }

    // Logic to move to next item regardless of correct/incorrect
    const remaining = items.filter(i => i.id !== currentItem.id);
    setItems(remaining);
    
    if (remaining.length > 0) {
      setCurrentItem(remaining[0]);
    } else {
      // Game Finished
      // Need to capture counts in closure or use refs if we want exact values here immediately, 
      // but since state updates are batched, we'll calculate final stats in finishGame wrapper or pass them.
      // Better approach: finishGame calls state setters, but for leaderboard we need current values.
      // We will pass the final update to finishGame.
      finishGame(
        currentItem.category === category ? correctCount + 1 : correctCount,
        currentItem.category !== category ? incorrectCount + 1 : incorrectCount
      );
    }
  };

  const finishGame = (finalCorrect: number, finalIncorrect: number) => {
    const end = Date.now();
    const duration = startTime ? (end - startTime) / 1000 : 0;
    
    setCompleted(true);
    setCurrentItem(null);
    setMessage({ text: `Chúc mừng ${playerName}! Em đã hoàn thành bài tập!`, type: 'success' });
    setLastDuration(duration);

    // Update Leaderboard
    const newEntry: LeaderboardEntry = {
      id: end,
      playerName: playerName,
      timestamp: end,
      duration: duration,
      correct: finalCorrect,
      incorrect: finalIncorrect
    };

    setLeaderboard(prev => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.correct - a.correct || a.duration - b.duration) // Sort by most correct, then fastest time
        .slice(0, 10); // Keep top 10
      
      localStorage.setItem('pet_furniture_leaderboard_v2', JSON.stringify(updated));
      return updated;
    });
  };

  // 1. Initial Name Input Screen
  if (!isGameActive) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border-4 border-blue-200 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Chào bạn mới!</h2>
          <p className="text-gray-600 mb-6">Em hãy nhập tên để bắt đầu trò chơi nhé.</p>
          
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của em..."
            className="w-full px-4 py-3 text-lg border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 mb-6 text-center"
            onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
          />

          <button
            onClick={handleStartGame}
            className="w-full group relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Play className="fill-current" /> Bắt đầu
          </button>
        </div>
      </div>
    );
  }

  // 2. Main Game Logic
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={100} className="text-blue-500" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-lg">Bài 1</span> 
              Tìm từ ngữ về bạn trong nhà
            </h2>
            <p className="text-gray-600 mt-1">Người chơi: <span className="font-bold text-blue-800">{playerName}</span></p>
          </div>
          
          {!completed && !isLoading && (
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
               <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold">
                 <CheckCircle size={20} />
                 <span>{correctCount}</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg font-bold">
                 <XCircle size={20} />
                 <span>{incorrectCount}</span>
               </div>
               <div className="w-px h-6 bg-gray-300"></div>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold">
                  <Clock size={20} />
                  <span>{currentTime}s</span>
                </div>
            </div>
          )}
        </div>
        
        <div className={`text-center py-2 rounded-lg font-bold transition-all relative z-10 ${
             message.type === 'success' ? 'bg-green-100 text-green-700' : 
             message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
           }`}>
             {message.text}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
          <p className="text-xl text-blue-600 font-bold animate-pulse">Cô giáo AI đang soạn câu hỏi mới...</p>
        </div>
      ) : !completed ? (
        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Pet Zone */}
          <button 
            onClick={() => handleSort('pet')}
            className="flex-1 w-full h-64 md:h-80 bg-pink-100 border-4 border-pink-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-pink-200 hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Cat size={64} className="text-pink-500 mb-4 transition-transform duration-300 group-hover:scale-125" />
            <h3 className="text-3xl font-bold text-pink-600 transition-transform duration-300 group-hover:scale-110">Vật nuôi</h3>
            <p className="text-pink-400 mt-2 transition-opacity duration-300 group-hover:opacity-80">(Con mèo, Con chó...)</p>
          </button>

          {/* Current Item Card */}
          <div className="w-64 h-48 perspective-1000 z-10">
            {currentItem && (
              <div className="w-full h-full bg-white rounded-2xl shadow-2xl border-4 border-yellow-400 flex items-center justify-center transform transition-all animate-pulse-slow relative">
                <span className="text-3xl font-extrabold text-gray-800 text-center px-4">
                  {currentItem.text}
                </span>
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                   {totalQuestions - items.length + 1}
                </div>
              </div>
            )}
          </div>

          {/* Furniture Zone */}
          <button 
            onClick={() => handleSort('furniture')}
            className="flex-1 w-full h-64 md:h-80 bg-indigo-100 border-4 border-indigo-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-200 hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Sofa size={64} className="text-indigo-500 mb-4 transition-transform duration-300 group-hover:scale-125" />
            <h3 className="text-3xl font-bold text-indigo-600 transition-transform duration-300 group-hover:scale-110">Đồ đạc</h3>
            <p className="text-indigo-400 mt-2 transition-opacity duration-300 group-hover:opacity-80">(Cái quạt, Cái bàn...)</p>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-start bg-white rounded-3xl shadow-inner p-8 overflow-y-auto">
          <CheckCircle size={60} className="text-green-500 mb-2" />
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Hoàn thành bài tập!</h3>
          <div className="flex gap-6 mb-6 mt-2">
            <div className="text-center">
               <p className="text-sm text-gray-500">Thời gian</p>
               <p className="font-bold text-blue-600 text-xl">{lastDuration?.toFixed(1)}s</p>
            </div>
            <div className="text-center">
               <p className="text-sm text-gray-500">Đúng</p>
               <p className="font-bold text-green-600 text-xl">{correctCount}</p>
            </div>
            <div className="text-center">
               <p className="text-sm text-gray-500">Sai</p>
               <p className="font-bold text-red-600 text-xl">{incorrectCount}</p>
            </div>
          </div>
          
          <button 
            onClick={startNewGame}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors shadow-lg mb-8"
          >
            <RefreshCcw size={20} /> Chơi lại
          </button>

          {/* Leaderboard */}
          <div className="w-full max-w-lg bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
             <h4 className="text-xl font-bold text-yellow-700 flex items-center justify-center gap-2 mb-4">
               <Trophy className="text-yellow-500 fill-yellow-500" /> Bảng Xếp Hạng
             </h4>
             <div className="space-y-2">
               {leaderboard.length === 0 ? (
                 <p className="text-center text-gray-500 italic">Chưa có thành tích nào. Hãy là người đầu tiên!</p>
               ) : (
                 leaderboard.map((entry, index) => (
                   <div 
                     key={entry.id} 
                     className={`flex justify-between items-center p-3 rounded-lg shadow-sm border ${
                       entry.id === leaderboard.find(l => l.duration === lastDuration && l.playerName === playerName && l.timestamp === leaderboard.reduce((max, cur) => cur.timestamp > max ? cur.timestamp : max, 0))?.id
                       ? 'bg-green-50 border-green-300 ring-2 ring-green-200' 
                       : 'bg-white border-gray-100'
                     }`}
                   >
                     <div className="flex items-center gap-3">
                        <span className={`font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          index === 0 ? 'bg-yellow-400 text-white ring-2 ring-yellow-200' : 
                          index === 1 ? 'bg-gray-300 text-white' : 
                          index === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{entry.playerName}</p>
                          <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                       <span className="text-green-600 font-bold">{entry.correct}Đ</span>
                       <span className="text-red-400 font-semibold">{entry.incorrect}S</span>
                       <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{entry.duration.toFixed(1)}s</span>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise1;