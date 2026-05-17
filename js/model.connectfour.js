"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

const connectFourModel = {
    rows: 6,
    columns: 7,
    currentPlayer: 1,
    gameOver: false,
    board: [],
    winningStones: [],

    names: {
        1: "Son Goku",
        2: "Piccolo"
    },

    init: function () {
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winningStones = [];
        this.createEmptyBoard();

        this.sendStoneInsertedEvent();
        this.sendPlayerChangedEvent();
    },

    //TODO: Prepare some customEvents. The model should dispatch events when
    //      - The Player Changes
    //      - A stone was inserted
    //      - The Game is over (Draw or Winner)
    //      Don't forget to give your events a namespace.
    //      For each customEvent, just make a >method< for your model-object,
    //      that, when called, dispatches the event. Nothing else should
    //      happen in those methods.
    sendPlayerChangedEvent: function () {
        const playerEvent = new CustomEvent("connectfour:playerchanged", {
            detail: {
                player: this.currentPlayer,
                playerName: this.names[this.currentPlayer]
            }
        });

        document.dispatchEvent(playerEvent);
    },

    sendStoneInsertedEvent: function () {
        const stoneEvent = new CustomEvent("connectfour:stoneinserted", {
            detail: {
                board: this.board
            }
        });

        document.dispatchEvent(stoneEvent);
    },

    sendGameOverEvent: function (reason) {
        const gameOverEvent = new CustomEvent("connectfour:gameover", {
            detail: {
                reason: reason,
                winner: this.currentPlayer,
                winnerName: this.names[this.currentPlayer],
                winningStones: this.winningStones
            }
        });

        document.dispatchEvent(gameOverEvent);
    },

    sendColumnFullEvent: function () {
        document.dispatchEvent(new CustomEvent("connectfour:columnfull"));
    },

    //TODO: Initiate the battlefield. Your model needs a representation of the
    //      battlefield as data (two-dimensional array). Obviously, there are
    //      no stones yet in the field.
    createEmptyBoard: function () {
        this.board = [];

        for (let row = 0; row < this.rows; row++) {
            const newRow = [];

            for (let column = 0; column < this.columns; column++) {
                newRow.push(0);
            }

            this.board.push(newRow);
        }
    },

    //TODO: The model should offer a method to insert a stone at a given column.
    //      If the stone can be inserted, the model should insert the stone,
    //      dispatch an event to let the world know that the battlefield has changed
    //      and check if the game is over now.
    //      Hint: This method will be called later by your controller, when the
    //      user makes an according input.
    insertStone: function (column) {
        if (this.gameOver) {
            return;
        }

        let emptyRow = -1;

        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][column] === 0) {
                emptyRow = row;
                break;
            }
        }

        if (emptyRow === -1) {
            this.sendColumnFullEvent();
            return;
        }

        this.board[emptyRow][column] = this.currentPlayer;
        this.sendStoneInsertedEvent();

        if (this.hasPlayerWon(emptyRow, column)) {
            this.gameOver = true;
            this.sendGameOverEvent("win");
            return;
        }

        if (this.isBoardFull()) {
            this.gameOver = true;
            this.sendGameOverEvent("draw");
            return;
        }

        this.changePlayer();
    },

    //TODO: Methods to check if the game is over, either by draw or a win.
    //      Let the world know in both cases what happend. If it's a win,
    //      Don't forget to store the winning stones and add this >detail<
    //      to your custom event.
    hasPlayerWon: function (lastRow, lastColumn) {
        const checks = [
            { row: 0, column: 1 },
            { row: 1, column: 0 },
            { row: 1, column: 1 },
            { row: 1, column: -1 }
        ];

        for (let i = 0; i < checks.length; i++) {
            const direction = checks[i];

            const stones = [
                { row: lastRow, column: lastColumn }
            ];

            this.checkLine(stones, lastRow, lastColumn, direction.row, direction.column);
            this.checkLine(stones, lastRow, lastColumn, -direction.row, -direction.column);

            if (stones.length >= 4) {
                this.winningStones = stones.slice(0, 4);
                return true;
            }
        }

        return false;
    },

    checkLine: function (stones, startRow, startColumn, rowStep, columnStep) {
        let row = startRow + rowStep;
        let column = startColumn + columnStep;

        while (row >= 0 && row < this.rows && column >= 0 && column < this.columns) {
            if (this.board[row][column] !== this.currentPlayer) {
                break;
            }

            stones.push({
                row: row,
                column: column
            });

            row = row + rowStep;
            column = column + columnStep;
        }
    },

    isBoardFull: function () {
        for (let column = 0; column < this.columns; column++) {
            if (this.board[0][column] === 0) {
                return false;
            }
        }

        return true;
    },

    //TODO: Method to change the current player (and dispatch the according event).
    changePlayer: function () {
        if (this.currentPlayer === 1) {
            this.currentPlayer = 2;
        } else {
            this.currentPlayer = 1;
        }

        this.sendPlayerChangedEvent();
    }
};
