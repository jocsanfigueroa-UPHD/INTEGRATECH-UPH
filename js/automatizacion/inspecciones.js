export const AREAS_OPERATIVAS = [
  {
    id: 'biblioteca', nombre: 'Biblioteca', responsable: 'Encargado de Biblioteca',
    items: ['Aforo dentro del límite', 'Pasillos y salidas despejados', 'Equipos y mobiliario operativos', 'Ambiente adecuado para estudio']
  },
  {
    id: 'matricula', nombre: 'Matrícula / Atención al cliente', responsable: 'Personal de Registro',
    items: ['Fila de atención controlada', 'Sistema de registro disponible', 'Documentación completa', 'Personal disponible para orientar']
  },
  {
    id: 'red', nombre: 'Red / Laboratorio de Turismo', responsable: 'Personal TICS',
    items: ['Gateway y switch conectados', 'Internet estable', 'Cableado sin daños visibles', 'Puntos de acceso disponibles']
  },
  {
    id: 'laboratorio', nombre: 'Laboratorio de Informática', responsable: 'Soporte Técnico',
    items: ['Computadoras encienden correctamente', 'Software requerido disponible', 'Conexión de red funcional', 'Área segura y ordenada']
  }
];

export function evaluarInspeccion(areaId, respuestas, fecha = new Date()) {
  const area = AREAS_OPERATIVAS.find((item) => item.id === areaId);
  if (!area) throw new Error('Área de inspección no válida.');
  const valores = area.items.map((_, index) => respuestas[index] || 'correcto');
  const criticos = valores.filter((valor) => valor === 'critico').length;
  const alertas = valores.filter((valor) => valor === 'alerta').length;
  const nivel = criticos > 0 ? 'crítico' : alertas > 0 ? 'atención' : 'normal';
  const requiereAsistencia = nivel !== 'normal';
  return {
    id: `${areaId}-${fecha.getTime()}`,
    areaId,
    area: area.nombre,
    responsable: area.responsable,
    fecha: fecha.toISOString(),
    nivel,
    requiereAsistencia,
    resumen: requiereAsistencia
      ? `${criticos} condición(es) crítica(s) y ${alertas} alerta(s).`
      : 'Todos los puntos fueron verificados sin incidencias.',
    detalles: area.items.map((item, index) => ({ item, estado: valores[index] }))
  };
}

export function ejecutarRondaAutomatica(escenarios = {}, fecha = new Date()) {
  return AREAS_OPERATIVAS.map((area) => evaluarInspeccion(area.id, escenarios[area.id] || [], fecha));
}

export function crearSolicitudAsistencia(resultado, motivo = '') {
  if (!resultado) throw new Error('No hay una inspección seleccionada.');
  return {
    id: `AST-${resultado.areaId.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
    inspeccionId: resultado.id,
    area: resultado.area,
    responsable: resultado.responsable,
    prioridad: resultado.nivel === 'crítico' ? 'Alta' : 'Media',
    motivo: motivo.trim() || resultado.resumen,
    estado: 'Pendiente',
    creada: new Date().toISOString()
  };
}
