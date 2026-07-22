# 🐍 Pythoncillo

¡Bienvenido a **Pythoncillo**! Un rincón sencillo y genial para jugar con scripts de Python, realizar operaciones básicas, contar vocales y aprender a hacer pruebas automáticas.

Este repositorio es ideal para experimentar con la lógica básica de programación en Python.

---

## 🚀 Contenido del Repositorio

Aquí tienes un desglose de los archivos que componen este proyecto:

*   **[Basesilla.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/Basesilla.py)**: Una calculadora modular que realiza operaciones fundamentales (`Suma`, `Resta`, `Multiplicación`, `División`) de forma segura.
*   **[contador.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/contador.py)**: Un script interactivo para consola. Le proporcionas cualquier frase y te dice cuántas vocales contiene en total, desglosando la cantidad exacta por cada vocal (`a`, `e`, `i`, `o`, `u`).
*   **[prueba.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/prueba.py)**: El set de pruebas unitarias desarrollado con `pytest` para validar el comportamiento de las operaciones de la calculadora.

---

## 🛠️ Cómo Empezar

### 📋 Prerrequisitos

Asegúrate de tener instalado **Python 3.x**. Para poder ejecutar las pruebas unitarias, necesitarás instalar `pytest`:

```bash
pip install pytest
```

### 🏃‍♂️ Ejecutando los Componentes

#### 1. Contar Vocales Interactivamente
Ejecuta el script de conteo de vocales en tu terminal:
```bash
python contador.py
```
*Escribe una frase cuando el script te lo pida y observa el desglose en tiempo real.*

#### 2. Usar la Calculadora (`Basesilla.py`)
Puedes importar la función `calcular` en cualquier otro archivo de Python:
```python
from Basesilla import calcular

resultado = calcular(10, 5, "Multiplicación")
print(f"Resultado: {resultado}") # Imprime: 50
```

---

## 🧪 Pruebas Unitarias con Pytest

Para comprobar si las operaciones de la calculadora funcionan como se espera, puedes correr las pruebas usando:

```bash
pytest prueba.py
```

> [!NOTE]
> Algunas pruebas en `prueba.py` actualmente tienen aserciones que fallarán a propósito (por ejemplo, comprobar si `5 + 50` es igual a `50`, o si `8 - 0` es igual a `20`). ¡Puedes corregir estos valores para ver cómo pasan todas las pruebas en verde!

---

Hecho con 💻, 🐍 y mucha curiosidad. ¡Disfruta programando!
