"use strict";

class TicTacToe {
    constructor(canvasID) {
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext("2d");
        this.gameOver = false;
        this.currentPlayer = "X";
        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        this.canvas.addEventListener("click", (event) => this.handleClick(event));
        this.reset();
    }

    cellSize() {
        return this.canvas.width / 3;
    }

    cellPadding() {
        return this.cellSize() * 0.2;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }

    reset() {
        const canvasSize = Math.min(window.innerWidth, window.innerHeight) * 0.7;
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        this.gameOver = false;
        this.currentPlayer = "X";

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();

        // Draw the vertical lines
        this.ctx.moveTo(this.cellSize(), 0);
        this.ctx.lineTo(this.cellSize(), this.canvas.height);
        this.ctx.moveTo(this.cellSize() * 2, 0);
        this.ctx.lineTo(this.cellSize() * 2, this.canvas.height);

        // Draw the horizontal lines
        this.ctx.moveTo(0, this.cellSize());
        this.ctx.lineTo(this.canvas.width, this.cellSize());
        this.ctx.moveTo(0, this.cellSize() * 2);
        this.ctx.lineTo(this.canvas.width, this.cellSize() * 2);
        this.ctx.stroke();

        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        document.getElementById("currentPlayer").innerText = "X";
        document.getElementById("winner").innerText = "";
    }

    drawX(x, y) {
        const xLeft = this.cellSize() * x + this.cellPadding();
        const xRight = xLeft + this.cellSize() - this.cellPadding() * 2;
        const yTop = this.cellSize() * y + this.cellPadding();
        const yBottom = yTop + this.cellSize() - this.cellPadding() * 2;
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(xLeft, yTop);
        this.ctx.lineTo(xRight, yBottom);
        this.ctx.moveTo(xLeft, yBottom);
        this.ctx.lineTo(xRight, yTop);
        this.ctx.stroke();
    }

    drawO(x, y) {
        const centerX = x * this.cellSize() + this.cellSize() / 2;
        const centerY = y * this.cellSize() + this.cellSize() / 2;
        const cellRadius = (this.cellSize() - this.cellPadding()) / 2;
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, cellRadius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    checkWin() {
        for (let i = 0; i < 3; i++) {
            // Check horizontal
            let rowSet = new Set(this.board[i]);
            if (rowSet.size == 1 && !rowSet.has("")) {
                let lineY = i * this.cellSize() + this.cellSize() / 2;
                return {
                    lineStartX: 0,
                    lineStartY: lineY,
                    lineEndX: this.canvas.width,
                    lineEndY: lineY,
                    foundWinner: this.board[i][0],
                };
            }

            // Check vertical
            let columnSet = new Set([this.board[0][i], this.board[1][i], this.board[2][i]]);
            if (columnSet.size == 1 && !columnSet.has("")) {
                let lineX = i * this.cellSize() + this.cellSize() / 2;
                return {
                    lineStartX: lineX,
                    lineStartY: 0,
                    lineEndX: lineX,
                    lineEndY: this.canvas.height,
                    foundWinner: this.board[0][i],
                };
            }
        }

        // Check diagonal (top left to bottom right)
        let diagonalSet = new Set([this.board[0][0], this.board[1][1], this.board[2][2]]);
        if (diagonalSet.size == 1 && !diagonalSet.has(""))
            return {
                lineStartX: 0,
                lineStartY: 0,
                lineEndX: this.canvas.width,
                lineEndY: this.canvas.height,
                foundWinner: this.board[1][1],
            };

        // Check diagonal (bottom left to top right)
        diagonalSet = new Set([this.board[2][0], this.board[1][1], this.board[0][2]]);
        if (diagonalSet.size == 1 && !diagonalSet.has(""))
            return {
                lineStartX: 0,
                lineStartY: this.canvas.height,
                lineEndX: this.canvas.width,
                lineEndY: 0,
                foundWinner: this.board[1][1],
            };

        return { foundWinner: "" };
    }

    checkDraw() {
        for (let i = 0; i < 3; i++) {
            let rowSet = new Set(this.board[i]);
            if (rowSet.has("")) return false;
        }
        return true;
    }

    getMousePosition(canvas, event) {
        var rect = this.canvas.getBoundingClientRect();
        var scaleX = this.canvas.width / rect.width;
        var scaleY = this.canvas.height / rect.height;
        return {
            x: Math.floor(((event.clientX - rect.left) * scaleX) / this.cellSize()),
            y: Math.floor(((event.clientY - rect.top) * scaleY) / this.cellSize()),
        };
    }

    handleClick(event) {
        const cell = this.getMousePosition(this.canvas, event);
        console.debug(`Clicked row ${cell.y} column ${cell.x}`);
        if (this.gameOver || this.board[cell.y][cell.x] !== "") return;

        this.board[cell.y][cell.x] = this.currentPlayer;
        this.currentPlayer === "X" ? this.drawX(cell.x, cell.y) : this.drawO(cell.x, cell.y);
        this.switchPlayer();
        document.getElementById("currentPlayer").innerText = this.currentPlayer;

        if (this.checkDraw()) {
            this.gameOver = true;
            document.getElementById("winner").innerText = "Draw!";
        }

        let result = this.checkWin();
        if (result.foundWinner !== "") {
            this.gameOver = true;
            this.ctx.strokeStyle = "red";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(result.lineStartX, result.lineStartY);
            this.ctx.lineTo(result.lineEndX, result.lineEndY);
            this.ctx.stroke();
            document.getElementById("winner").innerText = result.foundWinner + " wins!";
        }
    }
}

window.addEventListener("load", () => {
    let game = new TicTacToe("gameCanvas");
    document.getElementById("resetButton").addEventListener("click", () => game.reset());
    window.addEventListener("resize", () => game.reset());
});
