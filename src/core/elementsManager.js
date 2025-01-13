import { app } from "../app.js";
import { currentCollection, saveCollection } from "./collectionsManager.js";
import { updateElementsCounter } from "../screens/editionScreen.js";

const $ = require("jquery");
const XLSX = require("xlsx");
const { exec } = require("child_process");

export function updateDataView() {
  const elementItemsDiv = $("#elementItemsDiv");
  elementItemsDiv.empty();

  if (currentCollection.elements.headers.length > 0) {
    currentCollection.elements.headers.forEach((header, index) => {
      elementItemsDiv.append($("<p></p>").text(`${header} : ${currentCollection.elements.data[app.currentIndex][index]}`));
    });
  } else {
    elementItemsDiv.append($("<p></p>").text("Aucune donnée disponible").addClass("noStuffDiv"));
  }

  updateElementsCounter();
}

export function openExcelFile() {
  const filePath = `collections/${currentCollection.collectionInfo.UID}/data.xlsx`;

  // Open the file with the default Excel application
  exec(`start "" "${filePath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Le fichier n'a pas pu être trouvé :", err);
      return;
    }
  });
}

export function checkForFileUpdate() {
  const filePath = `collections/${currentCollection.collectionInfo.UID}/data.xlsx`;

  // Here we simulate the manual file check. Since JavaScript in the browser can't access the local file system,
  // this code will only work if the file path is accessible through a proper API (e.g., in a Node.js environment).
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Le fichier n'a pas pu être trouvé.");
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      // Process the file once it is fetched
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (sheetData.length > 0) {
        const headers = sheetData[0];
        const data = sheetData.slice(1);

        // Update currentCollection with the new data
        currentCollection.elements.headers = headers;
        currentCollection.elements.data = data;

        updateDataView();
        generateCollectionBtn.click(); //Saving mods to colelction
      } else {
        currentCollection.elements = {
          headers: [],
          data: [],
        };
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Le fichier n'a pas pu être trouvé.");
    });
}
