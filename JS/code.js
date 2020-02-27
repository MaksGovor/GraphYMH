'use strict';

const canvas = document.getElementById('c1');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 5;
ctx.font = '20px Vernada';
const branches = new Object();
const vertex = new Object();
const degree = new Object();
const connections = new Map(); 
const radius = 30;
let countD = 0;
let countH = 0;
const sides = {
  sideRight: [],
  sideLeft: [],
  sideDown: [],
};
const QUANTITY = 10;


const matrix = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0, 0, 0],  
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/*const matrix = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];*/


const doSymetricMatrix = (matrix, transp) => {
  const sMatrix = [];
  for (let i = 0; i < matrix.length; i++) sMatrix.push(matrix[i].slice(0));
  for (let i = 0; i < sMatrix.length; i++){
    for (let j = 0 ; j < sMatrix[i].length; j++){
      if (matrix[i][j] === 1) {
        sMatrix[j][i] = 1;
        if(transp && i !== j) sMatrix[i][j] = 0; 
      }
    }
  }
  return sMatrix;
}

const symetricMatrix = doSymetricMatrix(matrix, false);

const graphTriangle = n => {
  let width = canvas.width / 2;
  let height = 100;
  let left = width;
  const divider = n > 14 ? 2.5 : 2;
  const lrvertex = Math.floor(n / divider - 2) * 2 + 1;
  const down = n - lrvertex;
  const rd = Math.floor(n / divider) - 1;
  const ld = n + 2 - rd;
  console.dir({ rd, ld });
  console.dir({ down, lrvertex });
  for (let i = 1; i < Math.floor(n / divider); i++) {
    if (i === 1) {
      ctx.beginPath();
      ctx.arc(width, height, radius, 0, 2 * Math.PI);
      ctx.fillText(i, width , height );
      ctx.stroke();
      const ver = { width, height, num: i }
      vertex['ver' + i] = ver;
      degree['ver' + i] = {positive: 0, negative: 0};
      sides.sideLeft.push(ver);
      sides.sideRight.push(ver);
      continue;
    }
    width += 120;
    left -= 120;
    height += 120;
    ctx.beginPath();
    ctx.arc(width, height, radius, 0, 2 * Math.PI);
    ctx.fillText(i, width - 5, height + 10);
    const verRight = { width, height, num: i};
    vertex['ver' + i] = verRight;
    degree['ver' + i] = {positive: 0, negative: 0};
    sides.sideRight.push(verRight);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(left, height, radius, 0, 2 * Math.PI);
    const index = n + 2 - i;
    ctx.fillText(index, left - 5 , height + 10);
    const verLeft = { width: left, height , num: index};
    vertex['ver' + index] = verLeft;
    degree['ver' + index] = {positive: 0, negative: 0};
    sides.sideLeft.push(verLeft);
    ctx.stroke();
    if (i === Math.floor(n / divider) - 1) 
      sides.sideDown.push(verRight, verLeft);
  }
  const countDown = Math
    .sqrt(Math
      .pow((vertex['ver' + rd].width - vertex['ver' + ld].width), 2)) / (down + 1);
  console.dir({ countDown });
  for (let i = 0; i < down; i++) {
    width -= countDown;
    ctx.beginPath();
    ctx.arc(width, height, radius, 0, 2 * Math.PI);
    const index = rd + i + 1;
    ctx.fillText(index, width - 5, height + 10);
    const verDown = { width, height, num: index };
    vertex['ver' + index] = verDown;
    degree['ver' + index] = {positive: 0, negative: 0};
    sides.sideDown.push(verDown);
    ctx.stroke();
  }
  //ctx.fillText('S', 20, 50);
  console.dir(vertex);
  console.dir(sides);
  ctx.lineWidth = 4;
};

graphTriangle(QUANTITY);


const findCoords = (from, to, directed, arrowRadius) => {
  const toWidth = to.width;
  const toHeight = to.height;
  const frWidth = from.width;
  const frHeight = from.height;
  let xCentre, yCentre;
  let angle = Math.atan((toHeight - frHeight) / (toWidth - frWidth));
  const toRadius = directed && arrowRadius ? radius + arrowRadius : radius;

  if (toWidth < frWidth) {
    xCentre = toWidth + toRadius * Math.cos(angle);
    yCentre = toHeight + toRadius * Math.sin(angle);
  } else {
    xCentre = toWidth - toRadius * Math.cos(angle);
    yCentre = toHeight - toRadius * Math.sin(angle);
  }

  let xCentre1, yCentre1;
  angle = Math.atan((toHeight - frHeight) / (toWidth - frWidth));
  if (toWidth < frWidth) {
    xCentre1 = frWidth - radius * Math.cos(angle);
    yCentre1 = frHeight - radius * Math.sin(angle);
  } else {
    xCentre1 = frWidth + radius * Math.cos(angle);
    yCentre1 = frHeight + radius * Math.sin(angle);
  }
  const point1 = { width: xCentre1, height: yCentre1 };
  const point2 = { width: xCentre, height: yCentre };
  return ({ point1, point2 });
};


