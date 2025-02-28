import { GameState, Direction, ActionType } from "./constants.js";


export class GameBrain {

    #board = [];
    #gridPosition = { x: 2, y: 2};
    #currentPlayer = "X";
    #gameState = GameState.PLAYING;
    #playerPieces = { "X": 0, "O": 0 };
    #actionType = ActionType.PLACE;
    #selectedPiece = null;

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.#board = [];
        for (let i = 0; i < 5; i++) {
            this.#board[i] = new Array(5).fill(null);
        }

        this.#gridPosition = { x: 2, y: 2 };
        this.#currentPlayer = "X";
        this.#gameState = GameState.PLAYING;
        this.#playerPieces = { "X": 0, "O": 0 };
        this.#actionType = ActionType.PLACE;
        this.#selectedPiece = null;
    }

    makeAMove(x, y) {
        if (this.#gameState !== GameState.PLAYING) {
            return false;
        }

        if (!this.isValidCellForCurrentAction(x, y)) {
            return false;
        }

        if (this.#actionType === ActionType.PLACE) {
            this.#board[x][y] = this.#currentPlayer;
            this.#playerPieces[this.#currentPlayer]++;
        } else if (this.#actionType === ActionType.MOVE_PIECE && this.#selectedPiece) {
            this.#board[this.#selectedPiece.x][this.#selectedPiece.y] = null;
            this.#board[x][y] = this.#currentPlayer;
            this.#selectedPiece = null;
        }

        this.checkGameState();

        if (this.#gameState === GameState.PLAYING) {
            this.#currentPlayer = this.#currentPlayer === "X" ? "O" : "X";

            this.updateAvailableActions();
        }

        return true;
    }

    selectPieceToMove(x, y) {
        if (this.#board[x][y] === this.#currentPlayer) {
            this.#selectedPiece = { x, y };
            return true;
        }
        return false;
    }

    moveGrid(direction) {
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

    checkWinCondition(player) {
        const grid = this.getActiveGrid();

        for (let i = 0; i < 3; i++) {
            if (grid[i][0] === player && grid [i][1] === player && grid[i][2] === player) {
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


    checkGameState() {
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

    updateAvailableActions() {
        if (this.#playerPieces["X"] < 3 || this.#playerPieces["O"] < 3) {
            this.#actionType = ActionType.PLACE;
        } else {
            this.#actionType = ActionType.MOVE_PIECE;
        }
    }

    canMoveGrid() {
        return this.#playerPieces["X"] >= 3 && this.#playerPieces["O"] >= 3;
    }

    isValidCellForCurrentAction(x, y) {
        if (this.#playerPieces["X"] < 3 || this.#playerPieces["O"] < 3) {
            return this.#board[x][y] === null && this.isCellInActiveGrid(x, y);
        }
        
        if (this.#actionType === ActionType.PLACE) {
            return this.#board[x][y] === null && this.isCellInActiveGrid(x, y);
        }
        
        if (this.#actionType === ActionType.MOVE_PIECE && this.#selectedPiece === null) {
            return this.#board[x][y] === this.#currentPlayer;
        }
        
        if (this.#actionType === ActionType.MOVE_PIECE && this.#selectedPiece !== null) {
            return this.#board[x][y] === null && this.isCellInActiveGrid(x, y);
        }
        
        return false;
    }

    isCellInActiveGrid(x, y) {
        const gridXStart = this.#gridPosition.x - 1;
        const gridYStart = this.#gridPosition.y - 1;
        return x >= gridXStart && x < gridXStart + 3 && y >= gridYStart && y < gridYStart + 3;
    }

    getActiveGrid() {
        const grid = [];
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

    setActionType(actionType) {
        if (actionType === ActionType.MOVE_PIECE && (this.#playerPieces["X"] < 3 || this.#playerPieces["O"] < 3)) {
            return false;
        }
        
        if (actionType === ActionType.MOVE_GRID && !this.canMoveGrid()) {
            return false;
        }

        this.#actionType = actionType;
        this.#selectedPiece = null;
        return true;
    }

    get board() {
        return this.#board;
    }
    
    get gridPosition() {
        return this.#gridPosition;
    }
    
    get currentPlayer() {
        return this.#currentPlayer;
    }
    
    get gameState() {
        return this.#gameState;
    }
    
    get actionType() {
        return this.#actionType;
    }
    
    get selectedPiece() {
        return this.#selectedPiece;
    }

    get playerPieces() {
        return { ...this.#playerPieces };
    }
}