let canvas, context,
   prevX = 0, prevY = 0, //previous x and y value
   currX = 0, currY = 0, // current x and y value
   canvas_layout, mouseX, mouseY, //width & height of canvas 
   flag = false, drop_flag = false,
   rangeSlide, outputDiv;

let canvasImage, Toolbox, Toolboxbtn, Save, New,View, tempPos;

let x = 'black', //default color of line drawn
   y = 2; // default line thicknes
//function to initiate the canvas
function canv_init() {
   canvas = document.querySelector("#canvasBox");
   canvas_layout = document.querySelector(".canvaslayout");
   w = canvas.width = canvas_layout.offsetWidth * 2;
   h = canvas.height = canvas_layout.offsetHeight;
   context = canvas.getContext('2d');
   canvas.style.cursor = "crosshair";
   context.fillStyle = "white";
   context.fillRect(0,0,w,h);

   rangeSlide = document.querySelector("#rangeSlider");
   outputDiv = document.querySelector("#output");
   slideChange();
   colorClick(this);
   Save = document.querySelector("#save");
   Save.addEventListener('click', saveCanvas, false);
   New = document.querySelector('#new');
   New.addEventListener('click', newCanvas, false);
   View = document.querySelector("#view");
   View.addEventListener("click",()=>{canvas.requestFullscreen();});

   Toolbox = document.querySelectorAll('.toolBox > .toolBoxbtn');
   Toolbox.forEach(btn => {
      btn.addEventListener("click", () => {
         Toolboxbtn = btn.id;
      });
   });
   Listener();
}
function slideChange() {
   rangeSlide.addEventListener("input", function () {
      outputDiv.innerHTML = rangeSlide.value;
      y = parseInt(rangeSlide.value);
      return y;
   });
}
function Listener() {
   canvas.addEventListener('mousedown', startDraw, false);
   canvas.addEventListener('mousemove', draw, false);
   canvas.addEventListener('mouseup', stopDraw, false);
   canvas.addEventListener('mouseout', offBound, false);
   canvas.addEventListener("mouseover", loadImage, false);
}
function colorClick(choice) {
   x = choice.id;
   return x;
}
function getCursorCoordinates(e) {
   currX = e.clientX - canvas.offsetLeft;
   currY = e.clientY - canvas.offsetTop;
   return { currX: currX, currY: currY };
}
function getImage() {
   canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}
function putImage() {
   context.putImageData(canvasImage, 0, 0);
}
function saveCanvas() {
   let link = document.createElement("a");
   link.download = `CanvasImage.png`;
   link.href = canvas.toDataURL();
   link.click();
}
function newCanvas() {
   //context.clearRect(0, 0, canvas.width, canvas.height);
   location.reload();
}
function loadImage(e) {
   getImage();
   putImage();
   if (Toolboxbtn == "line") {
      return x, y;
   }
}
function startDraw(e) {
   if (Toolboxbtn == "line") {
      getImage();
      if (!flag) {
         getCursorCoordinates(e);
         prevX = currX;
         prevY = currY;
         context.strokeStyle = x;
         context.lineWidth = y;
         flag = true;
      }
   }
   else if (Toolboxbtn == "freestyle") {
      prevX = currX, prevY = currY;
      getCursorCoordinates(e);
      flag = drop_flag = true;
      if (drop_flag) {
         drawFree(x, y);
      }
   }
   else if (Toolboxbtn == "eraser") {
      getImage();
      if (!flag) {
         prevX = currX, prevY = currY;
         getCursorCoordinates(e);
         flag = true;
         drop_flag = true;
      } if (drop_flag) { drawFree("white",6); }
   }
   else if (Toolboxbtn == "rectangle" || "triangle" || "circle") {
      if (!flag) {
         tempPos = getCursorCoordinates(e);
         getImage();
         flag = true; drop_flag = false;
      }
   }
}
function draw(e) {
   switch (Toolboxbtn) {
      case "line":
         drawLine(e);
         break;
      case "freestyle":
         freeStyle(e);
         break;
      case "rectangle":
         drawRectangle(e);
         break;
      case "circle":
         drawCircle(e);
         break;
      case "triangle":
         drawTriangle(e);
         break;
      case "eraser":
         erasefunc(e);
         break;
      default:
         freeStyle(e);
   }
}
function drawFree(a, b) {
   context.beginPath();
   context.lineWidth = b;
   context.strokeStyle = a;
   context.fillStyle = a;
   context.fillRect(currX, currY, b, 2);
}
function stopDraw(e) {
   if (Toolboxbtn == "line") {
      if (flag) {
         getImage();
         putImage();
         flag = false;
      }
   } else if (Toolboxbtn == "rectangle") {
      flag = false;
   } else if (Toolboxbtn == "circle" || "triangle" || "freestyle" || "eraser") { flag = false; }
}
function offBound(e) {
   if (Toolboxbtn == "rectangle" || "circle" || "triangle" || "line" || "freestyle" || "eraser") { flag = false; }
}
function freeStyle(e) {
   if (flag) {
      prevX = currX, prevY = currY;
      getCursorCoordinates(e);
      context.moveTo(prevX, prevY);
      context.lineTo(currX, currY);
      context.strokeStyle = x;
      context.lineWidth = y;
      context.stroke();
   }
}
function drawLine(e) {
   mouseX = e.clientX - canvas.offsetLeft,
      mouseY = e.clientY - canvas.offsetTop;
   if (flag) {
      putImage();
      context.beginPath();
      context.strokeStyle = x;
      context.lineWidth = y;
      context.moveTo(prevX, prevY);
      context.lineTo(mouseX, mouseY);
      context.stroke();
      context.closePath();
   }
}
function drawRectangle(e) {
   if (flag) {
      prevX = tempPos.currX; prevY = tempPos.currY;
      getCursorCoordinates(e);
      putImage();
      draw_Rect();
      drop_flag = true;
   }
}
function draw_Rect() {
   context.beginPath();
   context.lineWidth = y;
   context.strokeStyle = x;
   context.fillStyle = x;
   context.strokeRect(currX, currY, prevX - currX, prevY - currY);
}
function drawCircle(e) {
   if (flag) {
      putImage();
      pos = getCursorCoordinates(e);
      draw_C(pos);
   }
}
function draw_C(pos) {
   let tempX, tempY, radius;
   tempX = tempPos.currX, tempY = tempPos.currY;
   radius = Math.sqrt(Math.pow((tempX - pos.currX), 2) + Math.pow((tempY - pos.currY), 2));
   context.beginPath();
   context.strokeStyle = x;
   context.lineWidth = y;
   context.arc(tempX, tempY, radius, 0 * Math.PI, 2 * Math.PI, false);
   context.stroke();
}
function drawTriangle(e) {
   if (flag) {
      putImage();
      prevX = tempPos.currX, prevY = tempPos.currY;
      getCursorCoordinates(e);
      draw_T();
   }
}
function draw_T() {
   context.beginPath();
   context.lineWidth = y;
   context.strokeStyle = x;
   context.moveTo(prevX, prevY);
   context.lineTo(currX, currY);
   context.lineTo(prevX * 2 - currX, currY);
   context.closePath();
   context.stroke();
}
function erasefunc(e) {
   if (flag) {
      prevX = currX, prevY = currY;
      getCursorCoordinates(e);
      context.moveTo(prevX, prevY);
      context.lineTo(currX, currY);
      context.stroke();
   }
}