const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const penSizeInput = document.getElementById('penSize');
const eraserButton = document.getElementById('eraserButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');

let isDrawing = false;
let isErasing = false;
let currentColor = "#000000"; // Default color
let penSize = 5;
let undoStack = [];
let redoStack = [];

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

ctx.lineWidth = penSize;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
  saveState();
}

function draw(e) {
  if (!isDrawing && !isErasing) return;

  if (isErasing) {
    ctx.strokeStyle = '#ffffff'; // Set eraser color to match canvas background
  } else {
    ctx.strokeStyle = currentColor;
  }

  ctx.lineWidth = penSize;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
}

function toggleEraser() {
  isErasing = !isErasing;
}

function saveState() {
  undoStack.push(canvas.toDataURL());
  redoStack = []; // Clear redo stack when a new state is saved
}


function undo() {
  if (undoStack.length > 0) {
    redoStack.push(canvas.toDataURL());
    let lastState = undoStack.pop();
    let img = new Image();
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastState;
  }
}


function redo() {
  if (redoStack.length > 0) {
    undoStack.push(canvas.toDataURL());
    let nextState = redoStack.pop();
    let img = new Image();
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = nextState;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
  redoStack = [];
}

function saveImage() {
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = 'drawing.png';
  link.click();
}

// Event Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
colorPicker.addEventListener('click', function(e) {
  if (e.target.classList.contains('color-swatch')) {
    currentColor = e.target.style.backgroundColor;
  }
});
penSizeInput.addEventListener('input', function() {
  penSize = this.value;
});
eraserButton.addEventListener('click', toggleEraser);
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveImage);
