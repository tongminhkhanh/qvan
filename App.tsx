import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Exercise1 from './components/Exercise1';
import Exercise2 from './components/Exercise2';
import Exercise3 from './components/Exercise3';
import { GameState, ExerciseType } from './types';
import { Home, Star, Book, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [currentTab, setCurrentTab] = useState<ExerciseType>(ExerciseType.SORTING);

  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  const returnHome = () => {
    setGameState(GameState.WELCOME);
  };

  if (gameState === GameState.WELCOME) {
    return <WelcomeScreen onStart={startGame} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header / Nav */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={returnHome}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              title="Về trang chủ"
            >
              <Home />
            </button>
            <h1 className="font-bold text-xl text-blue-600 hidden sm:block">Luyện tập Tiếng Việt 3</h1>
          </div>

          <nav className="flex space-x-2">
            <button 
              onClick={() => setCurrentTab(ExerciseType.SORTING)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                currentTab === ExerciseType.SORTING 
                ? 'bg-pink-100 text-pink-600 shadow-inner ring-2 ring-pink-400' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Star size={18} />
              <span className="hidden sm:inline">Bài 1</span>
            </button>
            <button 
              onClick={() => setCurrentTab(ExerciseType.READING)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                currentTab === ExerciseType.READING 
                ? 'bg-amber-100 text-amber-600 shadow-inner ring-2 ring-amber-400' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Book size={18} />
              <span className="hidden sm:inline">Bài 2</span>
            </button>
            <button 
              onClick={() => setCurrentTab(ExerciseType.MATCHING)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                currentTab === ExerciseType.MATCHING 
                ? 'bg-purple-100 text-purple-600 shadow-inner ring-2 ring-purple-400' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Heart size={18} />
              <span className="hidden sm:inline">Bài 3</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-50 pointer-events-none"></div>
        <div className="relative h-full">
          {currentTab === ExerciseType.SORTING && <Exercise1 />}
          {currentTab === ExerciseType.READING && <Exercise2 />}
          {currentTab === ExerciseType.MATCHING && <Exercise3 />}
        </div>
      </main>
    </div>
  );
};

export default App;