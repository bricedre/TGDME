import { renderCardUsingTemplate, triggerGeneration } from "./render.js";
import { cards } from "./deck/cards.js";
import { app } from "../app.js";

export const cardCounter = document.getElementById("pageCounter");
export const rootElement = document.querySelector(":root");

export const renderBtn = document.getElementById("renderBtn");

export const nextCardBtn = document.getElementById("nextCardBtn");
export const prevCardBtn = document.getElementById("prevCardBtn");

renderBtn.addEventListener("click", () => {
    triggerGeneration(app);
})

nextCardBtn.addEventListener("click", () => {
  goToNextCard(app.currentIndex);
})

prevCardBtn.addEventListener("click", () => {
  goToPreviousCard(app.currentIndex);
})

export function updateCardCounter(currentIndex) {
  //INDEX
  if (cards.length > 0) {
    cardCounter.innerHTML =
      "Card #" +
      (currentIndex + 1) +
      " of " +
      cards.length +
      " cards - " +
      (cards[currentIndex].quantity
        ? cards[currentIndex].quantity + " copies"
        : "1 copy");
  } else cardCounter.innerHTML = "NO CARD TO RENDER";
}

export function checkButtons(currentIndex) {
  if (currentIndex != 0) prevCardBtn.disabled = false;
  else prevCardBtn.disabled = true;

  if (currentIndex != cards.length - 1) nextCardBtn.disabled = false;
  else nextCardBtn.disabled = true;
}

export function keyPressed(p) {
  if (p.keyCode === p.LEFT_ARROW) {
    goToPreviousCard();
  } else if (p.keyCode === p.RIGHT_ARROW){
    goToNextCard();
  }
}

export function goToPreviousCard(currentIndex){
  if(currentIndex > 0) {
    app.currentIndex--;
    renderCardUsingTemplate(app, app.currentIndex);
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", (3-app.random()*6)+"deg");
    checkButtons(app.currentIndex);
  }
}

export function goToNextCard(currentIndex){
  if(currentIndex < cards.length - 1) {
    app.currentIndex++;
    renderCardUsingTemplate(app, app.currentIndex);
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", (3-app.random()*6)+"deg");
    checkButtons(app.currentIndex);
  }
}
