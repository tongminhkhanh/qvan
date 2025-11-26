import React from 'react';
import { Sparkles, Play, School } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-300 via-purple-200 to-pink-200 p-4 text-center">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white max-w-2xl w-full transform hover:scale-105 transition-all duration-500">
        <div className="flex justify-center mb-6">
           <div className="bg-yellow-400 p-4 rounded-full shadow-lg animate-bounce">
             <School size={64} className="text-white" />
           </div>
        </div>
        
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          Chào mừng các em học sinh <br/>
          <span className="text-6xl text-pink-500">Lớp 3A4!</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 font-semibold">
          Chúng mình cùng nhau ôn tập bài học hôm nay nhé!
        </p>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-2xl font-bold text-white transition-all duration-200 bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Play className="mr-3 fill-current" />
          Bắt đầu thôi!
          <div className="absolute -top-2 -right-2">
            <Sparkles className="text-yellow-400 w-8 h-8 animate-spin-slow" />
          </div>
        </button>
      </div>
      
      <footer className="absolute bottom-4 text-gray-500 font-medium text-sm">
        © Trò chơi học tập - Tiếng Việt 3
      </footer>
    </div>
  );
};

export default WelcomeScreen;