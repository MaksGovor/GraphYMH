'use strict';

const canvas = document.getElementById('c1');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('c2');
const ctx2 = canvas2.getContext('2d');
const coeff = 0.43;

canvas2.width = window.innerWidth * coeff;
canvas2.height = canvas2.width;
canvas.width = window.innerWidth * coeff;
canvas.height = canvas.width;

const defaultFont = '20px Vernada';
ctx.lineWidth = 2.4;
ctx.fillStyle = 'white';
ctx.font = defaultFont;
ctx2.font = defaultFont;
const branches = new Object();
const vertex = new Object();
const degree = new Object();
const connections = new Map(); 
const radius = 30;
let countA = 0;
let countD = 0;
let countH = 0;
let countBtn = 0;
const sides = {
  sideRight: [],
  sideLeft: [],
  sideDown: [],
};
const QUANTITY = 10;


const matrix = [
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 1, 0, 0, 0],  
  [0, 0, 0, 1, 0, 1, 0, 0, 0, 0], 
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const weightM = [
  [ 0, 85,  0,  1, 0,  0,  0,  0, 40, 88],
  [85,  0,  0, 45,  0, 17, 18, 99,  0,  0],  
  [ 0,  0,  0, 97,  4, 36, 55,  0,  0,  0], 
  [1, 45, 97,  0, 64,  0,  0,  0,  0,  0],
  [0,  0,  4, 64,  0, 25, 84,  0, 82,  0],
  [ 0, 17, 36,  0, 25,  0, 38,  0, 42,  0],
  [ 0, 18, 55,  0, 84, 38,  0, 68,  0,  0],
  [ 0, 99,  0,  0,  0,  0, 68,  0,  0,  0],
  [40,  0,  0,  0, 82, 42,  0,  0,  0, 38],
  [88,  0,  0,  0,  0,  0,  0,  0, 38,  0]
]

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

