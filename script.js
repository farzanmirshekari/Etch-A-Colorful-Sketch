let gridSize = 24;

const container = document.querySelector(".grid-container");

let backgroundColor = "#ffffff";
container.style.backgroundColor = backgroundColor;

function createGrid() {

  let gridWidth = container.offsetWidth / gridSize;
  container.style.gridTemplateColumns = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;
  container.style.gridTemplateRows = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;
  if (gridSize < 4) {
    container.style.gridTemplateColumns = `repeat(${gridSize},1fr`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 1fr`;
  }

  for (let i = 0; i < gridSize ** 2; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-item');
    square.setAttribute('draggable', 'false');
    square.style.backgroundColor = 'transperent';
    container.appendChild(square);
    square.classList.add('border-top-left');
  }

  const rightItems = document.querySelectorAll(`.grid-item:nth-child(${gridSize}n)`);
  for (let i = 0; i < rightItems.length; i++) {
    rightItems[i].setAttribute('data-right', 'true');
    rightItems[i].classList.toggle('border-right');
  }

  let gridItems = document.querySelectorAll('.grid-item');
  const lastItems = Array.from(gridItems).slice(-`${gridSize}`);
  for (let i = 0; i < lastItems.length; i++) {
    lastItems[i].setAttribute('data-bottom', 'true');
    lastItems[i].classList.toggle('border-bottom');
  }
}


createGrid();

gridItems = document.querySelectorAll('.grid-item');

let ink = '#000000';

const colorPicker = document.querySelector('#color-select');
colorPicker.addEventListener('input', (e) => {
    ink = e.target.value;
    if(grab) {
        grab = false;
        dropper.classList.remove('button-on');
    }
});

const backgroundColorPicker = document.querySelector('#background-color-select');

const buttons = document.getElementsByTagName('button');

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
      buttons[i].classList.toggle('button-on');
    });
}

let shading = false;
const shaderButton = document.querySelector('#shader-button');
shaderButton.addEventListener('click', () => {
    if(shading) {
        shading = false;
    } else {
        shading = true;
        rainbow = false;
        rainbowButton.classList.remove('button-on');
        lighten = false;
        lightenButton.classList.remove('button-on');
        eraser = false;
        eraserButton.classList.remove('button-on');
    }
    if(grab) {
        grab = false;
        dropper.classList.remove('button-on');
    }
});

let lighten = false;
const lightenButton = document.querySelector('#lighten-button');
lightenButton.addEventListener('click', () => {
  if (lighten) {
    lighten = false;
  } else {
    lighten = true;
    shading = false;
    shaderButton.classList.remove('button-on');
    rainbow = false;
    rainbowButton.classList.remove('button-on');
    eraser = false;
    eraserButton.classList.remove('button-on');
  }
  if (grab) {
    grab = false;
    dropper.classList.remove('button-on');
  }
});

function RGBtoHex(rgb) {
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  rgb = rgb.substr(4).split(')')[0].split(sep);

  let r = (+rgb[0]).toString(16),
  g = (+rgb[1]).toString(16),
  b = (+rgb[2]).toString(16);

if (r.length == 1) r = '0' + r;
if (g.length == 1) g = '0' + g;
if (b.length == 1) b = '0' + b;
b = (+rgb[2]).toString(16);

if (r.length == 1) r = '0' + r;
if (g.length == 1) g = '0' + g;
if (b.length == 1) b = '0' + b;
return '#' + r + g + b;
}

function adjust(RGBtoHex, rgb, amount) {
  let color = RGBtoHex(rgb);
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
      )
  );
}

const dropper = document.querySelector('#color-grabber');
let grab = false;
dropper.addEventListener('click', () => {
  if(grab) {
    grab = false;
    dropper.classList.remove('button-on');
  } else {
    grab = true;
  }

  if(fill) {
    fill = false;
    colorFillButton.classList.remove('button-on');
  }
});

let eraser = false;
const eraserButton = document.querySelector('#eraser-button');
eraserButton.addEventListener('click', () => {
  if(eraser) {
    eraser = false;
  } else {
    eraser = true;
    shading = false;
    shaderButton.classList.remove('button-on');
    rainbow = false;
    rainbowButton.classList.remove('button-on');
    lighten = false;
    lightenButton.classList.remove('button-on');
  }

  if(grab) {
    grab = false;
    dropper.classList.remove('button-on');
  }
});

let rainbow = false;
const rainbowButton = document.querySelector('#rainbow-button');
rainbowButton.addEventListener('click', () => {
  if(rainbow) {
    rainbow = false;
  } else {
    rainbow = true;
    shading = false;
    shaderButton.classList.remove('button-on');
    lighten = false;
    lightenButton.classList.remove('button-on');
    eraser = false;
    eraserButton.classList.remove('button-on');
  }

  if(grab) {
    grab = false;
    dropper.classList.remove('button-on');
  }
});

function randomColorGenerator() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

let progressBar = document.getElementById('progress-bar');

function rangeSlider(value) {
  let gridLabels = document.querySelectorAll('#range-value');
  progressBar.style.width = (value/128) * 100 + '%';
  for(let i = 0; i<gridLabels.length; i++) {
    gridLabels[i].textContent = value;
  }

  gridSize = parseInt(value);
  deleteGrid();
  createGrid();
  listen();
  reInit(); 

  const gridButton = document.querySelector('#grid-button');
  if(!gridButton.classList.contains('button-on')) {
    gridButton.classList.toggle('button-on');
  }
}

function reInit() {
  deleteGrid();
  createGrid();
  listen();
}

function rangeSliderValue(value) {
  let gridLabels = document.querySelector('#range-value');
  for(let i = 0; i< gridLabels.length; i++) {
    gridLabels[i].textContent = value;
  }
  progressBar.style.width = (value/128) * 100 + '%';
}

function deleteGrid() {
  while (container.firstChild) {
    container.removeEventListener('mousedown', drawClick);
    container.removeEventListener('mouseenter', drawClickHover);
    container.lastChild = null;
    container.removeChild(container.lastChild);
  }
}

function fadeGrid(item) {
  if(item.style.backgroundColor == '' || item.style.backgroundColor == 'transparent') {
    item.style.backgroundColor = backgroundColor;
  }
  let fadeSpeed = Math.random() * 10;
  if (fadeSpeed > 8) {
    item.classList.add('clear-fade');
  } else if (fadeSpeed > 6) {
    item.classList.add('clear-fade-2');
  } else if (fadeSpeed > 4) {
    item.classList.add('clear-fade-3');
  } else if (fadeSpeed > 2) {
    item.classList.add('clear-fade-4');
  } else {
    item.classList.add('clear-fade-5');
  }
}

let root = document.documentElement;
const clearButton = document.querySelector('#clear-grid');

function clearGrid() {
  root.style.setProperty('--bg-color', backgroundColor);
  gridItems = document.querySelectorAll('.grid-item');
  for(let i = 0; i<gridItems.length; i++) {
    fadeGrid(gridItems[i]);
  }
  setTimeout(function () {
    for(let i = 0; i<gridItems.length; i++) {
      gridItems[i].style.backgroundColor = '';
      gridItems[i].removeAttribute('data-inked');
      gridItems[i].removeAttribute('data-shade');
      gridItems[i].classList.remove('clear-fade');
      gridItems[i].classList.remove('clear-fade-2');
      gridItems[i].classList.remove('clear-fade-3');
      gridItems[i].classList.remove('clear-fade-4');
      gridItems[i].classList.remove('clear-fade-5');
    }
  }, 1500);
  container.style.backgroundColor = backgroundColor;
  setTimeout(function () {
    clearButton.classList.remove('btn-on');
  }, 500);
}

clearButton.addEventListener('click', clearGrid);

const colorFillButton = document.querySelector('#color-fill');
let fill = false;
colorFillButton.addEventListener('click', () => {
  if(grab) {
    grab = false;
    dropper.classList.remove('button-on');
  }
  if(fill) {
    fill = false;
  } else {
    fill = true;
  }
});

function toMatrix(arr, width) {
  return arr.reduce(function (rows, key, index) {
    return (index % width == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows;
  }, []);
}

function getAdjacent1D(x, gridX, gridY) {
  let xAbove = null;
  let xBellow = null;
  let xLeft = null;
  let xRight = null;

  if (gridX != 0) {
    xAbove = [x - gridSize];
  }

  if (gridX != gridSize - 1) {
    xBellow = [x + gridSize];
  }

  if (gridY != 0) {
    xLeft = [x - 1];
  }

  if (gridY != gridSize - 1) {
    xRight = [x + 1];
  }

  return [xAbove, xBellow, xLeft, xRight];
}

function colorFill(e) {
  if(fill) {
    let originalIndex = Array.from(e.target.parentElement.children).indexOf(e.target);

    let toFill = [originalIndex];
    let addedToFill = 1;

    gridItems = document.querySelectorAll('.grid-item');
    let gridItemsArray = Array.from(gridItems);

    let gridItemsArray2D = toMatrix(gridItemsArray, gridSize);

    let gridX = Math.floor(originalIndex / gridSize);
    let gridY = originalIndex % gridSize;

    while(addedToFill != 0) {
      let toCheck = toFill.slice(-addedToFill);
      let addedItems = [];
      addedToFill = 0;
      for(let j = 0; j < toCheck.length; j++) {
        let toAdd = getAdjacent1D(toCheck[j], gridX, gridY);
        for(let i = 0; i < toAdd.length; i++) {
          if(toAdd[i] != null) {
            if(!toFill.includes(toAdd[i][0])) {
              if(toAdd[i][0] >= 0 && toAdd[i][0] < gridSize ** 2 && typeof toAdd[i][0] == 'number') {
                if(e.target.parentElement.children[toAdd[i][0]].style.backgroundColor == e.target.style.backgroundColor) {
                  toFill.push(toAdd[i][0]);
                  addedItems.push(toAdd[i][0]);
                }
              }
            }
          }
        }
      }
      addedToFill = addedItems.length;
    }

    for(let i = 0; i < toFill.length; i++) {
      if(rainbow) {
        e.target.parentElement.children[toFill[i]].style.backgroundColor = randomColorGenerator();
      } else {
        e.target.parentElement.children[toFill[i]].style.backgroundColor = ink;
      }
      e.target.parentElement.children[toFill[i]].setAttribute('data-inked', 'true');
    }

    colorFillButton.classList.remove('button-on');
    fill = false;
  }
}

function drawClick(e) {
  if(!grab && !fill) {
    if(eraser) {
      e.target.style.backgroundColor = '';
      e.target.removeAttribute('data-inked');
      e.target.removeAttribute('data-shade');
    } else if (rainbow) {
      e.target.style.backgroundColor = randomColorGenerator();
      e.target.setAttribute('data-inked', 'true');
      e.target.removeAttribute('data-shade');
    } else if (shading) {
      if(!e.target.dataset.shade) {
        e.target.setAttribute('data-shade', '1');
      } else {
        let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
        shadeAmount++;
        e.target.setAttribute('data-shade', `${shadeAmount}`);
      }
      if (e.target.style.backgroundColor == '' || e.target.style.backgroundColor == 'transperent') {
        e.target.style.backgroundColor = bgColor;
      }
      e.target.style.backgroundColor = adjust(RGBtoHex, e.target.style.backgroundColor, -15);
    } else if (lighten) {
      if (!e.target.dataset.shade) {
        e.target.setAttribute('data-shade', '-1');
      } else {
        let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
        shadeAmount--;
        e.target.setAttribute('data-shade', `${shadeAmount}`);
      }
      if(e.target.style.backgroundColor == '' || e.target.style.backgroundColor == 'transparent') {
        e.target.style.backgroundColor = backgroundColor;
      }
      e.target.style.backgroundColor = adjust(RGBtoHex, e.target.style.backgroundColor, +15);
    } else {
      e.target.style.backgroundColor = ink;
      e.target.setAttribute('data-inked', 'true');
      e.target.removeAttribute('data-shade');
    }
  }
}

function drawClickHover(e) {
  if (e.buttons > 0) {
    if (!grab && !fill) {
      if (eraser) {
        e.target.style.backgroundColor = '';
        e.target.removeAttribute('data-inked');
        e.target.removeAttribute('data-shade');
      } else if (rainbow) {
        e.target.style.backgroundColor = randomColorGenerator();
        e.target.setAttribute('data-inked', 'true');
        e.target.removeAttribute('data-shade');
      } else if (shading) {
        if (!e.target.dataset.shade) {
          e.target.setAttribute('data-shade', '1');
        } else {
          let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
          shadeAmount++;
          e.target.setAttribute('data-shade', `${shadeAmount}`);
        } 
        if (
          e.target.style.backgroundColor == '' ||
          e.target.style.backgroundColor == 'transperent'
        ) {
          e.target.style.backgroundColor = bgColor;
        }

        e.target.style.backgroundColor = adjust(RGBToHex, e.target.style.backgroundColor, -15);
      } else if (lighten) {
        if (!e.target.dataset.shade) {
          e.target.setAttribute('data-shade', '-1');
        } else {
          let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
          shadeAmount--;
          e.target.setAttribute('data-shade', `${shadeAmount}`);
        }
        if (
          e.target.style.backgroundColor == '' ||
          e.target.style.backgroundColor == 'transperent'
        ) {
          e.target.style.backgroundColor = backgroundColor;
        }
        e.target.style.backgroundColor = adjust(RGBToHex, e.target.style.backgroundColor, +15);
      } else {
        e.target.style.backgroundColor = ink;
        e.target.setAttribute('data-inked', 'true');
        e.target.removeAttribute('data-shade');
      }
    }
  }
}

const saveButton = document.getElementById("save-button");
const drawing = document.getElementById("painting-area");

saveButton.addEventListener("click", function () {
  const preview = document.createElement("div");
  preview.setAttribute("id", "image-preview");
  window.scroll(0,0);
  window.pageXOffset = -7.9;
  html2canvas(document.getElementById("painting-container"), {
    allowTaint: true,
    useCORS: true
  }).then(function (canvas) {
    const filename = prompt("What is the name of the drawing?");
    if(filename === null) {
      return;
    }
    else {
      const a = document.createElement("a");
      document.body.appendChild(a);
      preview.appendChild(canvas);
      a.download = filename + ".png";
      a.href = canvas.toDataURL();
      a.target = '_blank';
      a.click();
      preview.remove();
    }
  });
  setTimeout(function () {
    saveButton.classList.remove('button-on');
  }, 1000)
});

function toggleGridLines() {
  for(i = 0; i < gridItems.length; i++) {
    gridItems[i].classList.toggle('border-top-left');
    if(gridItems[i].dataset.right) {
      gridItems[i].classList.toggle('border-right');
    }
    if(gridItems[i].dataset.bottom) {
      gridItems[i].classList.toggle('border-bottom');
    }
  }
}

function listen() {
  gridItems = document.querySelectorAll('.grid-item');
  for(let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mousedown', drawClick);
    gridItems[i].addEventListener('mouseenter', drawClickHover);
  }

  for(let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('click', (e) => {
      if(grab) {
        ink = e.target.style.backgroundColor;
        if(ink == '') {
          colorPicker.value = backgroundColor;
        } else {
          colorPicker.value = RGBtoHex(ink);
        }
        dropper.classList.remove('button-on');
        grab = false;
        rainbow = false;
        rainbowButton.classList.remove('button-on');
        shading = false;
        shaderButton.classList.remove('button-on');
        lighten = false;
        lightenButton.classList.remove('button-on');
        eraser = false;
        eraserButton.classList.remove('button-on');
      }
    });
  }

  for(let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('click', colorFill);
  }

  backgroundColorPicker.addEventListener('input', (e) => {
    gridItems = document.querySelectorAll('.grid-item');
    backgroundColor = e.target.value;
    for(let i = 0; i < gridItems.length; i++) {
      if(!gridItems[i].dataset.inked) {
        container.style.backgroundColor = backgroundColor;
      }

      if(!gridItems[i].dataset.inked) {
        if(gridItems[i].dataset.shade) {
          gridItems[i].style.backgroundColor = backgroundColor;
          let shadeAmount = parseInt(gridItems[i].getAttribute('data-shade'));
          let reshadeValue = shadeAmount * (-15)
          gridItems[i].style.backgroundColor = adjust(RGBtoHex, gridItems[i].style.backgroundColor, reshadeValue);
        }
      }
    }
  });

  const gridButton = document.querySelector('#grid-button');

  gridButton.addEventListener('click', toggleGridLines);

}

listen();