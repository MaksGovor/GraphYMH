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

ctx.lineWidth = 2.4;
ctx.fillStyle = 'white';
ctx.font = '20px Vernada';
ctx2.font = '20px Vernada';
const branches = new Object();
const vertex = new Object();
const degree = new Object();
const connections = new Map(); 
const radius = 30;
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
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
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

const drawCircle = (from, directed, sides,ctx) => {
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

const evasion = (from, to, event, directed, arrowRadius, sides, ctx) => {
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
    drawCircle(from, directed, sides, ctx);
    return;
  }
  if (event === 'default' || event === 'alongside'){
    if (branches['f' + to.num + 't' + from.num] === 1 && directed) {
      if (checkOne(from, to, 'sideDown', sides) || (from.height === to.height)) {
        countD++;
        const i = countD % 2 === 0 ? 10: -10;
        height = from.height + i + i*Math.random();
        width = (to.width + from.width) / 2;
        drawArrow(from ,{width, height},false , 0, 'begin', ctx);
        drawArrow({width, height}, to, directed, arrowRadius, 'end',ctx);
        return;
      }
      if (to.width === from.width) {
        countH++;
        const i = countH % 2 === 0 ? 10: -10;
        height = (from.height + to.height) / 2;
        width = from.width + i + i*Math.random();
        drawArrow(from ,{width, height},false , 0, 'begin', ctx);
        drawArrow({width, height}, to, directed, arrowRadius, 'end',ctx);
        return;
      }
      angle = Math.atan2(to.height - from.height,to.width - from.width);
      height = from.height + Math.sin(angle)*rad + 10*Math.random();
      width = from.width + 1.2*Math.cos(angle)*rad - 10*Math.random();
      drawArrow(from ,{width, height},false , 0, 'begin', ctx);
      drawArrow({width, height}, to, directed, arrowRadius, 'end', ctx);
      return;
    }
    else {
      drawArrow(from, to, directed, arrowRadius, 'full',ctx);
      return;
    }
  }
  drawArrow(from ,{width, height},false , 0, 'begin', ctx);
  drawArrow({width, height}, to, directed, arrowRadius, 'end', ctx);
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

const edge = (matrix, directed, vertex, sides, moment, ctx) => {
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
          window.setTimeout(() => drawArrow(from, to, directed, arrowRadius, 'full', ctx), count + 150);
          continue;
        }
        const checked = check(from, to, sides);
        if (moment){
          window.setTimeout(() => {
            console.log(checked);
            evasion(from, to, checked, directed, arrowRadius, sides, ctx);
          },count);
        } else evasion(from, to, checked, directed, arrowRadius, sides, ctx);
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

const serealizeWays = (ways, width, height, n) => {
  ctx2.beginPath();
  if (n) ctx2.fillText(`All paths of length ${n}`, width, height);
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
    const index = matrixNum[0].indexOf(num);
    const numeration = `${num}(${matrixNum[1][index]})`;
    ctx.beginPath();
    ctx.arc(width, height, radius - 1.2, 0, 2*Math.PI);
    ctx.fill()
    ctx.strokeText(numeration, width - 15, height + 5, 35);
  }
}

const hightlightEdge = (color, matrix, vertex, sides, numberEdges,ctx) => {
  ctx.fillStyle = 'black';
  ctx.lineWidth = 2.4;
  const length = matrix.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (matrix[i][j] === 1){
        const a = i + 1, b = j + 1;   
        const from = vertex['ver' + a], to = vertex['ver' + b];
        const checked = check(from, to, sides);
        branches['f' + a + 't' + b] = 1;
        if (numberEdges.includes(`f${a}t${b}`)){
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
        }
        evasion(from, to, checked, true, 12, sides, ctx);
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
    hightlightEdge('blue',matrix, vertex, sides,edgesBlue, ctx);
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
  hightlightEdge('blue',matrix, vertex, sides,edgesBlue, ctx);
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

//Usage // Begin //

//Lab 1

document.getElementById('build').onclick = function() {
  if (countBtn > 0) window.location.reload(true);
  const flag = prompt('Directed/undirected');
  if (flag.toLowerCase() === 'directed') edge(matrix, true, vertex, sides, true, ctx);
  else if (flag.toLowerCase() === 'undirected') edge(symetricMatrix, false, vertex, sides, true, ctx);
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
  edge(condMatrix,true,vertexK,sidesK,true,ctx2);
  renameVertex(visual,vertexK,ctx2);
};


document.getElementById('matrix').onclick = function() {
  ctx2.fillStyle = 'black';
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  const flag = prompt('Adjacency/reachability/connectivity/bypass/numeration');
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
}

document.getElementById('ways').onclick = function() {
  ctx2.fillStyle = 'black';
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  const flag = prompt('What length ?');
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
    edge(matrixT, true, vertexT, sidesT, true, ctx2);
  }  
}

