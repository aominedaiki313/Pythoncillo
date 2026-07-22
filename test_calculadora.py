import pytest
from calculadora import sumar, restar, multiplicar, dividir

def test_sumar():
    assert sumar(3, 5) == 8
    assert sumar(-1, 1) == 0
    assert sumar(-5, -5) == -10
    assert sumar(1.5, 2.5) == 4.0

def test_restar():
    assert restar(10, 5) == 5
    assert restar(0, 5) == -5
    assert restar(-3, -3) == 0
    assert restar(1.5, 0.5) == 1.0

def test_multiplicar():
    assert multiplicar(4, 5) == 20
    assert multiplicar(-2, 3) == -6
    assert multiplicar(0, 100) == 0
    assert multiplicar(1.5, 2) == 3.0

def test_dividir():
    assert dividir(10, 2) == 5.0
    assert dividir(-6, 3) == -2.0
    assert dividir(5, 2) == 2.5

def test_dividir_por_cero():
    # Verifica que se lance la excepción correcta al dividir por cero
    with pytest.raises(ValueError) as excinfo:
        dividir(10, 0)
    assert str(excinfo.value) == "No se puede dividir entre cero."
