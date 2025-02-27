import * as UI from "./ui.js";
import { GameBrain } from "./game.js";
import { GameState } from "./constants.js";


document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
});

function initializeGame() {
    UI.setupInitialUI();

    document.getElementById("human-human").addEventListener("click", () => startGame("human"));
    document.getElementById("human-ai").addEventListener("click", () => startGame("ai"));
}

function startGame(opponentType) {
    UI.switchToGameView();
    
    const game = new GameBrain();
    let aiPlayer = null;
    
    if (opponentType === "ai") {
        aiPlayer = new AIPlayer(game);
    }

    const timerInterval = setInterval(() => {
        UI.updateTimer();
    }, 1000);

    function cellClickHandler(x, y) {
        if (game.gameState !== GameState.PLAYING) return;
        
        if (game.isValidCellForCurrentAction(x, y)) {
            game.makeAMove(x, y);
            
            UI.updateBoard(game);
            UI.updateGameInfo(game);
            
            if (game.gameState !== GameState.PLAYING) {
                clearInterval(timerInterval);
                UI.showGameResult(game.gameState);
                return;
            }
            
            if (opponentType === "ai" && game.currentPlayer === "O") {
                setTimeout(() => {
                    aiPlayer.makeMove();
                    UI.updateBoard(game);
                    UI.updateGameInfo(game);
                    
                    if (game.gameState !== GameState.PLAYING) {
                        clearInterval(timerInterval);
                        UI.showGameResult(game.gameState);
                    }
                }, 500); 
            }
        } else {
            UI.showInvalidMoveMessage();
        }
    }
    
    function gridMoveHandler(direction) {
        if (game.gameState !== GameState.PLAYING) return;
        
        if (game.canMoveGrid()) {
            game.moveGrid(direction);
            UI.updateBoard(game);
            UI.updateGameInfo(game);
            
            if (game.gameState !== GameState.PLAYING) {
                clearInterval(timerInterval);
                UI.showGameResult(game.gameState);
                return;
            }
            
            if (opponentType === "ai" && game.currentPlayer === "O") {
                setTimeout(() => {
                    aiPlayer.makeMove();
                    UI.updateBoard(game);
                    UI.updateGameInfo(game);
                    
                    if (game.gameState !== GameState.PLAYING) {
                        clearInterval(timerInterval);
                        UI.showGameResult(game.gameState);
                    }
                }, 500);
            }
        } else {
            UI.showInvalidMoveMessage();
        }
    }
    
    UI.createBoard(game, cellClickHandler);
    UI.setupGridControls(gridMoveHandler);
    UI.updateGameInfo(game);
    
    document.getElementById("reset-button").addEventListener("click", () => {
        clearInterval(timerInterval);
        UI.resetTimer();
        UI.clearBoard();
        game.resetGame();
        UI.updateBoard(game);
        UI.updateGameInfo(game);
    });
    
    document.getElementById("menu-button").addEventListener("click", () => {
        clearInterval(timerInterval);
        UI.resetTimer();
        UI.clearBoard();
        UI.switchToMenuView();
    });

    document.addEventListener("gridMove", (event) => {
        gridMoveHandler(event.detail.direction);
    });
}

// let h1 = document.createElement("h1");
// h1.innerHTML = "TIC-TAC-TWO";
// document.body.appendChild(h1);

// let game = new GameBrain();

// function cellUpdateFn(x, y, e) {
//     game.makeAMove(x,y);
//     e.target.innerHTML = game.board[x][y] || "&nbsp;";
// }


// let board = UI.getInitialBoard(game.board, cellUpdateFn);
// document.body.appendChild(board);