const drawArrowhead = (ctx, from, to, arrowRadius) => {
  const toWidth = to.width;
  const toHeight = to.height;
  const frWidth = from.width;
  const frHeight = from.height;

  let angle;
  let x;
  let y;

  ctx.beginPath();

  angle = Math.atan2(toHeight - frHeight, toWidth - frWidth);
  x = arrowRadius * Math.cos(angle) + toWidth;
  y = arrowRadius * Math.sin(angle) + toHeight;

  ctx.moveTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = arrowRadius * Math.cos(angle) + toWidth;
  y = arrowRadius * Math.sin(angle) + toHeight;

  ctx.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = arrowRadius * Math.cos(angle) + toWidth;
  y = arrowRadius * Math.sin(angle) + toHeight;

  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
};

const drawArrow = (from, to, directed, arrowRadius, status) => {
  const res = findCoords(from, to, directed, arrowRadius);
  if (status === 'full'){
    ctx.beginPath();
    ctx.moveTo(res.point1.width, res.point1.height);
    ctx.lineTo(res.point2.width, res.point2.height);
    ctx.stroke();
    drawArrowhead(ctx, res.point1 ,res.point2 , arrowRadius);
  }
  if (status === 'begin') {
    ctx.beginPath();
    ctx.moveTo(res.point1.width, res.point1.height);
    ctx.lineTo(to.width, to.height);
    ctx.stroke();
  }
  if (status === 'end') {
    const res = findCoords(from, to, directed, arrowRadius);
    ctx.beginPath();
    ctx.moveTo(from.width, from.height);
    ctx.lineTo(res.point2.width, res.point2.height);
    ctx.stroke();
    drawArrowhead(ctx, from ,res.point2 , arrowRadius);
  }
};

