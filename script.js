let canvas, context,
   prevX = 0, //previous x and y value
   prevY = 0,
   currX = 0, // current x and y value
   currY = 0,
   canvas_layout,
   w, h, //width & height of canvas 
   flag = false,
   drop_flag = false;

var x = 'black', //default color of line drawn
   y = 2; // default line thicknes


function init() {
   canvas = document.querySelector("#canvasBox");
   canvas_layout = document.querySelector(".canvaslayout");
   w = canvas.width = canvas_layout.offsetWidth * 2;
   h = canvas.height = canvas_layout.offsetHeight

   context = canvas.getContext('2d');
   context.strokeStyle = x;

   // add mouse event listeners
   canvas.addEventListener('mousemove', function (e) { findxy('move', e), false });
   canvas.addEventListener('mousedown', function (e) { findxy('down', e), false });
   canvas.addEventListener('mouseup', function (e) { findxy('up', e), false });
   canvas.addEventListener('mouseout', function (e) { findxy('out', e), false });
}

function findxy(motion, e) {
   if (motion == 'down') {
      prevX = currX;
      prevY = currY;
      getCursorCoordinates(e);
      flag = true;
      drop_flag = true;
      if (drop_flag) {
         context.beginPath();
         context.fillStyle = x;
         context.fillRect(currX, currY, y, 2);
         context.closePath();
         drop_flag = false;
      }
   } else if (motion == 'move') {
      if (flag) {
         prevX = currX, prevY = currY;
         getCursorCoordinates(e);
         draw();
      }
   } else if (motion == 'up' || motion == 'out') {
      flag = false;
   }
}

function getCursorCoordinates(e) {
   currX = e.clientX - canvas.offsetLeft;
   currY = e.clientY - canvas.offsetTop;
   console.log(currX, currY);
   return { currX: currX, currY: currY };
}

function draw() {
   context.beginPath();
   context.moveTo(prevX, prevY);
   context.lineTo(currX, currY);
   context.strokeStyle = x;
   context.lineWidth = y;
   context.stroke();
   context.closePath();
}


function drawLine() {
   context.moveTo(prevX, prevY);
   context.lineTo(currX, currY);
   context.stroke();
}