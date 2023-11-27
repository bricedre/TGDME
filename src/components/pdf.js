import { deckName } from "./deck/deckInfo.js";

const { jsPDF } = require("jspdf");

let pageGeneration;

export function generatePDF(pages) {
  pageGeneration = new jsPDF("p", "mm", "a4", true);
  pages.forEach((page, index) => {
    if (index != 0) pageGeneration.addPage();
    
    pageGeneration.addImage(page.canvas, "JPEG", 0, 0, 210, 297, "", "FAST");
  });
  
  pageGeneration.save(deckName+".pdf");
  pageGeneration.output('datauri');

}
