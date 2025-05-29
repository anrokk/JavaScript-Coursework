import type { GameState, ActionType } from "./constants";

export type Player = "X" | "O";
export type BoardCellValue = Player | null;
export type BoardType = BoardCellValue[][];
export type ActiveGridType = BoardCellValue[][];

export interface Position {
    x: number,
    y: number
}

export interface PlayerPiecesCount {
    "X": number,
    "O": number
}

export type SelectedPieceType = Position | null;

export interface GameStoreState {
    board: BoardType;
    gridPosition: Position;
    currentPlayer: Player;
    gameState: GameState;
    playerPieces: PlayerPiecesCount;
    actionType: ActionType;
    selectedPiece: SelectedPieceType;
    elapsedTime: number;
}