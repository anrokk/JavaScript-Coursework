import { AIPlayer } from './ai';
import { GameBrain } from './game';
import { GameState, ActionType } from './constants';
import * as UI from './ui';
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});
function initializeApp() {
    UI.setupInitialUI();
    UI.addButtonEventListener("human-human", "click", () => startGame("human"));
    UI.addButtonEventListener("human-ai", "click", () => startGame("ai"));
}
function startGame(opponentType) {
    UI.switchToGameView();
    const game = new GameBrain();
    let aiPlayer = null;
    const aiDifficulty = 1;
    if (opponentType === "ai") {
        aiPlayer = new AIPlayer(game, aiDifficulty);
    }
    let timerIntervalId = null;
    let gameStartTime = 0;
    function startTimer() {
        if (timerIntervalId != null) {
            clearInterval(timerIntervalId);
        }
        UI.resetTimerDisplay();
        gameStartTime = Date.now();
        timerIntervalId = window.setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
            UI.updateTimer(elapsedSeconds);
        }, 1000);
    }
    function stopTimer() {
        if (timerIntervalId != null) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
    }
    function handleGameEnd() {
        stopTimer();
        UI.showGameResult(game.gameState);
        UI.updateGameInfo(game);
    }
    function cellClickHandler(x, y) {
        if (game.gameState !== GameState.PLAYING)
            return;
        if (game.makeAMove(x, y)) {
            UI.updateBoard(game);
            UI.updateGameInfo(game);
            if (game.gameState !== GameState.PLAYING) {
                handleGameEnd();
                return;
            }
            if (opponentType === "ai" && game.currentPlayer === "O" && aiPlayer) {
                setTimeout(() => {
                    if (game.gameState === GameState.PLAYING) {
                        aiPlayer.makeMove();
                        UI.updateBoard(game);
                        UI.updateGameInfo(game);
                        if (game.gameState !== GameState.PLAYING) {
                            handleGameEnd();
                        }
                    }
                }, 500);
            }
        }
        else {
            UI.showTemporaryMessage("Invalid move.");
        }
    }
    function gridMoveHandler(direction) {
        console.log(`[App] gridMoveHandler called with direction: "${direction}"`);
        if (game.gameState !== GameState.PLAYING)
            return;
        if (game.actionType !== ActionType.MOVE_GRID) {
            return;
        }
        if (game.moveGrid(direction)) {
            UI.updateBoard(game);
            UI.updateGameInfo(game);
            if (game.gameState !== GameState.PLAYING) {
                handleGameEnd();
                return;
            }
            if (opponentType === "ai" && game.currentPlayer === "O" && aiPlayer) {
                setTimeout(() => {
                    if (game.gameState === GameState.PLAYING) {
                        aiPlayer.makeMove();
                        UI.updateBoard(game);
                        UI.updateGameInfo(game);
                        if (game.gameState !== GameState.PLAYING) {
                            handleGameEnd();
                        }
                    }
                }, 500);
            }
        }
        else {
            UI.showTemporaryMessage("Cannot move grid there or not allowed yet.");
        }
    }
    function actionChangeHandler(actionType) {
        if (game.gameState !== GameState.PLAYING)
            return;
        if (game.setActionType(actionType)) {
            UI.updateGameInfo(game);
            UI.updateBoard(game);
        }
        else {
            UI.updateGameInfo(game);
            UI.showTemporaryMessage("Cannot switch to this action yet.");
        }
    }
    UI.createBoard(game, cellClickHandler);
    UI.setupGridControls(gridMoveHandler);
    UI.updateGameInfo(game);
    startTimer();
    UI.addButtonEventListener("reset-button", "click", () => {
        game.resetGame();
        UI.updateBoard(game);
        UI.updateGameInfo(game);
        UI.clearMessages();
        startTimer();
    });
    UI.addButtonEventListener("menu-button", "click", () => {
        stopTimer();
        UI.resetTimerDisplay();
        UI.clearBoardDisplay();
        UI.switchToMenuView();
    });
    const onGridMoveEvent = (event) => {
        const customEvent = event;
        if (customEvent.detail && customEvent.detail.direction) {
            gridMoveHandler(customEvent.detail.direction);
        }
    };
    const onActionChangeEvent = (event) => {
        const customEvent = event;
        if (customEvent.detail && customEvent.detail.actionType) {
            actionChangeHandler(customEvent.detail.actionType);
        }
    };
    document.addEventListener("actionChange", onActionChangeEvent);
    const menuButton = document.getElementById("menu-button");
    if (menuButton) {
        const originalMenuClickListener = () => {
            stopTimer();
            UI.resetTimerDisplay();
            UI.clearBoardDisplay();
            UI.switchToMenuView();
            document.removeEventListener("gridMove", onGridMoveEvent);
            document.removeEventListener("actionChange", onActionChangeEvent);
        };
        menuButton.removeEventListener("click", UI.switchToMenuView);
        menuButton.addEventListener("click", originalMenuClickListener);
    }
}
//# sourceMappingURL=app.js.map