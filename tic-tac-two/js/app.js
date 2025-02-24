import * as UI from "./ui.js";
import { GameBrain } from "./game.js";

let h1 = document.createElement("h1");
h1.innerHTML = "TIC-TAC-TWO";
document.body.appendChild(h1);

let game = new GameBrain();

function cellUpdateFn(x, y, e) {
    game.makeAMove(x,y);
    e.target.innerHTML = game.board[x][y] || "&nbsp;";
}


let board = UI.getInitialBoard(game.board, cellUpdateFn);
document.body.appendChild(board);