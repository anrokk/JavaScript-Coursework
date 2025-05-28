import { ActionType, Direction, GameState } from "./constants";
import { GameBrain, Player, Position, BoardType, BoardCellValue } from "./game";

export type MoveOption = Position;
export type DifficultyLevel = 0 | 1; // 0 for random, 1 for basic strategy

export class AIPlayer {
    #gameBrain: GameBrain;
    #difficultyLevel: DifficultyLevel;
    readonly #aiPlayerSymbol: Player = "O";
    readonly #opponentPlayerSymbol: Player = "X";

    constructor(gameBrain: GameBrain, difficultyLevel: DifficultyLevel = 1) {
        this.#gameBrain = gameBrain;
        this.#difficultyLevel = difficultyLevel;
    }

    makeMove(): void {
        if (this.#gameBrain.gameState !== GameState.PLAYING || this.#gameBrain.currentPlayer !== this.#aiPlayerSymbol) {
            return; 
        }

        const gamePieces = this.#gameBrain.playerPieces;

        if (gamePieces[this.#aiPlayerSymbol] < 3 || gamePieces[this.#opponentPlayerSymbol] < 3) {
            if (this.#gameBrain.setActionType(ActionType.PLACE)) {
                this.#makePlacementMove();
            } 
        } else {
            const decision = Math.random();
            if (decision < 0.7) { 
                if (this.#gameBrain.setActionType(ActionType.MOVE_PIECE)) {
                    this.#makeMovePieceAction();
                } else {
                    this.#fallbackToGridMoveOrRandomPlacement();
                }
            } else { 
                if (this.#gameBrain.setActionType(ActionType.MOVE_GRID)) {
                    this.#makeGridMoveAction();
                } else {
                    this.#fallbackToPieceMoveOrRandomPlacement();
                }
            }
        }
    }

    #fallbackToGridMoveOrRandomPlacement(): void {
        if (this.#gameBrain.setActionType(ActionType.MOVE_GRID)) {
            this.#makeGridMoveAction();
        } else if (this.#gameBrain.playerPieces[this.#aiPlayerSymbol] < 3 && this.#gameBrain.setActionType(ActionType.PLACE)) {
            this.#makePlacementMove();
        } else {
            console.warn("AI: Fallback to grid move or placement failed.");
        }
    }
    
