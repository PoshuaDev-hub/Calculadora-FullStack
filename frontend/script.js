/**
 * Lógica de Interacción - Calculadora Neutra
 * @author Joshua Chiguay
 */

let expression = "";

function addChar(char) {
    const screen = document.getElementById('screen');
    
    // Evitar múltiples ceros al inicio
    if (expression === "0" && char !== ".") expression = "";
    
    expression += char;
    screen.innerText = expression;
    
    // Feedback táctil visual
    hapticFeedback();
}

function clearScreen() {
    expression = "";
    document.getElementById('screen').innerText = "0";
}

async function sendToBackend() {
    const screen = document.getElementById('screen');
    if (!expression) return;

    screen.style.opacity = "0.5"; // Efecto de carga

    try {
        const response = await fetch('http://127.0.0.1:8000/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: expression })
        });

        const data = await response.json();
        screen.style.opacity = "1";

        if (data.status === "success") {
            screen.innerText = data.result;
            expression = data.result; 
        } else {
            screen.innerText = "Error";
            expression = "";
        }
    } catch (error) {
        screen.style.opacity = "1";
        screen.innerText = "Offline";
    }
}

// Función extra para animar botones al hacer click
function hapticFeedback() {
    const body = document.querySelector('.calculator-body');
    body.style.transform = "scale(0.99)";
    setTimeout(() => body.style.transform = "scale(1)", 100);
}