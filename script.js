/*
COMPLETE CALCULATOR
This file handles:
- Numbers
- Operators
- Decimal numbers
- Percentage
- Positive / Negative
- Delete
- Clear
- Calculation
- History
- Keyboard input
*/

let currentNumber = "0";
let previousNumber = null;
let operation = null;
let shouldResetDisplay = false;

const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");

function updateDisplay() {
    currentDisplay.textContent = formatNumber(currentNumber);

    if (previousNumber !== null && operation !== null) {
        previousDisplay.textContent = `${formatNumber(previousNumber)} ${getOperationSymbol(operation)}`;
    } else {
        previousDisplay.textContent = "";
    }
}

function formatNumber(number) {
    if (number === "Error") {
        return "Error";
    }

    const numericNumber = Number(number);

    if (!Number.isFinite(numericNumber)) {
        return "Error";
    }

    return numericNumber.toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}

function getOperationSymbol(operation) {
    switch (operation) {
        case "+":
            return "+";
        case "-":
            return "−";
        case "*":
            return "×";
        case "/":
            return "÷";
        default:
            return "";
    }
}

function enterNumber(number) {
    if (currentNumber === "Error") {
        clearCalculator();
    }

    if (shouldResetDisplay) {
        currentNumber = number;
        shouldResetDisplay = false;
    } else {
        if (currentNumber === "0") {
            currentNumber = number;
        } else {
            currentNumber += number;
        }
    }

    updateDisplay();
}

function enterDecimal() {
    if (currentNumber === "Error") {
        clearCalculator();
    }

    if (shouldResetDisplay) {
        currentNumber = "0.";
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (!currentNumber.includes(".")) {
        currentNumber += ".";
    }

    updateDisplay();
}

function chooseOperation(selectedOperation) {
    if (currentNumber === "Error") {
        return;
    }

    if (operation !== null && !shouldResetDisplay) {
        calculate(false);
    }

    previousNumber = Number(currentNumber);
    operation = selectedOperation;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate(addToHistory = true) {
    if (previousNumber === null || operation === null) {
        return;
    }

    const current = Number(currentNumber);
    let result;

    switch (operation) {
        case "+":
            result = previousNumber + current;
            break;
        case "-":
            result = previousNumber - current;
            break;
        case "*":
            result = previousNumber * current;
            break;
        case "/":
            if (current === 0) {
                currentNumber = "Error";
                previousNumber = null;
                operation = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = previousNumber / current;
            break;
        default:
            return;
    }

    result = Math.round((result + Number.EPSILON) * 10000000000) / 10000000000;

    const expression = `${formatNumber(previousNumber)} ${getOperationSymbol(operation)} ${formatNumber(current)}`;

    currentNumber = String(result);
    previousNumber = null;
    operation = null;
    shouldResetDisplay = true;

    updateDisplay();

    if (addToHistory) {
        addHistory(expression, result);
    }
}

function clearCalculator() {
    currentNumber = "0";
    previousNumber = null;
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteNumber() {
    if (currentNumber === "Error") {
        clearCalculator();
        return;
    }

    if (shouldResetDisplay) {
        return;
    }

    if (currentNumber.length === 1) {
        currentNumber = "0";
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }

    updateDisplay();
}

function calculatePercentage() {
    if (currentNumber === "Error") {
        return;
    }

    const number = Number(currentNumber);
    currentNumber = String(number / 100);
    updateDisplay();
}

function changeSign() {
    if (currentNumber === "Error") {
        return;
    }

    if (Number(currentNumber) === 0) {
        return;
    }

    if (currentNumber.startsWith("-")) {
        currentNumber = currentNumber.substring(1);
    } else {
        currentNumber = "-" + currentNumber;
    }

    updateDisplay();
}

function addHistory(expression, result) {
    const item = document.createElement("div");
    item.classList.add("history-item");

    const expressionElement = document.createElement("span");
    expressionElement.classList.add("history-expression");
    expressionElement.textContent = expression;

    const resultElement = document.createElement("span");
    resultElement.classList.add("history-result");
    resultElement.textContent = `= ${formatNumber(String(result))}`;

    item.appendChild(expressionElement);
    item.appendChild(resultElement);

    const emptyMessage = document.querySelector(".empty-history");
    if (emptyMessage) {
        emptyMessage.remove();
    }

    historyList.prepend(item);
}

clearHistoryButton.addEventListener("click", function () {
    historyList.innerHTML = '<p class="empty-history">No calculations yet</p>';
});

const buttons = document.querySelectorAll(".buttons button");
buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (button.dataset.number !== undefined) {
            enterNumber(button.dataset.number);
            return;
        }

        if (button.dataset.operation !== undefined) {
            chooseOperation(button.dataset.operation);
            return;
        }

        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearCalculator();
                break;
            case "delete":
                deleteNumber();
                break;
            case "percent":
                calculatePercentage();
                break;
            case "sign":
                changeSign();
                break;
            case "decimal":
                enterDecimal();
                break;
            case "calculate":
                calculate(true);
                break;
        }
    });
});

document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (key >= "0" && key <= "9") {
        enterNumber(key);
        return;
    }

    if (key === ".") {
        enterDecimal();
        return;
    }

    if (key === "+" || key === "-" || key === "*" || key === "/") {
        chooseOperation(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate(true);
        return;
    }

    if (key === "Backspace") {
        deleteNumber();
        return;
    }

    if (key === "Escape") {
        clearCalculator();
        return;
    }

    if (key === "%") {
        calculatePercentage();
        return;
    }
});

updateDisplay();
