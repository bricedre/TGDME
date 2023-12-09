import { currentDeck } from "./globalStuff.js";
import {
  renderImageElement,
  renderStripElement,
  renderTextElement,
} from "./elements.js";
import { generatePDF } from "./pdf.js";
import { app } from "../app.js";
import { cuttingHelp } from "./DOM.js";

export function triggerGeneration() {
  app.generateMode = true;
}

// GENERATE 3x3 A4 PAGES OF CARDS
export function generatePages(p5) {
  var cardW = currentDeck.deckInfo.cardW * currentDeck.deckInfo.resolution;
  var cardH = currentDeck.deckInfo.cardH * currentDeck.deckInfo.resolution;
  var colCount = currentDeck.deckInfo.colCount;
  var rowCount = currentDeck.deckInfo.rowCount;
  var marginX = currentDeck.deckInfo.marginX;
  var marginY = currentDeck.deckInfo.marginY;
  var pageW = currentDeck.deckInfo.pageW * currentDeck.deckInfo.resolution;
  var pageH = currentDeck.deckInfo.pageH * currentDeck.deckInfo.resolution;

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
    renderCardUsingTemplate(p5, cardIndex, currentDeck.deckInfo.visualGuide);
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

export function renderCardUsingTemplate(p, cardIndex, guide) {
  var cardW = currentDeck.deckInfo.cardW * currentDeck.deckInfo.resolution;
  var cardH = currentDeck.deckInfo.cardH * currentDeck.deckInfo.resolution;

  p.card.background(255);
  if (currentDeck.cards.length > 0) {
    for (let i = 0; i < currentDeck.template.length; i++) {
      if (currentDeck.template[i].element === "TEXT")
        renderTextElement(p, i, cardIndex);
      else if (currentDeck.template[i].element === "IMAGE")
        renderImageElement(p, i, cardIndex);
      else if (currentDeck.template[i].element === "STRIP")
        renderStripElement(p, i, cardIndex);
    }

    if (p.generateMode) {
      console.log(currentDeck.deckInfo.cuttingHelp)
      if(currentDeck.deckInfo.cuttingHelp){
        p.card.noFill();
        p.card.stroke(0, 100);
        p.card.strokeWeight(2);
        p.card.rect(0, 0, cardH, cardH);
      }
    } else {
      p.card.stroke(255, 0, 0, 100);
      p.card.noFill();
      p.card.strokeWeight(cardW * 0.007);

      switch (guide) {
        case "center":
          p.card.line(cardW / 2, 0, cardW / 2, cardH);
          p.card.line(0, cardH / 2, cardW, cardH / 2);

          break;

        case "grid3":
          for (let i = 0; i < 2; i++) {
            p.card.line(
              cardW / 3 + (cardW / 3) * i,
              0,
              cardW / 3 + (cardW / 3) * i,
              cardH
            );
          }
          for (let i = 0; i < 2; i++) {
            p.card.line(
              0,
              cardH / 3 + (cardH / 3) * i,
              cardW,
              cardH / 3 + (cardH / 3) * i
            );
          }
          break;

        case "grid4":
          for (let i = 0; i < 3; i++) {
            p.card.line(
              cardW / 4 + (cardW / 4) * i,
              0,
              cardW / 4 + (cardW / 4) * i,
              cardH
            );
          }
          for (let i = 0; i < 3; i++) {
            p.card.line(
              0,
              cardH / 4 + (cardH / 4) * i,
              cardW,
              cardH / 4 + (cardH / 4) * i
            );
          }
          break;

        case "grid6":
          for (let i = 0; i < 5; i++) {
            p.card.line(
              cardW / 6 + (cardW / 6) * i,
              0,
              cardW / 6 + (cardW / 6) * i,
              cardH
            );
          }
          for (let i = 0; i < 5; i++) {
            p.card.line(
              0,
              cardH / 6 + (cardH / 6) * i,
              cardW,
              cardH / 6 + (cardH / 6) * i
            );
          }
          break;

        case "circle":
          p.card.ellipse(cardW * 0.5, cardH * 0.5, cardW, cardH);
          break;

        case "hexp":
          p.card.beginShape();
          for (let i = 0; i < 6; i++) {
            p.card.vertex(cardW/2 + Math.cos(Math.PI/2 + Math.PI*2/6*i)*cardH/2, cardH/2+Math.sin(Math.PI/2 + Math.PI*2/6*i)*cardH/2);
          }
          p.card.endShape(p.CLOSE);
          
          break;
          
          case "hexl":
          p.card.beginShape();
          for (let i = 0; i < 6; i++) {
            p.card.vertex(cardW/2 + Math.cos(Math.PI*2/6*i)*cardW/2, cardH/2+Math.sin(Math.PI*2/6*i)*cardW/2);
          }
          p.card.endShape(p.CLOSE);
          
          break;

          case "oct":
            p.card.beginShape();
            for (let i = 0; i < 8; i++) {
              p.card.vertex(cardW/2 + Math.cos(Math.PI*2/16 + Math.PI*2/8*i)*cardW*0.54, cardH/2 + Math.sin(Math.PI*2/16 + Math.PI*2/8*i)*cardH*0.54);
            }
            p.card.endShape(p.CLOSE);
            
            break;
      }
    }
  } else {
    p.card.background(200);
    p.card.textAlign(p.CENTER, p.CENTER);
    p.card.textSize(30);
    p.card.text(
      "AUCUN ÉLÉMENT DANS LA COLLECTION!\n\nCRÉEZ UN MODÈLE ET DES ÉLÉMENTS DANS LE PANNEAU D'ÉDITION!",
      0,
      0,
      cardW,
      cardH
    );
  }
}
