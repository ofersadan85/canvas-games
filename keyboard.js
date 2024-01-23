"use strict";

export const englishKeys = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"]; // cSpell:disable-line
export const hebrewKeys = ["קראטוןםפ", "שדגכעיחלך", "זסבהנמצת"]; // cSpell:disable-line

export class KeyboardKey {
    constructor(char, x, y, keySize) {
        this.char = char;
        this.x = x;
        this.y = y;
        this.keySize = keySize;
        this.padding = 5;
        this.borderWidth = 1;
        this.borderColor = "gray";
        this.fillColor = "white";
        this.textColor = "black";
        this.currentBorderWidth = this.borderWidth;
        this.currentBorderColor = this.borderColor;
        this.currentFillColor = this.fillColor;
        this.currentTextColor = this.textColor;
    }

    draw(ctx) {
        const rectX = this.x - this.keySize / 2;
        const rectY = this.y - this.keySize / 2;
        ctx.font = `${this.keySize * 0.8}px Arial`;
        ctx.fillStyle = this.currentFillColor;
        ctx.fillRect(
            rectX + this.padding,
            rectY + this.padding,
            this.keySize - this.padding,
            this.keySize - this.padding
        );
        ctx.strokeStyle = this.currentBorderColor;
        ctx.lineWidth = this.currentBorderWidth;
        ctx.strokeRect(
            rectX + this.padding,
            rectY + this.padding,
            this.keySize - this.padding,
            this.keySize - this.padding
        );

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.currentTextColor;
        ctx.fillText(this.char, this.x + this.padding / 2, this.y + this.padding);
    }

    collides(x, y) {
        const rectX = this.x - this.keySize / 2;
        const rectY = this.y - this.keySize / 2;
        return rectX <= x && x <= rectX + this.keySize && rectY <= y && y <= rectY + this.keySize;
    }
}

export default class Keyboard {
    constructor(chars = englishKeys, x, y, width, height) {
        this.chars = chars;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        const maxRowLength = Math.max(...this.chars.map((row) => row.length));
        this.keySize = this.width / maxRowLength;
        this.keys = [];
        for (let row = 0; row < this.chars.length; row++) {
            const space = ((maxRowLength - this.chars[row].length) * this.keySize) / 2;
            for (let col = 0; col < this.chars[row].length; col++) {
                const char = this.chars[row][col];
                const x = this.x + space + col * this.keySize + this.keySize / 2;
                const y = this.y + row * this.keySize + this.keySize / 2;
                const key = new KeyboardKey(char, x, y, this.keySize);
                this.keys.push(key);
            }
        }
    }

    draw(ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        for (let key of this.keys) {
            key.draw(ctx);
        }
    }

    onHover(ctx, x, y) {
        for (let key of this.keys) {
            if (key.collides(x, y)) {
                key.currentBorderColor = "black";
                key.currentFillColor = "darkblue";
                key.currentTextColor = "gray";
            } else {
                key.currentBorderColor = key.borderColor;
                key.currentFillColor = key.fillColor;
                key.currentTextColor = key.textColor;
            }
            key.draw(ctx);
        }
    }

    onClick(ctx, x, y) {
        for (let key of this.keys) {
            if (key.collides(x, y)) {
                key.currentBorderColor = "black";
                key.currentFillColor = "#700";
                key.currentTextColor = "white";
            }
            key.draw(ctx);
        }
    }

    onMouseUp(ctx, x, y) {
        for (let key of this.keys) {
            if (key.collides(x, y)) {
                key.currentBorderColor = "black";
                key.currentFillColor = "darkblue";
                key.currentTextColor = "gray";
            }
            key.draw(ctx);
        }
    }
}

function getMousePosition(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
    };
}

window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth * 0.96; // TODO: fix this
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    let keyboard = new Keyboard(englishKeys, 0, 0, canvas.width, canvas.height);
    keyboard.draw(ctx);
    document.getElementById("languageSelect").addEventListener("change", (event) => {
        const languages = [englishKeys, hebrewKeys];
        keyboard = new Keyboard(languages[event.target.selectedIndex], 0, 0, canvas.width, canvas.height);
        keyboard.draw(ctx);
    });

    canvas.addEventListener("mousemove", (event) => {
        const mousePos = getMousePosition(event, canvas);
        keyboard.onHover(ctx, mousePos.x, mousePos.y);
    });
    canvas.addEventListener("mousedown", (event) => {
        const mousePos = getMousePosition(event, canvas);
        keyboard.onClick(ctx, mousePos.x, mousePos.y);
    });
    canvas.addEventListener("mouseup", (event) => {
        const mousePos = getMousePosition(event, canvas);
        keyboard.onMouseUp(ctx, mousePos.x, mousePos.y);
    });
});
