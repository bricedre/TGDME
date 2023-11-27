import {
  card,
  cardW,
  cardH,
  page,
  pageW,
  pageH,
} from "./components/deck/deckInfo.js";

import { renderCardUsingTemplate, generatePages } from "./components/render.js";
import { keyPressed } from "./components/interactions.js";
import { preload } from "./components/preload.js";
import { checkButtons, updateCardCounter } from "./components/DOM.js";

// CANVASES
export var page;
export var card;

export let generateMode = false;
export let currentIndex = 0;

console.log("Début de l'app");

const sketch = (p) => {
  console.log("new P5 element");
  p.setup = () => {
    p.createCanvas(cardW / 2, cardH / 2);

    page = p.createGraphics(pageW, pageH);
    card = p.createGraphics(cardW, cardH);

    p.imageMode(CORNER);
    page.imageMode(CORNER);
    card.imageMode(CENTER);

    renderCardUsingTemplate(p, currentIndex);
    updateCardCounter();
    checkButtons();
  };

  p.draw = () => {
    if (!generateMode) {
      p.image(card, 0, 0, p.width, p.height);
    } else {
      generatePages(p);
      generateMode = false;
      renderCardUsingTemplate(p, currentIndex);
    }
  };

  p.preload = () => {
    preload(p);
  };

  p.keyPressed = () => {
    keyPressed(p);
  };
};

new p5(sketch);
