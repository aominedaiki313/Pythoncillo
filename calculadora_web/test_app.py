import pytest
import math
import sys
import os

# Ensure app can be imported
sys.path.insert(0, os.path.dirname(__file__))

from app import app, evaluate_expression

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_basic_arithmetic():
    assert evaluate_expression("2 + 2") == 4
    assert evaluate_expression("10 - 4") == 6
    assert evaluate_expression("3 × 4") == 12
    assert evaluate_expression("20 ÷ 5") == 4
    assert evaluate_expression("2 ^ 3") == 8
    assert evaluate_expression("10 % 3") == 1

def test_operator_precedence_and_parentheses():
    assert evaluate_expression("2 + 3 * 4") == 14
    assert evaluate_expression("(2 + 3) * 4") == 20
    assert evaluate_expression("10 / (2 + 3)") == 2

def test_scientific_functions():
    assert evaluate_expression("sqrt(16)") == 4
    assert round(evaluate_expression("sin(0)"), 5) == 0
    assert round(evaluate_expression("cos(0)"), 5) == 1
    assert evaluate_expression("log(100)") == 2
    assert round(evaluate_expression("pi"), 5) == round(math.pi, 5)

def test_zero_division():
    with pytest.raises(ZeroDivisionError):
        evaluate_expression("5 / 0")

def test_invalid_syntax():
    with pytest.raises((SyntaxError, ValueError)):
        evaluate_expression("2 + * 3")

def test_security_eval():
    with pytest.raises(ValueError):
        evaluate_expression("__import__('os').system('dir')")

def test_api_calculate_success(client):
    response = client.post('/api/calculate', json={'expression': '15 + 25'})
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['result'] == 40
    assert data['expression'] == '15 + 25'

def test_api_calculate_zero_division(client):
    response = client.post('/api/calculate', json={'expression': '10 / 0'})
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] is False
    assert "por cero" in data['error']

def test_api_history_workflow(client):
    # Clear history first
    client.delete('/api/history')

    # Perform calculation
    client.post('/api/calculate', json={'expression': '5 * 5'})

    # Get history
    res = client.get('/api/history')
    assert res.status_code == 200
    hist = res.get_json()['history']
    assert len(hist) == 1
    assert hist[0]['result'] == 25

    # Clear history
    del_res = client.delete('/api/history')
    assert del_res.status_code == 200
    assert del_res.get_json()['history'] == []
