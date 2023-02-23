let canvas, context,
   prevX = 0, //previous x and y value
   prevY = 0,
   currX = 0, // current x and y value
   currY = 0,
   canvas_layout, //width & height of canvas 
   flag = false,
   drop_flag = false;


let mouseX = 0, mouseY = 0, existingLines = [];

let isDrawing = false;

var x = 'black', //default color of line drawn
   y = 2; // default line thicknes


//function to initiate the canvas
function canv_init() {
   canvas = document.querySelector("#canvasBox");
   canvas_layout = document.querySelector(".canvaslayout");
   w = canvas.width = canvas_layout.offsetWidth * 2;
   h = canvas.height = canvas_layout.offsetHeight

   context = canvas.getContext('2d');
}

function colorClick(choice) {
   switch (choice.id) {
      case 'red':
         x = 'red';
         console.log(choice.id)
         break;
      case 'blue':
         x = 'blue';
         break;
      case 'yellow':
         x = 'yellow';
         break;
      case 'green':
         x = 'green';
         break;
      case 'white':
         x = 'white';
         break;
      case 'black':
         x = 'black';
         break;
   }
}


function freeStyle() {
   // add mouse event listeners
   canvas.addEventListener('mousemove', function (e) { findxy('move', e) }, false);
   canvas.addEventListener('mousedown', function (e) { findxy('down', e) }, false);
   canvas.addEventListener('mouseup', function (e) { findxy('up', e) }, false);
   canvas.addEventListener('mouseout', function (e) { findxy('out', e) }, false);
}

function findxy(motion, e) {
   if (motion == 'down') {
      prevX = currX;
      prevY = currY;
      getCursorCoordinates(e);
      flag = true;
      drop_flag = true;
      if (drop_flag) {
         draw();
      }
   } else if (motion == 'move') {
      if (flag) {
         prevX = currX, prevY = currY;
         getCursorCoordinates(e);
         context.moveTo(prevX, prevY);
         context.lineTo(currX, currY);
         context.strokeStyle = x;
         context.lineWidth = y;
         context.stroke();
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
   context.fillStyle = x;
   context.fillRect(currX, currY, y, 2);
   context.closePath();
   drop_flag = false;
}


function drawLine() {

   canvas.addEventListener('mousemove', function (e) { mouseMove(e) }, false);
   canvas.addEventListener('mousedown', function (e) { mouseDown(e) }, false);
   canvas.addEventListener('mouseup', function (e) { mouseUp(e) }, false);
   canvas.addEventListener('mouseout', function (e) { mouseOut(e) }, false);

   function draw_L() {
      //context.fillStyle = x;
      context.fillRect(currX, currY, y, 2);
      context.strokeStyle = x;
      context.lineWidth = y;
      context.beginPath();

      for (var i = 0; i < existingLines.length; ++i) {
         let line = existingLines[i];
         context.moveTo(line.startX, line.startY);
         context.lineTo(line.endX, line.endY);
      }

      context.stroke();

      if (flag) {
         context.strokeStyle = x;
         context.beginPath();
         context.moveTo(prevX, prevY);
         context.lineTo(mouseX, mouseY);
         context.stroke();
      }
   }
   function mouseDown(e) {
      if (!flag) {
         getCursorCoordinates(e);
         prevX = currX;
         prevY = currY;
         flag = true;
      }
      draw_L();
   }
   function mouseUp(e) {
      if (flag) {
         existingLines.push({
            startX: prevX,
            startY: prevY,
            endX: mouseX,
            endY: mouseY
         })
         flag = false;
      }
      draw_L();
   }
   function mouseMove(e) {
      mouseX = e.clientX - canvas.offsetLeft;
      mouseY = e.clientY - canvas.offsetTop;
      console.log(mouseX, mouseY);
      /*if(flag){
         context.beginPath();
         context.moveTo(prevX, prevY);
         context.lineTo(mouseX, mouseY);
         context.stroke();
      } */
   }
   function mouseOut(e) {
      flag = false;
   }
}

/**
function windmillDraw(){
   canv_init();
   
   canvas.addEventListener('mousemove', function (e){mouseMove(e)}, false );
   canvas.addEventListener('mousedown', function (e){mouseDown(e)}, false );
   canvas.addEventListener('mouseup', function (e){mouseUp(e)}, false );
   canvas.addEventListener('mouseout', mouseOut(e), false );

function draw_L(){
   context.fillStyle = x;
   context.fillRect(currX,currY,y,2);
   context.strokeStyle = x;
   context.lineWidth = y;
   context.beginPath();

   for(var i=0;i< existingLines.length;++i){
      let line = existingLines[i];
      context.moveTo(line.startX,line.startY);
      context.lineTo(line.endX,line.endY);
   }

   context.stroke();

   if (isDrawing){
      context.strokeStyle = 'red';
      context.beginPath();
      context.moveTo(prevX,prevY);
      context.lineTo(currX,currY);
      context.stroke();
   }
}
function mouseDown(e){
   if(!isDrawing){
      getCursorCoordinates(e);
      prevX = currX;
      prevY = currY;
      isDrawing = true;
   }
   draw_L();  
}
function mouseUp(e){
   if (isDrawing){
      existingLines.push({
         startX: prevX,
         startY:prevY,
         endX:currX,
         endY:currY
      })
      isDrawing = false;
   }
   draw_L();
}
function mouseMove(e){
   getCursorCoordinates(e);
   if(isDrawing){
      draw_L();
   }
}

}
}
*/