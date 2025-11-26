import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { BookOpen, HelpCircle, Check, X } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Cánh buồm trên sông được so sánh với sự vật nào?',
    options: ['Con chim én', 'Con bướm nhỏ', 'Chiếc lá bay', 'Đám mây trắng'],
    correctAnswer: 'Con bướm nhỏ'
  },
  {
    id: 'q2',
    question: 'Nước sông được ví với sự vật nào?',
    options: ['Tấm gương khổng lồ', 'Dải lụa đào', 'Sao bay', 'Bầu trời xanh'],
    correctAnswer: 'Sao bay'
  }
];

const Exercise2: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId: string, option: string) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const checkResults = () => {
    setShowResults(true);
  };

  const reset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const allAnswered = QUESTIONS.every(q => answers[q.id]);

  return (
    <div className="flex flex-col md:flex-row h-full max-w-6xl mx-auto p-4 gap-6">
      {/* Reading Passage */}
      <div className="flex-1 bg-amber-50 rounded-2xl p-8 shadow-lg border-2 border-amber-200 overflow-y-auto max-h-[600px]">
        <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-amber-600" />
          Bài 2: Đọc hiểu
        </h2>
        
        <div className="prose prose-lg text-gray-800 font-medium leading-relaxed">
          <h3 className="text-center font-bold text-xl mb-4 text-amber-900">Nhà Thuỷ</h3>
          <p className="mb-4 indent-8">
            Nhà Thuỷ ở ngay dưới thuyền. Con sông thân yêu, nơi có "nhà" của Thuỷ ấy, là sông Hồng. Lòng sông mở mênh mông, quãng chảy qua Hà Nội càng mênh mông hơn.
          </p>
          <p className="mb-4 indent-8 bg-yellow-100 p-2 rounded-lg border-l-4 border-yellow-400">
            Mỗi <b>cánh buồm</b> nổi trên dòng sông, nom cứ như là <b>một con bướm nhỏ</b>. Lúc nắng ửng mây hồng, <b>nước sông</b> nhấp nháy như <b>sao bay</b>.
          </p>
          <p className="text-right italic text-sm text-gray-600">(Theo Phong Thu)</p>
        </div>
      </div>

      {/* Quiz Section */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <HelpCircle /> Trả lời câu hỏi
          </h3>

          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => (
              <div key={q.id} className="bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-gray-800 mb-3">{idx + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    const isCorrect = q.correctAnswer === opt;
                    let btnClass = "w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex justify-between items-center ";
                    
                    if (showResults) {
                      if (isCorrect) btnClass += "bg-green-100 border-green-500 text-green-800 font-bold";
                      else if (isSelected && !isCorrect) btnClass += "bg-red-100 border-red-500 text-red-800 opacity-70";
                      else btnClass += "bg-gray-50 border-gray-200 text-gray-500";
                    } else {
                      if (isSelected) btnClass += "bg-blue-100 border-blue-500 text-blue-800 shadow-md";
                      else btnClass += "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700";
                    }

                    return (
                      <button 
                        key={opt}
                        onClick={() => handleSelect(q.id, opt)}
                        disabled={showResults}
                        className={btnClass}
                      >
                        {opt}
                        {showResults && isCorrect && <Check size={20} />}
                        {showResults && isSelected && !isCorrect && <X size={20} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            {!showResults ? (
              <button
                onClick={checkResults}
                disabled={!allAnswered}
                className={`px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all ${
                  allAnswered 
                  ? 'bg-green-500 hover:bg-green-600 transform hover:scale-105' 
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Kiểm tra kết quả
              </button>
            ) : (
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 shadow-lg transition-all"
              >
                Làm lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise2;