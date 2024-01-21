const cellSize = 100;
const cellPadding = cellSize * 0.2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 3 * cellSize;
canvas.height = 3 * cellSize;

const currentPlayer = document.getElementById("currentPlayer");
const winner = document.getElementById("winner");
const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

function resetBoard() {
    ctx.fillStyle = "black";
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    // Draw the vertical lines
    ctx.beginPath();
    ctx.moveTo(cellSize, 0);
    ctx.lineTo(cellSize, canvas.height);
    ctx.moveTo(cellSize * 2, 0);
    ctx.lineTo(cellSize * 2, canvas.height);

    // Draw the horizontal lines
    ctx.moveTo(0, cellSize);
    ctx.lineTo(canvas.width, cellSize);
    ctx.moveTo(0, cellSize * 2);
    ctx.lineTo(canvas.width, cellSize * 2);
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
        }
    }
    currentPlayer.textContent = "X";
    winner.textContent = "";
    canvas.addEventListener("click", handleClick);
}

function drawX(x, y) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x * cellSize + cellPadding, y * cellSize + cellPadding);
    ctx.lineTo(x * cellSize + cellSize - cellPadding, y * cellSize + cellSize - cellPadding);
    ctx.moveTo(x * cellSize + cellSize - cellPadding, y * cellSize + cellPadding);
    ctx.lineTo(x * cellSize + cellPadding, y * cellSize + cellSize - cellPadding);
    ctx.stroke();
}

function drawO(x, y) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const cellRadius = (cellSize - cellPadding) / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, cellRadius, 0, Math.PI * 2);
    ctx.stroke();
}

function markWinner() {
    // Check horizontal
    let foundWinner = "";
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize + cellSize / 2);
            ctx.lineTo(canvas.width, i * cellSize + cellSize / 2);
            ctx.stroke();
            foundWinner = board[i][0];
        }
    }

    // Check vertical
    for (let i = 0; i < 3; i++) {
        if (board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(i * cellSize + cellSize / 2, 0);
            ctx.lineTo(i * cellSize + cellSize / 2, canvas.height);
            ctx.stroke();
            foundWinner = board[i][0];
        }
    }

    // Check diagonal
    if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
        foundWinner = board[0][0];
    }
    if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(0, canvas.height);
        ctx.stroke();
        foundWinner = board[0][2];
    }

    if (foundWinner !== "") {
        winner.textContent = foundWinner + " wins!";
        canvas.removeEventListener("click", handleClick);
    }
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const indexX = Math.floor(x / cellSize);
    const indexY = Math.floor(y / cellSize);

    if (board[indexY][indexX] !== "") {
        return;
    }

    board[indexY][indexX] = currentPlayer.textContent;
    if (currentPlayer.textContent === "X") {
        drawX(indexX, indexY);
        currentPlayer.textContent = "O";
    } else {
        drawO(indexX, indexY);
        currentPlayer.textContent = "X";
    }
    markWinner();
}

document.getElementById("resetButton").addEventListener("click", resetBoard);
window.addEventListener("load", resetBoard);
