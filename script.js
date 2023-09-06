

const theadRow = document.getElementById("table-heading-row");
const tBody = document.getElementById("table-body");

// Style buttons
const boldButton = document.getElementById("bold-btn");
const italicButton = document.getElementById("italic-btn");
const underlineButton = document.getElementById("underline-btn");

// align buttons
const leftAlign = document.getElementById("left-align");
const centerAlign = document.getElementById("center-align");
const rightAlign = document.getElementById("right-align"); 

// Dropdown (font-size)
const fontSizeDropDown = document.getElementById("font-size");

// Dropdown (font family)
const fontFamilyDropDown = document.getElementById("font-family"); 

// cut copy paste button
const cutButton = document.getElementById("cut-button");
const copyButton = document.getElementById("copy-button");
const pasteButton = document.getElementById("paste-button");

// background color input
const bgColor = document.getElementById("bgColor");

// Text color
const textColor = document.getElementById("textColor");

// upload thing
const uploadJsonFile = document.getElementById("jsonFile");

// add sheet button
const addSheetButton = document.getElementById('add-sheet-btn');
const sheetNumHeading = document.getElementById("sheet-num");

let currentCell;
let cutCell = {};


let rows = 100;
const columns = 26;



for(let col = 0 ; col < columns ; col++){
    const th = document.createElement("th");
    th.innerText = String.fromCharCode(col+65);
    theadRow.append(th);
}


for(let row = 1 ; row<=rows ; row++){
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.innerText = row;
    tr.append(th);
    
    // looping from A to Z
    for(let col = 0 ; col < columns ; col++){
        const td = document.createElement("td");
        td.setAttribute('contenteditable', true);  // it is for editing or typing text --> <td contenteditable="true"></td>
        td.setAttribute('id',`${String.fromCharCode(col+65)}${row}`)
        
        // if you enter any text in cells this addeventlistener will trigger. this is for download btn related
        td.addEventListener('input',(event) => onInputFn(event));

        // this event listener will trigger when i focus on particular cell
        td.addEventListener('focus', (event) => onFocusFn(event));

        tr.append(td);
    }

    tBody.append(tr);
}

function onInputFn(event){
    // console.log(event.target);
    UpdateMatrix(event.target);
    // console.log(matrix);    
}

function onFocusFn(event){
    // console.log(event.target.id);
    currentCell = event.target;
    document.getElementById("current-cell").innerText = currentCell.id;
}

// BOLD button
boldButton.addEventListener('click', () => {
    if(currentCell.style.fontWeight === 'bold'){
        currentCell.style.fontWeight = 'normal';
    }
    else{
        currentCell.style.fontWeight = 'bold';
    }
    UpdateMatrix(currentCell);
    // console.log(matrix);
})

// Italic button
italicButton.addEventListener('click',() => {
    if(currentCell.style.fontStyle === 'italic'){
        currentCell.style.fontStyle = 'normal';
    }
    else{
        currentCell.style.fontStyle = 'italic';
    }

    UpdateMatrix(currentCell);
})

// underline button
underlineButton.addEventListener('click', () => {
    if(currentCell.style.textDecoration === "underline"){
        currentCell.style.textDecoration = "none";
    }
    else{
        currentCell.style.textDecoration = "underline";
    }

    UpdateMatrix(currentCell);
})


// left align button
leftAlign.addEventListener('click', () => {
    currentCell.style.textAlign = "left";

    UpdateMatrix(currentCell);
})

// center align button
centerAlign.addEventListener('click', () => {
    currentCell.style.textAlign = "center";

    UpdateMatrix(currentCell);
})

// right align button 
rightAlign.addEventListener('click', () => {
    currentCell.style.textAlign = "right";

    UpdateMatrix(currentCell);
})

// font size
fontSizeDropDown.addEventListener('change', () => {
    currentCell.style.fontSize = fontSizeDropDown.value;

    UpdateMatrix(currentCell);
})

//font family
fontFamilyDropDown.addEventListener('change', () => {
    currentCell.style.fontFamily = fontFamilyDropDown.value;

    UpdateMatrix(currentCell);
})


// cut button
cutButton.addEventListener('click',() => {
   cutCell = {
    style: currentCell.style.cssText,  // cssText gives me style properties what i applied to the cell
    text: currentCell.innerText,
   }

   currentCell.innerText='';
   currentCell.style=null;

   UpdateMatrix(currentCell);
})

// copy button
copyButton.addEventListener('click', () => {
    cutCell = {
        style: currentCell.style.cssText,  // cssText gives me style properties what i applied to the cell
        text: currentCell.innerText,
    }
})

//pasteButton
pasteButton.addEventListener('click', () => {
    if(cutCell.text){
        currentCell.style = cutCell.style;
        currentCell.innerText = cutCell.text;

        UpdateMatrix(currentCell);
    }

})

// background color
bgColor.addEventListener('change', () => {
    currentCell.style.backgroundColor = bgColor.value;

    UpdateMatrix(currentCell);
})


// text color
textColor.addEventListener("change",() => {
    currentCell.style.color = textColor.value;

    UpdateMatrix(currentCell);
})


// ------ table copy related, download button related code starts from here----------
//forming outer array
let matrix = new Array(rows);
for(let row = 0 ; row < rows ; row++){
    //adding inner arrays
   matrix[row] = new Array(columns);
   for(let col = 0 ; col < columns ; col++){
     matrix[row][col] = {};                         //fixing inner arrays to empty objects
   }
}

// UpdateMatrix will take currentCell

function UpdateMatrix(currentCell){
   let obj = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
    id: currentCell.id,
   }
   // id --> B1, B2, C5,........
   let id = currentCell.id.split('');
   
   let i = id[1]-1; 
   let j = id[0].charCodeAt(0) - 65;
   matrix[i][j] = obj;
}


