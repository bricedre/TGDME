import {
  page,
  card,
  cardW,
  cardH,
  colCount,
  rowCount,
  marginX,
  marginY,
} from "../assets/deckInfo.js";
import { cards } from "../assets/cards.js";
import { generateMode } from "../app.js";
import {
  renderImageElement,
  renderStripElement,
  renderTextElement,
} from "./elements.js";
// import { generatePDF } from "./pdf.js";

export function triggerGeneration() {
  generateMode = true;
}

// GENERATE 3x3 A4 PAGES OF CARDS
export function generatePages(p5) {
  var pages = [];

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

  for (let i = 0; i < _allCardsIndices.length; i++) {
    var cardIndex = _allCardsIndices[i];
    if (i % (colCount * rowCount) == 0) page.background(255);
    renderCardUsingTemplate(p5, cardIndex);
    page.image(
      card,
      marginX + ((i % (colCount * rowCount)) % colCount) * cardW,
      marginY + int((i % (colCount * rowCount)) / colCount) * cardH,
      cardW,
      cardH
    );
    
    if (
      i % (colCount * rowCount) == colCount * rowCount - 1 ||
      i === _allCardsIndices.length - 1
    )
      pages.push(page);
  }

  // generatePDF(pages);
}

export function renderCardUsingTemplate(p5, cardIndex) {
  card.background(255);
  if (cards.length > 0) {
    for (let i = 0; i < template.length; i++) {
      if (template[i].element === "TEXT") renderTextElement(p5, i, cardIndex);
      else if (template[i].element === "IMAGE")
        renderImageElement(p5, i, cardIndex);
      else if (template[i].element === "STRIP")
        renderStripElement(p5, i, cardIndex);
    }

    if (generateMode) {
      card.noFill();
      card.stroke(0, 100);
      card.strokeWeight(2);
      card.rect(0, 0, cardW, cardH);
    }
  }
}
