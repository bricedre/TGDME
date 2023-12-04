import {
  renderImageElement,
  renderStripElement,
  renderTextElement,
} from "./elements.js";
import { generatePDF } from "./pdf.js";
import {
  app,
  currentCards,
  currentTemplate,
  currentDeckInfo
} from "../app.js";

export function triggerGeneration() {
  app.generateMode = true;
}

// GENERATE 3x3 A4 PAGES OF CARDS
export function generatePages(p5) {
  var cardW = currentDeckInfo.cardW;
  var cardH = currentDeckInfo.cardH;
  var colCount = currentDeckInfo.colCount;
  var rowCount = currentDeckInfo.rowCount;
  var marginX = currentDeckInfo.marginX;;
  var marginY = currentDeckInfo.marginY;
  var pageW = currentDeckInfo.pageW;
  var pageH = currentDeckInfo.pageH;

  var pages = [];

  var currentPage;

  var _allCardsIndices = [];
  var currentCardIndex = 0;
  currentCards.forEach((card) => {
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
      // currentPage.clear();
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
  p.card.background(255);
  if (currentCards.length > 0) {
    for (let i = 0; i < currentTemplate.length; i++) {
      if (currentTemplate[i].element === "TEXT") renderTextElement(p, i, cardIndex);
      else if (currentTemplate[i].element === "IMAGE")
        renderImageElement(p, i, cardIndex);
      else if (currentTemplate[i].element === "STRIP")
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
