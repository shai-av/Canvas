
var gCanvas
var gCtx
var gCurrShape = 'line'
var gShapeSize = 100
var gDraw = false
var gElBody

function init() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    addListeners()
    resizeCanvas()
    renderCanvas()
}

//--- canvas ---
function resizeCanvas() {
    gElBody = document.querySelector('body')
    gCanvas.width = gElBody.offsetWidth
    gCanvas.height = gElBody.offsetHeight
}

function renderCanvas() {
    gCtx.fillStyle = '#fafafa'
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
    gCtx.fillStyle = 'black'
}

function onClearCanvas() {
    clearCanvas()
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

//---Tool Bar ---
function onChangeStrokeClr(color) {
    gCtx.strokeStyle = color
}

function onChangeFillClr(color) {
    gCtx.fillStyle = color
}

function onChangeShape(shape) {
    gCurrShape = shape
}

function onChangeLineWidth(width) {
    gCtx.lineWidth = width
}

function onChangeShapeSize(size) {
    gShapeSize = +size
}

function onDownloadCanvas(elLink) {
    downloadCanvas(elLink)
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}

//--- Draw ---
function draw(ev) {
    let posX = ev.clientX
    let posY = ev.clientY
    switch (gCurrShape) {
        case 'line':
            drawLine(posX, posY)
            break;
        case 'square':
            drawRect(posX, posY)
            break;
        case 'triangle':
            drawTriangle(posX, posY)
            break;
        case 'circle':
            drawArc(posX, posY)
    }
}

function drawLine(x, y) {
    gCtx.lineTo(x, y);
    gCtx.stroke();
}

function drawRect(x, y) {
    gCtx.beginPath();
    gCtx.rect(x, y, gShapeSize, gShapeSize);
    gCtx.fillRect(x, y, gShapeSize, gShapeSize);
    gCtx.stroke();
}

function drawTriangle(x, y) {
    gCtx.beginPath();
    gCtx.moveTo(x, y);
    gCtx.lineTo(x + gShapeSize, y + gShapeSize);
    gCtx.lineTo(x, y + gShapeSize);
    gCtx.closePath();
    gCtx.fill();
    gCtx.stroke();
}

function drawArc(x, y) {
    gCtx.beginPath();
    //the x,y cords of the center , The radius of the circle, The starting angle, The ending angle, in radians
    gCtx.arc(x, y, gShapeSize, 0, 2 * Math.PI);//use to create a circle //Adds a circular arc to the current path.
    gCtx.stroke();
    gCtx.fill();
}

//--- listeners ---
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

// --- mouse events ---
function onDown(ev) {
    gDraw = true
    gElBody.classList.add('drawing')
    let pos = getPosFromEv(ev)
    if (gCurrShape !== 'line') drawOnXY(pos)
    gCtx.beginPath()
    gCtx.moveTo(pos.posX, pos.posY)
}

function onMove(ev) {
    if (gDraw) {
        const pos = getPosFromEv(ev)
        drawOnXY(getPosFromEv(ev))
    }
}

function onUp() {
    gDraw = false
    gElBody.classList.remove('drawing')
    gCtx.closePath()
}

function drawOnXY({posX,posY}) {

    switch (gCurrShape) {
        case 'line':
            drawLine(posX, posY)
            break;
        case 'square':
            drawRect(posX, posY)
            break;
        case 'triangle':
            drawTriangle(posX, posY)
            break;
        case 'circle':
            drawArc(posX, posY)
    }
}

function getPosFromEv(ev){
    let posX
    let posY
    if (ev.type.includes('touch')) {
        posX = ev.changedTouches[0].clientX
        posY = ev.changedTouches[0].clientY
        ev.preventDefault()
    } else {
        posX = ev.offsetX
        posY = ev.offsetY
    }
    return {posX,posY}
}

//--- upload from local ---
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}
//                               CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    //After we read the file
    reader.onload = function (event) {
        var img = new Image()// Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read
        //Run the callBack func , To render the img on the canvas
        img.onload = onImageReady.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}


function renderImg(img) {
    //Draw the img on the canvas
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}