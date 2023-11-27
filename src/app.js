'use strict';

const p5 = require('p5');

import {
  cardW,
  cardH,
  pageW,
  pageH,
} from "./components/deck/deckInfo.js";

import { generatePages, renderCardUsingTemplate } from "./components/render.js";
import { preload } from "./components/preload.js";
import { checkButtons, updateCardCounter } from "./components/DOM.js";

// CANVASES


const sketch = (p) => {

  console.log("new P5 element");

  p.setup = () => {
    p.createCanvas(window.innerHeight*0.6*cardW/cardH, window.innerHeight*0.6);

    p.page = p.createGraphics(pageW, pageH);
    p.card = p.createGraphics(cardW, cardH);

    p.generateMode = false;
    p.currentIndex = 0;

    p.imageMode(p.CORNER);
    p.page.imageMode(p.CORNER);
    p.card.imageMode(p.CENTER);

    renderCardUsingTemplate(p, p.currentIndex);
    updateCardCounter(p.currentIndex);
    checkButtons();
  };

  p.draw = () => {
    if (!p.generateMode) {
      p.image(p.card, 0, 0, p.width, p.height);
    } else {
      generatePages(p);
      p.generateMode = false;
      renderCardUsingTemplate(p, p.currentIndex);
    }
  };

  p.preload = () => {
    preload(p);
  };
};

export const app = new p5(sketch);
