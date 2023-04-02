const container = document.querySelector('#grid-container');
const width = container.clientWidth;
const height = container.clientHeight;

const defaultBGColor = '243, 231, 211';
const rainbowColors = ['255,0,0', '255, 165, 0', '255, 255, 0','60, 179, 113','0, 0, 255','248, 187, 208','127, 0, 255']
const clearButton = document.querySelector('.clear-button')
const rainbowButton = document.querySelector('.rainbow-button')
const shadeButton = document.querySelector('.shade-button')

const slider = document.querySelector('#myRange');
const sliderValue = document.querySelector('.sliderValue');
const colorPicker = document.querySelector('#colorpicker');


let allGridCells = [];

let penColor = `0,0,0`;
let useRainbow = false;
let shade = false;


colorPicker.addEventListener('input', function (e) {
    hexColor = this.value
    // console.log(hexColor);
    let {r, g, b} = hexTOrgb(hexColor);
    penColor = `${r}, ${g}, ${b}`
})


function hexTOrgb(hex){
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



rainbowButton.addEventListener('click', function (e) {
    useRainbow = !useRainbow;
    shade = false;
    shadeButton.classList.remove('shade-animation');
    this.classList.toggle('rainbow-animation');
})

shadeButton.addEventListener('click', function (e) {
    useRainbow = false;
    shade = !shade;
    this.classList.toggle('shade-animation')
    rainbowButton.classList.remove('rainbow-animation');
})


function randomRainbowColor(){
    return Math.floor(Math.random() * rainbowColors.length);
}


createGrid();

slider.addEventListener('input',function (e) {
    sliderValue.textContent = this.value
    createGrid(this.value)
})




clearButton.addEventListener('click',function(){
    allGridCells.forEach((cell,indx) => {
        colorCell(cell,defaultBGColor);
    })
})


function createGrid(numberOfCells=16){
    container.innerHTML = '';
    const cellWidth = width/numberOfCells;
    const cellHeight = height/numberOfCells;
    console.log(`Current Grid Size: ${numberOfCells} - Dimensions: ${width} x ${height} `)
    container.style.setProperty('--cell-width',cellWidth);
    container.style.setProperty('--cell-height',cellHeight);

    // for (let i = 0; i < numberOfCells; i++){
    //     for (let j = 0;j < numberOfCells; j++){
    //         createGridElement(i,j);
    //     }
    // }
    for (let n = 0; n < numberOfCells * numberOfCells; n++){
        let col = n % numberOfCells;
        let row = Math.floor(n/numberOfCells);
        createGridElement(row, col);
    }
    allGridCells = document.querySelectorAll('.grid-cell');
    allGridCells.forEach((cell,indx) => {
        cell.addEventListener('mousedown',function (e) {
            drawingAction(e);
            sketchLine();
        })  
    })
}
function createGridElement(row, column){
    const newDiv = document.createElement('div');
    //newDiv.textContent = `Created ${width}x${height} & ${cellWidth}x${cellHeight}`;
    newDiv.classList.add('grid-cell');
    newDiv.dataset.column = `${column+1}`
    newDiv.dataset.row = `${row+1}`
    container.appendChild(newDiv);
}


window.addEventListener('mouseup',()=>{
    console.log('End Sketching');
    sketchLine(false);
})



function colorCell(cell,color='0, 0, 0',opacity=1){
    // (cell.target).style['background-color'] = 'black';
    // const cell = cellEvent.target
    cell.style.setProperty('--bg-color',`${color}`);
    cell.style.setProperty('--opacity-level',`${opacity}`)
}

function drawingAction(cellEvent){

    if (useRainbow && !shade){
        colorCell(cellEvent.target, rainbowColors[randomRainbowColor()]);
    }
    else if (!useRainbow && shade){
        let [r, g, b]  = (getComputedStyle(cellEvent.target).getPropertyValue('--bg-color').split(',')).map((num) => {
            return Math.max(0,Number(num)-25);
        });
        console.log(r,g,b);
        colorCell(cellEvent.target, `${r}, ${g}, ${b}`);
    }
    else {
        colorCell(cellEvent.target, penColor);
    }
}

function sketchLine(attach = true){
    allGridCells.forEach((cell,indx) => {
        // if (attach){
        //     cell.addEventListener('mouseover',colorCell)
        // } else{
        //     cell.removeEventListener('mouseover',colorCell)
        // }
        if (attach){
            cell.addEventListener('mouseover', drawingAction)
        } else {
            cell.removeEventListener('mouseover',drawingAction)
        }
    })
    
}





// container.addEventListener('mousedown',(e)=>{
    
//     isDown = true;
//     console.log(e.target);
//     container.addEventListener('mouseover',test);
//     // allGridCells.forEach((e,i)=>{
//     //     e.addEventListener('mouseenter',test);
//     // })

// })



    // container.removeEventListener('mouseover',test)
    // allGridCells.forEach((e,i)=>{
    //     e.removeEventListener('mouseenter',test);
    // })

    // let [r, g, b]  = (getComputedStyle(container).getPropertyValue('--bg-color').split(',')).map(Number);
    // console.log(r, g, b);
    // console.log(getComputedStyle(container).getPropertyValue('--bg-color').split(','));
