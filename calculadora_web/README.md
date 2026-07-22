# ⚡ Calculadora Web Pro (Python & HTML/CSS/JS)

Una aplicación web de calculadora moderna y completa construida con un backend en **Python (Flask)** y una interfaz responsiva en **HTML5 / CSS3 / JavaScript (Glassmorphism)**.

## 🚀 Características

- **Diseño Glassmorphic Moderno**: Interfaz oscura con efectos glassmorphism, degradados vibrantes y micro-animaciones.
- **Backend Seguro en Python**: Evaluación de expresiones matemáticas mediante análisis AST (`ast.parse`) previniendo inyecciones de código.
- **Modo Estándar y Científico**:
  - Operaciones básicas: suma (`+`), resta (`-`), multiplicación (`×`), división (`÷`), módulo (`%`), potencias (`^`).
  - Funciones científicas: `sin`, `cos`, `tan`, `sqrt`, `log`, `ln`, constantes (`π`, `e`) y paréntesis.
- **Gestión de Memoria**: Botones `MC`, `MR`, `M+`, `M-`.
- **Historial de Cálculos**: Drawer desplegable que almacena los últimos 50 cálculos y permite reutilizarlos con un clic.
- **Soporte Teclado**: Atajos de teclado nativos para números (`0-9`), operadores, `Enter` / `=`, `Backspace` (borrar), y `Escape` (limpiar todo).
- **Pruebas Unitarias**: Suite de pruebas completa con `pytest`.

## 📁 Estructura del Proyecto

```
calculadora_web/
├── app.py              # Servidor Flask y motor de evaluación matemática AST
├── test_app.py         # Pruebas unitarias con Pytest
├── README.md           # Documentación del proyecto
└── static/
    ├── index.html      # Estructura HTML5 de la calculadora
    ├── style.css       # Estilos CSS glassmorphic y diseño responsivo
    └── script.js       # Lógica del cliente JS, integración API y eventos de teclado
```

## 🧰 Requisitos

- Python 3.10+
- Flask (`pip install flask`)
- Pytest (`pip install pytest`)

## 🛠️ Instrucciones de Ejecución

1. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

2. Iniciar el servidor backend:
   ```bash
   python calculadora_web/app.py
   ```

3. Abrir en el navegador:
   Navega a [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 🧪 Ejecución de Pruebas

Para verificar las pruebas unitarias:
```bash
python -m pytest calculadora_web/test_app.py
```

## 📡 API Endpoints

- `POST /api/calculate`: Recibe JSON `{"expression": "2 + 2"}` y retorna el resultado.
- `GET /api/history`: Obtiene la lista del historial.
- `DELETE /api/history`: Limpia el historial de la sesión.
