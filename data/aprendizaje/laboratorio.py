import json

archivo = open("data/laboratorio.json", "r", encoding="utf-8")
equipos = json.load(archivo)
archivo.close()


def evaluar_equipo(equipo):
    if equipo["estado"].lower() == "mantenimiento":
        return "Alta", "El equipo se encuentra en mantenimiento"

    if equipo["horas_uso"] >= 3000:
        return "Alta", "El equipo tiene muchas horas de uso"

    if equipo["ram"] < 8:
        return "Media", "La memoria RAM puede limitar el rendimiento"

    return "Normal", "El equipo presenta condiciones adecuadas"


def inspeccionar_laboratorio():
    print("=== AGENTE DE LABORATORIO ===")
    print()
    print("Analizando los equipos del laboratorio...")
    print()

    for equipo in equipos:
        prioridad, motivo = evaluar_equipo(equipo)

        print("Equipo:", equipo["equipo"])
        print("Procesador:", equipo["procesador"])
        print("RAM:", equipo["ram"], "GB")
        print("Almacenamiento:", equipo["almacenamiento"], "GB")
        print("Estado:", equipo["estado"])
        print("Horas de uso:", equipo["horas_uso"])
        print("Nivel de atencion:", prioridad)
        print("Motivo:", motivo)
        print("-" * 50)


print("=== MISION 4: LABORATORIO ===")
print()

inspeccionar_laboratorio()