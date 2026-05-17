"use strict";

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

const connectFourView = {
    boardBox: null,
    playerText: null,
    infoText: null,
    leftFighter: null,
    rightFighter: null,

    init: function () {
        this.boardBox = document.querySelector("#board");
        this.playerText = document.querySelector("#playerInfo");
        this.infoText = document.querySelector("#message");
        this.leftFighter = document.querySelector(".left-fighter");
        this.rightFighter = document.querySelector(".right-fighter");

        this.createBoardButtons();
        this.listenToModel();
    },

    createBoardButtons: function () {
        this.boardBox.innerHTML = "";

        for (let row = 0; row < 6; row++) {
            for (let column = 0; column < 7; column++) {
                const field = document.createElement("button");

                field.className = "cell";
                field.dataset.row = row;
                field.dataset.column = column;

                this.boardBox.appendChild(field);
            }
        }
    },

    listenToModel: function () {
        document.addEventListener("connectfour:stoneinserted", (event) => {
            this.updateBoard(event.detail.board);
        });

        document.addEventListener("connectfour:playerchanged", (event) => {
            this.showCurrentPlayer(event.detail.player, event.detail.playerName);
        });

        document.addEventListener("connectfour:gameover", (event) => {
            this.showGameOver(event.detail);
        });

        document.addEventListener("connectfour:columnfull", () => {
            this.infoText.textContent = "This column is full.";
        });
    },

    //TODO: Update the field. Show the whole battlefield with all the stones
    //      that are already played.
    updateBoard: function (board) {
        const cells = document.querySelectorAll(".cell");

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);
            const value = board[row][column];

            cell.classList.remove("player-one");
            cell.classList.remove("player-two");
            cell.classList.remove("winning-cell");

            if (value === 1) {
                cell.classList.add("player-one");
            }

            if (value === 2) {
                cell.classList.add("player-two");
            }
        }
    },

    //TODO: Show the current player
    showCurrentPlayer: function (player, playerName) {
        this.playerText.textContent = "Current player: " + playerName;
        this.infoText.textContent = "Click into a column.";

        this.leftFighter.classList.remove("active-fighter");
        this.rightFighter.classList.remove("active-fighter");

        if (player === 1) {
            this.leftFighter.classList.add("active-fighter");
        } else {
            this.rightFighter.classList.add("active-fighter");
        }
    },

    //TODO: Notify the player when the game is over. Make it clear how the
    //      Game ended. If it's a win, show the winning stones.
    showGameOver: function (gameInfo) {
        this.leftFighter.classList.remove("active-fighter");
        this.rightFighter.classList.remove("active-fighter");

        if (gameInfo.reason === "draw") {
            this.infoText.textContent = "Draw. No winner.";
            return;
        }

        this.infoText.textContent = gameInfo.winnerName + " wins!";

        for (let i = 0; i < gameInfo.winningStones.length; i++) {
            const stone = gameInfo.winningStones[i];

            const selector = '.cell[data-row="' + stone.row + '"][data-column="' + stone.column + '"]';
            const cell = document.querySelector(selector);

            if (cell !== null) {
                cell.classList.add("winning-cell");
            }
        }
    }
};
