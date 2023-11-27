import {
  cardW,
  cardH,
  colCount,
  rowCount,
  marginX,
  marginY,
} from "./deck/deckInfo.js";
import { cards } from "./deck/cards.js";
import {
  renderImageElement,
  renderStripElement,
  renderTextElement,
} from "./elements.js";
import { template } from "./deck/template.js";
import {generatePDF} from "./pdf.js"
import { app } from "../app.js";

export function triggerGeneration(app) {
  app.generateMode = true;
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
    if (i % (colCount * rowCount) == 0) p5.page.background(255);
    renderCardUsingTemplate(p5, cardIndex);
    p5.page.image(
      p5.card,
      marginX + ((i % (colCount * rowCount)) % colCount) * cardW,
      marginY + Math.floor((i % (colCount * rowCount)) / colCount) * cardH,
      cardW,
      cardH
    );
    
    if (
      i % (colCount * rowCount) == colCount * rowCount - 1 ||
      i === _allCardsIndices.length - 1
    )
    
    pages.push(p5.page);

    renderCardUsingTemplate(app, app.currentIndex)
  }

  generatePDF(pages);
}

export function renderCardUsingTemplate(p, cardIndex) {
  p.card.background(255);
  if (cards.length > 0) {
    for (let i = 0; i < template.length; i++) {
      if (template[i].element === "TEXT") renderTextElement(p, i, cardIndex);
      else if (template[i].element === "IMAGE")
        renderImageElement(p, i, cardIndex);
      else if (template[i].element === "STRIP")
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
