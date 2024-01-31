let inputArea = document.getElementById('inputArea');
let outputArea = document.getElementById('outputArea');

function appendToInput(value) {
    inputArea.value += value;
}

function deleteLastChar() {
    inputArea.value = inputArea.value.slice(0, -1);
}

function clearInput() {
    inputArea.value = '';
    outputArea.innerHTML = '';
}

function calculate() {
    let expression = inputArea.value;
    let result;
    try {
        result = eval(expression);
        outputArea.innerHTML = `${expression} = ${result}`;
        inputArea.value = `${expression} = ${result}`;
    } catch (error) {
        outputArea.innerHTML = 'Error';
        inputArea.value = 'Error';
    }
}
