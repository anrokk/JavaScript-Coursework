export var GameState;
(function (GameState) {
    GameState["PLAYING"] = "playing";
    GameState["X_WINS"] = "x_wins";
    GameState["O_WINS"] = "o_wins";
    GameState["TIE"] = "tie";
})(GameState || (GameState = {}));
export var ActionType;
(function (ActionType) {
    ActionType["PLACE"] = "place";
    ActionType["MOVE_PIECE"] = "move_piece";
    ActionType["MOVE_GRID"] = "move_grid";
})(ActionType || (ActionType = {}));
export var Direction;
(function (Direction) {
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
    Direction["LEFT"] = "left";
    Direction["RIGHT"] = "right";
    Direction["UP_LEFT"] = "up_left";
    Direction["UP_RIGHT"] = "up_right";
    Direction["DOWN_LEFT"] = "down_left";
    Direction["DOWN_RIGHT"] = "down_right";
})(Direction || (Direction = {}));
//# sourceMappingURL=constants.js.map