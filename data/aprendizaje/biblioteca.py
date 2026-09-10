import json

archivo = open("data/biblioteca.json", "r", encoding="utf-8")
biblioteca = json.load(archivo)
archivo.close()


def buscar_libros(clasificacion):
    resultados = []

    for libro in biblioteca:
        if libro["clasificacion"].lower() == clasificacion.lower():
            resultados.append(libro)

    return resultados


def recomendar_libros(clasificacion):
    resultados = buscar_libros(clasificacion)

    print("=== AGENTE DE BIBLIOTECA ===")
    print()
    print("Clasificacion solicitada:", clasificacion)
    print()

    if len(resultados) == 0:
        print("No se encontraron libros para esta clasificacion.")
        return

    print("Libros recomendados:")

    for libro in resultados:
        print()
        print("Titulo:", libro["titulo"])
        print("Autor:", libro["autor"])
        print("Genero:", libro["genero"])
        print("Nivel:", libro["nivel"])
        print("Paginas:", libro["paginas"])


print("=== MISION 1: BIBLIOTECA ===")
print()

recomendar_libros("Tecnología")