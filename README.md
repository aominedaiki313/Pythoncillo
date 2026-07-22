# 🐍 Pythoncillo

¡Bienvenido a **Pythoncillo**! Un rincón sencillo y genial para jugar con scripts de Python, realizar operaciones básicas, contar vocales y aprender a hacer pruebas automáticas.

Este repositorio es ideal para experimentar con la lógica básica de programación en Python.

---

## 🚀 Contenido del Repositorio

Aquí tienes un desglose de los archivos que componen este proyecto:

*   **[calculadora.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/calculadora.py)**: Una calculadora limpia y robusta con tipado de datos y control de excepciones.
*   **[test_calculadora.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/test_calculadora.py)**: Pruebas unitarias completas e impecables usando `pytest` para la calculadora.
*   **[Basesilla.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/Basesilla.py)**: Versión alternativa de la calculadora modular.
*   **[contador.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/contador.py)**: Un script interactivo para consola. Le proporcionas cualquier frase y te dice cuántas vocales contiene en total, desglosando la cantidad exacta por cada vocal (`a`, `e`, `i`, `o`, `u`).
*   **[prueba.py](file:///c:/Users/demia/OneDrive/Desktop/m/Pythoncillo/prueba.py)**: Set alternativo de pruebas unitarias.

---

## 🛠️ Cómo Empezar

### 📋 Prerrequisitos

Asegúrate de tener instalado **Python 3.x**. Instala las dependencias del proyecto ejecutando:

```bash
pip install -r requirements.txt
```


### 🏃‍♂️ Ejecutando los Componentes

#### 1. Contar Vocales Interactivamente
Ejecuta el script de conteo de vocales en tu terminal:
```bash
python contador.py
```
*Escribe una frase cuando el script te lo pida y observa el desglose en tiempo real.*

#### 2. Usar la Calculadora Nueva (`calculadora.py`)
Puedes importar y usar las funciones matemáticas en tu propio código de la siguiente manera:
```python
from calculadora import sumar, dividir

print(sumar(10, 5))     # Imprime: 15
print(dividir(10, 2))   # Imprime: 5.0
```

---

## 🧪 Pruebas Unitarias con Pytest

Para correr las pruebas de la nueva calculadora y verificar que todo funcione al 100%:

```bash
pytest test_calculadora.py
```

> [!TIP]
> Si quieres ejecutar todas las suites de prueba disponibles en el repositorio (incluyendo el archivo alternativo `prueba.py`), simplemente corre:
> ```bash
> pytest
> ```

---

Hecho con 💻, 🐍 y mucha curiosidad. ¡Disfruta programando!
