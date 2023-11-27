import {
  card,
  cardW,
  cardH,
  page,
  pageW,
  pageH,
} from "./assets/deckInfo.js";
import { renderCardUsingTemplate, generatePages } from "./components/render.js";
import { keyPressed } from "./components/interactions.js";
import { preload } from "./components/preload.js";
import { checkButtons, updateCardCounter } from "./components/DOM.js";
import p5 from "p5";

export let generateMode = false;
export let currentIndex = 0;

console.log("Début de l'app");

const sketch = (p5) => {
  console.log("new P5 element");
  p5.setup = () => {
    p5.createCanvas(cardW / 2, cardH / 2);

    page = p5.createGraphics(pageW, pageH);
    card = p5.createGraphics(cardW, cardH);

    p5.imageMode(CORNER);
    page.imageMode(CORNER);
    card.imageMode(CENTER);

    renderCardUsingTemplate(p5, currentIndex);
    updateCardCounter();
    checkButtons();
  };

  p5.draw = () => {
    if (!generateMode) {
      p5.image(card, 0, 0, p5.width, p5.height);
    } else {
      generatePages();
      generateMode = false;
      renderCardUsingTemplate(currentIndex);
    }
  };

  p5.preload = () => {
    preload();
  };

  p5.keyPressed = () => {
    keyPressed();
  };
};

export const p5 = new p5(sketch);
