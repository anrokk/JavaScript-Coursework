import { useGameStore } from '../stores/gameStore';
import { ActionType, Direction, GameState } from '../constants';
import type { Position, BoardType, BoardCellValue, Player } from '../types';

export type DifficultyLevel = 0 | 1;

type GameStore = ReturnType<typeof useGameStore>;

const AI_PLAYER_SYMBOL: Player = 'O';
const OPPONENT_PLAYER_SYMBOL: Player = 'X';

function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkWinOnBoard(board: BoardType, player: Player, gridPos: Position): boolean {
    const activeGrid: BoardCellValue[][] = [];
    const startCol = gridPos.x - 1; 
    const startRow = gridPos.y - 1;

    for (let r = 0; r < 3; r++) {
        activeGrid[r] = [];
        for (let c = 0; c < 3; c++) {
            const boardR = startRow + r;
            const boardC = startCol + c;
            if (boardR >= 0 && boardR < board.length && boardC >= 0 && boardC < (board[boardR]?.length || 0) ) {
                 activeGrid[r][c] = board[boardR][boardC];
            } else {
                activeGrid[r][c] = null;
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        if (activeGrid[i][0] === player && activeGrid[i][1] === player && activeGrid[i][2] === player) return true;
    }
    
    for (let j = 0; j < 3; j++) {
        if (activeGrid[0][j] === player && activeGrid[1][j] === player && activeGrid[2][j] === player) return true;
    }

    if (activeGrid[0][0] === player && activeGrid[1][1] === player && activeGrid[2][2] === player) return true;
    if (activeGrid[0][2] === player && activeGrid[1][1] === player && activeGrid[2][0] === player) return true;
    
    return false;
}

function getAvailableCellsForAI(store: GameStore): Position[] {
    const moves: Position[] = [];
    
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (store.isValidCellForCurrentAction(r, c)) {
                moves.push({ y: r, x: c }); 
            }
        }
    }
    return moves;
}

function findWinningOrBlockingPlacement(
    store: GameStore,
    availableCells: Position[], 
    playerToTest: Player
): Position | null {
    for (const cell of availableCells) { 
        const tempBoard = store.board.map(r => [...r]); 
        if (tempBoard[cell.y][cell.x] === null) {
            tempBoard[cell.y][cell.x] = playerToTest;
            if (checkWinOnBoard(tempBoard, playerToTest, store.gridPosition)) {
                return cell; 
            }
        }
    }
    return null;
}

function findWinningOrBlockingMoveFromPiece(
    store: GameStore,
    pieceToMove: Position, 
    availableDestinations: Position[], 
    playerToTest: Player
): Position | null {
    for (const dest of availableDestinations) { 
        const tempBoard = store.board.map(r => [...r]);
        if (tempBoard[dest.y][dest.x] === null) { 
            tempBoard[pieceToMove.y][pieceToMove.x] = null; 
            tempBoard[dest.y][dest.x] = playerToTest; 

            if (checkWinOnBoard(tempBoard, playerToTest, store.gridPosition)) {
                return dest;
            }
        }
    }
    return null;
}

function makeRandomValidMove(store: GameStore, availableCells: Position[]): void {
    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const move = availableCells[randomIndex]; 
        store.makeAMove(move.y, move.x);
    } else {
        console.warn("AI: makeRandomValidMove called with no available cells.");
    }
}

function makePlacementMoveAI(store: GameStore, difficulty: DifficultyLevel): void {
    if (store.actionType !== ActionType.PLACE) {
        if (!store.setActionType(ActionType.PLACE)) {
             console.error("AI: Could not set ActionType.PLACE for placement.");
             return;
        }
    }

    const availableCells = getAvailableCellsForAI(store);
    if (availableCells.length === 0) {
        console.warn("AI: No placement moves available.");
        return;
    }

    if (difficulty === 0) { // Random
        makeRandomValidMove(store, availableCells);
        return;
    }

    // Difficulty 1: Basic strategy
    let move = findWinningOrBlockingPlacement(store, availableCells, AI_PLAYER_SYMBOL); 
    if (move) {
        store.makeAMove(move.y, move.x);
        return;
    }

    move = findWinningOrBlockingPlacement(store, availableCells, OPPONENT_PLAYER_SYMBOL); 
    if (move) {
        store.makeAMove(move.y, move.x);
        return;
    }
    
    const centerBoardRow = store.gridPosition.y; 
    const centerBoardCol = store.gridPosition.x; 

    const centerTarget = availableCells.find(c => c.y === centerBoardRow && c.x === centerBoardCol);
     if (centerTarget) { 
        store.makeAMove(centerTarget.y, centerTarget.x);
        return;
    }

    makeRandomValidMove(store, availableCells);
}

