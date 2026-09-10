import json
import os
from pathlib import Path
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

RAIZ = Path(__file__).resolve().parent.parent
with (RAIZ / "data" / "biblioteca.json").open("r", encoding="utf-8") as archivo:
    biblioteca = json.load(archivo)

datos_entrenamiento = biblioteca[:15]
datos_prueba = biblioteca[15:]

X_entrenamiento = []

for libro in datos_entrenamiento:
    nivel = 1 if libro["nivel"] == "Universitario" else 0

    X_entrenamiento.append([
        libro["genero"],
        libro["paginas"],
        libro["anio"],
        nivel
    ])

y_entrenamiento = []

for libro in datos_entrenamiento:
    y_entrenamiento.append(libro["clasificacion"])

procesador = ColumnTransformer(
    transformers=[
        ("genero", OneHotEncoder(handle_unknown="ignore"), [0])
    ],
    remainder="passthrough"
)

X_entrenamiento_procesado = procesador.fit_transform(X_entrenamiento)

modelo = DecisionTreeClassifier(random_state=42)

modelo.fit(X_entrenamiento_procesado, y_entrenamiento)

X_prueba = []

for libro in datos_prueba:
    nivel = 1 if libro["nivel"] == "Universitario" else 0

    X_prueba.append([
        libro["genero"],
        libro["paginas"],
        libro["anio"],
        nivel
    ])

y_prueba = []

for libro in datos_prueba:
    y_prueba.append(libro["clasificacion"])

X_prueba_procesado = procesador.transform(X_prueba)

predicciones = modelo.predict(X_prueba_procesado)

print("=== APRENDIZAJE INDUCTIVO ===")
print()
print("Total de libros:", len(biblioteca))
print("Libros para entrenamiento:", len(datos_entrenamiento))
print("Libros para prueba:", len(datos_prueba))

print()
print("=== CARACTERISTICAS UTILIZADAS ===")
print("Genero")
print("Paginas")
print("Anio")
print("Nivel")

print()
print("=== PREDICCIONES DEL ARBOL DE DECISION ===")

for i, libro in enumerate(datos_prueba):
    print()
    print("Libro:", libro["titulo"])
    print("Genero:", libro["genero"])
    print("Clasificacion real:", libro["clasificacion"])
    print("Clasificacion predicha:", predicciones[i])

precision = accuracy_score(y_prueba, predicciones)

print()
print("=== EVALUACION DEL MODELO ===")
print("Precision del modelo:", precision * 100, "%")

print()
print("=== REPORTE DE CLASIFICACION ===")
print(classification_report(y_prueba, predicciones, zero_division=0))

carpeta_evidencias = RAIZ / "docs" / "evidencias"
os.makedirs(carpeta_evidencias, exist_ok=True)

nombres_caracteristicas = procesador.get_feature_names_out()

plt.figure(figsize=(18, 10))

plot_tree(
    modelo,
    feature_names=nombres_caracteristicas,
    class_names=modelo.classes_,
    filled=True,
    rounded=True,
    fontsize=8
)

plt.title("Arbol de Decision - Clasificacion de Libros")
plt.tight_layout()

ruta_arbol = os.path.join(
    carpeta_evidencias,
    "arbol_decision.png"
)

plt.savefig(ruta_arbol, dpi=200, bbox_inches="tight")
plt.close()

print()
print("=== EVIDENCIA GENERADA ===")
print("Arbol de decision guardado en:", ruta_arbol)

print()
print("=== PROCESO COMPLETADO ===")
print("El modelo fue entrenado con 15 libros.")
print("Se realizaron predicciones sobre 5 libros de prueba.")
print("Tambien se genero la imagen del arbol de decision.")
