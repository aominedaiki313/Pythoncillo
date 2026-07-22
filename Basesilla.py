def calcular(num1, num2, operacion):
        if operacion == "Suma":
            return num1 + num2

        elif operacion == "Resta":
            return num1 - num2

        elif operacion == "Multiplicación":
            return num1 * num2

        elif operacion == "División":
            if num2 != 0:
                return num1 / num2
            return "El número 2 tiene que ser diferente a 0"

        return "Operación no válida"
    