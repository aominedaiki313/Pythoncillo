"""
Módulo de calculadora con operaciones matemáticas básicas.
"""

def sumar(a: float, b: float) -> float:
    """Devuelve la suma de a y b."""
    return a + b

def restar(a: float, b: float) -> float:
    """Devuelve la resta de a y b."""
    return a - b

def multiplicar(a: float, b: float) -> float:
    """Devuelve el producto de a y b."""
    return a * b

def dividir(a: float, b: float) -> float:
    """
    Devuelve el cociente de a entre b.
    
    Lanza ValueError si se intenta dividir por cero.
    """
    if b == 0:
        raise ValueError("No se puede dividir entre cero.")
    return a / b
