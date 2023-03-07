let canvas, context,
   prevX = 0, //previous x and y value
   prevY = 0,
   currX = 0, // current x and y value
   currY = 0,
   canvas_layout, //width & height of canvas 
   flag = false,
   drop_flag = false,
   rangeSlide, outputDiv, thickness,
   canvasImage, Save,New;


let mouseX = 0, mouseY = 0, existingLines = [];

let Circle = false,
   Line = false,
   Triangle = false,
   Freestyle = false,
   Rectangle = false;

var x = 'black', //default color of line drawn
   y = 2; // default line thicknes


//function to initiate the canvas
function canv_init() {
   canvas = document.querySelector("#canvasBox");
   canvas_layout = document.querySelector(".canvaslayout");
   w = canvas.width = canvas_layout.offsetWidth * 2;
   h = canvas.height = canvas_layout.offsetHeight
   context = canvas.getContext('2d');

   rangeSlide = document.querySelector("#rangeSlider");
   outputDiv = document.querySelector("#output");
   slideChange();
   Save = document.querySelector("#save");
   Save.addEventListener('click',saveCanvas,false);
   New = document.querySelector('#new');
   New.addEventListener('click',newCanvas,false);
}

function slideChange() {
   rangeSlide.addEventListener("input", function () {
      outputDiv.innerHTML = rangeSlide.value;
      y = parseInt(rangeSlide.value);
      console.log(y);
      return y;
   });
}

function chooseListener(func) {
   if (Circle || Freestyle || Line || Triangle || Rectangle) {
      canvas.addEventListener('mousemove', function (e) { func('move', e) }, false);
      canvas.addEventListener('mousedown', function (e) { func('down', e) }, false);
      canvas.addEventListener('mouseup', function (e) { func('up', e) }, false);
      canvas.addEventListener('mouseout', function (e) { func('out', e) }, false);
   }
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
   Freestyle = true;
   Line = Circle = false;
   chooseListener(findxy);
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

   function draw() {
      context.beginPath();
      context.fillStyle = x;
      context.fillRect(currX, currY, y, 2);
      context.closePath();
      drop_flag = false;
   }
}

function getCursorCoordinates(e) {
   currX = e.clientX - canvas.offsetLeft;
   currY = e.clientY - canvas.offsetTop;
   console.log(currX, currY);
   return { currX: currX, currY: currY };
}

function drawLine() {
   Line = true;
   Freestyle = Circle = false;
   chooseListener(draw_Line);
   function draw_Line(motion, e) {
      if (motion == 'down') {
         getImage();
         if (!flag) {
            getCursorCoordinates(e);
            prevX = currX;
            prevY = currY;
            flag = true;
         }

         draw_L();
      } else if (motion == 'move') {
         mouseX = e.clientX - canvas.offsetLeft;
         mouseY = e.clientY - canvas.offsetTop;
         console.log(mouseX, mouseY);
         putImage();
         draw_L();
      } else if (motion == 'up') {
         if (flag) {
            existingLines.push({
               startX: prevX,
               startY: prevY,
               endX: mouseX,
               endY: mouseY
            })
            flag = false;
         }
         //putImage();
         draw_L();
      } else if (motion == 'out') {
         flag = false;
      }
   }
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
}
function erasefunc() {
   x = "white";
   y = 10;
   canvas.style.cursor = "crosshair";
   freeStyle();
}
function drawCircle() {
   Circle = true;
   Freestyle = Line = false;
   chooseListener(draw_Circle);
   let tempX, tempY, radius;

   function draw_Circle(motion, e) {
      if (motion == 'down') {
         if (!flag) {
            startLocation = getCursorCoordinates(e);
            flag = true;
            getImage();
         }
      } else if (motion == 'up') {
         flag = false;
         pos = getCursorCoordinates(e);
         putImage(); //this make sures that the image is not dragged.
         draw_C(pos);
      } else if (motion == 'move') {
         if (flag) {
            putImage();
            let pos = getCursorCoordinates(e);
            draw_C(pos);
         }
      } else if (motion == 'out') {
         flag = false;
      }
   }
   function draw_C(pos) {
      tempX = startLocation.currX;
      tempY = startLocation.currY;
      context.strokeStyle = x;
      context.lineWidth = y;
      radius = Math.sqrt(Math.pow((tempX - pos.currX), 2) + Math.pow((tempY - pos.currY), 2));
      context.beginPath();
      context.arc(tempX, tempY, radius, 0, 2 * Math.PI, false);
      context.stroke();
   }
}
function getImage() {
   canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}
function putImage() {
   context.putImageData(canvasImage, 0, 0);
}
function drawTriangle() {
   Triangle = true;
   Freestyle = Circle = Line = false;
   chooseListener(draw_Triangle);
   var tempPos;
   function draw_Triangle(motion, e) {
      if (motion == 'down') {
         if (!flag) {
            tempPos = getCursorCoordinates(e);
            getImage();
            flag = true;
         }
      } else if (motion == 'up') {
         flag = false;
         putImage();
         draw_T();
      } else if (motion == 'move') {
         if (flag) {
            putImage();
            prevX = tempPos.currX;
            prevY = tempPos.currY;
            getCursorCoordinates(e);
            draw_T();
         }
      } else if (motion == 'out') {
         flag = false;
      }
   }
   function draw_T() {
      context.lineWidth = y;
      context.strokeStyle = x;
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(currX, currY);
      context.lineTo(prevX * 2 - currX, currY);
      context.closePath();
      context.stroke();
   }
}
function drawRectangle() {
   Rectangle = true;
   chooseListener(draw_Rectangle);
   let tempPos;
   function draw_Rectangle(motion, e) {
      if (motion == 'down') {
         if (!flag) {
            tempPos = getCursorCoordinates(e);
            flag = true;
            getImage();
         }
      } else if (motion == 'move') {
         if (flag) {
            prevX = tempPos.currX, prevY = tempPos.currY;
            getCursorCoordinates(e);
            putImage();
            draw_Rect();
         }

      } else if (motion == 'up') {
         flag = false;
         getCursorCoordinates(e);
         putImage();
         draw_Rect();
      } else if (motion == 'out') {
         flag = false;
      }
   }
   function draw_Rect() {
      context.beginPath();
      context.lineWidth = y;
      context.strokeStyle = x;
      context.strokeRect(currX,currY,prevX-currX,prevY-currY);
      context.closePath();
   }
}

function saveCanvas(){
   let link = document.createElement("a"); 
   link.download = `${Date.now()}.jpg`; 
    link.href = canvas.toDataURL(); 
    link.click();
}
function newCanvas(){
   //context.clearRect(0, 0, canvas.width, canvas.height);
   location.reload();
}