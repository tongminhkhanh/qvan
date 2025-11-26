export enum GameState {
  WELCOME = 'WELCOME',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export enum ExerciseType {
  SORTING = 'SORTING',
  READING = 'READING',
  MATCHING = 'MATCHING'
}

export interface SortItem {
  id: string;
  text: string;
  category: 'pet' | 'furniture';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
  color: string;
}