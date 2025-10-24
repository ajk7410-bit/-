export interface Puzzle {
  id: number;
  question: string;
  answer: string;
  type?: 'numeric' | 'alpha';
  hintText?: string;
  hintImage?: string;
}

export type GamePhase = 'WELCOME' | 'PLAY' | 'MISSION_1' | 'MISSION_2' | 'MISSION_3' | 'COMPLETED' | 'MISSION_SHADOW_FAIL' | 'MISSION_1_CONFIRM' | 'MISSION_2_CONFIRM';