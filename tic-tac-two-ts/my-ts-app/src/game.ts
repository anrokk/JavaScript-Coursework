import { GameState, ActionType, Direction } from "./constants";

export type Player = "X" | "O";
export type BoardCellValue = Player | null;
export type BoardType = BoardCellValue[][]; 
export type ActiveGridType = BoardCellValue[][]; 

export interface Position {
    x: number;
    y: number;
}

export interface PlayerPiecesCount {
    "X": number;
    "O": number;
}

export type SelectedPieceType = Position | null;

export class GameBrain {
    #board: BoardType = [];
    #gridPosition: Position = { x: 2, y: 2 }; 
    #currentPlayer: Player = "X";
    #gameState: GameState = GameState.PLAYING;
    #playerPieces: PlayerPiecesCount = { "X": 0, "O": 0 }; 
    #actionType: ActionType = ActionType.PLACE;
    #selectedPiece: SelectedPieceType = null;

    constructor(){
        this.resetGame();
    }

    resetGame(): void{
        this.#board = [];
        for (let i = 0; i < 5; i++){
            this.#board[i] = new Array(5).fill(null);
        }
        this.#gridPosition = { x: 2, y: 2 };
        this.#currentPlayer = "X";
        this.#gameState = GameState.PLAYING;
        this.#playerPieces = { "X": 0, "O": 0 };
        this.#actionType = ActionType.PLACE;
        this.#selectedPiece = null;
        this.updateAvailableActions();
    }

    makeAMove(x: number, y: number): boolean {
        if (this.#gameState !== GameState.PLAYING) {
            return false;
        }

        if (!this.isValidCellForCurrentAction(x, y)) {
            return false;
        }

        if (this.#actionType === ActionType.PLACE) {
            if (this.#playerPieces[this.#currentPlayer] < 3) {
                this.#board[x][y] = this.#currentPlayer;
                this.#playerPieces[this.#currentPlayer]++;
            } else {
                console.error("Cannot place more than 3 pieces.");
                return false;
            }
        } else if (this.#actionType === ActionType.MOVE_PIECE && this.#selectedPiece) {
            this.#board[this.#selectedPiece.x][this.#selectedPiece.y] = null;
            this.#board[x][y] = this.#currentPlayer;
            this.#selectedPiece = null;
        } else {
            return false;
        }

        this.checkGameState();

        if (this.#gameState === GameState.PLAYING) {
            this.#currentPlayer = this.#currentPlayer === "X" ? "O" : "X";
            this.updateAvailableActions();
        }

        return true;
    }