const drawCircle = (from, directed) => {
  let width;
  let height;
  if (sides.sideRight.includes(from)) {
    width = from.width + radius;
    height = from.height - radius;
    if (directed){
      ctx.beginPath();
      ctx.moveTo(width - 5, from.height + 12);
      ctx.lineTo(width + 15, from.height + 15);
      ctx.lineTo(width + 10,from.height - 5);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(width , height , 40, Math.PI / 2, Math.PI , true);
    ctx.stroke();
    return;
  }

  if (sides.sideLeft.includes(from)) {
    width = from.width - radius;
    height = from.height - radius;
    if (directed){
      ctx.beginPath();
      ctx.moveTo(width + 5, from.height + 12);
      ctx.lineTo(width - 15, from.height + 15);
      ctx.lineTo(width - 10,from.height - 5);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(width , height , 40, Math.PI / 2, 0 , false);
    ctx.stroke();
    return;
  }
    
  if (sides.sideDown.includes(from)) {
    width = from.width - radius;
    height = from.height + radius;
    if (directed){
      ctx.beginPath();
      ctx.moveTo(width + 5, from.height - 10);
      ctx.lineTo(width - 15, from.height + 3);
      ctx.lineTo(width - 15,from.height - 18);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(width , height , 40, 0, 1.5*Math.PI , false);
    ctx.stroke();
    return;
  }
}

// Start changes

const evasion = (from, to, event, directed, arrowRadius) => {
  const centreX = (from.width + to.width) / 2;
  const centreY = (from.height + to.height) / 2;
  const rad = Math.sqrt(Math.pow(centreX - from.width, 2) + Math.pow(centreY - from.height, 2));
  let height, width;
  let angle ;
  if (event === 'onSideRight') {
    angle = Math.atan2(to.height - from.height,to.width - from.width);
    height = from.height + Math.sin(angle)*rad + 30*Math.random();
    width = from.width + 2*Math.cos(angle)*rad - 30*Math.random();
  }
  if (event === 'onSideLeft') {
    angle = Math.atan2(from.height - to.height,to.width - from.width);
    height = from.height - Math.sin(angle)*rad - 30*Math.random();
    width = from.width + 2*Math.cos(angle)*rad + 30*Math.random();
  }
  if (event === 'onSideDown'){
    height = from.height + 100 + 90*Math.random();
    width = (to.width + from.width) / 2;
  }
  if (event === 'coincidence'){
    drawCircle(from, directed);
    return;
  }
  if (event === 'default' || event === 'alongside'){
    if (branches['f' + to.num + 't' + from.num] === 1 && directed) {
      if (checkOne(from, to, 'sideDown') || (from.height === to.height)) {
        countD++;
        const i = countD % 2 === 0 ? 10: -10;
        height = from.height + i + i*Math.random();
        width = (to.width + from.width) / 2;
        drawArrow(from ,{width, height},false , 0, 'begin');
        drawArrow({width, height}, to, directed, arrowRadius, 'end');
        return;
      }
      if (to.width === from.width) {
        countH++;
        const i = countH % 2 === 0 ? 10: -10;
        height = (from.height + to.height) / 2;
        width = from.width + i + i*Math.random();
        drawArrow(from ,{width, height},false , 0, 'begin');
        drawArrow({width, height}, to, directed, arrowRadius, 'end');
        return;
      }
      angle = Math.atan2(to.height - from.height,to.width - from.width);
      height = from.height + Math.sin(angle)*rad + 10*Math.random();
      width = from.width + 1.2*Math.cos(angle)*rad - 10*Math.random();
      drawArrow(from ,{width, height},false , 0, 'begin');
      drawArrow({width, height}, to, directed, arrowRadius, 'end');
      return;
    }
    else {
      drawArrow(from, to, directed, arrowRadius, 'full');
      return;
    }
  }
  drawArrow(from ,{width, height},false , 0, 'begin');
  drawArrow({width, height}, to, directed, arrowRadius, 'end');
}


const checkOne = (from, to, side) => {
  let count = 0;
  for (const ver of sides[side]) {
    if (ver.height === from.height && ver.width === from.width)
      count++;
    if (ver.height === to.height && ver.width === to.width)
      count++;    
  }
  return count === 2 ? true : false;
}

const check = (from, to) => {
  if (from.num + 1 === to.num || from.num === to.num + 1) return 'alongside';
  if (from.num === to.num) return 'coincidence';
  if (checkOne(from, to, 'sideDown')) return 'onSideDown';
  if (checkOne(from, to, 'sideRight')) return 'onSideRight';
  if (checkOne(from, to, 'sideLeft')) return 'onSideLeft';
  return 'default';
}

const edge = (matrix, directed) => {
  degree.status = directed;
  const arrowRadius = directed ? 12 : 0;
  let count = 200;
  for (let i = 0; i < matrix.length; i++) {
    const length = directed ? matrix[i].length : i + 1;
    console.log(length);
    for (let j = 0; j < length; j++) {
      if (matrix[i][j] === 1) {
        count += 100;
        const a = i + 1;
        const b = j + 1;
        if (directed) {
          degree['ver' + a].positive++;
          degree['ver' + b].negative++;
        } else {
          degree['ver' + a].positive++;
          degree['ver' + b].positive++;
        }
        const from = vertex['ver' + a];
        const to = vertex['ver' + b];
        connections.set(from, to);
        branches['f' + a + 't' + b] = 1;
        if (from.num === QUANTITY && to.num === 1) {
          window.setTimeout(() => drawArrow(from, to, directed, arrowRadius, 'full'), count + 150);
          continue;
        }
        const checked = check(from, to);
        window.setTimeout(() => {
          console.log(checked);
          evasion(from, to, checked, directed, arrowRadius);
        },count);
      }
    }
  }
};

const viewDegree = degree => {
  const statistic = {
    isolated:[],
    hanging:[]
  };
  let ph = true;
  let width = 30, height = 30;
  const st1 = degree['ver' + 1].positive + degree['ver' + 1].negative;
  for (let i = 1; i <= QUANTITY; i++ ) {
    const str = degree.status ?
      `Vertex ${i}: δ+(${i}) = ${degree['ver' + i].positive} δ-(${i}) = ${degree['ver' + i].negative}`:
      `Vertex ${i}: δ(${i}) = ${degree['ver' + i].positive}`
    ctx.beginPath()
    ctx.fillText(str, width, height, 280);
    height+= 30
    ph = ph && (st1 === degree['ver' + i].positive + degree['ver' + i].negative) ? true: false;
  }
  for (let i = 1; i <= QUANTITY; i++){
    if (i === 1) {
      ctx.fillText('Isolated vertexes :', width, height);
      height += 30;
    }
    if (degree['ver' + i].positive + degree['ver' + i].negative === 0) {
      ctx.fillText(`Vertex ${i};`, width, height);
      height += 30;
    }
  }
  for (let i = 1; i <= QUANTITY; i++){
    if (i === 1) {
      ctx.fillText('Hahging vertexes :', width, height);
      height += 30;
    }
    if (degree['ver' + i].positive + degree['ver' + i].negative === 1) {
      ctx.fillText(`Vertex ${i};`, width, height);
      height += 30;
    }
  }
  if(ph) ctx.fillText('Graph is homogeneous, degree: ' + st1, width, height, 280);
  return statistic;
}

edge(matrix, true);

document.getElementById('statistics').onclick = function() {
  viewDegree(degree)
}

console.dir(branches);
console.dir(degree);
