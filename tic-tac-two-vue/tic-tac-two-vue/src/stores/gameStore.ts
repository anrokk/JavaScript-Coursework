import { defineStore } from 'pinia';
import { GameState, ActionType, Direction } from '@/constants'; 
import type { GameStoreState, BoardType, Position, SelectedPieceType, ActiveGridType, BoardCellValue } from '@/types';

function createInitialBoard(): BoardType {
const board: BoardType = [];
for (let i = 0; i < 5; i++) {
    board[i] = new Array(5).fill(null);
}
return board;
}


let timerIntervalId: number | null = null;

export const useGameStore = defineStore('game', {
    state: (): GameStoreState => ({
        board: createInitialBoard(),
        gridPosition: { x: 2, y: 2},
        currentPlayer: 'X',
        gameState: GameState.PLAYING,
        playerPieces: { X: 0, O: 0 },
        actionType: ActionType.PLACE,
        selectedPiece: null,
        elapsedTime: 0
    }),

    getters: {
        activeGrid(state): ActiveGridType {
            const grid: ActiveGridType = [];
            const startCol = state.gridPosition.x - 1;
            const startRow = state.gridPosition.y - 1;
            for (let i = 0; i < 3; i++) {
                grid[i] = [];
                for (let j = 0; j < 3; j++) {
                    const boardRow = startRow + i;
                    const boardCol = startCol + j;
                    if (boardRow >= 0 && boardRow < 5 && boardCol >= 0 && boardCol < 5) {
                        grid[i][j] = state.board[boardRow][boardCol];
                    } else {
                        grid[i][j] = null; 
                    }
                }
            }
            return grid;
        },

        isCellInActiveGrid(state): (cellRow: number, cellCol: number) => boolean {
            return (cellRow: number, cellCol: number): boolean => {
                const startCol = state.gridPosition.x - 1;
                const startRow = state.gridPosition.y - 1;

                return cellRow >= startRow && cellRow < startRow + 3 && cellCol >= startCol && cellCol < startCol + 3;
            }
        },

        canMoveGrid(state): boolean {
            return state.playerPieces.X >= 3 && state.playerPieces.O >= 3;
        },

        gameStatusManager(state): string {
            switch (state.gameState) {
                case GameState.PLAYING:
                    return `Player ${state.currentPlayer}'s turn`;
                case GameState.X_WINS:
                    return 'Player X wins!';
                case GameState.O_WINS:
                    return 'Player O wins!';
                case GameState.TIE:
                    return 'Game ended in a tie!';
                case GameState.GAME_OVER:
                    return 'Game over!';
                case GameState.MENU:
                    return 'Select game mode';
                default:
                    return '';
            }
        },

        formattedElapsedTime(state): string {
            const minutes = Math.floor(state.elapsedTime / 60);
            const seconds = state.elapsedTime % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    },

    actions: {

        initializeGame() {
            this.resetGame();
            this.gameState = GameState.PLAYING;
            this.startTimer();
        },

        resetGame() {
            this.board = createInitialBoard();
            this.gridPosition = { x: 2, y: 2 };
            this.currentPlayer = 'X';
            this.gameState = GameState.MENU;
            this.playerPieces = { X: 0, O: 0 };
            this.actionType = ActionType.PLACE;
            this.selectedPiece = null;
            this.stopTimer();
            this.elapsedTime = 0;
        },

        setActionType(newActionType: ActionType) {
            if (this.gameState !== GameState.PLAYING) return false;
            if (newActionType === ActionType.MOVE_PIECE && (this.playerPieces.X < 3 || this.playerPieces.O < 3)) return false;
            if (newActionType === ActionType.MOVE_GRID && !this.canMoveGrid) return false;
            if (newActionType === ActionType.PLACE && this.playerPieces[this.currentPlayer] >= 3) return false;

            this.actionType = newActionType;
            this.selectedPiece = null; // selected piece is null, when changing action type
            return true;
        },

        startTimer() {
            this.stopTimer();
            this.elapsedTime = 0;
            timerIntervalId = window.setInterval(() => {
                this.elapsedTime++;
            }, 1000);
        },

        stopTimer() {
            if (timerIntervalId !== null) {
                clearInterval(timerIntervalId);
                timerIntervalId = null;
            }
        }
    }
});