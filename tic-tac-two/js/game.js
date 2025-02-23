export class GameBrain {

    #board = [[], [], [], [], []];
    currentPlayer = "X";

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