const graphTriangle = (n, ctx, sides, vertex, visible) => {
  if (!visible) {
    visible = new Array();
    for (let p = 1; p <= n; p++) visible.push(p);
    //console.dir(visible);
  } 
  ctx.fillStyle = 'white';
  let width = canvas.width / 2;
  let height = 150;
  let left = width;
  const divider = n > 14 ? 2.5 : 2;
  const lrvertex = Math.floor(n / divider - 2) * 2 + 1;
  const down = n - lrvertex;
  const rd = Math.floor(n / divider) - 1;
  const ld = n + 2 - rd;
  //console.dir({ rd, ld });
  //console.dir({ down, lrvertex });
  for (let i = 1; i < Math.floor(n / divider); i++) {
    if (i === 1) {
      if (visible.includes(i)){
        ctx.beginPath();
        ctx.arc(width, height, radius, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke();
        ctx.strokeText(i, width - 5, height + 5);
      }
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
    if (visible.includes(i)){
      ctx.beginPath();
      ctx.arc(width, height, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeText(i, width - 5, height + 5);
      ctx.stroke();
    }
    const verRight = { width, height, num: i};
    vertex['ver' + i] = verRight;
    degree['ver' + i] = {positive: 0, negative: 0};
    sides.sideRight.push(verRight);
    const index = n + 2 - i;
    if (visible.includes(index)){
      ctx.beginPath();
      ctx.arc(left, height, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeText(index, left - 5 , height + 5);
      ctx.stroke();
    }
    const verLeft = { width: left, height , num: index};
    vertex['ver' + index] = verLeft;
    degree['ver' + index] = {positive: 0, negative: 0};
    sides.sideLeft.push(verLeft);
    if (i === Math.floor(n / divider) - 1) 
      sides.sideDown.push(verRight, verLeft);
  }
  const countDown = Math
    .sqrt(Math
      .pow((vertex['ver' + rd].width - vertex['ver' + ld].width), 2)) / (down + 1);
  //console.dir({ countDown });
  for (let i = 0; i < down; i++) {
    width -= countDown;
    const index = rd + i + 1;
    if(visible.includes(index)) {
      ctx.beginPath();
      ctx.arc(width, height, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeText(index, width - 5, height + 5);
      ctx.stroke();
    }    
    const verDown = { width, height, num: index };
    vertex['ver' + index] = verDown;
    degree['ver' + index] = {positive: 0, negative: 0};
    sides.sideDown.push(verDown);
  }
  //ctx.fillText('S', 20, 50);
  //console.dir(vertex);
  //console.dir(sides);
  ctx.lineWidth = 3.4;
  ctx.fillStyle = 'black';
};

graphTriangle(QUANTITY, ctx, sides, vertex);


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

const drawArrow = (from, to, directed, arrowRadius, status, ctx) => {
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

const drawCircle = (from, directed, sides, weight,ctx) => {
  let width;
  let height;
  const rras = 40;
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
    ctx.arc(width , height , rras, Math.PI / 2, Math.PI , true);
    ctx.stroke();
    if (weight) weightEdge(ctx, width, height - rras, 30, 20, 8, weight);
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
    ctx.arc(width , height , rras, Math.PI / 2, 0 , false);
    ctx.stroke();
    if (weight) weightEdge(ctx, width, height - rras, 30, 20, 8, weight);
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
    ctx.arc(width , height , rras, 0, 1.5*Math.PI , false);
    ctx.stroke();
    if (weight) weightEdge(ctx, width, height + rras, 30, 20, 8, weight);
    return;
  }
}

const weightEdge = (ctx, x1, y1, width, height, radius, text) => {
  const x = x1 - width / 2, y = y1 - height / 2;
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.stroke();
  ctx.fillStyle = '#ceadff';
  ctx.fill();
  ctx.fillStyle = 'black';
  ctx.fillText(text, x + (width - 11.5 * text.length)/2, y + height /1.2, width);
}

const findWeightCoord = (from, to) => ({
  width:(from.width + to.width) / 2,
  height: (from.height + to.height)/2  
})

// Start changes

const evasion = (from, to, event, directed, arrowRadius, sides, weight, ctx) => {
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
    drawCircle(from, directed, sides, weight, ctx);
    return;
  }
  if (event === 'default' || event === 'alongside'){
    if (branches['f' + to.num + 't' + from.num] === 1 && directed) {
      if (checkOne(from, to, 'sideDown', sides) || (from.height === to.height)) {
        countD++;
        const i = countD % 2 === 0 ? 20: -20;
        height = from.height + i;
        width = (to.width + from.width) / 2;
        drawArrow(from ,{width, height},false , 0, 'begin', ctx);
        drawArrow({width, height}, to, directed, arrowRadius, 'end',ctx);
        if (weight) weightEdge(ctx, width, height, 30, 20, 8, weight);
        return;
      }
      if (to.width === from.width) {
        countH++;
        const i = countH % 2 === 0 ? 10: -10;
        height = (from.height + to.height) / 2;
        width = from.width + i + i*Math.random();
        drawArrow(from ,{width, height},false , 0, 'begin', ctx);
        drawArrow({width, height}, to, directed, arrowRadius, 'end',ctx);
        if (weight) weightEdge(ctx, width, height, 30, 20, 8, weight);
        return;
      }
      angle = Math.atan2(to.height - from.height,to.width - from.width);
      height = from.height + Math.sin(angle)*rad + 10*Math.random();
      width = from.width + 1.2*Math.cos(angle)*rad - 10*Math.random();
      drawArrow(from ,{width, height},false , 0, 'begin', ctx);
      drawArrow({width, height}, to, directed, arrowRadius, 'end', ctx);
      if (weight) weightEdge(ctx, width, height, 30, 20, 8, weight);
      return;
    }
    else {
      drawArrow(from, to, directed, arrowRadius, 'full',ctx);
      const {width, height} = findWeightCoord(from, to);
      if (weight) weightEdge(ctx, width, height, 30, 20, 8, weight);
      return;
    }
  }
  drawArrow(from ,{width, height},false , 0, 'begin', ctx);
  drawArrow({width, height}, to, directed, arrowRadius, 'end', ctx);
  if (weight) weightEdge(ctx, width, height, 30, 20, 8, weight);
}


const checkOne = (from, to, side, sides) => {
  let count = 0;
  for (const ver of sides[side]) {
    if (ver.height === from.height && ver.width === from.width)
      count++;
    if (ver.height === to.height && ver.width === to.width)
      count++;    
  }
  return count === 2 ? true : false;
}

const check = (from, to, sides) => {
  if (from.num + 1 === to.num || from.num === to.num + 1) return 'alongside';
  if (from.num === to.num) return 'coincidence';
  if (checkOne(from, to, 'sideDown', sides)) return 'onSideDown';
  if (checkOne(from, to, 'sideRight', sides)) return 'onSideRight';
  if (checkOne(from, to, 'sideLeft', sides)) return 'onSideLeft';
  return 'default';
}

const edge = (matrix, directed, vertex, sides, moment, weightM, ctx) => {
  degree.status = directed;
  const arrowRadius = directed ? 12 : 0;
  let count = 200;
  for (let i = 0; i < matrix.length; i++) {
    const length = directed ? matrix[i].length : i + 1;
    //console.log(length);
    for (let j = 0; j < length; j++) {
      if (matrix[i][j] === 1) {
        count += 100;
        const weight = weightM ? weightM[i][j].toString() : weightM;
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
          window.setTimeout(() => {
            drawArrow(from, to, directed, arrowRadius, 'full', ctx), count + 150;
            if (weight){
            const {width, height} = findWeightCoord(from,to);
            weightEdge(ctx, width, height, 30, 20, 8 ,weight);
            }
          });
          continue;
        }
        const checked = check(from, to, sides);
        if (moment){
          window.setTimeout(() => {
            //console.log(checked);
            evasion(from, to, checked, directed, arrowRadius, sides, weight, ctx);
          },count);
        } else evasion(from, to, checked, directed, arrowRadius, sides, weight, ctx);
      }
    }
  }
};


// Lab 2 function

const viewDegree = degree => {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  const statistic = {
    isolated:[],
    hanging:[]
  };
  let ph = true;
  let width = 30, height = 30;
  const st1 = degree['ver' + 1].positive + degree['ver' + 1].negative;
  for (let i = 1; i <= QUANTITY; i++ ) {
    const str = degree.status ?
      `Vertex ${i}: δ⁺(${i}) = ${degree['ver' + i].positive} δ⁻(${i}) = ${degree['ver' + i].negative}`:
      `Vertex ${i}: δ(${i}) = ${degree['ver' + i].positive}`
    ctx2.beginPath()
    ctx2.fillText(str, width, height);
    height+= 30
    ph = ph && (st1 === degree['ver' + i].positive + degree['ver' + i].negative) ? true: false;
  }
  for (let i = 1; i <= QUANTITY; i++){
    if (i === 1) {
      ctx2.fillText('Isolated vertexes :', width, height);
      height += 30;
    }
    if (degree['ver' + i].positive + degree['ver' + i].negative === 0) {
      ctx2.fillText(`Vertex ${i};`, width, height);
      height += 30;
    }
  }
  for (let i = 1; i <= QUANTITY; i++){
    if (i === 1) {
      ctx2.fillText('Hahging vertexes :', width, height);
      height += 30;
    }
    if (degree['ver' + i].positive + degree['ver' + i].negative === 1) {
      ctx2.fillText(`Vertex ${i};`, width, height);
      height += 30;
    }
  }
  if(ph) ctx2.fillText('Graph is homogeneous, degree: ' + st1, width, height);
  else ctx2.fillText('Graph isn`t homogeneous', width, height);
  return statistic;
}

// Lab3 functions

const serealizeMatrix = (name ,matrix, width, height) => {
  const start = width;
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx2.beginPath();
  for (let i = 0; i < matrix.length; i++){
    if (i === 0) ctx2.fillText('⎛',width - 10,height);
    else if (i === matrix.length - 1) ctx2.fillText('⎝', width - 10,height);
    else ctx2.fillText('⎜', width - 10,height);
    if (i === Math.floor((matrix.length - 1) / 2)) ctx2.fillText(`${name} =`, width - 40 - 11.5*name.length , height);
    for (let j = 0; j < matrix[i].length; j++){
      ctx2.fillText(`${matrix[i][j]}`,width, height);
      width += 30;
      if (j === matrix[i].length - 1) {
        if (i === 0) ctx2.fillText('⎞',width - 10,height);
        else if (i === matrix.length - 1) ctx2.fillText('⎠', width - 10,height);
        else ctx2.fillText('⎟', width - 10 ,height);
        width = start;
      }
    }
    height += 23;
  }
  return 0;
}

const TransMatrix = A => {
  const m = A.length, n = A[0].length, AT = [];
  for (let i = 0; i < n; i++){
    AT[ i ] = [];
    for (let j = 0; j < m; j++) AT[ i ][j] = A[j][ i ];
  }
    return AT;
}

const SumMatrix = (A,B) =>  {   
    let m = A.length, n = A[0].length;
    const C = [];
    for (let i = 0; i < m; i++){
      C[ i ] = [];
      for (let j = 0; j < n; j++) C[ i ][j] = A[ i ][j]+B[ i ][j];
     }
    return C;
}

const MultiplyMatrix = (A,B) => {
    let rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length;
    const C = [];
    if (colsA != rowsB) return false;
    for (let i = 0; i < rowsA; i++) C[i] = [];
    for (let k = 0; k < colsB; k++) {
      for (var i = 0; i < rowsA; i++) {
        var t = 0;
        for (var j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
        C[ i ][k] = t;
      }
    }
    return C;
}

const MatrixPow = (n,A) => { 
  if (n == 1) return A;
  else return MultiplyMatrix( A, MatrixPow(n-1,A) );
}

const connectivityMatrix = matrix => {
  const transM = TransMatrix(matrix), res = new Array(), length = matrix.length;
  for (let i = 0; i < length; i++){
    res[ i ] = new Array();
    for (let j = 0;j < length;j++) res[i][j] = matrix[i][j] * transM[i][j];
  }
  return res;
}

const reachabilityMatrix = matrix => {
  const powers = [matrix];
  for (let i = 2; i < matrix.length; i++){
    powers.push(MatrixPow(i, matrix));
  };
  const result = powers.reduce(SumMatrix);
  for (let i = 0; i < result.length; i++){
    for(let j = 0; j < result[i].length; j++){
      if (i === j || result[i][j] !== 0) result[i][j] = 1; 
    }
  }
  return result;
}

// Find ways 2 and 3

const findOne = (from, to, matrix , n) => {
  const result = new Array();
  let counter = 0;
  for (let i = 0;i < matrix.length;i++){
    for (let j = 0;j < matrix.length; j++){
      if (n === 2){
        if (i === j && matrix[i][to] === 1 && matrix[from][j] === 1)
          if (from !== i || to !== i)
            result.push(`${from + 1}➙${i + 1}➙${to + 1}`);
      }
      if (n === 3) {
        if (matrix[i][to] === 1 && matrix[from][j] === 1 && matrix[j][i] === 1 && !(from === i && to === j)){
          result.push(`${from + 1}➙${j + 1}➙${i + 1}➙${to + 1}`);
        }
      }
    }
  }
  return result;
}

const findWays = (matrix, n) => {
  const result = new Array();
  const finder = MatrixPow(n, matrix), length = finder.length;
  for (let i = 0;i < length;i++){
    for (let j = 0;j < length;j++) {
      if (finder[i][j] !== 0){
        result.push(...findOne(i, j,matrix, n));
      }
    }
  }
  return result;
}

const serealizeWays = (ways, width, height, n, d) => {
  ctx2.beginPath();
  if (d) ctx2.fillText('Shortest paths from the vertex 1', width, height);
  if (n && !d) ctx2.fillText(`All paths of length ${n}`, width, height);
  height += 30;
  const length = ways.length;
  for (let i = 0;i < length; i++){
    ctx2.fillText(`{${ways[i]}}`, width, height);
    if (length > 25 && i === Math.floor(length / 2)) width += (ways[i].length + 2) * 15, height = 30;
    height += 30;
  }
}


// Components of strong connectivity

const findComponents = cMatrix => {
  const res = new Object(), length = cMatrix.length;
  for (let i = 0;i < length; i++){
    let key = '';
    for (let j = 0;j < length;j++){
      key += cMatrix[i][j];
    }
    if (res[key]) res[key].push(i + 1);
    else res[key] = [i + 1]; 
  }
  return res;
}

const serealizeComponents = cCollect => {
  const res = new Array();
  let i = 0;
  const mapper = a => {
    i++;
    return `${a} (K${i})`
  }
  for (const i in cCollect){
    res.push(cCollect[i].slice(0))
  }
  return res.sort((a,b) => a[a.length - 1] - b[b.length - 1]).map(mapper);
}


// Condensation graph

const compColection = components => {
  const res = new Object();
  for (const k in components){
    const key = components[k].reduce((a, b) => a > b ? a: b);
    res[key] = components[k];
  }
  return res;
}

const condensationMatrix = (components,branches,length) => {
  const res = [];
  for (let k = 0;k < length; k++) {
    res[k] = [];
    for(let p = 0;p < length;p++) res[k][p] = 0;
  }
  for (const key1 in components){
    for (let i = 0;i < components[key1].length; i++){
      for (const key2 in components){
        if (key1 !== key2){
          for (let j = 0;j < components[key2].length; j++){
            const from = components[key1][i], to = components[key2][j];
            if (branches['f' + from + 't' + to] === 1){
              res[key1 - 1][key2 - 1] = 1;
            }
          }
        }
      }
    }
  }
  return res;
}

const renameVertex = (visible, vertex, ctx) => {
  ctx.fillStyle = 'white';
  ctx.lineWidth = 2.4;
  for (let i = 1;i <= visible.length; i++){
    ctx.beginPath();
    const {width, height} = vertex['ver' + visible[i - 1]];
    ctx.arc(width,height,25,0,2*Math.PI);
    ctx.fill();
    ctx.strokeText('K' + i,width - 10, height + 10);
  }
  ctx.fillStyle = 'black';
}

// Lab 4 functions (BFS)

// Graphics 

const hightlightVertex = (color, listVvertex, numberVertex, radius, matrixNum, ctx) => {
  ctx.fillStyle = color;
  ctx.lineWidth = 2.4;
  for (const vertex of numberVertex){
    const {width, height, num} = listVvertex['ver' + vertex];
    const index = matrixNum ? matrixNum[0].indexOf(num) : 0;
    const numeration = matrixNum ? `${num}(${matrixNum[1][index]})` : `${num}`;
    ctx.beginPath();
    ctx.arc(width, height, radius - 1.2, 0, 2*Math.PI);
    ctx.fill()
    ctx.strokeText(numeration, width - 15, height + 5, 35);
  }
}

const hightlightEdge = (color, matrix, vertex, sides, numberEdges, directed, weightM,ctx) => {
  const radius = directed ? 12 : 0;
  ctx.fillStyle = 'black';
  ctx.lineWidth = 2.4;
  const length = matrix.length;
  for (let i = 0; i < length; i++) {
    const lengthT = directed ? 0 : i;
    for (let j = lengthT; j < length; j++) {
      if (matrix[i][j] === 1){
        const a = i + 1, b = j + 1;   
        const from = vertex['ver' + a], to = vertex['ver' + b];
        const weight = weightM ? weightM[i][j].toString() : weightM;
        const checked = check(from, to, sides);
        branches['f' + a + 't' + b] = 1;
        if (numberEdges.includes(`f${a}t${b}`)){
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
        }
        evasion(from, to, checked, directed, radius, sides, weight, ctx);
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
      }
    }
  }
}

// Mechnic part

const doInfoBfs = quantity => {
  const res = new Object();
  for (let i = 1; i <= quantity; i++) res['ver' + i] = 0;
  return res;
};

const bfsAlgoritm = (start, matrix, infoBfs, visualReturned, direction) => {
  const Quene = new Array();
  const length = matrix.length;
  let counter = 0;
  let activeVer;  
  infoBfs['ver' + start] = ++counter;
  Quene.push(start);
  while (Quene.length !== 0){
    visualReturned.push(Quene.slice(0));
    activeVer = Quene.shift();
    for (let i = 0; i < length; i++){
      const ch = direction ? 0 : (matrix[i][activeVer - 1] === 1);
      if (((matrix[activeVer - 1][i] === 1) || ch) && infoBfs['ver' + (i + 1)] === 0) {
        Quene.push(i + 1);
        infoBfs['ver' + (i + 1)] = ++counter;
      }
    }
  }
  for (const key in infoBfs){
    if(infoBfs[key] === 0){
      visualReturned.push(['nextComponent'])
      const res = bfsAlgoritm(parseInt(key.slice(3)), matrix, infoBfs, visualReturned, direction);
      visualReturned.concat(res);
    }
  }
  return visualReturned;
}

const hightlightBFS = (visualReturned, vertexBlue, edgesBlue, matrix, sides, vertex, infoBfs, direction,matrixNum, ctx) => {
  if (visualReturned.length === 0) {
    graphTriangle(QUANTITY, ctx, sides, vertex);
    hightlightEdge('blue',matrix, vertex, sides,edgesBlue, true, false,ctx);
    hightlightVertex('blue', vertex, vertexBlue, radius, matrixNum,ctx);
    return;
  }
  graphTriangle(QUANTITY, ctx, sides, vertex);
  const activeVer = visualReturned.shift().shift();
  const limeV = new Array();
  const visual = visualReturned[0] || [];
  if (visual[0] !== 'nextComponent') { 
    for (const i of visual) if(!vertexBlue.includes(i)) limeV.push(i);
    vertexBlue.push(...visual, activeVer);
    for (const to of visual) {
      if (!infoBfs['ver' + to]) {
          const pushedEdge = direction ?
            `f${activeVer}t${to}`:
            branches[`f${activeVer}t${to}`] ?`f${activeVer}t${to}` : `f${to}t${activeVer}`;
          edgesBlue.push(pushedEdge);
          infoBfs['ver' + to] = 1;
        }
    }
  } else {
    visualReturned.shift();
    vertexBlue.push(activeVer);
  }
  hightlightEdge('blue',matrix, vertex, sides,edgesBlue, true, false,ctx);
  hightlightVertex('blue', vertex, vertexBlue, radius,matrixNum, ctx);
  hightlightVertex('red', vertex, [activeVer], radius,matrixNum, ctx);
  hightlightVertex('lime',vertex,limeV,radius,matrixNum,ctx);
}

const doTreeTravesal = (QUANTITY, edgesBlue) =>{
  const res = [];
  for (let i = 0; i < QUANTITY; i++){
    res[i] = [];
    for (let j = 0; j < QUANTITY; j++){
      if (edgesBlue.includes(`f${i + 1}t${j + 1}`)) res[i][j] = 1;
      else res[i][j] = 0;
    }
  }
  return res;
}

const doMatrixNumeration = infoBfs => {
  const res = [[],[]];
  for (const key in infoBfs) {
    const c = parseInt(key.slice(3)) - 1;
    res[0][c] = c + 1;
    res[1][c] = infoBfs[key];
  }
  return res;
}

const renameInTree = (vertex, matrixNum, ctx) => {
  ctx.fillText(`🄱🄵🅂 search tree 🌲`, 40, 30);
  ctx.fillStyle = '#deff9c';
  for (const key in vertex) {
    const {width, height, num} = vertex[key];
    const index = matrixNum[0].indexOf(num);
    ctx.beginPath();
    ctx.arc(width, height, radius - 1.2, 0, 2*Math.PI);
    ctx.fill();
    ctx.strokeText(`${num}(${matrixNum[1][index]})`, width - 15, height + 5, 35);
  }
  ctx.fillStyle = 'black';
}

//Lab 5 Functions (Prime)

// Mechanic part

const matrixSkl = n => {
  const res = [];
  for (let i = 0; i < n; i++){
    res[i] = [];
    for (let j = 0; j < n; j++) res[i][j] = 0;
  }
  return res;
}


const minSkeleton = (weightM, visitedVert, visualizeArr) => {
  let weight = 0;
  const skeletonM = matrixSkl(QUANTITY);
  const length = skeletonM.length;
  while (visitedVert.length !== length) {
    let resmin = [];
    for (const v of visitedVert){
      const sorted = weightM[v - 1].filter(a => a !== 0);
      let min;
      if (sorted.length) min = sorted.reduce((a, b) => a < b? a: b);
      if (min) {
        const index = weightM[v - 1].indexOf(min) + 1;
        if (!visitedVert.includes(index)) resmin.push([min, [index,v]]);
      }
    }
    if (resmin.length === 0) {
      const none = [];
      for (let k  = 1; k <= QUANTITY; k++) if (!visitedVert.includes(k)) none.push(k);
      for (const v of none){
        const sorted = weightM[v - 1].filter(a => a !== 0);
        let min;
        if (sorted.length) min = sorted.reduce((a, b) => a < b? a: b);
          if (min) {
          const index = weightM[v - 1].indexOf(min) + 1;
          if (visitedVert.includes(index)) resmin.push([min, [index,v]]);
        }
      }
    }
    const res = resmin.reduce((a, b) => a[0] < b [0]? a : b);
    weight += res[0];
    //console.log(res);
    visualizeArr.push(res[1]);
    visitedVert.push(res[1][0]);
    weightM[res[1][0] - 1][res[1][1] - 1] = 0,weightM[res[1][1] - 1][res[1][0] - 1] = 0;
    skeletonM[res[1][0] - 1][res[1][1] - 1] = 1,skeletonM[res[1][1] - 1][res[1][0] - 1] = 1;
    resmin = [];
  }
  return {skeletonM, weight};
}


// Graphics part

const buildPrimesSkl = (visualizeArr,visualize, vertex, sides,visual, weightM, weight, ctx) => {
  if (visualizeArr.length === 0) {
    graphTriangle(QUANTITY, ctx2, sides, vertex);
    edge(skeletonM, false, vertex, sides, true, weightM, ctx2);
    ctx.fillText(`The weight of the minimum remaining tree is : ${weight}`, 20, 30);
    return;
  };
  visualize.push(visualizeArr.shift());
  for (const i of visualize) visual.push(...i);
  graphTriangle(QUANTITY, ctx, sides, vertex, visual);
  for (const coords of visualize){
    const from = vertex['ver' + coords[0]], to = vertex['ver' + coords[1]];
    const checked = check(from, to, sides);
    const weight = weightM[coords[0] - 1][coords[1] - 1].toString();
    evasion(from, to, checked, false, 0, sides, weight, ctx);
  }
}

// Lab 6 (Deikstra algoritm)

// Mechanc part

const dijkstra = (weightM, start, timeDistances) => {
  const distances = [];
  for (let i = 0; i < weightM.length; i++) distances[i] = Number.MAX_VALUE;
  distances[start] = 0;
  let visited = [];
  while (true) {
      let shortestDistance = Number.MAX_VALUE;
      let shortestIndex = -1;
      for (var i = 0; i < weightM.length; i++) {
          if (distances[i] < shortestDistance && !visited[i]) {
              shortestDistance = distances[i];
              shortestIndex = i;
          }
      }
      if (shortestIndex === -1) {
          return distances;
      }
      for (let i = 0; i < weightM[shortestIndex].length; i++) {
          if (weightM[shortestIndex][i] !== 0 && distances[i] > distances[shortestIndex] + weightM[shortestIndex][i]) {
              distances[i] = distances[shortestIndex] + weightM[shortestIndex][i];
          }
      }
      visited[shortestIndex] = true;
      timeDistances.push(distances.slice(0));
  }
};

const buildShortestPath = (weightM, weightsMap, endPos) => {
  let endNodeWeight = weightsMap[endPos];
  if (endNodeWeight === Number.MAX_VALUE) return 'Infinity';
  const path = [];
  let pos = endPos;
  while (endNodeWeight !== 0) {
    for (let i = 0;i < weightM[pos].length; i++) {
      if (endNodeWeight === weightM[pos][i] + weightsMap[i]) {
        path.unshift(+i + 1);
        endNodeWeight = weightsMap[i];
        pos = i;
      }
    }
  }
  if (!path.includes(endPos + 1)) path.push(endPos + 1);
  return path;
}

const dePath = (weightM, weightsMap, quantity) => {
  const res = [];
  for (let i = 0;i < quantity; i++) res.push(buildShortestPath(weightM, weightsMap, i));
  return res;
}

// Graphic part

const doQueneD = (paths, weightsMap) => {
  const res = [];
  for (let i = 0; i < weightsMap.length; i++) {
    res[i] = [weightsMap[i], paths[i]];
  }
  return res.sort((a, b) => a[0] - b[0]).slice(1);
}

const infChek = gpaths => {
  if (gpaths[0] === 'Infinity') {
    gpaths.shift();
    infChek(gpaths);
  }
}

const graphicsDijkstra = (matrix, vertex, sides, weightM, gpaths, visualVert, visualEdge, start, matrixNum, matrixI,ctx) => {
  if (!visualVert.includes(start)) visualVert.push(start);
  const main = () => {
    graphTriangle(QUANTITY, ctx, sides, vertex);
    hightlightVertex('blue', vertex, [1,2,3,4,5,6,7,8,9,10], radius, matrixNum, ctx2);
    hightlightVertex('lime', vertex, visualVert, radius, matrixNum, ctx2);
    hightlightVertex('red', vertex, [start, active[active.length - 1]], radius, matrixNum, ctx2);
    const numberEdges = [];
    for (const edge of visualEdge) numberEdges.push(`f${edge[0]}t${edge[1]}`, `f${edge[1]}t${edge[0]}`);
    hightlightEdge('lime', doSymetricMatrix(matrix), vertex, sides, numberEdges, false, weightM,ctx2);
  }
  if (gpaths.length === 0) {
    graphTriangle(QUANTITY, ctx2, sides, vertex);
    edge(doSymetricMatrix(matrixI), false, vertex, sides, false, weightM, ctx2);
    hightlightVertex('lime', vertex, [1,2,3,4,5,6,7,8,9,10], radius, matrixNum, ctx2);
    hightlightVertex('red', vertex, [start], radius, matrixNum, ctx2);
    return;
  }
  ctx.lineWidth = 2.4;
  infChek(gpaths);
  const active = gpaths.shift()[1];
  visualVert.push(...active);
  for (const ver of active) matrixNum[1][ver - 1] = 'P';
  for (let i = 1; i < active.length;i++){
    const pushed = [active[i - 1], active[i]];
    if (!visualEdge.toString().includes(pushed.toString()))
      visualEdge.push(pushed);
  };
  for (const edge of visualEdge) matrixI[edge[0] - 1][edge[1] - 1] = 1;
  main();
}

// Serealize part

const doTreeByGpaths = (QUANTITY, gpaths) => {
  const res = [];
  const edges = [];
  for (let i = 0;i < QUANTITY; i++){
    res[i] = [];
    for (let j = 0;j < QUANTITY; j++)
      res[i][j] = 0;
  }
  return res;
}

const serealizeDijkstra = gpaths => {
  const mapper = a => {
    const r = a[1].reduce((c,b) => `${c}➢${b}`);
    return `{way: ${r}, weight: ${a[0]}}`
  }
  return gpaths.map(mapper);
}

const doTable = (data, ctx) => {
  for (let i = 0; i < data.length; i++){
    for (let j = 0; j < data[i].length; j++){
      if (data[i][j] === Number.MAX_VALUE) data[i][j] = '∞';
    }
  };
  const line = [];
  for (let i = 1; i <= 10; i++) line.push(i);
  const line2 = data.shift().map( x => `${x}`);
  const line1 = line.map(x => `${x}`);
  const eac1 = parseInt(line1.reduce((a, b) => a.length > b.length ? a : b));
  const eac2 =  parseInt(line2.reduce((a, b) => a.length > b.length ? a : b));
  const max = Math.max(eac1, eac2).toString().length;
  const res1 = line1.map(x => x.length < max ? `${x} ` : x);
  const res2 = line2.map(x => x.length < max && x != '∞'? `${x} ` : x);
  console.log(res1)
  ctx.fillText(res1.join(' | '), 20, 20, 300);
  ctx.fillText(res2.join(' | '), 20, 45, 300);
}

//Usage // Begin //

//Lab 1

document.getElementById('build').onclick = function() {
  if (countBtn > 0) window.location.reload(true);
  const flag = prompt('Directed/undirected/GraphForLab5');
  if (flag.toLowerCase() === 'directed') edge(matrix, true, vertex, sides, true, false, ctx);
  else if (flag.toLowerCase() === 'undirected') edge(symetricMatrix, false, vertex, sides, true, false, ctx);
  else if (flag.toLowerCase() === 'graphforlab5') edge(symetricMatrix, false, vertex, sides, true,weightM, ctx);
  else alert('Incorrectly answer');
  countBtn++;
}

//Lab 2

document.getElementById('statistics').onclick = function() {
  viewDegree(degree);
}

//Lab 3

const rMatrix = reachabilityMatrix(matrix);
const cMatrix = connectivityMatrix(rMatrix);
const components = findComponents(cMatrix);
const completeComponents = compColection(components);


document.getElementById('condensation').onclick = function (){
  ctx2.clearRect(0,0,canvas2.width, canvas2.height);
  ctx2.lineWidth = 2.4;
  const vertexK = {};
  const sidesK = {
    sideDown:[],
    sideLeft:[],
    sideRight:[]
  };
  const condMatrix = condensationMatrix(completeComponents,branches,QUANTITY);
  const visual = [];
  for (const i in completeComponents) visual.push(parseInt(i));
  graphTriangle(QUANTITY,ctx2,sidesK,vertexK,visual);
  edge(condMatrix,true,vertexK,sidesK,true, false,ctx2);
  renameVertex(visual,vertexK,ctx2);
};


document.getElementById('matrix').onclick = function() {
  ctx2.fillStyle = 'black';
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  const flag = prompt('Adjacency/reachability/connectivity/bypass/numeration/minskeleton');
  if (flag.toLowerCase() === 'adjacency'){
    const f2 = prompt('What degree?');
    if (f2 === '1') serealizeMatrix('A', matrix, 80, 100);
    else if (f2 === '2') serealizeMatrix('A²', MatrixPow(2, matrix), 80, 100);
    else if (f2 === '3') serealizeMatrix('A³', MatrixPow(3, matrix), 80, 100);
    else alert('Incorrectly answer');
  }
  else if (flag.toLowerCase() === 'reachability') {
    const f3 = prompt('What degree?');
    if (f3 === '1') serealizeMatrix('R', rMatrix, 80, 100);
    else if (f3 === '2') serealizeMatrix('R²', MatrixPow(2, rMatrix), 80, 100);
    else alert('Incorrectly answer');
  }
  else if (flag.toLowerCase() === 'connectivity'){
    serealizeMatrix('S', cMatrix , 80, 100);
  }
  else if (flag.toLowerCase() === 'bypass'){
    serealizeMatrix('B', doTreeTravesal(QUANTITY, edgesBlue) , 80, 100);
  }
  else if (flag.toLowerCase() === 'numeration'){
    serealizeMatrix('N', doMatrixNumeration(infoBfs) , 80, 100);
  }
  else if (flag.toLowerCase() === 'minskeleton'){
    serealizeMatrix('M', skeletonM , 80, 100);
  }
}

document.getElementById('ways').onclick = function() {
  ctx2.fillStyle = 'black';
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  const flag = prompt('What length?/dijkstra');
  if (flag === 'dijkstra') {
    serealizeWays(serealizedD, 30, 30, 0, 1);
    return;
  } 
  serealizeWays(findWays(matrix, parseInt(flag)),30, 30, flag);
}

document.getElementById('components').onclick = function() {
  ctx2.fillStyle = 'black';
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
  ctx2.fillText('Components of strong connectivity:',30, 30);
  serealizeWays(serealizeComponents(components), 30, 30);
}

// Lab 4

const vertexBlue = new Array();
const edgesBlue = new Array();
const infoBfs = doInfoBfs(QUANTITY), infoBfs2 = doInfoBfs(QUANTITY);
const visualReturned = new Array();


document.getElementById('start').onclick = function(){
  const flag = prompt('Enter start vertex:');
  const flag2 = confirm('Consider the direction of the arrows?(Enter yes of cancellation)');
  const qq = bfsAlgoritm(parseInt(flag), matrix, infoBfs, visualReturned, flag2);
  const matrixN = doMatrixNumeration(infoBfs);
  
  document.getElementById('BFS').onclick = function() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.fillStyle = 'black';
    ctx2.fillText(`Start vertex: ${flag}`, 100, 80);
    const vertex2 = new Object();
    const sides2 = {
    sideDown: [],
    sideLeft: [],
    sideRight: []
    }
    ctx2.lineWidth = 2;
    hightlightBFS(qq,vertexBlue,edgesBlue, matrix,sides2, vertex2, infoBfs2, flag2, matrixN, ctx2);
  }


  document.getElementById('tree').onclick = function() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
    const vertexT = new Object();
    const sidesT = {
      sideDown: [],
      sideLeft: [],
      sideRight: []
      }
    const matrixT = doTreeTravesal(QUANTITY,edgesBlue);
    graphTriangle(QUANTITY, ctx2, sidesT, vertexT);
    renameInTree(vertexT,matrixN,ctx2);
    edge(matrixT, true, vertexT, sidesT, true, false, ctx2);
  }  
}


// Lab 5


const visualizeArr = new Array();
const WM = doSymetricMatrix(weightM);
const {skeletonM, weight} = minSkeleton(WM,[1], visualizeArr);
//console.log(weight);
const visualaze = new Array(), visual = new Array();


document.getElementById('skeleton').onclick = function() {
  ctx2.lineWidth = 2.4;
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  const vertexP = new Array();
  const sidesP = {
    sideDown: [],
    sideLeft: [],
    sideRight: []
  };
  buildPrimesSkl(visualizeArr, visualaze, vertexP, sidesP, visual, weightM, weight, ctx2);
}



// Lab 6 

const timeDistances = [];
const weightsMap = dijkstra(weightM, 0, timeDistances);
console.log(timeDistances);
const pask = dePath(weightM, weightsMap, QUANTITY);
const gpaths = doQueneD(pask, weightsMap);
const serealizedD = serealizeDijkstra(gpaths);
const matrixNum = [
  [1,    2,    3,   4,   5,   6,   7,   8,   9,  10],
  ['P', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T']
];
const treeMatrix = doTreeByGpaths(QUANTITY, gpaths);



document.getElementById('dijkstra').onclick = function() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  const sidesD = {
    sideDown: [],
    sideLeft: [],
    sideRight: [],
  }
  const vertexD = new Object();
  const visualVD = new Array();
  const visualED = new Array();
  doTable(timeDistances, ctx2);
  graphicsDijkstra(doSymetricMatrix(matrix), vertexD, sidesD, weightM, gpaths, visualVD, visualED, 1, matrixNum, treeMatrix, ctx2);
}
