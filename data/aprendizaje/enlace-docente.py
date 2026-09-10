import json

archivo_docentes = open("data/docentes.json", "r", encoding="utf-8")
docentes = json.load(archivo_docentes)
archivo_docentes.close()

archivo_matricula = open("data/matricula.json", "r", encoding="utf-8")
estudiantes = json.load(archivo_matricula)
archivo_matricula.close()


def buscar_docente(grado):
    for docente in docentes:
        grados = docente["grado"].lower()

        if grado.lower() in grados:
            return docente

    return None


def evaluar_estudiante(estudiante):
    if estudiante["promedio"] < 70:
        return "Prioridad alta", "Necesita seguimiento academico"

    if estudiante["promedio"] < 80:
        return "Prioridad media", "Se recomienda reforzar su rendimiento"

    return "Prioridad normal", "Rendimiento academico adecuado"


def enlazar_estudiantes():
    print("=== AGENTE DE ENLACE DOCENTE - ESTUDIANTE ===")
    print()
    print("Analizando estudiantes y asignando seguimiento...")
    print()

    for estudiante in estudiantes:
        docente = buscar_docente(estudiante["grado"])
        prioridad, motivo = evaluar_estudiante(estudiante)

        print("Estudiante:", estudiante["nombre"])
        print("Grado:", estudiante["grado"])
        print("Promedio:", estudiante["promedio"])

        if docente:
            print("Docente asignado:", docente["nombre"])
            print("Especialidad:", docente["especialidad"])
        else:
            print("Docente asignado: No encontrado")

        print("Seguimiento:", prioridad)
        print("Motivo:", motivo)
        print("-" * 55)


print("=== MISION 5: ENLACE DOCENTE - ESTUDIANTE ===")
print()

enlazar_estudiantes()