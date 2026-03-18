/**
 * Lógica de Interacción - Calculadora Híbrida
 * @description Conexión con Backend Python + Respaldo Local en JS
 * @author Joshua Chiguay
 */

let expression = "";

function addChar(char) {
    const screen = document.getElementById('screen');
    
    // Evitar múltiples ceros al inicio
    if (expression === "0" && char !== ".") expression = "";
    
    expression += char;
    screen.innerText = expression;
    
    hapticFeedback();
}

function clearScreen() {
    expression = "";
    document.getElementById('screen').innerText = "0";
}

async function sendToBackend() {
    const screen = document.getElementById('screen');
    if (!expression) return;

    screen.style.opacity = "0.5"; 

    try {
        // 1. INTENTO DE CÁLCULO EN EL BACKEND (PYTHON)
        // Usamos un timeout corto (2s) para no dejar al usuario esperando
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch('http://127.0.0.1:8000/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: expression }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();
        screen.style.opacity = "1";

        if (data.status === "success") {
            console.log("Calculado por Backend (Python)");
            screen.innerText = data.result;
            expression = data.result; 
        } else {
            screen.innerText = "Error";
            expression = "";
        }

    } catch (error) {
        // 2. LÓGICA DE RESPALDO (OFFLINE / GITHUB PAGES)
        // Entra aquí si el fetch falla o el servidor está apagado
        console.warn("Servidor offline. Ejecutando lógica de respaldo local.");
        
        try {
            // Reemplazamos los caracteres visuales por operadores de JS si fuera necesario
            // (Ej: convertir '×' a '*' o '÷' a '/')
            let safeExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
            
            const result = eval(safeExpression);
            
            // Formateo de ingeniería (máximo 4 decimales)
            const finalResult = Number.isInteger(result) ? result : result.toFixed(4);

            screen.style.opacity = "1";
            screen.innerText = finalResult;
            expression = finalResult.toString();

            // Pequeño guiño visual: el texto brilla un poco en modo local
            screen.style.textShadow = "0 0 10px rgba(255,255,255,0.5)";
            setTimeout(() => screen.style.textShadow = "none", 500);

        } catch (jsError) {
            screen.style.opacity = "1";
            screen.innerText = "Error";
            expression = "";
        }
    }
}

function hapticFeedback() {
    const body = document.querySelector('.calculator-body');
    if (body) {
        body.style.transform = "scale(0.98)";
        setTimeout(() => body.style.transform = "scale(1)", 100);
    }
}