"use strict";

const p5 = require("p5");

import { currentDeck, currentDeckIndex } from "./components/globalStuff.js";
import { generatePages, renderCardUsingTemplate } from "./components/render.js";
import { setUI } from "./components/DOM.js";

const sketch = (p) => {

  p.setup = () => {
    p.setupCanvas(100, 100, 100, 100);

    p.generateMode = false;
    p.currentIndex = 0;

    p.imageMode(p.CORNER);
    p.page.imageMode(p.CORNER);
    p.card.imageMode(p.CENTER);

    setUI();
  };

  p.draw = () => {
    if (!p.generateMode) {
      if (currentDeckIndex !== -1) {
        p.image(p.card, 0, 0, p.width, p.height);
      }
    } else {
      generatePages(p);
      p.generateMode = false;
      renderCardUsingTemplate(p, p.currentIndex, currentDeck.deckInfo.visualGuide);
    }
  };

  p.setupCanvas = (cardW, cardH, pageW, pageH) => {
    p.createCanvas(
      (window.innerHeight * 0.6 * cardW) / cardH,
      window.innerHeight * 0.6
    );
    p.page = p.createGraphics(pageW, pageH);
    p.card = p.createGraphics(cardW, cardH);
  };

  p.resizeExistingCanvas = (cardW, cardH, pageW, pageH) => {
    p.resizeCanvas(
      (window.innerHeight * 0.6 * cardW) / cardH,
      window.innerHeight * 0.6
    );
    p.page = p.createGraphics(pageW, pageH);
    p.card = p.createGraphics(cardW, cardH);
  };
};

export const app = new p5(sketch);
