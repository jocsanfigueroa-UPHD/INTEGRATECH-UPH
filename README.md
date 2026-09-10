# INTEGRATECH-UPH

Plataforma Integrada de Automatización, Inspección Operativa y Asistencia Tecnológica de la UPH Danlí.

> “Un agente inteligente, múltiples soluciones.”

## Descripción

INTEGRATECH-UPH es una plataforma web profesional para simular un agente inteligente que percibe un entorno universitario, analiza datos, toma decisiones, planifica rutas y ejecuta acciones de apoyo para procesos institucionales de la Universidad Politécnica de Honduras, Centro Asociado Danlí.

La aplicación integra planificación basada en inteligencia artificial, aprendizaje inductivo, simulación de un agente robótico, replanificación ante cambios, y una interfaz de control orientada a monitoreo institucional.

## Objetivos

- Representar un agente operativo con ciclo de percepción, decisión y acción.
- Planificar rutas en un mapa institucional mediante A*.
- Detectar obstáculos y replanificar la ruta.
- Clasificar situaciones con un árbol de decisión sencillo.
- Simular cuatro escenarios de apoyo institucional: biblioteca, matrícula, red y laboratorio.
- Mostrar una interfaz institucional compatible con GitHub Pages.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES6
- Canvas de HTML
- Archivos JSON
- GitHub Pages
- Visual Studio Code

## Estructura de carpetas

- index.html
- css/styles.css
- js/bootstrap.js
- js/configuracion.js
- js/agente/
- js/planificacion/
- js/aprendizaje/
- js/misiones/
- js/interfaz/
- data/
- tests/
- docs/

## Módulos principales

- Planificación: A* y costos por tráfico/obstáculos.
- Robot: posición, movimientos, estado y bitácora.
- Aprendizaje inductivo: árbol de decisión, entrenamiento y clasificación.
- Misiones: biblioteca, matrícula, red y laboratorio.
- Interfaz: panel institucional, controls y simulador en canvas.

## Ejecución

Se puede abrir directamente con el navegador:

1. Abrir index.html en el navegador.
2. O usar Live Server en Visual Studio Code.
3. Publicar en GitHub Pages.

No requiere instalación de dependencias ni backend.

## GitHub Pages

Para publicar:

1. Subir este repositorio a GitHub.
2. En el repositorio, abrir Settings > Pages.
3. Seleccionar la rama principal o develop si corresponde.
4. Guardar la publicación.
5. Usar la URL generada por GitHub Pages.

## Integrantes

- Jocsan Yair Zelaya Figueroa — coordinación, interfaz e integración.
- Andrea Celeste Cubas Rodríguez — planificación y robot.
- Jose Mejia Torres — aprendizaje y misiones.

## División del trabajo

Consultar DIVISION-DEL-TRABAJO.md para revisar responsabilidades y ramas.

## Escenarios de prueba

El sistema incluye pruebas para:

- Ruta libre.
- Obstrucciones.
- Replanificación.
- Ruta sin solución.
- Clasificación inductiva.

## Capturas de funcionamiento

Se recomienda incluir evidencias visuales en la carpeta docs/evidencias.

## Notas

- El agente se identifica como ITA-01.
- La aplicación está diseñada con colores institucionales.
- La interfaz es responsiva para computadora, tablet y móvil.
- El ciclo de percepción, decisión y acción se muestra en el panel principal.
