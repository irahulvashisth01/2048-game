// ===============================
// 2048 GAME
// ===============================

const SIZE = 4;

let board = [];
let score = 0;

const boardContainer = document.querySelector(".board");
const tiles = document.querySelectorAll(".tile");
const scoreElement = document.querySelector("#score");
const restartButton = document.querySelector("#restart");


// ===============================
// START GAME
// ===============================

function startGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;

    addRandomTile();
    addRandomTile();

    display();
}


// ===============================
// DISPLAY BOARD
// ===============================

function display() {

    let index = 0;

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            const tile = tiles[index];

            const value = board[row][col];

            tile.innerText = value === 0 ? "" : value;

            if (value === 0) {

                tile.style.backgroundColor = "#aaa";
                tile.style.color = "#111";

            } else {

                tile.style.backgroundColor = getTileColor(value);

                if (value >= 128) {
                    tile.style.color = "white";
                } else {
                    tile.style.color = "#111";
                }
            }

            index++;
        }
    }

    scoreElement.innerText = score;
}


// ===============================
// ADD RANDOM TILE
// ===============================

function addRandomTile() {

    const emptyCells = [];

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });

            }
        }
    }

    // No empty cell
    if (emptyCells.length === 0) {
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * emptyCells.length);

    const cell = emptyCells[randomIndex];

    // 90% chance = 2
    // 10% chance = 4

    board[cell.row][cell.col] =
        Math.random() < 0.9 ? 2 : 4;
}


// ===============================
// REMOVE ZEROES
// ===============================

function removeZeros(array) {

    return array.filter(value => value !== 0);

}


// ===============================
// MERGE ROW
// ===============================

function mergeLine(line) {

    line = removeZeros(line);

    let result = [];

    for (let i = 0; i < line.length; i++) {

        if (line[i] === line[i + 1]) {

            const mergedValue = line[i] * 2;

            result.push(mergedValue);

            score += mergedValue;

            i++;

        } else {

            result.push(line[i]);

        }
    }

    while (result.length < SIZE) {
        result.push(0);
    }

    return result;
}


// ===============================
// MOVE LEFT
// ===============================

function moveLeft() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const oldRow = [...board[row]];

        const newRow = mergeLine(board[row]);

        board[row] = newRow;

        if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) {
            moved = true;
        }
    }

    return moved;
}


// ===============================
// MOVE RIGHT
// ===============================

function moveRight() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const oldRow = [...board[row]];

        const reversed = [...board[row]].reverse();

        const newRow = mergeLine(reversed).reverse();

        board[row] = newRow;

        if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) {
            moved = true;
        }
    }

    return moved;
}


// ===============================
// MOVE UP
// ===============================

function moveUp() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        let column = [];

        for (let row = 0; row < SIZE; row++) {

            column.push(board[row][col]);

        }

        const oldColumn = [...column];

        const newColumn = mergeLine(column);

        for (let row = 0; row < SIZE; row++) {

            board[row][col] = newColumn[row];

        }

        if (
            JSON.stringify(oldColumn) !==
            JSON.stringify(newColumn)
        ) {

            moved = true;

        }
    }

    return moved;
}


// ===============================
// MOVE DOWN
// ===============================

function moveDown() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        let column = [];

        for (let row = 0; row < SIZE; row++) {

            column.push(board[row][col]);

        }

        const oldColumn = [...column];

        const reversed = [...column].reverse();

        const newColumn = mergeLine(reversed).reverse();

        for (let row = 0; row < SIZE; row++) {

            board[row][col] = newColumn[row];

        }

        if (
            JSON.stringify(oldColumn) !==
            JSON.stringify(newColumn)
        ) {

            moved = true;

        }
    }

    return moved;
}


// ===============================
// KEYBOARD CONTROLS
// ===============================

window.addEventListener("keydown", function (event) {

    let moved = false;

    switch (event.key) {

        case "ArrowLeft":

            moved = moveLeft();

            break;

        case "ArrowRight":

            moved = moveRight();

            break;

        case "ArrowUp":

            moved = moveUp();

            break;

        case "ArrowDown":

            moved = moveDown();

            break;

        default:

            return;
    }

    // Prevent page scrolling
    event.preventDefault();

    if (moved) {

        addRandomTile();

        display();

        checkGameOver();
    }
});


// ===============================
// TILE COLORS
// ===============================

function getTileColor(value) {

    const colors = {

        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e"

    };

    return colors[value] || "#3c3a32";
}


// ===============================
// GAME OVER
// ===============================

function checkGameOver() {

    // Empty cell exists
    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {

                return false;

            }
        }
    }


    // Check horizontal merges
    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE - 1; col++) {

            if (
                board[row][col] ===
                board[row][col + 1]
            ) {

                return false;

            }
        }
    }


    // Check vertical merges
    for (let col = 0; col < SIZE; col++) {

        for (let row = 0; row < SIZE - 1; row++) {

            if (
                board[row][col] ===
                board[row + 1][col]
            ) {

                return false;

            }
        }
    }


    setTimeout(() => {

        alert("Game Over! 🎮");

    }, 100);

    return true;
}


// ===============================
// WIN CONDITION
// ===============================

function checkWin() {

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 2048) {

                alert("🎉 Congratulations! You reached 2048!");

                return true;
            }
        }
    }

    return false;
}


// ===============================
// MOBILE SWIPE
// ===============================

let touchStartX = 0;
let touchStartY = 0;

boardContainer.addEventListener(
    "touchstart",
    function (event) {

        const touch = event.touches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

    },
    { passive: true }
);


boardContainer.addEventListener(
    "touchend",
    function (event) {

        const touch = event.changedTouches[0];

        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        const minSwipeDistance = 30;

        let moved = false;

        // Horizontal swipe
        if (Math.abs(dx) > Math.abs(dy)) {

            if (Math.abs(dx) < minSwipeDistance) {
                return;
            }

            if (dx > 0) {

                moved = moveRight();

            } else {

                moved = moveLeft();

            }

        }

        // Vertical swipe
        else {

            if (Math.abs(dy) < minSwipeDistance) {
                return;
            }

            if (dy > 0) {

                moved = moveDown();

            } else {

                moved = moveUp();

            }
        }


        if (moved) {

            addRandomTile();

            display();

            checkGameOver();

        }

    }
);


// ===============================
// RESTART GAME
// ===============================

restartButton.addEventListener(
    "click",
    startGame
);


// ===============================
// START
// ===============================

startGame();