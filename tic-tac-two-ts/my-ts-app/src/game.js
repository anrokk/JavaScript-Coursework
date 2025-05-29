var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GameBrain_board, _GameBrain_gridPosition, _GameBrain_currentPlayer, _GameBrain_gameState, _GameBrain_playerPieces, _GameBrain_actionType, _GameBrain_selectedPiece;
import { GameState, ActionType, Direction } from "./constants";
export class GameBrain {
    constructor() {
        _GameBrain_board.set(this, []);
        _GameBrain_gridPosition.set(this, { x: 2, y: 2 });
        _GameBrain_currentPlayer.set(this, "X");
        _GameBrain_gameState.set(this, GameState.PLAYING);
        _GameBrain_playerPieces.set(this, { "X": 0, "O": 0 });
        _GameBrain_actionType.set(this, ActionType.PLACE);
        _GameBrain_selectedPiece.set(this, null);
        this.resetGame();
    }
    resetGame() {
        __classPrivateFieldSet(this, _GameBrain_board, [], "f");
        for (let i = 0; i < 5; i++) {
            __classPrivateFieldGet(this, _GameBrain_board, "f")[i] = new Array(5).fill(null);
        }
        __classPrivateFieldSet(this, _GameBrain_gridPosition, { x: 2, y: 2 }, "f");
        __classPrivateFieldSet(this, _GameBrain_currentPlayer, "X", "f");
        __classPrivateFieldSet(this, _GameBrain_gameState, GameState.PLAYING, "f");
        __classPrivateFieldSet(this, _GameBrain_playerPieces, { "X": 0, "O": 0 }, "f");
        __classPrivateFieldSet(this, _GameBrain_actionType, ActionType.PLACE, "f");
        __classPrivateFieldSet(this, _GameBrain_selectedPiece, null, "f");
        this.updateAvailableActions();
    }
    makeAMove(x, y) {
        if (__classPrivateFieldGet(this, _GameBrain_gameState, "f") !== GameState.PLAYING) {
            return false;
        }
        if (!this.isValidCellForCurrentAction(x, y)) {
            return false;
        }
        if (__classPrivateFieldGet(this, _GameBrain_actionType, "f") === ActionType.PLACE) {
            if (__classPrivateFieldGet(this, _GameBrain_playerPieces, "f")[__classPrivateFieldGet(this, _GameBrain_currentPlayer, "f")] < 3) {
                __classPrivateFieldGet(this, _GameBrain_board, "f")[x][y] = __classPrivateFieldGet(this, _GameBrain_currentPlayer, "f");
                __classPrivateFieldGet(this, _GameBrain_playerPieces, "f")[__classPrivateFieldGet(this, _GameBrain_currentPlayer, "f")]++;
            }
            else {
                console.error("Cannot place more than 3 pieces.");
                return false;
            }
        }
        else if (__classPrivateFieldGet(this, _GameBrain_actionType, "f") === ActionType.MOVE_PIECE && __classPrivateFieldGet(this, _GameBrain_selectedPiece, "f")) {
            __classPrivateFieldGet(this, _GameBrain_board, "f")[__classPrivateFieldGet(this, _GameBrain_selectedPiece, "f").x][__classPrivateFieldGet(this, _GameBrain_selectedPiece, "f").y] = null;
            __classPrivateFieldGet(this, _GameBrain_board, "f")[x][y] = __classPrivateFieldGet(this, _GameBrain_currentPlayer, "f");
            __classPrivateFieldSet(this, _GameBrain_selectedPiece, null, "f");
        }
        else {
            return false;
        }
        this.checkGameState();
        if (__classPrivateFieldGet(this, _GameBrain_gameState, "f") === GameState.PLAYING) {
            __classPrivateFieldSet(this, _GameBrain_currentPlayer, __classPrivateFieldGet(this, _GameBrain_currentPlayer, "f") === "X" ? "O" : "X", "f");
            this.updateAvailableActions();
        }
        return true;
    }
    selectPieceToMove(x, y) {
        if (__classPrivateFieldGet(this, _GameBrain_actionType, "f") !== ActionType.MOVE_PIECE)
            return false;
        if (__classPrivateFieldGet(this, _GameBrain_board, "f")[x][y] === __classPrivateFieldGet(this, _GameBrain_currentPlayer, "f")) {
            __classPrivateFieldSet(this, _GameBrain_selectedPiece, { x, y }, "f");
            return true;
        }
        return false;
    }
    moveGrid(direction) {
        if (__classPrivateFieldGet(this, _GameBrain_gameState, "f") !== GameState.PLAYING)
            return false;
        if (__classPrivateFieldGet(this, _GameBrain_actionType, "f") !== ActionType.MOVE_GRID)
            return false;
        if (!this.canMoveGrid()) {
            return false;
        }
        let currentVisualRow = __classPrivateFieldGet(this, _GameBrain_gridPosition, "f").x;
        let currentVisualCol = __classPrivateFieldGet(this, _GameBrain_gridPosition, "f").y;
        let newVisualRow = currentVisualRow;
        let newVisualCol = currentVisualCol;
        switch (direction) {
            case Direction.UP:
                newVisualRow = Math.max(1, currentVisualRow - 1);
                break;
            case Direction.DOWN:
                newVisualRow = Math.min(3, currentVisualRow + 1);
                break;
            case Direction.LEFT:
                newVisualCol = Math.max(1, currentVisualCol - 1);
                break;
            case Direction.RIGHT:
                newVisualCol = Math.min(3, currentVisualCol + 1);
                break;
            case Direction.UP_LEFT:
                newVisualRow = Math.max(1, currentVisualRow - 1);
                newVisualCol = Math.max(1, currentVisualCol - 1);
                break;
            case Direction.UP_RIGHT:
                newVisualRow = Math.max(1, currentVisualRow - 1);
                newVisualCol = Math.min(3, currentVisualCol + 1);
                break;
            case Direction.DOWN_LEFT:
                newVisualRow = Math.min(3, currentVisualRow + 1);
                newVisualCol = Math.max(1, currentVisualCol - 1);
                break;
            case Direction.DOWN_RIGHT:
                newVisualRow = Math.min(3, currentVisualRow + 1);
                newVisualCol = Math.min(3, currentVisualCol + 1);
                break;
            default:
                return false;
        }
        if (newVisualRow !== currentVisualRow || newVisualCol !== currentVisualCol) {
            __classPrivateFieldSet(this, _GameBrain_gridPosition, { x: newVisualRow, y: newVisualCol }, "f");
            const xWins = this.checkWinCondition("X");
            const oWins = this.checkWinCondition("O");
            if (xWins && oWins) {
                __classPrivateFieldSet(this, _GameBrain_gameState, GameState.TIE, "f");
            }
            else if (xWins) {
                __classPrivateFieldSet(this, _GameBrain_gameState, GameState.X_WINS, "f");
            }
            else if (oWins) {
                __classPrivateFieldSet(this, _GameBrain_gameState, GameState.O_WINS, "f");
            }
            if (__classPrivateFieldGet(this, _GameBrain_gameState, "f") === GameState.PLAYING) {
                __classPrivateFieldSet(this, _GameBrain_currentPlayer, __classPrivateFieldGet(this, _GameBrain_currentPlayer, "f") === "X" ? "O" : "X", "f");
                this.updateAvailableActions();
            }
            return true;
        }
        return false;
    }
    checkWinCondition(player) {
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
    checkGameState() {
        if (__classPrivateFieldGet(this, _GameBrain_actionType, "f") === ActionType.MOVE_GRID)
            return;
        const xWins = this.checkWinCondition("X");
        const oWins = this.checkWinCondition("O");
        if (xWins && oWins) {
            __classPrivateFieldSet(this, _GameBrain_gameState, GameState.TIE, "f");
        }
        else if (xWins) {
            __classPrivateFieldSet(this, _GameBrain_gameState, GameState.X_WINS, "f");
        }
        else if (oWins) {
            __classPrivateFieldSet(this, _GameBrain_gameState, GameState.O_WINS, "f");
        }
    }
    updateAvailableActions() {
        if (__classPrivateFieldGet(this, _GameBrain_playerPieces, "f")["X"] < 3 || __classPrivateFieldGet(this, _GameBrain_playerPieces, "f")["O"] < 3) {
            __classPrivateFieldSet(this, _GameBrain_actionType, ActionType.PLACE, "f");
        }
        else {
            if (__classPrivateFieldGet(this, _GameBrain_actionType, "f") === ActionType.PLACE) {
                __classPrivateFieldSet(this, _GameBrain_actionType, ActionType.MOVE_PIECE, "f");
            }
        }
        __classPrivateFieldSet(this, _GameBrain_selectedPiece, null, "f");
    }
    canMoveGrid() {
        return __classPrivateFieldGet(this, _GameBrain_playerPieces, "f")["X"] >= 3 && __classPrivateFieldGet(this, _GameBrain_playerPieces, "f")["O"] >= 3;
    }
    isValidCellForCurrentAction(x, y) {
        if (x < 0 || x >= 5 || y < 0 || y >= 5)
            return false;
        switch (__classPrivateFieldGet(this, _GameBrain_actionType, "f")) {
            case ActionType.PLACE:
                return __classPrivateFieldGet(this, _GameBrain_playerPieces, "f")[__classPrivateFieldGet(this, _GameBrain_currentPlayer, "f")] < 3 &&
                    __classPrivateFieldGet(this, _GameBrain_board, "f")[x][y] === null &&
                    this.isCellInActiveGrid(x, y);
            case ActionType.MOVE_PIECE:
                if (__classPrivateFieldGet(this, _GameBrain_selectedPiece, "f") === null) {
                    return __classPrivateFieldGet(this, _GameBrain_board, "f")[x][y] === __classPrivateFieldGet(this, _GameBrain_currentPlayer, "f");
                }
                else {
                    return __classPrivateFieldGet(this, _GameBrain_board, "f")[x][y] === null &&
                        this.isCellInActiveGrid(x, y);
                }
            case ActionType.MOVE_GRID:
                return false;
            default:
                return false;
        }
    }
    isCellInActiveGrid(x, y) {
        const gridXStart = __classPrivateFieldGet(this, _GameBrain_gridPosition, "f").x - 1;
        const gridYStart = __classPrivateFieldGet(this, _GameBrain_gridPosition, "f").y - 1;
        return x >= gridXStart && x < gridXStart + 3 &&
            y >= gridYStart && y < gridYStart + 3;
    }
    getActiveGrid() {
        const grid = [];
        const gridXStart = __classPrivateFieldGet(this, _GameBrain_gridPosition, "f").x - 1;
        const gridYStart = __classPrivateFieldGet(this, _GameBrain_gridPosition, "f").y - 1;
        for (let i = 0; i < 3; i++) {
            grid[i] = [];
            for (let j = 0; j < 3; j++) {
                grid[i][j] = __classPrivateFieldGet(this, _GameBrain_board, "f")[gridXStart + i][gridYStart + j];
            }
        }
        return grid;
    }
    setActionType(actionType) {
        if (__classPrivateFieldGet(this, _GameBrain_gameState, "f") !== GameState.PLAYING)
            return false;
        if (actionType === ActionType.MOVE_PIECE) {
            if (__classPrivateFieldGet(this, _GameBrain_playerPieces, "f")["X"] < 3 || __classPrivateFieldGet(this, _GameBrain_playerPieces, "f")["O"] < 3) {
                return false;
            }
        }
        else if (actionType === ActionType.MOVE_GRID) {
            if (!this.canMoveGrid()) {
                return false;
            }
        }
        else if (actionType === ActionType.PLACE) {
            if (__classPrivateFieldGet(this, _GameBrain_playerPieces, "f")[__classPrivateFieldGet(this, _GameBrain_currentPlayer, "f")] >= 3) {
                return false;
            }
        }
        __classPrivateFieldSet(this, _GameBrain_actionType, actionType, "f");
        __classPrivateFieldSet(this, _GameBrain_selectedPiece, null, "f");
        return true;
    }
    get board() {
        return __classPrivateFieldGet(this, _GameBrain_board, "f").map(row => [...row]);
    }
    get gridPosition() {
        return Object.assign({}, __classPrivateFieldGet(this, _GameBrain_gridPosition, "f"));
    }
    get currentPlayer() {
        return __classPrivateFieldGet(this, _GameBrain_currentPlayer, "f");
    }
    get gameState() {
        return __classPrivateFieldGet(this, _GameBrain_gameState, "f");
    }
    get actionType() {
        return __classPrivateFieldGet(this, _GameBrain_actionType, "f");
    }
    get selectedPiece() {
        return __classPrivateFieldGet(this, _GameBrain_selectedPiece, "f") ? Object.assign({}, __classPrivateFieldGet(this, _GameBrain_selectedPiece, "f")) : null;
    }
    get playerPieces() {
        return Object.assign({}, __classPrivateFieldGet(this, _GameBrain_playerPieces, "f"));
    }
}
_GameBrain_board = new WeakMap(), _GameBrain_gridPosition = new WeakMap(), _GameBrain_currentPlayer = new WeakMap(), _GameBrain_gameState = new WeakMap(), _GameBrain_playerPieces = new WeakMap(), _GameBrain_actionType = new WeakMap(), _GameBrain_selectedPiece = new WeakMap();
//# sourceMappingURL=game.js.map