    selectPieceToMove(x: number, y: number): boolean {
        if (this.#actionType !== ActionType.MOVE_PIECE) return false;
        if (this.#board[x][y] === this.#currentPlayer){
            this.#selectedPiece = { x, y };
            return true;
        }
        return false;
    }

    moveGrid(direction: Direction): boolean {
        if (this.#gameState !== GameState.PLAYING) return false;
        if (this.#actionType !== ActionType.MOVE_GRID) return false;
        if (!this.canMoveGrid()) {
            return false;
        }

        let newX = this.#gridPosition.x;
        let newY = this.#gridPosition.y;

        switch (direction) {
            case Direction.UP:
                newY = Math.max(1, this.#gridPosition.y - 1);
                break;
            case Direction.DOWN:
                newY = Math.min(3, this.#gridPosition.y + 1);
                break;
            case Direction.LEFT:
                newX = Math.max(1, this.#gridPosition.x - 1);
                break;
            case Direction.RIGHT:
                newX = Math.min(3, this.#gridPosition.x + 1);
                break;
            case Direction.UP_LEFT:
                newX = Math.max(1, this.#gridPosition.x - 1);
                newY = Math.max(1, this.#gridPosition.y - 1);
                break;
            case Direction.UP_RIGHT:
                newX = Math.min(3, this.#gridPosition.x + 1);
                newY = Math.max(1, this.#gridPosition.y - 1);
                break;
            case Direction.DOWN_LEFT:
                newX = Math.max(1, this.#gridPosition.x - 1);
                newY = Math.min(3, this.#gridPosition.y + 1);
                break;
            case Direction.DOWN_RIGHT:
                newX = Math.min(3, this.#gridPosition.x + 1);
                newY = Math.min(3, this.#gridPosition.y + 1);
                break;
            default:
                return false; 
        }

        if (newX !== this.#gridPosition.x || newY !== this.#gridPosition.y) {
            this.#gridPosition = { x: newX, y: newY };

            const xWins = this.checkWinCondition("X");
            const oWins = this.checkWinCondition("O");

            if (xWins && oWins) {
                this.#gameState = GameState.TIE;
            } else if (xWins) {
                this.#gameState = GameState.X_WINS;
            } else if (oWins) {
                this.#gameState = GameState.O_WINS;
            }

            if (this.#gameState === GameState.PLAYING) {
                this.#currentPlayer = this.#currentPlayer === "X" ? "O" : "X";
                this.updateAvailableActions(); 
            }
            return true;
        }
        return false; 
    }

    checkWinCondition(player: Player): boolean {
        const grid = this.getActiveGrid();

        for (let i = 0; i < 3; i++) {
            if (grid[i][0] === player && grid[i][1] === player && grid[i][2] === player) {
                return true;
            }
        }

        for (let j = 0; j < 3; j++) {
            if (grid[0][j] === player && grid[1][j] === player && grid[2][j] === player) {
                return true;
            }
        }

        if (grid[0][0] === player && grid[1][1] === player && grid[2][2] === player) {
            return true;
        }
        if (grid[0][2] === player && grid[1][1] === player && grid[2][0] === player) {
            return true;
        }

        return false;
    }

    checkGameState(): void {
        if (this.#actionType === ActionType.MOVE_GRID) return;


        const xWins = this.checkWinCondition("X");
        const oWins = this.checkWinCondition("O");

        if (xWins && oWins) { 
            this.#gameState = GameState.TIE;
        } else if (xWins) {
            this.#gameState = GameState.X_WINS;
        } else if (oWins) {
            this.#gameState = GameState.O_WINS;
        }
    }

    updateAvailableActions(): void {
        if (this.#playerPieces["X"] < 3 || this.#playerPieces["O"] < 3) {
            this.#actionType = ActionType.PLACE;
        } else {
            if (this.#actionType === ActionType.PLACE){
                this.#actionType = ActionType.MOVE_PIECE;
            }
        }
        this.#selectedPiece = null;
    }

    canMoveGrid(): boolean {
        return this.#playerPieces["X"] >= 3 && this.#playerPieces["O"] >= 3;
    }

    isValidCellForCurrentAction(x: number, y: number): boolean {
        if (x < 0 || x >= 5 || y < 0 || y >= 5) return false; 

        switch (this.#actionType) {
            case ActionType.PLACE:
                return this.#playerPieces[this.#currentPlayer] < 3 &&
                       this.#board[x][y] === null &&
                       this.isCellInActiveGrid(x, y);

            case ActionType.MOVE_PIECE:
                if (this.#selectedPiece === null) {
                    return this.#board[x][y] === this.#currentPlayer;
                } else {
                    return this.#board[x][y] === null &&
                           this.isCellInActiveGrid(x, y);
                }

            case ActionType.MOVE_GRID:
                return false; 

            default:
                return false;
        }
    }

    isCellInActiveGrid(x: number, y: number): boolean {
        const gridXStart = this.#gridPosition.x - 1; 
        const gridYStart = this.#gridPosition.y - 1; 

        return x >= gridXStart && x < gridXStart + 3 &&
               y >= gridYStart && y < gridYStart + 3;
    }

    getActiveGrid(): ActiveGridType {
        const grid: ActiveGridType = [];
        const gridXStart = this.#gridPosition.x - 1;
        const gridYStart = this.#gridPosition.y - 1;

        for (let i = 0; i < 3; i++) {
            grid[i] = [];
            for (let j = 0; j < 3; j++) {
                grid[i][j] = this.#board[gridXStart + i][gridYStart + j];
            }
        }
        return grid;
    }

    setActionType(actionType: ActionType): boolean {
        if (this.#gameState !== GameState.PLAYING) return false;

        if (actionType === ActionType.MOVE_PIECE) {
            if (this.#playerPieces["X"] < 3 || this.#playerPieces["O"] < 3) {
                return false; 
            }
        } else if (actionType === ActionType.MOVE_GRID) {
            if (!this.canMoveGrid()) {
                return false; 
            }
        } else if (actionType === ActionType.PLACE) {
            if (this.#playerPieces[this.#currentPlayer] >= 3) {
                return false;
            }
        }

        this.#actionType = actionType;
        this.#selectedPiece = null;
        return true;
    }

    // Getters
    get board(): Readonly<BoardType> {
        return this.#board.map(row => [...row]);
    }

    get gridPosition(): Readonly<Position> {
        return { ...this.#gridPosition }; 
    }

    get currentPlayer(): Player {
        return this.#currentPlayer;
    }

    get gameState(): GameState {
        return this.#gameState;
    }

    get actionType(): ActionType {
        return this.#actionType;
    }

    get selectedPiece(): Readonly<SelectedPieceType> {
        return this.#selectedPiece ? { ...this.#selectedPiece } : null; 
    }

    get playerPieces(): Readonly<PlayerPiecesCount> {
        return { ...this.#playerPieces }; 
    }

}
