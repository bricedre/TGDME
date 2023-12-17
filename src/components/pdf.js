import { currentCollection } from "./collectionManager.js";

const { jsPDF } = require("jspdf");

let pageGeneration;

export function generatePDF(pages) {

  var coll = currentCollection.collectionInfo;
  var deckName = coll.deckName;

  pageGeneration = new jsPDF("p", "px", [coll.pageWidth*coll.resolution, coll.pageHeight*coll.resolution], true);
  pages.forEach((page, index) => {
    if (index != 0) pageGeneration.addPage();

    pageGeneration.addImage(page.canvas, "JPEG", 0, 0, coll.pageWidth*coll.resolution, coll.pageHeight*coll.resolution, "", "FAST");
  });
  
  pageGeneration.save(deckName+".pdf");

}
