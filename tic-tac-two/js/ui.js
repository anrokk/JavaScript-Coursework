import { GameState, Direction, ActionType } from "./constants.js";


let seconds = 0;
let minutes = 0;

let boardElement = null;
let statusElement = null;
let actionButtonsContainer = null;

export function setupInitialUI() {
    document.body.innerHTML = "";

    const header = document.createElement("header");
    const title = document.createElement("h1");
    title.textContent = "TIC-TAC-TWO";
    header.appendChild(title);
    document.body.appendChild(header);
    
    const modeSelection = document.createElement("div");
    modeSelection.id = "mode-selection";
    modeSelection.classList.add("mode-selection");

    const modeTitle = document.createElement("h2");
    modeTitle.textContent = "Select Mode";
    modeSelection.appendChild(modeTitle);

    const humanButton = document.createElement("button");
    humanButton.id = "human-human";
    humanButton.textContent = "Human vs Human";
    humanButton.classList.add("mode-button");
    modeSelection.appendChild(humanButton);

    const aiButton = document.createElement("button");
    aiButton.id = "human-ai";
    aiButton.textContent = "Human vs AI";
    aiButton.classList.add("mode-button");
    modeSelection.appendChild(aiButton);

    document.body.appendChild(modeSelection);

    const gameContainer = document.createElement("div");
    gameContainer.id = "game-container";
    gameContainer.classList.add("game-container", "hidden");

    const gameInfo = document.createElement("div");
    gameInfo.classList.add("game-info");

    statusElement = document.createElement("div");
    statusElement.id = "status";
    statusElement.classList.add("status");
    gameInfo.appendChild(statusElement);

    const timerElement = document.createElement("div");
    timerElement.id = "timer";
    timerElement.classList.add("timer");
    timerElement.textContent = "Time: 00:00";
    gameInfo.appendChild(timerElement);

    gameContainer.appendChild(gameInfo);

    actionButtonsContainer = document.createElement("div");
    actionButtonsContainer.classList.add("action-buttons");

    const placeButton = document.createElement("button");
    placeButton.id = "place-button";
    placeButton.textContent = "Place Piece";
    placeButton.classList.add("action-button", "active");
    placeButton.addEventListener("click", () => setActiveAction(ActionType.PLACE));
    actionButtonsContainer.appendChild(placeButton);

    const moveButton = document.createElement("button");
    moveButton.id = "move-button";
    moveButton.textContent = "Move Piece";
    moveButton.classList.add("action-button");
    moveButton.addEventListener("click", () => setActiveAction(ActionType.MOVE_PIECE));
    actionButtonsContainer.appendChild(moveButton);
    
    const gridButton = document.createElement("button");
    gridButton.id = "grid-button";
    gridButton.textContent = "Move Grid";
    gridButton.classList.add("action-button");
    gridButton.addEventListener("click", () => setActiveAction(ActionType.MOVE_GRID));
    actionButtonsContainer.appendChild(gridButton);
    
    gameContainer.appendChild(actionButtonsContainer);
    
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");
    
    boardContainer.innerHTML = `<div id="board-element" class="board"></div>`;
    
    const gridControls = document.createElement("div");
    gridControls.id = "grid-controls";
    gridControls.classList.add("grid-controls", "hidden");
    
    const directions = [
        { id: "up-left", text: "↖", dir: Direction.UP_LEFT },
        { id: "up", text: "↑", dir: Direction.UP },
        { id: "up-right", text: "↗", dir: Direction.UP_RIGHT },
        { id: "left", text: "←", dir: Direction.LEFT },
        { id: "center", text: "•", dir: null },
        { id: "right", text: "→", dir: Direction.RIGHT },
        { id: "down-left", text: "↙", dir: Direction.DOWN_LEFT },
        { id: "down", text: "↓", dir: Direction.DOWN },
        { id: "down-right", text: "↘", dir: Direction.DOWN_RIGHT }
    ];

    const dirGrid = document.createElement("div");
    dirGrid.classList.add("direction-grid");

    for (const dir of directions) {
        const button = document.createElement("button");
        button.id = `dir-${dir.id}`;
        button.textContent = dir.text;
        button.classList.add("direction-button");
        if (!dir.dir) button.classList.add("center-button");
        if (dir.dir) {
            button.dataset.direction = dir.dir;
        }
        dirGrid.appendChild(button);
    }

    gridControls.appendChild(dirGrid);
    boardContainer.appendChild(gridControls);
    
    gameContainer.appendChild(boardContainer);
    
    const gameControls = document.createElement("div");
    gameControls.classList.add("game-controls");
    
    const resetButton = document.createElement("button");
    resetButton.id = "reset-button";
    resetButton.textContent = "Reset Game";
    resetButton.classList.add("control-button");
    gameControls.appendChild(resetButton);
    
    const menuButton = document.createElement("button");
    menuButton.id = "menu-button";
    menuButton.textContent = "Back to Menu";
    menuButton.classList.add("control-button");
    gameControls.appendChild(menuButton);
    
    gameContainer.appendChild(gameControls);
    
    const messagesContainer = document.createElement("div");
    messagesContainer.id = "messages";
    messagesContainer.classList.add("messages");
    gameContainer.appendChild(messagesContainer);
    
    document.body.appendChild(gameContainer);

    document.addEventListener("keydown", handleGridMove);
}

