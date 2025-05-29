import { defineStore } from 'pinia';
import { GameState, ActionType, Direction, } from '@/constants'; 
import type { GameStoreState, BoardType, Position, SelectedPieceType, ActiveGridType, BoardCellValue, Player } from '@/types';

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

        gameStatusMessage(state): string {
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
            this._updateAvailableActions();
        },

        setActionType(newActionType: ActionType) {
            if (this.gameState !== GameState.PLAYING) return false;
            if (newActionType === ActionType.MOVE_PIECE && (this.playerPieces.X < 3 || this.playerPieces.O < 3)) {
                return false;
            }
            if (newActionType === ActionType.MOVE_GRID && !this.canMoveGrid) {
                return false;
            }
            if (newActionType === ActionType.PLACE && this.playerPieces[this.currentPlayer] >= 3) {
                return false;
            }
            this.actionType = newActionType;
            this.selectedPiece = null;
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
        },

        _updateAvailableActions() {
            if (this.playerPieces.X < 3 || this.playerPieces.O < 3) {
                if (this.playerPieces[this.currentPlayer] < 3){
                    this.actionType = ActionType.PLACE;
                } else {
                    this.actionType = ActionType.PLACE;
                }
            } else {
                if (this.actionType === ActionType.PLACE){
                    this.actionType = ActionType.MOVE_PIECE;
                }
            }
            this.selectedPiece = null;
        },

        _checkWinCondition(player: Player): boolean {
            const grid = this.activeGrid; 
            for (let i = 0; i < 3; i++) {
                if (grid[i][0] === player && grid[i][1] === player && grid[i][2] === player) return true;
            }
            for (let j = 0; j < 3; j++) {
                if (grid[0][j] === player && grid[1][j] === player && grid[2][j] === player) return true;
            }
            if (grid[0][0] === player && grid[1][1] === player && grid[2][2] === player) return true;
            if (grid[0][2] === player && grid[1][1] === player && grid[2][0] === player) return true;
            return false;
        },

        _updateGameStateAfterMove() {
            const xWins = this._checkWinCondition('X');
            const oWins = this._checkWinCondition('O');

            if (xWins) this.gameState = GameState.X_WINS;
            else if (oWins) this.gameState = GameState.O_WINS;

            if (this.gameState === GameState.PLAYING) {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this._updateAvailableActions();
            } else {
                this.stopTimer(); 
            }
        },

        isValidCellForCurrentAction(rowIndex: number, colIndex: number): boolean {
            if (rowIndex < 0 || rowIndex >= 5 || colIndex < 0 || colIndex >= 5) return false;

            switch (this.actionType) {
                case ActionType.PLACE:
                    return this.playerPieces[this.currentPlayer] < 3 &&
                           this.board[rowIndex][colIndex] === null &&
                           this.isCellInActiveGrid(rowIndex, colIndex);
                case ActionType.MOVE_PIECE:
                    if (this.selectedPiece === null) { 
                        return this.board[rowIndex][colIndex] === this.currentPlayer;
                    } else { 
                        return this.board[rowIndex][colIndex] === null &&
                               this.isCellInActiveGrid(rowIndex, colIndex);
                    }
                case ActionType.MOVE_GRID:
                    return false; 
                default:
                    return false;
            }
        },

        makeAMove(rowIndex: number, colIndex: number) {
            if (this.gameState !== GameState.PLAYING) return;
            
            const newBoard = this.board.map(r => [...r]); 

            if (this.actionType === ActionType.PLACE) {
                if (!(this.playerPieces[this.currentPlayer] < 3 && newBoard[rowIndex][colIndex] === null && this.isCellInActiveGrid(rowIndex, colIndex))) {
                    console.warn("Store: Invalid placement condition in makeAMove."); return;
                }
                newBoard[rowIndex][colIndex] = this.currentPlayer;
                this.playerPieces[this.currentPlayer]++;
            } else if (this.actionType === ActionType.MOVE_PIECE && this.selectedPiece) {
                 if (!(newBoard[rowIndex][colIndex] === null && this.isCellInActiveGrid(rowIndex, colIndex))) {
                    console.warn("Store: Invalid move destination in makeAMove."); return;
                 }
                newBoard[this.selectedPiece.y][this.selectedPiece.x] = null; 
                newBoard[rowIndex][colIndex] = this.currentPlayer; 
                this.selectedPiece = null; 
            } else {
                console.warn("Store: makeAMove called in an invalid state/actionType or without selectedPiece.");
                return; 
            }
            
            this.board = newBoard; 
            this._updateGameStateAfterMove();
        },

        selectPieceToMove(rowIndex: number, colIndex: number) {
            if (this.gameState !== GameState.PLAYING || this.actionType !== ActionType.MOVE_PIECE) {
                console.warn("Store: Cannot select piece - not in correct state or action type.");
                return;
            }

            if (this.board[rowIndex][colIndex] === this.currentPlayer) {
                this.selectedPiece = { x: colIndex, y: rowIndex };
            } else {
                this.selectedPiece = null; 
                console.warn("Store: Invalid piece to select.");
            }
        },
    }
});