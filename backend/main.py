"""
CALCULADORA FULL STACK - Engine de Cálculo (Optimizado)
@description API REST desarrollada en FastAPI para procesamiento matemático.
@author Joshua Chiguay
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="MathEngine API")

# --- CONFIGURACIÓN DE CORS ---
# Permite que tu frontend acceda al backend sin bloqueos de seguridad del navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalculationRequest(BaseModel):
    expression: str

@app.post("/calculate")
async def calculate(data: CalculationRequest):
    try:
        # 1. Pre-procesamiento: Limpiamos espacios y estandarizamos decimales
        # Convertimos comas en puntos por si el teclado envía formatos distintos
        expr = data.expression.replace(',', '.')
        
        # Log técnico: Verás esto en tu terminal de VS Code
        print(f"Recibido para calcular: {expr}")

        # 2. Validación de Seguridad
        # Solo permitimos números y operadores básicos para evitar inyección de código
        allowed_chars = "0123456789+-*/(). "
        if not all(char in allowed_chars for char in expr):
            return {"result": "Invalid Input", "status": "error"}

        # 3. Evaluación Matemática
        # eval() procesa la precedencia (paréntesis, mult/div antes que suma/resta)
        result = eval(expr)

        # 4. Formateo de Ingeniería
        if isinstance(result, float):
            if result.is_integer():
                result = int(result)
            else:
                # Limitamos a 4 decimales para mantener la estética en el display
                result = round(result, 4)

        return {
            "result": str(result),
            "status": "success"
        }

    except ZeroDivisionError:
        return {"result": "Div/0", "status": "error"}
    except Exception as e:
        print(f"Error interno: {e}")
        return {"result": "Error", "status": "error"}

if __name__ == "__main__":
    # Ejecutamos en el puerto 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)