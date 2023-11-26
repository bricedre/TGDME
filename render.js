function triggerGeneration(){
  generateMode = true;
}

// GENERATE 3x3 A4 PAGES OF CARDS
function generatePages() {

  var _allCardsIndices = [];
  var currentCardIndex = 0;
  cards.forEach((card) => {
    if (card.quantity) {
      for (let i = 0; i < card.quantity; i++)
        _allCardsIndices.push(currentCardIndex);
    } else {
      _allCardsIndices.push(currentCardIndex);
    }
    currentCardIndex++;
  });

  var lastIndex = 0;
  for (let i = 0; i < _allCardsIndices.length; i++) {
    var cardIndex = _allCardsIndices[i];
    if (i % (colCount*rowCount) == 0) page.background(255);
    renderCardUsingTemplate(cardIndex);
    page.image(
      card,
      marginX + ((i % (colCount*rowCount)) % colCount) * cardW,
      marginY + int((i % (colCount*rowCount)) / colCount) * cardH,
      cardW,
      cardH
    );
    if (i % (colCount*rowCount) == (colCount*rowCount-1) || i === _allCardsIndices.length-1) saveCanvas(page, "page" + Math.floor(i/(colCount*rowCount)) + ".jpg");
    lastIndex = i;
  }

}

function renderCardUsingTemplate(cardIndex) {
  card.background(255);
  if(cards.length > 0){
    for (let i = 0; i < template.length; i++) {
      if (template[i].element === "TEXT") renderTextElement(i, cardIndex);
      else if (template[i].element === "IMAGE") renderImageElement(i, cardIndex);
      else if (template[i].element === "STRIP") renderStripElement(i, cardIndex);
    }
    
    if(generateMode){
      card.noFill();
      card.stroke(0, 100);
      card.strokeWeight(2);
      card.rect(0, 0, cardW, cardH);
    }
  }
}