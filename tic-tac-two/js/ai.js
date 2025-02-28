import { ActionType, Direction } from "./constants.js";

export class AIPlayer {
    #gameBrain;
    #difficultyLevel = 1; // 0 = random, 1 = basic strategy

    constructor(gameBrain) {
        this.#gameBrain = gameBrain;
    }

    makeMove() {
        if (this.#gameBrain.playerPieces["X"] < 3 || this.#gameBrain.playerPieces["O"] < 3) {
            this.#makePlacementMove();
        } else {
            const decision = Math.random();
            
            if (decision < 0.7) {
                this.#gameBrain.setActionType(ActionType.MOVE_PIECE);
                this.#makeMovePieceAction();
            } else {
                this.#gameBrain.setActionType(ActionType.MOVE_GRID);
                this.#makeGridMoveAction();
            }
        }
    }

    #makePlacementMove() {
        const moves = this.#getAvailableMoves();
        
        if (this.#difficultyLevel === 0 || moves.length === 0) {
            this.#makeRandomMove(moves);
            return;
        }
        
        const winningMove = this.#findWinningMove(moves);
        if (winningMove) {
            this.#gameBrain.makeAMove(winningMove.x, winningMove.y);
            return;
        }
        
        const blockingMove = this.#findBlockingMove(moves);
        if (blockingMove) {
            this.#gameBrain.makeAMove(blockingMove.x, blockingMove.y);
            return;
        }
        
        const center = this.#getActiveCenterPosition();
        const centerMove = moves.find(move => move.x === center.x && move.y === center.y);
        if (centerMove) {
            this.#gameBrain.makeAMove(centerMove.x, centerMove.y);
            return;
        }
        
        this.#makeRandomMove(moves);
    }

    #makeMovePieceAction() {
        const aiPieces = [];
        const board = this.#gameBrain.board;
        
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (board[x][y] === "O") {
                    aiPieces.push({x, y});
                }
            }
        }
        
        this.#shuffleArray(aiPieces);
        
        for (const piece of aiPieces) {
            this.#gameBrain.selectPieceToMove(piece.x, piece.y);
            
            const moves = this.#getAvailableMoves();
            
            if (moves.length === 0) continue;
            
            const winningMove = this.#findWinningMove(moves);
            if (winningMove) {
                this.#gameBrain.makeAMove(winningMove.x, winningMove.y);
                return;
            }
        
            const moveIndex = Math.floor(Math.random() * moves.length);
            const move = moves[moveIndex];
            this.#gameBrain.makeAMove(move.x, move.y);
            return;
        }
        
        if (aiPieces.length > 0) {
            const randomPiece = aiPieces[0];
            this.#gameBrain.selectPieceToMove(randomPiece.x, randomPiece.y);
            
            const moves = this.#getAvailableMoves();
            if (moves.length > 0) {
                const moveIndex = Math.floor(Math.random() * moves.length);
                this.#gameBrain.makeAMove(moves[moveIndex].x, moves[moveIndex].y);
                return;
            }
        }
        
        this.#gameBrain.setActionType(ActionType.MOVE_GRID);
        this.#makeGridMoveAction();
    }

    #makeGridMoveAction() {
        const directions = [
            Direction.UP,
            Direction.DOWN,
            Direction.LEFT,
            Direction.RIGHT,
            Direction.UP_LEFT,
            Direction.UP_RIGHT,
            Direction.DOWN_LEFT,
            Direction.DOWN_RIGHT
        ];
        
        this.#shuffleArray(directions);
        
        for (const direction of directions)  {
            const currentGrid = this.#gameBrain.gridPosition;
            const tempX = currentGrid.x;
            const tempY = currentGrid.y;
            
            if (this.#gameBrain.moveGrid(direction)) {
                if (this.#gameBrain.gameState !== "playing") {
                    return;
                }
                
                return;
            }
        }
        
        this.#gameBrain.setActionType(ActionType.MOVE_PIECE);
        this.#makeMovePieceAction();
    }

    #getAvailableMoves() {
        const moves = [];
        const board = this.#gameBrain.board;
        
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (this.#gameBrain.isValidCellForCurrentAction(x, y)) {
                    moves.push({x, y});
                }
            }
        }
        
        return moves;
    }

    #findWinningMove(moves) {
        for (const move of moves) {
            const board = this.#gameBrain.board;
            const originalValue = board[move.x][move.y];
            
            board[move.x][move.y] = "O";
            
            const isWinningMove = this.#gameBrain.checkWinCondition("O");
            
            board[move.x][move.y] = originalValue;
            
            if (isWinningMove) {
                return move;
            }
        }
        
        return null;
    }

    #findBlockingMove(moves) {
        for (const move of moves) {
            const board = this.#gameBrain.board;
            const originalValue = board[move.x][move.y];
            
            board[move.x][move.y] = "X";
            
            const wouldBlock = this.#gameBrain.checkWinCondition("X");
            
            board[move.x][move.y] = originalValue;
            
            if (wouldBlock) {
                return move;
            }
        }
        
        return null;
    }

    #getActiveCenterPosition() {
        const gridPos = this.#gameBrain.gridPosition;
        return {
            x: gridPos.x,
            y: gridPos.y
        };
    }

    #makeRandomMove(moves) {
        if (moves.length > 0) {
            const randomIndex = Math.floor(Math.random() * moves.length);
            const move = moves[randomIndex];
            this.#gameBrain.makeAMove(move.x, move.y);
        }
    }

    #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
