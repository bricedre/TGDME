import { deckName } from "./deck/deckInfo.js";

const { jsPDF } = require("jspdf");

let pageGeneration;

export function generatePDF(pages) {
  pageGeneration = new jsPDF({
    compress : true
  });
  pages.forEach((page, index) => {
    if (index != 0) pageGeneration.addPage();
    
    pageGeneration.addImage(page.canvas, "webp", 0, 0, 210, 297);
  });
  
  pageGeneration.save(deckName+".pdf");

}
