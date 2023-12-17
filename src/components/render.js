import { currentCollection } from "./collectionManager.js";
import {
  renderImageComponent,
  renderStripComponent,
  renderTextComponent,
} from "./elements.js";
import { generatePDF } from "./pdf.js";
import { app } from "../app.js";

export function triggerGeneration() {
  app.generateMode = true;
}

// GENERATE 3x3 A4 PAGES OF CARDS
export function generatePages(p5) {
  var W =
    currentCollection.collectionInfo.W *
    currentCollection.collectionInfo.resolution;
  var H =
    currentCollection.collectionInfo.H *
    currentCollection.collectionInfo.resolution;
  var colCount = currentCollection.collectionInfo.colCount;
  var rowCount = currentCollection.collectionInfo.rowCount;
  var marginX = currentCollection.collectionInfo.marginX;
  var marginY = currentCollection.collectionInfo.marginY;
  var pageWidth =
    currentCollection.collectionInfo.pageWidth *
    currentCollection.collectionInfo.resolution;
  var pageHeight =
    currentCollection.collectionInfo.pageHeight *
    currentCollection.collectionInfo.resolution;

  var pages = [];

  var currentPage;

  var _allCardsIndices = [];
  var currentElementIndex = 0;
  currentCollection.elements.forEach((card) => {
    if (card.quantity) {
      for (let i = 0; i < card.quantity; i++)
        _allCardsIndices.push(currentElementIndex);
    } else {
      _allCardsIndices.push(currentElementIndex);
    }
    currentElementIndex++;
  });

  for (let i = 0; i < _allCardsIndices.length; i++) {
    var elementIndex = _allCardsIndices[i];
    if (i % (colCount * rowCount) == 0) {
      currentPage = p5.createGraphics(pageWidth, pageHeight);
      currentPage.background(255);
    }
    renderCardUsingTemplate(
      p5,
      elementIndex,
      currentCollection.collectionInfo.visualGuide
    );
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

export function renderCardUsingTemplate(p, elementIndex, guide) {
  var W =
    currentCollection.collectionInfo.W *
    currentCollection.collectionInfo.resolution;
  var H =
    currentCollection.collectionInfo.H *
    currentCollection.collectionInfo.resolution;

  p.card.background(255);
  if (currentCollection.elements.length > 0) {
    for (let i = 0; i < currentCollection.template.length; i++) {
      if (currentCollection.template[i].isVisible) {
        if (currentCollection.template[i].component === "TEXT")
          renderTextComponent(p, i, elementIndex);
        else if (currentCollection.template[i].component === "IMAGE")
          renderImageComponent(p, i, elementIndex);
        else if (currentCollection.template[i].component === "STRIP")
          renderStripComponent(p, i, elementIndex);
      }
    }

    if (p.generateMode) {
      if (currentCollection.collectionInfo.cuttingHelp) {
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
            p.card.line(W / 3 + (W / 3) * i, 0, W / 3 + (W / 3) * i, H);
          }
          for (let i = 0; i < 2; i++) {
            p.card.line(0, H / 3 + (H / 3) * i, W, H / 3 + (H / 3) * i);
          }
          break;

        case "grid4":
          for (let i = 0; i < 3; i++) {
            p.card.line(W / 4 + (W / 4) * i, 0, W / 4 + (W / 4) * i, H);
          }
          for (let i = 0; i < 3; i++) {
            p.card.line(0, H / 4 + (H / 4) * i, W, H / 4 + (H / 4) * i);
          }
          break;

        case "grid6":
          for (let i = 0; i < 5; i++) {
            p.card.line(W / 6 + (W / 6) * i, 0, W / 6 + (W / 6) * i, H);
          }
          for (let i = 0; i < 5; i++) {
            p.card.line(0, H / 6 + (H / 6) * i, W, H / 6 + (H / 6) * i);
          }
          break;

        case "circle":
          p.card.ellipse(W * 0.5, H * 0.5, W, H);
          break;

        case "hexp":
          p.card.beginShape();
          for (let i = 0; i < 6; i++) {
            p.card.vertex(
              W / 2 + (Math.cos(Math.PI / 2 + ((Math.PI * 2) / 6) * i) * H) / 2,
              H / 2 + (Math.sin(Math.PI / 2 + ((Math.PI * 2) / 6) * i) * H) / 2
            );
          }
          p.card.endShape(p.CLOSE);

          break;

        case "hexl":
          p.card.beginShape();
          for (let i = 0; i < 6; i++) {
            p.card.vertex(
              W / 2 + (Math.cos(((Math.PI * 2) / 6) * i) * W) / 2,
              H / 2 + (Math.sin(((Math.PI * 2) / 6) * i) * W) / 2
            );
          }
          p.card.endShape(p.CLOSE);

          break;

        case "oct":
          p.card.beginShape();
          for (let i = 0; i < 8; i++) {
            p.card.vertex(
              W / 2 +
                Math.cos((Math.PI * 2) / 16 + ((Math.PI * 2) / 8) * i) *
                  W *
                  0.54,
              H / 2 +
                Math.sin((Math.PI * 2) / 16 + ((Math.PI * 2) / 8) * i) *
                  H *
                  0.54
            );
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
