import json

archivo = open("data/matricula.json", "r", encoding="utf-8")
matriculas = json.load(archivo)
archivo.close()


def evaluar_prioridad(estudiante):
    if estudiante["documentos_completos"] == False:
        return "Alta", "Documentacion incompleta"

    if estudiante["promedio"] < 70:
        return "Alta", "Promedio academico bajo"

    if estudiante["tipo_matricula"].lower() == "reingreso":
        return "Media", "Estudiante de reingreso"

    return "Normal", "Cumple las condiciones de matricula"


def analizar_matricula():
    print("=== AGENTE DE MATRICULA ===")
    print()
    print("Analizando solicitudes de matricula...")
    print()

    for estudiante in matriculas:
        prioridad, motivo = evaluar_prioridad(estudiante)

        print("Estudiante:", estudiante["nombre"])
        print("Grado:", estudiante["grado"])
        print("Promedio:", estudiante["promedio"])
        print("Tipo de matricula:", estudiante["tipo_matricula"])
        print("Prioridad:", prioridad)
        print("Motivo:", motivo)
        print("-" * 45)


print("=== MISION 2: MATRICULA ===")
print()

analizar_matricula()