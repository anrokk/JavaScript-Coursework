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
var _AIPlayer_instances, _AIPlayer_gameBrain, _AIPlayer_difficultyLevel, _AIPlayer_aiPlayerSymbol, _AIPlayer_opponentPlayerSymbol, _AIPlayer_fallbackToGridMoveOrRandomPlacement, _AIPlayer_fallbackToPieceMoveOrRandomPlacement, _AIPlayer_makePlacementMove, _AIPlayer_makeMovePieceAction, _AIPlayer_makeGridMoveAction, _AIPlayer_getAvailableMoves, _AIPlayer_checkWinOnBoard, _AIPlayer_findWinningMove, _AIPlayer_findWinningMoveFromPiece, _AIPlayer_getActiveCenterPosition, _AIPlayer_makeRandomMove, _AIPlayer_shuffleArray;
import { ActionType, Direction, GameState } from "./constants";
export class AIPlayer {
    constructor(gameBrain, difficultyLevel = 1) {
        _AIPlayer_instances.add(this);
        _AIPlayer_gameBrain.set(this, void 0);
        _AIPlayer_difficultyLevel.set(this, void 0);
        _AIPlayer_aiPlayerSymbol.set(this, "O");
        _AIPlayer_opponentPlayerSymbol.set(this, "X");
        __classPrivateFieldSet(this, _AIPlayer_gameBrain, gameBrain, "f");
        __classPrivateFieldSet(this, _AIPlayer_difficultyLevel, difficultyLevel, "f");
    }
    makeMove() {
        if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").gameState !== GameState.PLAYING || __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").currentPlayer !== __classPrivateFieldGet(this, _AIPlayer_aiPlayerSymbol, "f")) {
            return;
        }
        const gamePieces = __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").playerPieces;
        if (gamePieces[__classPrivateFieldGet(this, _AIPlayer_aiPlayerSymbol, "f")] < 3 || gamePieces[__classPrivateFieldGet(this, _AIPlayer_opponentPlayerSymbol, "f")] < 3) {
            if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.PLACE)) {
                __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makePlacementMove).call(this);
            }
        }
        else {
            const decision = Math.random();
            if (decision < 0.7) {
                if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_PIECE)) {
                    __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeMovePieceAction).call(this);
                }
                else {
                    __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_fallbackToGridMoveOrRandomPlacement).call(this);
                }
            }
            else {
                if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_GRID)) {
                    __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeGridMoveAction).call(this);
                }
                else {
                    __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_fallbackToPieceMoveOrRandomPlacement).call(this);
                }
            }
        }
    }
}
_AIPlayer_gameBrain = new WeakMap(), _AIPlayer_difficultyLevel = new WeakMap(), _AIPlayer_aiPlayerSymbol = new WeakMap(), _AIPlayer_opponentPlayerSymbol = new WeakMap(), _AIPlayer_instances = new WeakSet(), _AIPlayer_fallbackToGridMoveOrRandomPlacement = function _AIPlayer_fallbackToGridMoveOrRandomPlacement() {
    if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_GRID)) {
        __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeGridMoveAction).call(this);
    }
    else if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").playerPieces[__classPrivateFieldGet(this, _AIPlayer_aiPlayerSymbol, "f")] < 3 && __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.PLACE)) {
        __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makePlacementMove).call(this);
    }
    else {
        console.warn("AI: Fallback to grid move or placement failed.");
    }
}, _AIPlayer_fallbackToPieceMoveOrRandomPlacement = function _AIPlayer_fallbackToPieceMoveOrRandomPlacement() {
    if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_PIECE)) {
        __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeMovePieceAction).call(this);
    }
    else if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").playerPieces[__classPrivateFieldGet(this, _AIPlayer_aiPlayerSymbol, "f")] < 3 && __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.PLACE)) {
        __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makePlacementMove).call(this);
    }
    else {
        console.warn("AI: Fallback to piece move or placement failed.");
    }
}, _AIPlayer_makePlacementMove = function _AIPlayer_makePlacementMove() {
    const moves = __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_getAvailableMoves).call(this);
    if (moves.length === 0) {
        console.warn("AI: No placement moves available.");
        return;
    }
    if (__classPrivateFieldGet(this, _AIPlayer_difficultyLevel, "f") === 0) {
        __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeRandomMove).call(this, moves);
        return;
    }
    const winningMove = __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_findWinningMove).call(this, moves, __classPrivateFieldGet(this, _AIPlayer_aiPlayerSymbol, "f"));
    if (winningMove) {
        __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").makeAMove(winningMove.x, winningMove.y);
        return;
    }
    const blockingMove = __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_findWinningMove).call(this, moves, __classPrivateFieldGet(this, _AIPlayer_opponentPlayerSymbol, "f"));
    if (blockingMove) {
        __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").makeAMove(blockingMove.x, blockingMove.y);
        return;
    }
    const center = __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_getActiveCenterPosition).call(this);
    const centerCellOf5x5 = { x: 2, y: 2 };
    const activeCenterMove = moves.find(move => move.x === center.x && move.y === center.y);
    if (activeCenterMove) {
        __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").makeAMove(activeCenterMove.x, activeCenterMove.y);
        return;
    }
    if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").isCellInActiveGrid(centerCellOf5x5.x, centerCellOf5x5.y)) {
        const boardCenterMove = moves.find(move => move.x === centerCellOf5x5.x && move.y === centerCellOf5x5.y);
        if (boardCenterMove) {
            __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").makeAMove(boardCenterMove.x, boardCenterMove.y);
            return;
        }
    }
    __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeRandomMove).call(this, moves);
}, _AIPlayer_makeMovePieceAction = function _AIPlayer_makeMovePieceAction() {
    const aiPieces = [];
    const board = __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").board.map(row => [...row]);
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === __classPrivateFieldGet(this, _AIPlayer_aiPlayerSymbol, "f")) {
                aiPieces.push({ x: r, y: c });
            }
        }
    }
    if (aiPieces.length === 0) {
        if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_GRID)) {
            __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeGridMoveAction).call(this);
        }
        return;
    }
    __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_shuffleArray).call(this, aiPieces);
    for (const piece of aiPieces) {
        if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").selectPieceToMove(piece.x, piece.y)) {
            const availableDestinations = __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_getAvailableMoves).call(this);
            if (availableDestinations.length === 0) {
                __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").actionType);
                continue;
            }
            const winningMove = __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_findWinningMoveFromPiece).call(this, piece, availableDestinations, __classPrivateFieldGet(this, _AIPlayer_aiPlayerSymbol, "f"));
            if (winningMove) {
                __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").makeAMove(winningMove.x, winningMove.y);
                return;
            }
            const blockingMove = __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_findWinningMoveFromPiece).call(this, piece, availableDestinations, __classPrivateFieldGet(this, _AIPlayer_opponentPlayerSymbol, "f"));
            if (blockingMove) {
                __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").makeAMove(blockingMove.x, blockingMove.y);
                return;
            }
            __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeRandomMove).call(this, availableDestinations);
            return;
        }
    }
    console.warn("AI: No piece could make a move. Fallback to grid move.");
    if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_GRID)) {
        __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeGridMoveAction).call(this);
    }
}, _AIPlayer_makeGridMoveAction = function _AIPlayer_makeGridMoveAction() {
    if (!__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").canMoveGrid()) {
        if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_PIECE)) {
            __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeMovePieceAction).call(this);
        }
        return;
    }
    const directions = Object.values(Direction);
    __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_shuffleArray).call(this, directions);
    for (const direction of directions) {
        if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").moveGrid(direction)) {
            return;
        }
    }
    console.warn("AI: No effective grid move found. Fallback to piece move.");
    if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").setActionType(ActionType.MOVE_PIECE)) {
        __classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_makeMovePieceAction).call(this);
    }
}, _AIPlayer_getAvailableMoves = function _AIPlayer_getAvailableMoves() {
    const moves = [];
    const boardSize = 5;
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (__classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").isValidCellForCurrentAction(r, c)) {
                moves.push({ x: r, y: c });
            }
        }
    }
    return moves;
}, _AIPlayer_checkWinOnBoard = function _AIPlayer_checkWinOnBoard(board, player, gridPos) {
    const activeGrid = [];
    const gridXStart = gridPos.x - 1;
    const gridYStart = gridPos.y - 1;
    for (let r = 0; r < 3; r++) {
        activeGrid[r] = [];
        for (let c = 0; c < 3; c++) {
            const boardR = gridXStart + r;
            const boardC = gridYStart + c;
            if (boardR >= 0 && boardR < board.length && boardC >= 0 && boardC < board[boardR].length) {
                activeGrid[r][c] = board[boardR][boardC];
            }
            else {
                activeGrid[r][c] = null;
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        if (activeGrid[i][0] === player && activeGrid[i][1] === player && activeGrid[i][2] === player)
            return true;
    }
    for (let j = 0; j < 3; j++) {
        if (activeGrid[0][j] === player && activeGrid[1][j] === player && activeGrid[2][j] === player)
            return true;
    }
    if (activeGrid[0][0] === player && activeGrid[1][1] === player && activeGrid[2][2] === player)
        return true;
    if (activeGrid[0][2] === player && activeGrid[1][1] === player && activeGrid[2][0] === player)
        return true;
    return false;
}, _AIPlayer_findWinningMove = function _AIPlayer_findWinningMove(availableMoves, playerToTest) {
    for (const move of availableMoves) {
        const tempBoard = __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").board.map(row => [...row]);
        if (tempBoard[move.x][move.y] === null) {
            tempBoard[move.x][move.y] = playerToTest;
            if (__classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_checkWinOnBoard).call(this, tempBoard, playerToTest, __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").gridPosition)) {
                return move;
            }
        }
    }
    return null;
}, _AIPlayer_findWinningMoveFromPiece = function _AIPlayer_findWinningMoveFromPiece(pieceToMove, availableDestinations, playerToTest) {
    for (const destination of availableDestinations) {
        const tempBoard = __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").board.map(row => [...row]);
        if (tempBoard[destination.x][destination.y] === null) {
            tempBoard[pieceToMove.x][pieceToMove.y] = null;
            tempBoard[destination.x][destination.y] = playerToTest;
            if (__classPrivateFieldGet(this, _AIPlayer_instances, "m", _AIPlayer_checkWinOnBoard).call(this, tempBoard, playerToTest, __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").gridPosition)) {
                return destination;
            }
        }
    }
    return null;
}, _AIPlayer_getActiveCenterPosition = function _AIPlayer_getActiveCenterPosition() {
    return __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").gridPosition;
}, _AIPlayer_makeRandomMove = function _AIPlayer_makeRandomMove(moves) {
    if (moves.length > 0) {
        const randomIndex = Math.floor(Math.random() * moves.length);
        const move = moves[randomIndex];
        __classPrivateFieldGet(this, _AIPlayer_gameBrain, "f").makeAMove(move.x, move.y);
    }
    else {
        console.warn("AI: makeRandomMove called with no available moves.");
    }
}, _AIPlayer_shuffleArray = function _AIPlayer_shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};
//# sourceMappingURL=ai.js.map