const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

let isDrawing = false;
let currentColor = "#000000"; // Default color

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!isDrawing) return;
  ctx.strokeStyle = currentColor;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

colorPicker.addEventListener('click', function(e) {
  if (e.target.classList.contains('color-swatch')) {
    currentColor = e.target.style.backgroundColor;
  }
});