//----------------------------

//Downlaod button

function downloadJson(){
    // i am converting matrix to string
    const matrixString = JSON.stringify(matrix); // ---> matrixString

    // converting text form of matrix to downloadable form(file)
    const blob = new Blob([matrixString],{type:'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);     //URL.createObjectURL(blob)--> it converts my blob into a link.
    
    //naming the file which will be downloaded
    link.download = 'data.json';   // data.json is name of file (example:- table.json, shashank.json, whateever you want)
    document.body.appendChild(link);  // i am placing that link in my body
    console.log(document.body);
    link.click();
    document.body.removeChild(link); // after clicking link, i need to remove that from body

}

// Upload button (little bit hard to understand)
uploadJsonFile.addEventListener("change", readJsonFileFn);
function readJsonFileFn(event){
    // console.log(event);
    const file = event.target.files[0];

    // if the file is present(exist)
    if(file){ 
        const reader = new FileReader();  // this is for reading my file

        reader.readAsText(file);  //reader read this file as a text (it calls the below reader.onload function)

        reader.onload = function(e){  
            // reader has read the file and converted it into code and stores in a 'e.target.result'.
            const fileContent = e.target.result;
            try{                                  // here i am trying to read that file
                const fileContentJSON = JSON.parse(fileContent);

                matrix = fileContentJSON;   // if i am not writing this it will broke my download functionality

                //iterating over matrix and saving it in my html table
                fileContentJSON.forEach((row) => {
                    row.forEach((cell) => {
                        if(cell.id){
                            // respective currentCell of cell in html or table
                            var currentCell = document.getElementById("cell.id");
                            currentCell.innerText = cell.text;
                            currentCell.style.cssText = cell.style;
                        }
                    })
                });
            }
            catch(err){
               console.log("error in reading json file", err);
            }
        }
       
    }
}



// things related to multiple sheets - add sheets button

let numSheets = 1;   // number of sheets
let currSheetNum = 1; // current sheet

addSheetButton.addEventListener('click',() => {

    // create a new sheet
    // we need to handle a matrix of my previous sheet

    if(numSheets === 1){
        var tempArr = [matrix];
        localStorage.setItem('arrMatrix',JSON.stringify(tempArr));
    }

    else{ // if more than one sheet

        // first i need to get my previous array
        var previousSheetArray = JSON.parse(localStorage.getItem('arrMatrix'));
        var updatedArr = [...previousSheetArray,matrix];
        localStorage.setItem('arrMatrix',JSON.stringify(updatedArr));


    }

    // update variable related to my sheet
    numSheets++;
    currSheetNum = numSheets;

    // cleanup my virtual memory
    for(let row = 0 ; row < rows ; row++){
        matrix[row] = new Array(columns);
        for(let col = 0 ; col < columns ; col++){
            matrix[row][col] = {};
        }
      
    }

    // table body will be none for my new sheet
    tBody.innerHTML=``;
    for(let row = 1 ; row <= rows ; row++){
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.innerText = row;
        tr.append(th);

        for(let col = 0; col < columns ; col++){
            const td = document.createElement("td");
            td.setAttribute('contenteditable',"true");
            td.setAttribute('id',`${String.fromCharCode(col+65)}${row}`)

            td.addEventListener('focus', (event) => onFocusFn(event));
            td.addEventListener('input',(event) => onInputFn(event));

            tr.append(td);
        }
        tBody.append(tr)
    }
    sheetNumHeading.innerText ="Sheet No: " + currSheetNum;
})


//------- this is only hardcode, afterwards you have to do use loop to add sheets

document.getElementById('sheet-1').addEventListener("click",() => {
    var myArr = JSON.parse(localStorage.getItem('arrMatrix'));
    let tableData = myArr[0];
    currSheetNum = 1;
    matrix = tableData;

    tableData.forEach((row) => {
        row.forEach((cell) => {
            if(cell.id){
               var mycell = document.getElementById(cell.id);
               mycell.style.cssText = cell.style;
               mycell.innerText = cell.text;
            }
        })
    })
    sheetNumHeading.innerText = "Sheet No: "+currSheetNum;
});

document.getElementById('sheet-2').addEventListener("click",() => {
    var myArr = JSON.parse(localStorage.getItem('arrMatrix'));
    let tableData = myArr[1];
    currSheetNum = 2;
    matrix = tableData;

    tableData.forEach((row) => {
        row.forEach((cell) => {
            if(cell.id){
               var mycell = document.getElementById(cell.id);
               mycell.style.cssText = cell.style;
               mycell.innerText = cell.text;
            }
        })
    })
    sheetNumHeading.innerText = "Sheet No: "+currSheetNum;
});

document.getElementById('sheet-3').addEventListener("click",() => {
    var myArr = JSON.parse(localStorage.getItem('arrMatrix'));
    let tableData = myArr[2];
    currSheetNum = 3;
    matrix = tableData;

    tableData.forEach((row) => {
        row.forEach((cell) => {
            if(cell.id){
               var mycell = document.getElementById(cell.id);
               mycell.style.cssText = cell.style;
               mycell.innerText = cell.text;
            }
        })
    })
    sheetNumHeading.innerText = "Sheet No: "+currSheetNum;
});
//------------






// matrix is representing virtual memory of my currentTable.

//There are 2 ways of cloning my table

// 1. We iterate over whole table and copy every table.
// 2. when we are editing any cell, we update that respective cell in 2d matrix.  ---> i am using this



//
// css
// cut copy paste modification
// onload it should show sheet #1
// dynamic buttons of sheet 1, sheet 2, sheet 3 on click of add sheet.
// dynamic functionality for 'sheet-${i}' 