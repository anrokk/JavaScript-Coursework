import * as UI from "./ui.js";
import { GameBrain } from "./game.js";
import { GameState } from "./constants.js";
import { AIPlayer } from "./ai.js";


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

    let timerStartTime = Date.now();
    let timerInterval = null;
    
    function startTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerStartTime = Date.now();
        
        UI.resetTimer();
        
        timerInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
            UI.updateTimerDirect(elapsedSeconds);
        }, 1000);
    }
    
    startTimer();
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    function handleGameEnd() {
        stopTimer();
        UI.showGameResult(game.gameState);
    }

    function cellClickHandler(x, y) {
        if (game.gameState !== GameState.PLAYING) return;
        
        if (game.isValidCellForCurrentAction(x, y)) {
            game.makeAMove(x, y);
            
            UI.updateBoard(game);
            UI.updateGameInfo(game);
            
            if (game.gameState !== GameState.PLAYING) {
                handleGameEnd();
                return;
            }
            
            if (opponentType === "ai" && game.currentPlayer === "O") {
                setTimeout(() => {
                    aiPlayer.makeMove();
                    UI.updateBoard(game);
                    UI.updateGameInfo(game);
                    
                    if (game.gameState !== GameState.PLAYING) {
                        handleGameEnd();
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
                handleGameEnd();
                return;
            }
            
            if (opponentType === "ai" && game.currentPlayer === "O") {
                setTimeout(() => {
                    aiPlayer.makeMove();
                    UI.updateBoard(game);
                    UI.updateGameInfo(game);
                    
                    if (game.gameState !== GameState.PLAYING) {
                        handleGameEnd();
                    }
                }, 500);
            }
        } else {
            UI.showInvalidMoveMessage("Cannot move grid yet - each player needs at least 3 pieces");
        }
    }
    
    UI.createBoard(game, cellClickHandler);
    UI.setupGridControls(gridMoveHandler);
    UI.updateGameInfo(game);
    
    document.getElementById("reset-button").addEventListener("click", () => {
        game.resetGame();
        UI.updateBoard(game);
        UI.updateGameInfo(game);
        UI.clearMessages();
        
        startTimer();
    });
    
    document.getElementById("menu-button").addEventListener("click", () => {
        stopTimer();
        UI.resetTimer();
        UI.clearBoard();
        UI.switchToMenuView();
    });

    document.addEventListener("gridMove", (event) => {
        gridMoveHandler(event.detail.direction);
    });

    document.addEventListener("actionChange", (event) => {
        const actionType = event.detail.actionType;
        game.setActionType(actionType);
        UI.updateGameInfo(game);
    });

    UI.showDebugInfo(game);
}