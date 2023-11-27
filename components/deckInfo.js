// CANVASES
export var page;
export var card;

// CARD FORMAT
let cardFormat = 'poker'; // poker, square, domino, custom
let cardOrientation = "portrait"; // portrait, Landscape
export let cardW = 10;
export let cardH = 10;
switch (cardFormat) {
    case "poker":
        cardW = Math.round(6.3 * 118.1); // x300dpi
        cardH = Math.round(8.8 * 118.1);
        break;

    case "square":
        cardW = Math.round(8.8 * 118.1);
        cardH = Math.round(8.8 * 118.1);
        break;

    case "domino":
        cardW = Math.round(4.4 * 118.1);
        cardH = Math.round(8.8 * 118.1);
        break;

    case Custom:
    default:
        cardW = Math.round(cardW * 118.1); 
        cardH = Math.round(cardH * 118.1);
        break;
}

if(cardOrientation === "landscape"){
    let _temp = cardW;
    cardW = cardH;
    cardH = _temp;
}


// PAGE FORMAT
let pageFormat = "A4" // A3, A4, A5, custom 
let pageOrientation = "portrait"
export let pageW = 10;
export let pageH = 10;
switch (pageFormat) {
    case "A3":
        pageW = Math.round(29.7 * 118.1);
        pageH = Math.round(42 * 118.1);
        break;

    case "A4":
        pageW = Math.round(21 * 118.1);
        pageH = Math.round(29.7 * 118.1);
        break;

    case custom:
    default:
        pageW = Math.round(pageW * 118.1);
        pageH = Math.round(pageH * 118.1);
        break;
}

if(pageOrientation === "landscape"){
    let _temp = pageW;
    pageW = pageH;
    pageH = _temp;
}

// DERIVED MARGINS & COLUMN/ROW COUNTS TO CENTER THE CARDS IN THE PAGE
export let colCount = Math.floor(pageW/cardW);
export let rowCount = Math.floor(pageH/cardH);
export let marginX = (pageW - cardW * colCount) / 2;
export let marginY = (pageH - cardH * rowCount) / 2;