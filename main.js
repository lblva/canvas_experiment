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

canvas.width = 800; // Set canvas width
canvas.height = 500; // Set canvas height

ctx.lineWidth = penSize;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

let isDraggingSticker = false;

function startDrawing(e) {
  if (!isDraggingSticker) {
    isDrawing = true;
    draw(e);
  }
}

function stopDrawing() {
  if (!isDraggingSticker) {
    isDrawing = false;
    ctx.beginPath();
    saveState();
  }
}

function draw(e) {
  if ((!isDrawing && !isErasing) || isDraggingSticker) return;

  if (isErasing && e.buttons === 1) { // Check if left mouse button is pressed
    ctx.strokeStyle = '#ffffff'; // Set eraser color to match canvas background
    ctx.lineWidth = penSize;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
  } else if (isDrawing && e.buttons === 1) { // Check if left mouse button is pressed
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = penSize;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
  }
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
  
  // Create a file save dialog
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const fileName = prompt('Enter file name', 'drawing.png');
    if (fileName) {
      link.download = fileName;
      const a = document.createElement('a');
      a.href = link.href;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });

  // Open the file save dialog
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

const stickers = document.querySelectorAll('.sticker');

stickers.forEach(sticker => {
  sticker.addEventListener('dragstart', handleDragStart);
});

canvas.addEventListener('dragover', handleDragOver);
canvas.addEventListener('drop', handleDrop);

function handleDragStart(e) {
  isDraggingSticker = true;
  e.dataTransfer.setData('text/plain', e.target.src);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  isDraggingSticker = false;
  const rect = canvas.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  const imgSrc = e.dataTransfer.getData('text/plain');
  const img = new Image();
  img.src = imgSrc;

  img.onload = function() {
    // Draw the image with a width and height of 50px
    ctx.drawImage(img, offsetX - 25, offsetY - 25, 50, 50);
  };
}

