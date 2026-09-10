import { CONFIG } from '../configuracion.js';

export function renderCampus(canvas, context) {
  const ctx = canvas.getContext('2d');
  const cols = CONFIG.cols;
  const rows = CONFIG.rows;
  const footerHeight = 30;
  const cell = Math.min(canvas.width / cols, (canvas.height - footerHeight) / rows);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#101116';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCampusPlan(ctx, canvas.width, canvas.height - footerHeight, cell, context);

  (context.map?.obstacles || []).forEach((obstacle) => {
    const px = obstacle.x * cell;
    const py = obstacle.y * cell;
    ctx.fillStyle = '#d95f68';
    ctx.beginPath();
    ctx.roundRect(px + cell * 0.3, py + cell * 0.3, cell * 0.4, cell * 0.4, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', px + cell / 2, py + cell / 2);
  });

  (context.map?.closedOffices || []).forEach((office) => {
    const px = office.x * cell;
    const py = office.y * cell;
    ctx.fillStyle = '#e8b84b';
    ctx.beginPath();
    ctx.roundRect(px + cell * 0.34, py + cell * 0.34, cell * 0.32, cell * 0.32, 4);
    ctx.fill();
  });

  const route = context.route || [];
  if (route.length > 1) {
    ctx.strokeStyle = '#1d7ad9';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    route.forEach((cellPosition, index) => {
      const px = cellPosition.x * cell + cell / 2;
      const py = cellPosition.y * cell + cell / 2;
      if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }

  const objective = context.objective || { x: 0, y: 0 };
  const ox = objective.x * cell;
  const oy = objective.y * cell;
  ctx.fillStyle = '#169b70';
  ctx.beginPath();
  ctx.arc(ox + cell / 2, oy + cell / 2, Math.max(7, cell * 0.2), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  const robotPos = context.robot?.posicion || { x: 1, y: 1 };
  const rx = robotPos.x * cell;
  const ry = robotPos.y * cell;
  ctx.fillStyle = '#163f70';
  ctx.beginPath();
  ctx.arc(rx + cell / 2, ry + cell / 2, Math.max(8, cell * 0.23), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ITA', rx + cell / 2, ry + cell / 2);

  const missionLabel = context.mission || 'biblioteca';
  ctx.fillStyle = 'rgba(247, 250, 252, 0.96)';
  ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);
  ctx.strokeStyle = '#cbd9e2';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - footerHeight);
  ctx.lineTo(canvas.width, canvas.height - footerHeight);
  ctx.stroke();
  ctx.fillStyle = '#18324a';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'start';
  ctx.textBaseline = 'middle';
  ctx.fillText(`MISIÓN · ${missionLabel.toUpperCase()}`, 14, canvas.height - footerHeight / 2);

  if (context.classification) {
    ctx.textAlign = 'right';
    ctx.font = '11px Arial';
    ctx.fillText(context.classification, canvas.width - 14, canvas.height - footerHeight / 2);
  }
}

function drawCampusPlan(ctx, width, height, cell, context) {
  const palette = { paper: '#f7fafc', ink: '#18324a', line: '#8aa6b8', corridor: '#dceef2', accent: '#e9a928', room: '#ffffff', service: '#e8f1f7' };
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = palette.corridor;
  ctx.fillRect(42, 236, 716, 38);
  ctx.fillRect(350, 38, 38, 420);
  ctx.fillRect(70, 112, 640, 28);

  ctx.fillStyle = palette.ink;
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('PLANO OPERATIVO · CAMPUS UPH DANLÍ', 18, 18);

  const rooms = [
    { x: 24, y: 42, w: 150, h: 66, label: 'LABORATORIO INFORMÁTICA\nGESTIÓN DE EQUIPOS', fill: palette.accent },
    { x: 190, y: 24, w: 138, h: 96, label: 'SALÓN MULTIUSOS', fill: palette.room },
    { x: 410, y: 24, w: 160, h: 78, label: 'AULA 7', fill: palette.room },
    { x: 590, y: 24, w: 180, h: 78, label: 'LAB. TURISMO / RED\nCENTRAL DE INTERNET', fill: palette.accent },
    { x: 410, y: 148, w: 160, h: 74, label: 'AULA 8', fill: palette.room },
    { x: 590, y: 148, w: 180, h: 74, label: 'AULA 9', fill: palette.room },
    { x: 50, y: 302, w: 220, h: 112, label: 'BIBLIOTECA\nCONTROL DE AFORO', fill: palette.accent },
    { x: 296, y: 302, w: 150, h: 112, label: 'RED / TICS\nINSPECCIÓN DE RED', fill: palette.accent },
    { x: 474, y: 302, w: 132, h: 112, label: 'DIRECCIÓN', fill: palette.room },
    { x: 575, y: 302, w: 199, h: 112, label: 'ATENCIÓN AL CLIENTE\nINICIO MATRÍCULA', fill: palette.accent },
    { x: 90, y: 438, w: 180, h: 48, label: 'ACCESO NORTE', fill: palette.room },
    { x: 296, y: 438, w: 180, h: 48, label: 'ACCESO LATERAL', fill: palette.room },
    { x: 565, y: 414, w: 209, h: 72, label: 'ENTRADA PRINCIPAL\nUNIVERSIDAD POLITÉCNICA DE HONDURAS · DANLÍ', fill: palette.ink }
  ];

  rooms.forEach((room, index) => {
    ctx.fillStyle = room.fill;
    ctx.strokeStyle = room.fill === palette.ink ? palette.ink : palette.line;
    ctx.fillRect(room.x, room.y, room.w, room.h);
    ctx.strokeRect(room.x, room.y, room.w, room.h);
    ctx.fillStyle = room.fill === palette.ink ? '#ffffff' : palette.ink;
    const lines = room.label.split('\n');
    const fontSize = lines.length > 1 ? 12 : 13;
    ctx.font = `${fontSize}px Arial`;
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, room.x + room.w / 2, room.y + room.h / 2 + (lineIndex - (lines.length - 1) / 2) * 18);
    });
    ctx.font = '10px Arial';
    ctx.fillStyle = room.fill === palette.ink ? '#c9e8ef' : palette.line;
    ctx.fillText(String(index + 1).padStart(2, '0'), room.x + 12, room.y + 12);
  });

  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}
