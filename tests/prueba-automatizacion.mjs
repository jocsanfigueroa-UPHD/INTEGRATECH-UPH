import assert from 'node:assert/strict';
import { evaluarInspeccion, ejecutarRondaAutomatica, crearSolicitudAsistencia } from '../js/automatizacion/inspecciones.js';

const normal = evaluarInspeccion('biblioteca', ['correcto','correcto','correcto','correcto'], new Date('2026-09-11T12:00:00Z'));
assert.equal(normal.nivel, 'normal');
assert.equal(normal.requiereAsistencia, false);

const critica = evaluarInspeccion('red', ['correcto','critico','alerta','correcto'], new Date('2026-09-11T12:00:00Z'));
assert.equal(critica.nivel, 'crítico');
assert.equal(critica.requiereAsistencia, true);
assert.equal(crearSolicitudAsistencia(critica).prioridad, 'Alta');
assert.equal(ejecutarRondaAutomatica({}).length, 4);
console.log('✓ Automatización de inspecciones y asistencia');
