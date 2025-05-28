import { AIPlayer, DifficultyLevel } from './ai';
import { GameBrain } from './game';
import { GameState, ActionType, Direction } from './constants';
import * as UI from './ui';


document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
})


function initializeApp() {
    UI.setupInitialUI();

    UI.addButtonEventListener("human-human", "click", () => startGame("human"));
    UI.addButtonEventListener("human-ai", "click", () => startGame("ai"));
}

type OpponentType = "human" | "ai";

function startGame(opponentType: OpponentType) {
    UI.switchToGameView();

    const game = new GameBrain();
    let aiPlayer: AIPlayer | null = null;
    const aiDifficulty: DifficultyLevel = 1; // 0 or 1

    if (opponentType === "ai") {
        aiPlayer = new AIPlayer(game, aiDifficulty);
    }

    let timerIntervalId: number | null = null;
    let gameStartTime: number = 0;

    function startTimer(): void {
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

    function stopTimer(): void {
        if (timerIntervalId != null) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
    }

    function handleGameEnd(): void {
        stopTimer();
        UI.showGameResult(game.gameState);
        UI.updateGameInfo(game);
    }

    function cellClickHandler(x: number, y: number): void {
        if (game.gameState !== GameState.PLAYING) return;

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
                        aiPlayer!.makeMove(); 
                        UI.updateBoard(game);
                        UI.updateGameInfo(game);
                        if (game.gameState !== GameState.PLAYING) {
                            handleGameEnd();
                        }
                    }
                }, 500);
            }
        } else {
            UI.showTemporaryMessage("Invalid move.");
        }
    }

    
    function gridMoveHandler(direction: Direction): void {
        if (game.gameState !== GameState.PLAYING) return;
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
                        aiPlayer!.makeMove();
                        UI.updateBoard(game);
                        UI.updateGameInfo(game);
                        if (game.gameState !== GameState.PLAYING) {
                            handleGameEnd();
                        }
                    }
                }, 500);
            }
        } else {
            UI.showTemporaryMessage("Cannot move grid there or not allowed yet.");
        }
    }
    
    
    function actionChangeHandler(actionType: ActionType): void {
        if (game.gameState !== GameState.PLAYING) return;

        if (game.setActionType(actionType)) {
            UI.updateGameInfo(game); 
            UI.updateBoard(game); 
        } else {
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

    
    interface GridMoveEventDetail { direction: Direction; }
    const onGridMoveEvent = (event: Event): void => {
        const customEvent = event as CustomEvent<GridMoveEventDetail>;
        if (customEvent.detail && customEvent.detail.direction) {
            gridMoveHandler(customEvent.detail.direction);
        }
    };
    document.addEventListener("gridMove", onGridMoveEvent);


    interface ActionChangeEventDetail { actionType: ActionType; }
    const onActionChangeEvent = (event: Event): void => {
        const customEvent = event as CustomEvent<ActionChangeEventDetail>;
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