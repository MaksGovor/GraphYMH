'use strict';

const canvas = document.getElementById('c1');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const vertex = new Object();

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


const graphTriangle = () => {
    let width = canvas.width / 2;
    let height = 40;
    let left = width;
    
    for (let i = 1; i < 5;i++) {
        if ( i === 1) {
            ctx.beginPath();
            ctx.arc(width, height, 30, 0, 2*Math.PI,false );
            ctx.fillText(i, width, height);
            ctx.stroke();
            vertex['ver' + i] = {width, height};
            continue;
        }
        width += 70;
        left -= 70;
        height += 80;
        ctx.beginPath();        
        ctx.arc(width, height, 30, 0, 2*Math.PI,false );
        ctx.fillText(i, width, height);
        vertex['ver' + i] = {width, height};
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(left, height, 30, 0, 2*Math.PI,false );
        const index = 12 - i;
        ctx.fillText(index, left, height);
        vertex['ver' + index] = {left, height};
        ctx.stroke();
    };
    for (let i = 5; i <= 7; i++) {
        width -= 105;
        ctx.beginPath();        
        ctx.arc(width, height + 15, 30, 0, 2*Math.PI,false );
        ctx.fillText(i, width, height + 15);
        vertex['ver' + i] = {width, height};
        ctx.stroke();
    };
    ctx.fillText("Fill text", 20, 50);
    console.log(vertex);
}

const badRib = {
  angle : [1, 4, 8],
  left: [1, 8, 9, 10],
  right: [1, 2, 3, 4],
  down: [4, 5, 6, 7, 8],
};


const rib = matrix =>{
    for (let i = 0; i < matrix.length; i++) {
        const a = i + 1;
        const width1 = vertex['ver' + a].width || vertex['ver' + a].left; 
        const height1 = vertex['ver' + a].height;
        for(let j = 0; j < matrix[i].length;j++) {
            if (matrix[i][j] === 1) {
                const b = j + 1;                
                const width2 = vertex['ver' + b].width || vertex['ver' + b].left; 
                const height2 = vertex['ver' + b].height;
                if (a === b) {
                    ctx.beginPath();
                    ctx.moveTo(width1 + 8, height1 + 10);
                    ctx.lineTo(width1 + 70,height1 - 40);
                    ctx.moveTo(width1 + 70,height1 - 40);
                    ctx.lineTo(width1 + 20, height1 - 40);
                    ctx.moveTo(width1 + 20, height1 - 40);
                    ctx.lineTo(width2 + 3, height2 - 16);
                    ctx.stroke();
                } else {
                console.log(a, b);
                ctx.moveTo(width1, height1);
                ctx.lineTo(width2, height2);
                ctx.stroke();
                }
            }
        }
    }
};

graphTriangle();
rib(matrix);

