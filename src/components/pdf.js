import { currentCollection } from "./collectionManager.js";

const { jsPDF } = require("jspdf");

let pageGeneration;

export function generatePDF(pages) {
  console.log("FN : Génération PDF")

  var coll = currentCollection.collectionInfo;
  var collectionName = coll.collectionName;

  pageGeneration = new jsPDF("p", "px", [coll.pageWidth*coll.resolution, coll.pageHeight*coll.resolution], true);
  pages.forEach((page, index) => {
    if (index != 0) pageGeneration.addPage();

    pageGeneration.addImage(page.canvas, "JPEG", 0, 0, coll.pageWidth*coll.resolution, coll.pageHeight*coll.resolution, "", "FAST");
  });
  
  pageGeneration.save(collectionName+".pdf");

}
