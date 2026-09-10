import json

archivo = open("data/red.json", "r", encoding="utf-8")
equipos = json.load(archivo)
archivo.close()


def evaluar_equipo(equipo):
    if equipo["estado"].lower() == "inactivo":
        return "Critica", "El equipo se encuentra inactivo"

    if equipo["perdida_paquetes"] >= 10 or equipo["latencia"] >= 100:
        return "Alta", "Presenta problemas importantes de red"

    if equipo["perdida_paquetes"] >= 5 or equipo["latencia"] >= 70:
        return "Media", "Presenta degradacion en la conexion"

    return "Normal", "Conexion dentro de los parametros esperados"


def inspeccionar_red():
    print("=== AGENTE DE INSPECCION DE RED ===")
    print()
    print("Analizando estado de los equipos...")
    print()

    for equipo in equipos:
        prioridad, motivo = evaluar_equipo(equipo)

        print("Equipo:", equipo["equipo"])
        print("Ubicacion:", equipo["ubicacion"])
        print("Estado:", equipo["estado"])
        print("Latencia:", equipo["latencia"], "ms")
        print("Perdida de paquetes:", equipo["perdida_paquetes"], "%")
        print("Nivel de atencion:", prioridad)
        print("Motivo:", motivo)
        print("-" * 50)


print("=== MISION 3: INSPECCION DE RED ===")
print()

inspeccionar_red()