export enum GameState {
    PLAYING = "playing",
    X_WINS = "x_wins",
    O_WINS = "o_wins",
    TIE = "tie",
    MENU = "menu", 
    GAME_OVER = "game_over" 
}

export enum ActionType {
    PLACE = "place",
    MOVE_PIECE = "move_piece",
    MOVE_GRID = "move_grid"
}

export enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    UP_LEFT = "up_left",
    UP_RIGHT = "up_right",
    DOWN_LEFT = "down_left",
    DOWN_RIGHT = "down_right"
}