texto = input("Ingrese una frase"+ " ")
vocales={
    'a':0,
    'e':0,
    'i':0,
    'o':0,
    'u':0
}
for x in texto.lower():
    if x in vocales:
        vocales[
            x
        ] +=1

total = sum(vocales.values())

print("Total vocales",":" ,total)

for vocal,cantidad in vocales.items():
    #print(f"{vocal} : {cantidad}")
    print(vocal, ":", cantidad)