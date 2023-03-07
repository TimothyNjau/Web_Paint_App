let canvas, context,
   prevX = 0, prevY = 0, //previous x and y value
   currX = 0, currY = 0, // current x and y value
   canvas_layout, mouseX, mouseY, //width & height of canvas 
   flag = false, drop_flag = false,
   rangeSlide, outputDiv;

let canvasImage, Toolbox, Toolboxbtn, Save, New, tempPos, existingLines = [];

let x = 'black', //default color of line drawn
   y = 2; // default line thicknes

//function to initiate the canvas
function canv_init() {
   canvas = document.querySelector("#canvasBox");
   canvas_layout = document.querySelector(".canvaslayout");
   w = canvas.width = canvas_layout.offsetWidth * 2;
   h = canvas.height = canvas_layout.offsetHeight;
   context = canvas.getContext('2d');

   rangeSlide = document.querySelector("#rangeSlider");
   outputDiv = document.querySelector("#output");
   slideChange();
   colorClick(this);
   Save = document.querySelector("#save");
   Save.addEventListener('click', saveCanvas, false);
   New = document.querySelector('#new');
   New.addEventListener('click', newCanvas, false);
   Toolbox = document.querySelectorAll('.toolBox > .toolBoxbtn');
   Toolbox.forEach(btn => {
      btn.addEventListener("click", () => {
         Toolboxbtn = btn.id;
         console.log(Toolboxbtn);
      });
   });
   Listener();
}
function slideChange() {
   rangeSlide.addEventListener("input", function () {
      outputDiv.innerHTML = rangeSlide.value;
      y = parseInt(rangeSlide.value);
      console.log(y);
      return y;
   });
}
function Listener() {
   canvas.addEventListener('mousemove', draw, false);
   canvas.addEventListener('mousedown', startDraw, false);
   canvas.addEventListener('mouseup', stopDraw, false);
   canvas.addEventListener('mouseout', offBound, false);
}
function colorClick(choice) {
   x = choice.id;
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
   link.download = `${Date.now()}.jpg`;
   link.href = canvas.toDataURL();
   link.click();
}
function newCanvas() {
   //context.clearRect(0, 0, canvas.width, canvas.height);
   location.reload();
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
function startDraw(e) {
   if (Toolboxbtn == "line") {
      if (!flag) {
         getCursorCoordinates(e);
         prevX = currX;
         prevY = currY;
        getImage();
         flag = true;
      } draw_L();
   }
   else if (Toolboxbtn == "rectangle" || "triangle" || "circle") {
      if (!flag) {
         tempPos = getCursorCoordinates(e);
         getImage();
         flag = true; drop_flag = false;
      }
   } else if (Toolboxbtn == "freestyle") {
     if(!flag){
      prevX = currX, prevY = currY;
      getCursorCoordinates(e);
      flag = true;
     // getImage();
     } drawFree(x,10);
   
   } else if (Toolboxbtn == "eraser"){
      if(!flag) {
      prevX = currX, prevY = currY;
      getCursorCoordinates(e);
      flag = true;
      drop_flag = true;
      //getImage();
      } if (drop_flag){drawFree("white",y);} drawFree("white",y);
   }
}
function drawFree(a,b){
   context.beginPath();
   context.lineWidth = b;
   context.strokeStyle = a;
   context.fillStyle = a;
   context.fillRect(currX, currY, b, 2);
}
function stopDraw(e) {
   if (Toolboxbtn == "line") {
      if (flag) {
         existingLines.push({ startX: prevX, startY: prevY, endX: mouseX, endY: mouseY });
         flag = false;
      }
      draw_L(e);
   } else if (Toolboxbtn == "rectangle") {
      flag = false;
      putImage();
      if (drop_flag) { draw_Rect(); }
   } else if (Toolboxbtn == "circle" || "triangle" || "freestyle" || "eraser") { flag = false; }
}
function offBound(e) {
   if (Toolboxbtn == "rectangle" || "circle" || "triangle" || "line" || "freestyle" || "eraser") { flag = false; }
}
function freeStyle(e) {
   if (flag) {
      prevX = currX, prevY = currY;
      getCursorCoordinates(e);
     // putImage();
      //context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(currX, currY);
      context.strokeStyle = x;
      context.lineWidth = y;
      context.stroke();
      context.closePath();
   }
}
function drawLine(e) {
   mouseX = e.clientX - canvas.offsetLeft,
   mouseY = e.clientY - canvas.offsetTop;
   putImage();
   draw_L(e, mouseX, mouseY);
}
function draw_L(e, mouseX, mouseY) {
   context.beginPath();
   context.strokeStyle = x;
   context.lineWidth = y;
   for (var i = 0; i < existingLines.length; ++i) {
      let line = existingLines[i];
      context.moveTo(line.startX, line.startY);
      context.lineTo(line.endX, line.endY);
   }
   context.stroke();
   context.closePath();
   if (flag) {
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
   context.closePath();
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
   context.strokeStyle = x;
   context.lineWidth = y;
   radius = Math.sqrt(Math.pow((tempX - pos.currX), 2) + Math.pow((tempY - pos.currY), 2));
   context.beginPath();
   context.arc(tempX, tempY, radius, 0, 2 * Math.PI, false);
   context.stroke();
   context.closePath();
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
   context.lineWidth = y;
   context.strokeStyle = x;
   context.beginPath();
   context.moveTo(prevX, prevY);
   context.lineTo(currX, currY);
   context.lineTo(prevX * 2 - currX, currY);
   context.closePath();
   context.stroke();
}
function erasefunc(e){
   if (flag) {
      prevX = currX, prevY = currY;
      getCursorCoordinates(e);
      //putImage();
      context.moveTo(prevX, prevY);
      context.lineTo(currX, currY);
      context.strokeStyle = "white";
      context.lineWidth = y;
      context.stroke();
      context.closePath();
   }
}