function makeMovePieceActionAI(store: GameStore, difficulty: DifficultyLevel): void {
    if (!store.setActionType(ActionType.MOVE_PIECE)) { 
        if (store.canMoveGrid && store.setActionType(ActionType.MOVE_GRID)) {
            makeGridMoveActionAI(store, difficulty);
        }
        return;
    }

    const aiPieces: Position[] = [];
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (store.board[r][c] === AI_PLAYER_SYMBOL) {
                aiPieces.push({ y: r, x: c });
            }
        }
    }

    if (aiPieces.length === 0) {
        console.warn("AI: No pieces to move.");
        if (store.canMoveGrid && store.setActionType(ActionType.MOVE_GRID)) {
            makeGridMoveActionAI(store, difficulty);
        }
        return;
    }

    shuffleArray(aiPieces);

    for (const piece of aiPieces) { 
        store.selectPieceToMove(piece.y, piece.x); 
        if (store.selectedPiece && store.selectedPiece.y === piece.y && store.selectedPiece.x === piece.x) {
            const availableDestinations = getAvailableCellsForAI(store); 
            if (availableDestinations.length === 0) {
                store.selectedPiece = null; 
                continue; 
            }

            if (difficulty === 1) {
                let move = findWinningOrBlockingMoveFromPiece(store, piece, availableDestinations, AI_PLAYER_SYMBOL);
                if (move) { store.makeAMove(move.y, move.x); return; }

                move = findWinningOrBlockingMoveFromPiece(store, piece, availableDestinations, OPPONENT_PLAYER_SYMBOL);
                if (move) { store.makeAMove(move.y, move.x); return; }
            }
            
            makeRandomValidMove(store, availableDestinations); 
            return; 
        }
    }

    console.warn("AI: No piece could make a valid move. Attempting grid move.");
    if (store.canMoveGrid && store.setActionType(ActionType.MOVE_GRID)) {
        makeGridMoveActionAI(store, difficulty);
    } else {
        console.error("AI: No piece move or grid move fallback possible.");
    }
}


function makeGridMoveActionAI(store: GameStore, difficulty: DifficultyLevel): void {
    if (!store.setActionType(ActionType.MOVE_GRID)) {
        console.error("AI: Could not set ActionType.MOVE_GRID.");
        if (store.playerPieces.X >= 3 && store.playerPieces.O >= 3 && store.setActionType(ActionType.MOVE_PIECE)) {
            makeMovePieceActionAI(store, difficulty);
        }
        return;
    }

    const directions: Direction[] = [
        Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT,
        Direction.UP_LEFT, Direction.UP_RIGHT, Direction.DOWN_LEFT, Direction.DOWN_RIGHT
    ];
    shuffleArray(directions);

    
    for (const direction of directions) {
        if (store.moveGrid(direction)) { 
            return; 
        }
    }
    
    console.warn("AI: No effective grid move found. Fallback to piece move.");
    if (store.playerPieces.X >= 3 && store.playerPieces.O >= 3 && store.setActionType(ActionType.MOVE_PIECE)) {
        makeMovePieceActionAI(store, difficulty);
    } else {
         console.error("AI: No grid move or piece move fallback possible for grid action.");
    }
}

export function performAIMove(difficulty: DifficultyLevel = 1): void {
    const store = useGameStore(); 

    if (store.gameState !== GameState.PLAYING || store.currentPlayer !== AI_PLAYER_SYMBOL) {
        return; 
    }

    console.log("[AI] Thinking...");

    setTimeout(() => {
        if (store.gameState !== GameState.PLAYING || store.currentPlayer !== AI_PLAYER_SYMBOL) {
            return; 
        }

        if (store.playerPieces.X < 3 || store.playerPieces.O < 3) {
            if (store.playerPieces[AI_PLAYER_SYMBOL] < 3) {
                makePlacementMoveAI(store, difficulty);
            } else {
                console.log("[AI] In placement phase, but AI has placed all its pieces. Opponent to move.");
            }
        } else {
            const decision = Math.random();
            let chosenAction = false;

            if (decision < 0.7) { 
                if (store.setActionType(ActionType.MOVE_PIECE)) {
                    makeMovePieceActionAI(store, difficulty);
                    chosenAction = true;
                }
            }
            
            if (!chosenAction && store.canMoveGrid) { 
                if (store.setActionType(ActionType.MOVE_GRID)) {
                    makeGridMoveActionAI(store, difficulty);
                    chosenAction = true;
                }
            }
            
            if (!chosenAction && store.setActionType(ActionType.MOVE_PIECE)) { 
                 makeMovePieceActionAI(store, difficulty);
                 chosenAction = true;
            }

            if (!chosenAction) {
                console.error("[AI] Could not decide on or perform a valid move action.");
            }
        }
    }, 750); // thinking delay
}

