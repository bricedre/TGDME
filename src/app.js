'use strict';

const p5 = require('p5');

import { currentDeckIndex } from "./components/globalStuff.js";
import { generatePages, renderCardUsingTemplate } from "./components/render.js";
import { setUI } from "./components/DOM.js";


const sketch = (p) => {

  console.log("new P5 element");

  p.setup = () => {
    // p.createCanvas(window.innerHeight*0.6*cardW/cardH, window.innerHeight*0.6);

    // p.page = p.createGraphics(pageW, pageH);
    // p.card = p.createGraphics(cardW, cardH);

    p.setupCanvas(200, 200)

    p.page = p.createGraphics(100, 100);
    p.card = p.createGraphics(100, 100);

    p.generateMode = false;
    p.currentIndex = 0;

    p.imageMode(p.CORNER);
    p.page.imageMode(p.CORNER);
    p.card.imageMode(p.CENTER);
    
    setUI();

  };

  p.draw = () => {
    if (!p.generateMode) {
      if(currentDeckIndex !== -1){
        p.image(p.card, 0, 0, p.width, p.height);
      }
    } else {
      generatePages(p);
      p.generateMode = false;
      renderCardUsingTemplate(p, p.currentIndex);
    }
  };

  p.setupCanvas = (w, h) => {
    p.createCanvas(w, h);
  }
};

export const app = new p5(sketch);
