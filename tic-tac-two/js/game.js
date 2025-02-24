export class GameBrain {

    #board = [[], [], [], [], []];
    #gridPosition = { x: 1, y: 1};
    currentPlayer = "X";

    constructor() {
        for (let i = 0; i < 5; i++) {
            this.#board[i] = new Array(5).fill(undefined);
            } 
        }

    makeAMove(x,y){
        if (this.board[x][y] === undefined){
            this.board[x][y] = this.currentPlayer;
            this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        }
    }

    get board(){
        return this.#board;
    }
}