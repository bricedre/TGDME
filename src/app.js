'use strict';

const p5 = require('p5');

// import {
//   cardW,
//   cardH,
//   pageW,
//   pageH,
// } from "./components/deck/deckInfo.js";

import { generatePages, renderCardUsingTemplate } from "./components/render.js";
import { preload } from "./components/preload.js";
import { checkButtons, updateCardCounter, setHeaderButtons } from "./components/DOM.js";

export let currentDeck = -1;
export let currentTemplate;
export let currentCards;
export let currentDeckInfo;
export let currentAssetsList;

const sketch = (p) => {

  console.log("new P5 element");

  p.setup = () => {
    // p.createCanvas(window.innerHeight*0.6*cardW/cardH, window.innerHeight*0.6);

    // p.page = p.createGraphics(pageW, pageH);
    // p.card = p.createGraphics(cardW, cardH);

    p.createCanvas(100, 100);

    p.page = p.createGraphics(100, 100);
    p.card = p.createGraphics(100, 100);

    p.generateMode = false;
    p.currentIndex = 0;

    p.imageMode(p.CORNER);
    p.page.imageMode(p.CORNER);
    p.card.imageMode(p.CENTER);
    
    setHeaderButtons();

  };

  p.draw = () => {
    if (!p.generateMode) {
      if(currentDeck !== -1){
        p.image(p.card, 0, 0, p.width, p.height);
      }
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
