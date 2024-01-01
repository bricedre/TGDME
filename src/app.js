"use strict";

const p5 = require("p5");

import { currentCollection, currentCollectionUID } from "./collection/collectionManager.js";
import { generatePages, renderCardUsingTemplate } from "./render.js";
import { setupMenu } from "./screens/menuScreen.js";

const sketch = (p) => {

  p.setup = () => {
    p.setupCanvas(100, 100, 100, 100);

    p.generateMode = false;
    p.currentIndex = 0;

    p.imageMode(p.CORNER);
    p.page.imageMode(p.CORNER);
    p.card.imageMode(p.CENTER);

    setupMenu();
  };

  p.draw = () => {
    if (!p.generateMode) {
      if (currentCollectionUID !== -1) {
        p.image(p.card, 0, 0, p.width, p.height);
      }
    } else {
      generatePages(p);
      p.generateMode = false;
      renderCardUsingTemplate(p, p.currentIndex, currentCollection.collectionInfo.visualGuide);
    }
  };

  p.setupCanvas = (W, H, pageWidth, pageHeight) => {
    p.createCanvas(
      (window.innerHeight * 0.6 * W) / H,
      window.innerHeight * 0.6
    );
    p.page = p.createGraphics(pageWidth, pageHeight);
    p.card = p.createGraphics(W, H);
  };

  p.resizeExistingCanvas = (W, H, pageWidth, pageHeight) => {
    p.resizeCanvas(
      (window.innerHeight * 0.6 * W) / H,
      window.innerHeight * 0.6
    );

    var canvases = document.querySelectorAll("canvas");
    canvases.forEach((canvas, index) => {
      if(index != 0){
        canvas.remove();
      }
    })

    p.page = p.createGraphics(pageWidth, pageHeight);
    p.card = p.createGraphics(W, H);
  };
};

export const app = new p5(sketch);