    #fallbackToPieceMoveOrRandomPlacement(): void {
        if (this.#gameBrain.setActionType(ActionType.MOVE_PIECE)) {
            this.#makeMovePieceAction();
        } else if (this.#gameBrain.playerPieces[this.#aiPlayerSymbol] < 3 && this.#gameBrain.setActionType(ActionType.PLACE)) {
            this.#makePlacementMove();
        } else {
            console.warn("AI: Fallback to piece move or placement failed.");
        }
    }

    #makePlacementMove(): void {
        const moves = this.#getAvailableMoves();

        if (moves.length === 0) {
            console.warn("AI: No placement moves available.");
            return; 
        }

        if (this.#difficultyLevel === 0) {
            this.#makeRandomMove(moves);
            return;
        }

        const winningMove = this.#findWinningMove(moves, this.#aiPlayerSymbol);
        if (winningMove) {
            this.#gameBrain.makeAMove(winningMove.x, winningMove.y);
            return;
        }

        const blockingMove = this.#findWinningMove(moves, this.#opponentPlayerSymbol); 
        if (blockingMove) {
            this.#gameBrain.makeAMove(blockingMove.x, blockingMove.y);
            return;
        }

        const center = this.#getActiveCenterPosition(); 
        const centerCellOf5x5 = {x: 2, y: 2}; 

        const activeCenterMove = moves.find(move => move.x === center.x && move.y === center.y);
        if (activeCenterMove) {
            this.#gameBrain.makeAMove(activeCenterMove.x, activeCenterMove.y);
            return;
        }

        if (this.#gameBrain.isCellInActiveGrid(centerCellOf5x5.x, centerCellOf5x5.y)) {
            const boardCenterMove = moves.find(move => move.x === centerCellOf5x5.x && move.y === centerCellOf5x5.y);
            if (boardCenterMove) {
                this.#gameBrain.makeAMove(boardCenterMove.x, boardCenterMove.y);
                return;
            }
        }
        
        this.#makeRandomMove(moves);
    }

    #makeMovePieceAction(): void {
        const aiPieces: Position[] = [];
        const board: BoardType = this.#gameBrain.board.map(row => [...row]); 

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                if (board[r][c] === this.#aiPlayerSymbol) {
                    aiPieces.push({ x: r, y: c });
                }
            }
        }

        if (aiPieces.length === 0) {
            if (this.#gameBrain.setActionType(ActionType.MOVE_GRID)) {
                this.#makeGridMoveAction();
            }
            return;
        }

        this.#shuffleArray(aiPieces);

        for (const piece of aiPieces) {
            if (this.#gameBrain.selectPieceToMove(piece.x, piece.y)) {
                const availableDestinations = this.#getAvailableMoves(); 

                if (availableDestinations.length === 0) {
                    this.#gameBrain.setActionType(this.#gameBrain.actionType); 
                    continue; 
                }

                const winningMove = this.#findWinningMoveFromPiece(piece, availableDestinations, this.#aiPlayerSymbol);
                if (winningMove) {
                    this.#gameBrain.makeAMove(winningMove.x, winningMove.y);
                    return;
                }

                const blockingMove = this.#findWinningMoveFromPiece(piece, availableDestinations, this.#opponentPlayerSymbol);
                if (blockingMove) {
                    this.#gameBrain.makeAMove(blockingMove.x, blockingMove.y);
                    return;
                }
                
                this.#makeRandomMove(availableDestinations);
                return;
            }
        }
        
        console.warn("AI: No piece could make a move. Fallback to grid move.");
        if (this.#gameBrain.setActionType(ActionType.MOVE_GRID)) {
            this.#makeGridMoveAction();
        }
    }
    
    #makeGridMoveAction(): void {
        if (!this.#gameBrain.canMoveGrid()) {
            if(this.#gameBrain.setActionType(ActionType.MOVE_PIECE)) {
                this.#makeMovePieceAction();
            }
            return;
        }

        const directions: Direction[] = Object.values(Direction);
        this.#shuffleArray(directions);

        for (const direction of directions) {
            
            if (this.#gameBrain.moveGrid(direction)) {
                return; 
            }
        }

        console.warn("AI: No effective grid move found. Fallback to piece move.");
        if(this.#gameBrain.setActionType(ActionType.MOVE_PIECE)) {
            this.#makeMovePieceAction();
        }
    }

    #getAvailableMoves(): MoveOption[] {
        const moves: MoveOption[] = [];
        const boardSize = 5; 
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (this.#gameBrain.isValidCellForCurrentAction(r, c)) {
                    moves.push({ x: r, y: c });
                }
            }
        }
        return moves;
    }

    #checkWinOnBoard(board: BoardType, player: Player, gridPos: Position): boolean {
        const activeGrid: BoardCellValue[][] = [];
        const gridXStart = gridPos.x - 1;
        const gridYStart = gridPos.y - 1;

        for (let r = 0; r < 3; r++) {
            activeGrid[r] = [];
            for (let c = 0; c < 3; c++) {
                const boardR = gridXStart + r; 
                const boardC = gridYStart + c; 
                if (boardR >= 0 && boardR < board.length && boardC >= 0 && boardC < board[boardR].length) {
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

    #findWinningMove(availableMoves: MoveOption[], playerToTest: Player): MoveOption | null {
        for (const move of availableMoves) {
            const tempBoard: BoardType = this.#gameBrain.board.map(row => [...row]);
            if (tempBoard[move.x][move.y] === null) { 
                tempBoard[move.x][move.y] = playerToTest; 
                if (this.#checkWinOnBoard(tempBoard, playerToTest, this.#gameBrain.gridPosition)) {
                    return move; 
                }
            }
        }
        return null;
    }

    #findWinningMoveFromPiece(pieceToMove: Position, availableDestinations: MoveOption[], playerToTest: Player): MoveOption | null {
        for (const destination of availableDestinations) {
            const tempBoard: BoardType = this.#gameBrain.board.map(row => [...row]);
            if (tempBoard[destination.x][destination.y] === null) { 
                tempBoard[pieceToMove.x][pieceToMove.y] = null; 
                tempBoard[destination.x][destination.y] = playerToTest; 

                if (this.#checkWinOnBoard(tempBoard, playerToTest, this.#gameBrain.gridPosition)) {
                    return destination; 
                }
            }
        }
        return null;
    }

    #getActiveCenterPosition(): Position {
        return this.#gameBrain.gridPosition; 
    }

    #makeRandomMove(moves: MoveOption[]): void {
        if (moves.length > 0) {
            const randomIndex = Math.floor(Math.random() * moves.length);
            const move = moves[randomIndex];
            this.#gameBrain.makeAMove(move.x, move.y);
        } else {
            console.warn("AI: makeRandomMove called with no available moves.");
        }
    }

    #shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
    }
}

