import { currentDeck } from "./globalStuff.js";

const { jsPDF } = require("jspdf");

let pageGeneration;

export function generatePDF(pages) {

  var deckName = currentDeck.deckInfo.deckName;

  pageGeneration = new jsPDF("p", "px", [currentDeck.deckInfo.pageWidth*currentDeck.deckInfo.resolution, currentDeck.deckInfo.pageHeight*currentDeck.deckInfo.resolution], true);
  pages.forEach((page, index) => {
    if (index != 0) pageGeneration.addPage();

    pageGeneration.addImage(page.canvas, "JPEG", 0, 0, currentDeck.deckInfo.pageWidth*currentDeck.deckInfo.resolution, currentDeck.deckInfo.pageHeight*currentDeck.deckInfo.resolution, "", "FAST");
  });
  
  pageGeneration.save(deckName+".pdf");

}
