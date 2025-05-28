import { GameState, Direction, ActionType } from "./constants";
import { GameBrain } from "./game"; 

let boardElement: HTMLDivElement | null = null;
let statusElement: HTMLDivElement | null = null;
let actionButtonsContainer: HTMLDivElement | null = null;
let gridControlsElement: HTMLDivElement | null = null;
let messagesElement: HTMLDivElement | null = null;
let timerElement: HTMLDivElement | null = null;

type CellClickHandler = (x: number, y: number) => void;
type GridMoveHandler = (direction: Direction) => void;


export function setupInitialUI(): void {
    document.body.innerHTML = ""; 

    const header = document.createElement("header");
    const title = document.createElement("h1");
    title.textContent = "TIC-TAC-TWO";
    header.appendChild(title);
    document.body.appendChild(header);

    const modeSelectionDiv = document.createElement("div");
    modeSelectionDiv.id = "mode-selection";
    modeSelectionDiv.classList.add("mode-selection");

    const modeTitle = document.createElement("h2");
    modeTitle.textContent = "Select Mode";
    modeSelectionDiv.appendChild(modeTitle);

    const humanButton = document.createElement("button");
    humanButton.id = "human-human";
    humanButton.textContent = "Human vs Human";
    humanButton.classList.add("mode-button");
    modeSelectionDiv.appendChild(humanButton);

    const aiButton = document.createElement("button");
    aiButton.id = "human-ai";
    aiButton.textContent = "Human vs AI";
    aiButton.classList.add("mode-button");
    modeSelectionDiv.appendChild(aiButton);

    document.body.appendChild(modeSelectionDiv);

    const gameContainer = document.createElement("div");
    gameContainer.id = "game-container";
    gameContainer.classList.add("game-container", "hidden");

    const gameInfoDiv = document.createElement("div");
    gameInfoDiv.classList.add("game-info");

    statusElement = document.createElement("div");
    statusElement.id = "status";
    statusElement.classList.add("status");
    gameInfoDiv.appendChild(statusElement);

    timerElement = document.createElement("div");
    timerElement.id = "timer";
    timerElement.classList.add("timer");
    timerElement.textContent = "Time: 00:00";
    gameInfoDiv.appendChild(timerElement);

    gameContainer.appendChild(gameInfoDiv);

    actionButtonsContainer = document.createElement("div");
    actionButtonsContainer.classList.add("action-buttons");

    const placeButton = document.createElement("button");
    placeButton.id = "place-button";
    placeButton.textContent = "Place Piece";
    placeButton.classList.add("action-button", "active"); 
    placeButton.addEventListener("click", () => dispatchActionChangeEvent(ActionType.PLACE));
    actionButtonsContainer.appendChild(placeButton);

    const moveButton = document.createElement("button");
    moveButton.id = "move-button";
    moveButton.textContent = "Move Piece";
    moveButton.classList.add("action-button");
    moveButton.addEventListener("click", () => dispatchActionChangeEvent(ActionType.MOVE_PIECE));
    actionButtonsContainer.appendChild(moveButton);

    const gridButton = document.createElement("button");
    gridButton.id = "grid-button";
    gridButton.textContent = "Move Grid";
    gridButton.classList.add("action-button");
    gridButton.addEventListener("click", () => dispatchActionChangeEvent(ActionType.MOVE_GRID));
    actionButtonsContainer.appendChild(gridButton);

    gameContainer.appendChild(actionButtonsContainer);

    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");

    boardElement = document.createElement("div");
    boardElement.id = "board-element";
    boardElement.classList.add("board");
    boardContainer.appendChild(boardElement); 

    gridControlsElement = document.createElement("div");
    gridControlsElement.id = "grid-controls";
    gridControlsElement.classList.add("grid-controls", "hidden");

    const directions: { id: string; text: string; dir: Direction | null }[] = [
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
    gridControlsElement.appendChild(dirGrid);
    boardContainer.appendChild(gridControlsElement); 

    gameContainer.appendChild(boardContainer);

    const gameControlsDiv = document.createElement("div");
    gameControlsDiv.classList.add("game-controls");

    const resetButton = document.createElement("button");
    resetButton.id = "reset-button";
    resetButton.textContent = "Reset Game";
    resetButton.classList.add("control-button");
    gameControlsDiv.appendChild(resetButton);

    const menuButton = document.createElement("button");
    menuButton.id = "menu-button";
    menuButton.textContent = "Back to Menu";
    menuButton.classList.add("control-button");
    gameControlsDiv.appendChild(menuButton);

    gameContainer.appendChild(gameControlsDiv);

    messagesElement = document.createElement("div");
    messagesElement.id = "messages";
    messagesElement.classList.add("messages");
    gameContainer.appendChild(messagesElement);

    document.body.appendChild(gameContainer);

}


function dispatchActionChangeEvent(actionType: ActionType): void {
    const customEvent = new CustomEvent<ActionChangeDetail>("actionChange", {
        detail: { actionType }
    });
    document.dispatchEvent(customEvent);
}

interface ActionChangeDetail {
    actionType: ActionType;
}

interface GridMoveDetail {
    direction: Direction;
}


export function switchToGameView(): void {
    document.getElementById("mode-selection")?.classList.add("hidden");
    document.getElementById("game-container")?.classList.remove("hidden");
}

export function switchToMenuView(): void {
    document.getElementById("game-container")?.classList.add("hidden");
    document.getElementById("mode-selection")?.classList.remove("hidden");
}


export function createBoard(game: GameBrain, onCellClick: CellClickHandler): void {
    if (!boardElement) return;
    boardElement.innerHTML = ''; 

    const boardData = game.board;
    for (let x = 0; x < boardData.length; x++) { 
        for (let y = 0; y < boardData[x].length; y++) { 
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x.toString(); 
            cell.dataset.y = y.toString(); 

            if (game.isCellInActiveGrid(x, y)) {
                cell.classList.add("active-grid");
            }

            const cellValue = boardData[x][y];
            if (cellValue) {
                cell.textContent = cellValue;
                cell.classList.add(cellValue.toLowerCase()); 
            } else {
                cell.innerHTML = "&nbsp;"; 
            }

            cell.addEventListener("click", () => {
                const currentActionType = game.actionType;
                if (currentActionType === ActionType.PLACE ||
                    (currentActionType === ActionType.MOVE_PIECE && game.selectedPiece !== null)) {
                    onCellClick(x, y); 
                } else if (currentActionType === ActionType.MOVE_PIECE && game.selectedPiece === null) {
                    if (game.selectPieceToMove(x, y)) {
                        updateBoard(game); 
                    } else {
                        showTemporaryMessage("Select your own piece to move.");
                    }
                }
            });
            boardElement.appendChild(cell);
        }
    }
}


export function updateBoard(game: GameBrain): void {
    if (!boardElement) return;
    const cells = boardElement.querySelectorAll(".cell");
    const boardData = game.board;

    cells.forEach(cell => {
        const htmlCell = cell as HTMLDivElement;
        const x = parseInt(htmlCell.dataset.x!, 10);
        const y = parseInt(htmlCell.dataset.y!, 10);

        htmlCell.classList.remove("active-grid", "selected", "x", "o");
        htmlCell.innerHTML = "&nbsp;"; 

        if (game.isCellInActiveGrid(x, y)) {
            htmlCell.classList.add("active-grid");
        }

        const selectedPiece = game.selectedPiece;
        if (selectedPiece && selectedPiece.x === x && selectedPiece.y === y) {
            htmlCell.classList.add("selected");
        }

        const cellValue = boardData[x][y];
        if (cellValue) {
            htmlCell.textContent = cellValue;
            htmlCell.classList.add(cellValue.toLowerCase());
        }
    });
    clearMessages(); 
}


export function updateTimer(totalSeconds: number): void {
    if (!timerElement) return;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerElement.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


export function resetTimerDisplay(): void {
    if (timerElement) {
        timerElement.textContent = "Time: 00:00";
    }
}


export function updateGameInfo(game: GameBrain): void {
    if (statusElement) {
        switch (game.gameState) {
            case GameState.PLAYING:
                statusElement.textContent = `Player ${game.currentPlayer}'s turn`;
                break;
            case GameState.X_WINS:
                statusElement.textContent = "Player X wins!";
                break;
            case GameState.O_WINS:
                statusElement.textContent = "Player O wins!";
                break;
            case GameState.TIE:
                statusElement.textContent = "Game ended in a tie!";
                break;
        }
    }

    const actionButtons = document.querySelectorAll(".action-button");
    actionButtons.forEach(button => button.classList.remove("active"));

    const currentActionType = game.actionType;
    if (currentActionType === ActionType.PLACE) {
        document.getElementById("place-button")?.classList.add("active");
    } else if (currentActionType === ActionType.MOVE_PIECE) {
        document.getElementById("move-button")?.classList.add("active");
    } else if (currentActionType === ActionType.MOVE_GRID) {
        document.getElementById("grid-button")?.classList.add("active");
    }

    if (gridControlsElement) {
        if (currentActionType === ActionType.MOVE_GRID && game.canMoveGrid()) {
            gridControlsElement.classList.remove("hidden");
        } else {
            gridControlsElement.classList.add("hidden");
        }
    }
    const placeButton = document.getElementById("place-button") as HTMLButtonElement | null;
    const moveButton = document.getElementById("move-button") as HTMLButtonElement | null;
    const gridMoveButton = document.getElementById("grid-button") as HTMLButtonElement | null;

    if (game.playerPieces[game.currentPlayer] >=3 && game.playerPieces[game.currentPlayer === "X" ? "O" : "X"] >=3) { 
        if(placeButton) placeButton.disabled = true;
        if(moveButton) moveButton.disabled = false;
        if(gridMoveButton) gridMoveButton.disabled = false;
    } else { 
        if(placeButton) placeButton.disabled = game.playerPieces[game.currentPlayer] >=3; 
        if(moveButton) moveButton.disabled = true;
        if(gridMoveButton) gridMoveButton.disabled = true;
    }
     if (game.gameState !== GameState.PLAYING) {
        if(placeButton) placeButton.disabled = true;
        if(moveButton) moveButton.disabled = true;
        if(gridMoveButton) gridMoveButton.disabled = true;
    }

}



export function setupGridControls(onGridMove: GridMoveHandler): void {
    if (!gridControlsElement) return;
    const buttons = gridControlsElement.querySelectorAll(".direction-button");
    buttons.forEach(button => {
        const htmlButton = button as HTMLButtonElement;
        const direction = htmlButton.dataset.direction as Direction | undefined;
        if (direction) {
            htmlButton.addEventListener("click", () => {
                console.log(`[UI] Direction button clicked. Raw data-direction: "${htmlButton.dataset.direction}". Parsed direction: "${direction}"`);
                onGridMove(direction);
            });
        }
    });
}


export function showTemporaryMessage(message: string): void {
    if (!messagesElement) return;
    messagesElement.textContent = message;
    messagesElement.classList.remove("game-result"); 
    setTimeout(() => {
        clearMessages();
    }, 3000);
}


export function clearMessages(): void {
    if (messagesElement) {
        messagesElement.textContent = "";
    }
}


export function clearBoardDisplay(): void {
    if (boardElement) {
        boardElement.innerHTML = "";
    }
}


export function showGameResult(gameState: GameState): void {
    if (!messagesElement) return;
    let message = "";
    switch (gameState) {
        case GameState.X_WINS: message = "Player X wins!"; break;
        case GameState.O_WINS: message = "Player O wins!"; break;
        case GameState.TIE: message = "Game ended in a tie!"; break;
        default: return; // Not a final state
    }
    messagesElement.textContent = message;
    messagesElement.classList.add("game-result");
}


export function addButtonEventListener(id: string, eventType: string, listener: EventListenerOrEventListenerObject): void {
    const button = document.getElementById(id);
    if (button) {
        button.addEventListener(eventType, listener);
    } else {
        console.warn(`Button with ID "${id}" not found.`);
    }
}