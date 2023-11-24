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
    if (i % 9 == 0) page.background(255);
    renderCardUsingTemplate(cardIndex);
    page.image(
      card,
      marginX + ((i % 9) % 3) * cardW,
      marginY + int((i % 9) / 3) * cardH,
      cardW,
      cardH
    );
    if (i % 9 == 8) saveCanvas(page, "page" + int(i / 9) + ".jpg");
    lastIndex = i;
  }

  //SAVE INCOMPLETE PAGE
  if (_allCardsIndices.length % 9 != 0)
    saveCanvas(page, "page" + lastIndex + ".jpg");

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