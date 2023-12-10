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
  var W = currentDeck.deckInfo.W * currentDeck.deckInfo.resolution;
  var H = currentDeck.deckInfo.H * currentDeck.deckInfo.resolution;
  var colCount = currentDeck.deckInfo.colCount;
  var rowCount = currentDeck.deckInfo.rowCount;
  var marginX = currentDeck.deckInfo.marginX;
  var marginY = currentDeck.deckInfo.marginY;
  var pageWidth = currentDeck.deckInfo.pageWidth * currentDeck.deckInfo.resolution;
  var pageHeight = currentDeck.deckInfo.pageHeight * currentDeck.deckInfo.resolution;

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
      currentPage = p5.createGraphics(pageWidth, pageHeight);
      currentPage.background(255);
    }
    renderCardUsingTemplate(p5, cardIndex, currentDeck.deckInfo.visualGuide);
    currentPage.image(
      p5.card,
      marginX + ((i % (colCount * rowCount)) % colCount) * W,
      marginY + Math.floor((i % (colCount * rowCount)) / colCount) * H,
      W,
      H
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
  var W = currentDeck.deckInfo.W * currentDeck.deckInfo.resolution;
  var H = currentDeck.deckInfo.H * currentDeck.deckInfo.resolution;

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
        p.card.rect(0, 0, H, H);
      }
    } else {
      p.card.stroke(255, 0, 0, 100);
      p.card.noFill();
      p.card.strokeWeight(W * 0.007);

      switch (guide) {
        case "center":
          p.card.line(W / 2, 0, W / 2, H);
          p.card.line(0, H / 2, W, H / 2);

          break;

        case "grid3":
          for (let i = 0; i < 2; i++) {
            p.card.line(
              W / 3 + (W / 3) * i,
              0,
              W / 3 + (W / 3) * i,
              H
            );
          }
          for (let i = 0; i < 2; i++) {
            p.card.line(
              0,
              H / 3 + (H / 3) * i,
              W,
              H / 3 + (H / 3) * i
            );
          }
          break;

        case "grid4":
          for (let i = 0; i < 3; i++) {
            p.card.line(
              W / 4 + (W / 4) * i,
              0,
              W / 4 + (W / 4) * i,
              H
            );
          }
          for (let i = 0; i < 3; i++) {
            p.card.line(
              0,
              H / 4 + (H / 4) * i,
              W,
              H / 4 + (H / 4) * i
            );
          }
          break;

        case "grid6":
          for (let i = 0; i < 5; i++) {
            p.card.line(
              W / 6 + (W / 6) * i,
              0,
              W / 6 + (W / 6) * i,
              H
            );
          }
          for (let i = 0; i < 5; i++) {
            p.card.line(
              0,
              H / 6 + (H / 6) * i,
              W,
              H / 6 + (H / 6) * i
            );
          }
          break;

        case "circle":
          p.card.ellipse(W * 0.5, H * 0.5, W, H);
          break;

        case "hexp":
          p.card.beginShape();
          for (let i = 0; i < 6; i++) {
            p.card.vertex(W/2 + Math.cos(Math.PI/2 + Math.PI*2/6*i)*H/2, H/2+Math.sin(Math.PI/2 + Math.PI*2/6*i)*H/2);
          }
          p.card.endShape(p.CLOSE);
          
          break;
          
          case "hexl":
          p.card.beginShape();
          for (let i = 0; i < 6; i++) {
            p.card.vertex(W/2 + Math.cos(Math.PI*2/6*i)*W/2, H/2+Math.sin(Math.PI*2/6*i)*W/2);
          }
          p.card.endShape(p.CLOSE);
          
          break;

          case "oct":
            p.card.beginShape();
            for (let i = 0; i < 8; i++) {
              p.card.vertex(W/2 + Math.cos(Math.PI*2/16 + Math.PI*2/8*i)*W*0.54, H/2 + Math.sin(Math.PI*2/16 + Math.PI*2/8*i)*H*0.54);
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
      W,
      H
    );
  }
}
