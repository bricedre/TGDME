import {
  currentDeck
} from "./globalStuff.js";
import {
  renderImageElement,
  renderStripElement,
  renderTextElement,
} from "./elements.js";
import { generatePDF } from "./pdf.js";
import {
  app
} from "../app.js";



export function triggerGeneration() {
  app.generateMode = true;
}

// GENERATE 3x3 A4 PAGES OF CARDS
export function generatePages(p5) {
  
  var cardW = currentDeck.deckInfo.cardW;
  var cardH = currentDeck.deckInfo.cardH;
  var colCount = currentDeck.deckInfo.colCount;
  var rowCount = currentDeck.deckInfo.rowCount;
  var marginX = currentDeck.deckInfo.marginX;;
  var marginY = currentDeck.deckInfo.marginY;
  var pageW = currentDeck.deckInfo.pageW;
  var pageH = currentDeck.deckInfo.pageH;

  var pages = [];

  var currentPage;

  var _allCardsIndices = [];
  var currentCardIndex = 0;
  currentDeck.cards.forEach((card) => {
    if (card.quantity) {
      for (let i = 0; i < card.quantity; i++)
        _allCardsIndices.push(currentCardIndex);
    } else {
      _allCardsIndices.push(currentCardIndex);
    }
    currentCardIndex++;
  });

  for (let i = 0; i < _allCardsIndices.length; i++) {
    var cardIndex = _allCardsIndices[i];
    if (i % (colCount * rowCount) == 0) {
      currentPage = p5.createGraphics(pageW, pageH);
      currentPage.background(255);
    }
    renderCardUsingTemplate(p5, cardIndex);
    currentPage.image(
      p5.card,
      marginX + ((i % (colCount * rowCount)) % colCount) * cardW,
      marginY + Math.floor((i % (colCount * rowCount)) / colCount) * cardH,
      cardW,
      cardH
    );

    if (
      i % (colCount * rowCount) == colCount * rowCount - 1 ||
      i === _allCardsIndices.length - 1
    ) {
      pages.push(currentPage);
    }
  }

  generatePDF(pages);
}

export function renderCardUsingTemplate(p, cardIndex) {

  var cardW = currentDeck.deckInfo.cardW;
  var cardH = currentDeck.deckInfo.cardH;

  p.card.background(255);
  if (currentDeck.cards.length > 0) {
    for (let i = 0; i < currentDeck.template.length; i++) {
      if (currentDeck.template[i].element === "TEXT") renderTextElement(p, i, cardIndex);
      else if (currentDeck.template[i].element === "IMAGE")
        renderImageElement(p, i, cardIndex);
      else if (currentDeck.template[i].element === "STRIP")
        renderStripElement(p, i, cardIndex);
    }

    if (p.generateMode) {
      p.card.noFill();
      p.card.stroke(0, 100);
      p.card.strokeWeight(2);
      p.card.rect(0, 0, cardW, cardH);
    }
  }
}
