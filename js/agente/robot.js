export class Robot {
  constructor(initialState = {}) {
    this.posicion = { ...initialState.posicion, x: initialState.posicion?.x ?? 1, y: initialState.posicion?.y ?? 1 };
    this.objetivo = { ...initialState.objetivo, x: initialState.objetivo?.x ?? 10, y: initialState.objetivo?.y ?? 7 };
    this.mision = initialState.mision || 'biblioteca';
    this.bateria = initialState.bateria ?? 100;
    this.estado = initialState.estado || 'listo';
    this.accionActual = initialState.accionActual || 'esperar';
    this.tareaCompletada = Boolean(initialState.tareaCompletada);
    this.rutaActual = Array.isArray(initialState.rutaActual) ? [...initialState.rutaActual] : [];
    this.rutaRecorrida = Array.isArray(initialState.rutaRecorrida) ? [...initialState.rutaRecorrida] : [];
    this.bitacora = Array.isArray(initialState.bitacora) ? [...initialState.bitacora] : [];
    this.obstaculos = Array.isArray(initialState.obstaculos) ? [...initialState.obstaculos] : [];
    this.acciones = initialState.acciones ?? 0;
    this.replanificaciones = initialState.replanificaciones ?? 0;
    this.costoAcumulado = initialState.costoAcumulado ?? 0;
  }

  get posicionTexto() {
    return `(${this.posicion.x}, ${this.posicion.y})`;
  }

  mover(dx, dy) {
    const nuevaPosicion = { x: this.posicion.x + dx, y: this.posicion.y + dy };
    this.posicion = nuevaPosicion;
    this.bateria = Math.max(0, this.bateria - 1);
    this.acciones += 1;
    this.rutaRecorrida.push({ x: nuevaPosicion.x, y: nuevaPosicion.y });
    return nuevaPosicion;
  }

  establecerObjetivo(objetivo) {
    this.objetivo = { ...objetivo };
    return this.objetivo;
  }

  registrarEvento(mensaje, level = 'info') {
    const timestamp = new Date().toLocaleTimeString('es-HN', { hour12: false });
    this.bitacora.push({ timestamp, level, message: mensaje });
    return this.bitacora;
  }

  completar() {
    this.estado = 'completado';
    this.tareaCompletada = true;
    return this.estado;
  }
}

