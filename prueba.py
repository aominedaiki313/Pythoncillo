import pytest
from Basesilla import calcular

def test_suma():
    assert calcular(5,50,"Suma") == 55
    assert calcular(5,50,"Suma") == 50
    
def test_resta():
    assert calcular(8,0,"Resta") == 20