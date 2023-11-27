import { generatePages } from "./render.js";
import { currentIndex } from "../app.js";
import { goToNextCard, goToPreviousCard } from "./interactions.js";

export const cardCounter = document.getElementById("pageCounter");
export const rootElement = document.querySelector(":root");

export const renderBtn = document.getElementById("renderBtn");

export const nextCardBtn = document.getElementById("nextCardBtn");
export const prevCardBtn = document.getElementById("prevCardBtn");

renderBtn.addEventListener("click", () => {
    generatePages();
})

nextCardBtn.addEventListener("click", () => {
  goToNextCard();
})

prevCardBtn.addEventListener("click", () => {
  goToPreviousCard();
})

export function updateCardCounter() {
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

export function checkButtons() {
  if (currentIndex != 0) prevCardBtn.disabled = false;
  else prevCardBtn.disabled = true;

  if (currentIndex != cards.length - 1) nextCardBtn.disabled = false;
  else nextCardBtn.disabled = true;
}
