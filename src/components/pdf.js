import { currentCollection } from "./collectionManager.js";

const { jsPDF } = require("jspdf");

let pageGeneration;

export function generatePDF(pages) {

  var deckName = currentCollection.collectionInfo.deckName;

  pageGeneration = new jsPDF("p", "px", [currentCollection.collectionInfo.pageWidth*currentCollection.collectionInfo.resolution, currentCollection.collectionInfo.pageHeight*currentCollection.collectionInfo.resolution], true);
  pages.forEach((page, index) => {
    if (index != 0) pageGeneration.addPage();

    pageGeneration.addImage(page.canvas, "JPEG", 0, 0, currentCollection.collectionInfo.pageWidth*currentCollection.collectionInfo.resolution, currentCollection.collectionInfo.pageHeight*currentCollection.collectionInfo.resolution, "", "FAST");
  });
  
  pageGeneration.save(deckName+".pdf");

}
