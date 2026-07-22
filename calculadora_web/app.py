import ast
import math
from flask import Flask, jsonify, request, send_from_directory
import os

app = Flask(__name__, static_folder='static', static_url_path='')

# Store in-memory calculation history
history = []

ALLOWED_NAMES = {
    'pi': math.pi,
    'e': math.e,
    'sqrt': math.sqrt,
    'sin': math.sin,
    'cos': math.cos,
    'tan': math.tan,
    'log': math.log10,
    'ln': math.log,
    'exp': math.exp,
    'abs': abs,
    'factorial': math.factorial,
    'rad': math.radians,
    'deg': math.degrees,
}

def safe_eval(node):
    """Recursively evaluates AST nodes safely without arbitrary code execution."""
    if isinstance(node, ast.Expression):
        return safe_eval(node.body)
    elif isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Tipo de constante no permitido: {type(node.value).__name__}")
    elif isinstance(node, ast.Name):
        if node.id in ALLOWED_NAMES:
            return ALLOWED_NAMES[node.id]
        raise ValueError(f"Nombre de variable o función no permitido: {node.id}")
    elif isinstance(node, ast.BinOp):
        left = safe_eval(node.left)
        right = safe_eval(node.right)
        if isinstance(node.op, ast.Add):
            return left + right
        elif isinstance(node.op, ast.Sub):
            return left - right
        elif isinstance(node.op, ast.Mult):
            return left * right
        elif isinstance(node.op, ast.Div):
            if right == 0:
                raise ZeroDivisionError("División por cero")
            return left / right
        elif isinstance(node.op, ast.FloorDiv):
            if right == 0:
                raise ZeroDivisionError("División entera por cero")
            return left // right
        elif isinstance(node.op, ast.Mod):
            if right == 0:
                raise ZeroDivisionError("Módulo por cero")
            return left % right
        elif isinstance(node.op, ast.Pow):
            if abs(left) > 1e5 and right > 100:
                raise ValueError("Exponente demasiado grande")
            return left ** right
        else:
            raise ValueError(f"Operador binario no soportado: {type(node.op).__name__}")
    elif isinstance(node, ast.UnaryOp):
        operand = safe_eval(node.operand)
        if isinstance(node.op, ast.UAdd):
            return +operand
        elif isinstance(node.op, ast.USub):
            return -operand
        else:
            raise ValueError(f"Operador unario no soportado: {type(node.op).__name__}")
    elif isinstance(node, ast.Call):
        func = safe_eval(node.func)
        if not callable(func):
            raise ValueError("El objetivo de la llamada no es una función válida")
        args = [safe_eval(arg) for arg in node.args]
        return func(*args)
    else:
        raise ValueError(f"Sintaxis no permitida en la expresión: {type(node).__name__}")

def evaluate_expression(expr_str):
    """Clean and evaluate a user math expression string."""
    if not expr_str or not expr_str.strip():
        raise ValueError("Expresión vacía")

    # Replace UI symbols with standard python syntax
    clean_expr = expr_str.replace('×', '*').replace('÷', '/').replace('^', '**').replace('π', 'pi')
    
    # Parse into AST safely
    parsed = ast.parse(clean_expr, mode='eval')
    val = safe_eval(parsed)

    # Format result
    if isinstance(val, float):
        if val.is_integer():
            return int(val)
        # Round to 10 decimal places to handle precision noise
        val = round(val, 10)
    return val

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.get_json(silent=True) or {}
    expression = data.get('expression', '')
    
    try:
        result = evaluate_expression(expression)
        entry = {
            'expression': expression,
            'result': result,
            'status': 'success'
        }
        history.insert(0, entry)
        # Keep maximum 50 history entries
        if len(history) > 50:
            history.pop()
            
        return jsonify({
            'success': True,
            'expression': expression,
            'result': result
        })
    except ZeroDivisionError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except (SyntaxError, ValueError, TypeError) as e:
        return jsonify({'success': False, 'error': f"Expresión inválida: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': f"Error de cálculo: {str(e)}"}), 500

@app.route('/api/history', methods=['GET', 'DELETE'])
def handle_history():
    global history
    if request.method == 'DELETE':
        history.clear()
        return jsonify({'success': True, 'message': 'Historial limpiado', 'history': []})
    return jsonify({'success': True, 'history': history})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Servidor backend ejecutándose en http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
