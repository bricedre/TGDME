//

export let deckName = "Rédac' Challenge";

//RESOLUTION
export let resolution = 50; //118.1 (300dpi)

// CARD FORMAT
let cardFormat = 'poker'; // poker, square, domino, custom
let cardOrientation = "portrait"; // portrait, Landscape
export let cardW = 10;
export let cardH = 10;
switch (cardFormat) {
    case "poker":
        cardW = Math.round(6.3 * resolution);
        cardH = Math.round(8.8 * resolution);
        break;

    case "square":
        cardW = Math.round(8.8 * resolution);
        cardH = Math.round(8.8 * resolution);
        break;

    case "domino":
        cardW = Math.round(4.4 * resolution);
        cardH = Math.round(8.8 * resolution);
        break;

    case Custom:
    default:
        cardW = Math.round(cardW * resolution); 
        cardH = Math.round(cardH * resolution);
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
        pageW = Math.round(29.7 * resolution);
        pageH = Math.round(42 * resolution);
        break;

    case "A4":
        pageW = Math.round(21 * resolution);
        pageH = Math.round(29.7 * resolution);
        break;

    case custom:
    default:
        pageW = Math.round(pageW * resolution);
        pageH = Math.round(pageH * resolution);
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