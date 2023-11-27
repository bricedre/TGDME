import { renderCardUsingTemplate } from "./render.js";
import { rootElement, updateCardCounter } from "./DOM.js";
import { currentIndex } from "../app.js";

export function keyPressed(p) {
  if (p.keyCode === p.LEFT_ARROW) {
    goToPreviousCard();
  } else if (p.keyCode === p.RIGHT_ARROW){
    goToNextCard();
  }
}

export function goToPreviousCard(){
  if(currentIndex > 0) {
    currentIndex--;
    renderCardUsingTemplate(currentIndex);
    updateCardCounter();
    rootElement.style.setProperty("--cardAngle", (3-random()*6)+"deg");

    checkButtons();
  }
}

export function goToNextCard(){
  if(currentIndex < cards.length - 1) {
    currentIndex++;
    renderCardUsingTemplate(currentIndex);
    updateCardCounter();
    rootElement.style.setProperty("--cardAngle", (3-random()*6)+"deg");
    checkButtons();
  }
}

