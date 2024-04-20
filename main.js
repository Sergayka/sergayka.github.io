let cells = [];
let stop = false;

for (let i = 1; i < 10; i++) {
    cells.push(document.querySelector(`.c${i}`));
}

isPressedCell = [null, null, null, null, null, null, null, null, null];



function checkCombination(a, b, c) {
    var result = isPressedCell[a] + isPressedCell[b] + isPressedCell[c]

    if (result === "xxx" || result === "ooo") {
        return result
    }

    switch (result) {
        case "xxnull":
            return ["x", c];

        case "xnullx":
            return ["x", b];

        case "nullxx":
            return ["x", a];

        case "oonull":
            return ["o", c];

        case "onullo":
            return ["o", b];

        case "nulloo":
            return ["o", a];
    }
}

function stopGame(a, b, c) {
    cells[a].style.backgroundColor = "#FF6A61";
    cells[b].style.backgroundColor = "#FF6A61";
    cells[c].style.backgroundColor = "#FF6A61";

    stop = true;
}

function stopGameTie() {
    cells.forEach(cell => {
        cell.style.backgroundColor = '#FFDFDC';
    }); 
    stop = true;
}

function checkWin() {
    let tie = false;
    for (let i = 0; i < 9; i++) {
        if (isPressedCell[i] === null) {
            tie = true;
        } 
    }
    
    if (!(tie)) {
        stopGameTie();
    }

    for (let i = 0; i < 3; i++) {
        let result = checkCombination(i, i + 3, i + 6)

        if (result === "xxx" || result === "ooo") {
            stopGame(i, i + 3, i + 6);
        }
    }

    for (let i = 0; i <= 6; i += 3) {
        let result = checkCombination(i, i + 1, i + 2);

        if (result === "xxx" || result === "ooo") {
            stopGame(i, i + 1, i + 2);
        }
    }

    result = checkCombination(0, 4, 8);
    if (result === "xxx" || result === "ooo") {
        stopGame(0, 4, 8);
    }

    result = checkCombination(2, 4, 6);
    if (result === "xxx" || result === "ooo") {
        stopGame(2, 4, 6);
    }
}

function opponent() {

    for (let i = 0; i < 3; i++) {
        let result = checkCombination(i, i + 3, i + 6);

        if (typeof (result) === "object" && result[0] === "o") {
            cells[result[1]].textContent = 'O';
            cells[result[1]].style.backgroundColor = '#B7D4FF';
            isPressedCell[result[1]] = 'o';
            return;
        }
    }

    for (let i = 0; i <= 6; i += 3) {
        let result = checkCombination(i, i + 1, i + 2);

        if (typeof (result) === "object" && result[0] === "o") {
            cells[result[1]].textContent = "O";
            cells[result[1]].style.backgroundColor = '#B7D4FF';
            isPressedCell[result[1]] = "o";
            return;
        }
    }

    let result = checkCombination(0, 4, 8);
    if (typeof (result) === "object" && result[0] === "o") {
        cells[result[1]].textContent = "O";
        cells[result[1]].style.backgroundColor = '#B7D4FF';
        isPressedCell[result[1]] = "o";
        return;
    }

    result = checkCombination(2, 4, 6);
    if (typeof (result) === "object" && result[0] === "o") {
        cells[result[1]].textContent = "O";
        cells[result[1]].style.backgroundColor = '#B7D4FF';
        isPressedCell[result[1]] = "o";
        return;
    }

    for (let i = 0; i < 3; i++) {
        let result = checkCombination(i, i + 3, i + 6);

        if (typeof (result) === "object" && result[0] === "x") {
            cells[result[1]].textContent = "O";
            cells[result[1]].style.backgroundColor = '#B7D4FF';
            isPressedCell[result[1]] = "o";
            return;
        }
    }

    for (let i = 0; i <= 6; i += 3) {
        let result = checkCombination(i, i + 1, i + 2);

        if (typeof (result) === "object" && result[0] === "x") {
            cells[result[1]].textContent = "O";
            cells[result[1]].style.backgroundColor = '#B7D4FF';
            isPressedCell[result[1]] = "o";
            return;
        }
    }

    result = checkCombination(0, 4, 8);
    if (typeof (result) === "object" && result[0] === "x") {
        cells[result[1]].textContent = "O";
        cells[result[1]].style.backgroundColor = '#B7D4FF';
        isPressedCell[result[1]] = "o";
        return;
    }

    result = checkCombination(2, 4, 6);
    if (typeof (result) === "object" && result[0] === "x") {
        cells[result[1]].textContent = "O";
        cells[result[1]].style.backgroundColor = '#B7D4FF';
        isPressedCell[result[1]] = "o";
        return;
    }

    let tempArr = [];

    for (let i = 0; i < 9; i++) {
        if (isPressedCell[i] === null) {
            tempArr.push(i);
        }
    }

    let randIndexTempArr = Math.floor(Math.random() * tempArr.length);

    let randNull = tempArr[randIndexTempArr];

    cells[randNull].textContent = 'O';
    cells[randNull].style.backgroundColor = '#B7D4FF';
    isPressedCell[randNull] = "o";
}


for (let i = 0; i < 9; i++) {
    cells[i].addEventListener('touchend', () => {
        if (stop === true) {
            return;
        }

        if (isPressedCell[i] == null) {
            cells[i].textContent = 'X';
            cells[i].style.backgroundColor = '#C9FFBF';
            isPressedCell[i] = 'x';
        } else {
            return
        }
        
        checkWin();
        
        if (stop === true) {
            return;
        }
        
        opponent();
        
        checkWin();
    });

    cells[i].addEventListener('click', () => {
        if (stop === true) {
            return;
        }

        if (isPressedCell[i] == null) {
            cells[i].textContent = 'X';
            cells[i].style.backgroundColor = '#C9FFBF';
            isPressedCell[i] = 'x';
        } else {
            return
        }
        
        checkWin();
        
        if (stop === true) {
            return;
        }
        
        opponent();
        
        checkWin();
    });

}

document.querySelector('.restart').addEventListener('touchend', () => {
    if (stop == false) {
        return;
    }
    stop = false;
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
        cell.textContent = '';
    });
    isPressedCell = [null, null, null, null, null, null, null, null, null];
});

document.querySelector('.clear').addEventListener('touchend', () => {
    stop = false;
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
        cell.textContent = '';
    });
    isPressedCell = [null, null, null, null, null, null, null, null, null];
});
document.querySelector('.restart').addEventListener('click', () => {
    if (stop == false) {
        return;
    }
    stop = false;
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
        cell.textContent = '';
    });
    isPressedCell = [null, null, null, null, null, null, null, null, null];
});

document.querySelector('.clear').addEventListener('click', () => {
    stop = false;
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
        cell.textContent = '';
    });
    isPressedCell = [null, null, null, null, null, null, null, null, null];
});