function handleGridMove(event) {
    if (document.querySelector(".action-button.active").id !== "grid-button") return;

    let direction = null;
    switch (event.key) {
        case "ArrowUp":
            direction = Direction.UP;
            break;
        case "ArrowDown":
            direction = Direction.DOWN;
            break;
        case "ArrowLeft":
            direction = Direction.LEFT;
            break;
        case "ArrowRight":
            direction = Direction.RIGHT;
            break;
        case "Home":
        case "7":  
            direction = Direction.UP_LEFT;
            break;
        case "End":
        case "1":  
            direction = Direction.DOWN_LEFT;
            break;
        case "PageUp":
        case "9":  
            direction = Direction.UP_RIGHT;
            break;
        case "PageDown":
        case "3":  
            direction = Direction.DOWN_RIGHT;
            break;
    }

    if (direction) {
        const customEvent = new CustomEvent("gridMove", { detail: { direction } });
        document.dispatchEvent(customEvent);
    }
}

export function switchToGameView() {
    document.getElementById("mode-selection").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
}

export function switchToMenuView() {
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("mode-selection").classList.remove("hidden");
}

export function createBoard(game, cellClickHandler) {
    boardElement = document.getElementById("board-element");
    boardElement.innerHTML = '';
    
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            if (game.isCellInActiveGrid(x, y)) {
                cell.classList.add("active-grid");
            }
            
            if (game.board[x][y]) {
                cell.textContent = game.board[x][y];
                cell.classList.add(game.board[x][y].toLowerCase());
            } else {
                cell.innerHTML = "&nbsp;";
            }
            
            cell.addEventListener("click", () => {
                if (game.actionType === ActionType.PLACE || 
                    (game.actionType === ActionType.MOVE_PIECE && game.selectedPiece !== null)) {
                    cellClickHandler(x, y);
                } else if (game.actionType === ActionType.MOVE_PIECE && game.selectedPiece === null) {
                    if (game.selectPieceToMove(x, y)) {
                        updateBoard(game);
                    } else {
                        showInvalidMoveMessage("Select your own piece to move");
                    }
                }
            });
            
            boardElement.appendChild(cell);
        }
    }
}

export function updateBoard(game) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        cell.classList.remove("active-grid", "selected", "x", "o", "grid-center");

        if (game.isCellInActiveGrid(x, y)) {
            cell.classList.add("active-grid");
        }

        if (game.selectedPiece && game.selectedPiece.x === x && game.selectedPiece.y === y) {
            cell.classList.add("selected");
        }

        if (game.board[x][y]) {
            cell.textContent = game.board[x][y];
            cell.classList.add(game.board[x][y].toLowerCase());
        } else {
            cell.innerHTML = "&nbsp;";
        }
    });

    clearMessages();
}

export function updateTimer(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function resetTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "Time: 00:00";
}

export function updateGameInfo(game) {
    const statusElement = document.getElementById("status");

    if (game.gameState === GameState.PLAYING) {
        statusElement.textContent = `Player ${game.currentPlayer}'s turn`;
    } else if (game.gameState === GameState.X_WINS) {
        statusElement.textContent = "Player X wins!";
    } else if (game.gameState === GameState.O_WINS) {
        statusElement.textContent = "Player O wins!";
    } else if (game.gameState === GameState.TIE) {
        statusElement.textContent = "Game ended in a tie!";
    }

    const actionButtons = document.querySelectorAll(".action-button");
    actionButtons.forEach(button => button.classList.remove("active"));

    if (game.actionType === ActionType.PLACE) {
        document.getElementById("place-button").classList.add("active");
    } else if (game.actionType === ActionType.MOVE_PIECE) {
        document.getElementById("move-button").classList.add("active");
    } else if (game.actionType === ActionType.MOVE_GRID) {
        document.getElementById("grid-button").classList.add("active");
    }

    const gridControls = document.getElementById("grid-controls");
    if (game.actionType === ActionType.MOVE_GRID) {
        gridControls.classList.remove("hidden");
    } else {
        gridControls.classList.add("hidden");
    }
}

export function setupGridControls(gridMoveHandler) {
    const buttons = document.querySelectorAll(".direction-button");
    buttons.forEach(button => {
        if (button.dataset.direction) {
            button.addEventListener("click", () => {
                const direction = button.dataset.direction;
                gridMoveHandler(direction);
            });
        }
    });

    document.addEventListener("gridMove", (event) => {
        gridMoveHandler(event.detail.direction);
    });
}

export function showInvalidMoveMessage(message) {
    const messsagesElement = document.getElementById("messages");
    messsagesElement.textContent = message;

    setTimeout(() => {
        clearMessages(); 
    }, 3000);
}

export function clearMessages() {
    const messagesElement = document.getElementById("messages");
    messagesElement.textContent = "";
}

export function clearBoard() {
    if (boardElement) {
        boardElement.innerHTML = "";
    }
}

export function showGameResult(gameState) {
    let message = "";

    if (gameState === GameState.X_WINS) {
        message = "Player X wins!";
    } else if (gameState === GameState.O_WINS) {
        message = "Player O wins!";
    } else if (gameState === GameState.TIE) {
        message = "Game ended in a tie!";
    }

    const messagesElement = document.getElementById("messages");
    messagesElement.textContent = message;
    messagesElement.classList.add("game-result");
}

function setActiveAction(actionType) {
    const customEvent = new CustomEvent("actionChange", { detail: { actionType } });
    document.dispatchEvent(customEvent);

    const actionButtons = document.querySelectorAll(".action-button");
    actionButtons.forEach(button => button.classList.remove("active"));

    if (actionType === ActionType.PLACE) {
        document.getElementById("place-button").classList.add("active");
    } else if (actionType === ActionType.MOVE_PIECE) {
        document.getElementById("move-button").classList.add("active");
    } else if (actionType === ActionType.MOVE_GRID) {
        document.getElementById("grid-button").classList.add("active");
    }
    
    const gridControls = document.getElementById("grid-controls");
    if (actionType === ActionType.MOVE_GRID) {
        gridControls.classList.remove("hidden");
    } else {
        gridControls.classList.add("hidden");
    }
}