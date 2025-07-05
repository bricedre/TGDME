import { app } from "../app.js";
import { appDataFolder, currentCollection, currentCollectionUID, currentProjectUID, saveCollection } from "./collectionsManager.js";
import { updateElementsCounter } from "../screens/editionScreen.js";


const $ = require("jquery");
const XLSX = require("xlsx");
const { exec } = require("child_process");

export function checkForFileUpdate() {
  const filePath = `${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/data.xlsx`;

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

        //Cleaning trailing empty data
        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i].length == 0) {
            data.pop();
          } else {
            break;
          }
        }

        //Cleaning data without a header
        data.forEach((data) => {
          while (data.length > headers.length) {
            data.pop();
          }
        });

        // Update currentCollection with the new data
        currentCollection.elements.headers = headers;
        currentCollection.elements.data = data;

        updateDataView();
        generateCollectionBtn.click(); //Saving mods to collection
      } else {
        currentCollection.elements = {
          headers: [],
          data: [],
        };
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Le fichier n'a pas pu être chargé.");
    });
}

export function updateDataView() {
  const elementItemsDiv = $("#elementItemsDiv");
  elementItemsDiv.empty();

  //Has data to show
  if (currentCollection.elements.headers.length > 0) {
    let dataTable = $(`<table class="dataTable"></table>`);
    dataTable.append($("<thead><tr><th>CLÉ</th><th>VALEUR</th><th>APERÇU</th></tr></thead>"));
    let dataTableBody = $("<tbody></tbody>");
    dataTableBody.css("background", "#ffffff")

    currentCollection.elements.headers.forEach((header, index) => {
      let newRow = $("<tr></tr>");
      newRow.append($("<td></td>").text(header));

      let valueToShow = currentCollection.elements.data[app.currentIndex][index];

      newRow.append($("<td></td>").text(valueToShow));

      if (valueToShow) {
        if (valueToShow.toString().charAt(0) == "#") {
          // newRow.append($("<td></td>")
          let colorPreview = $("<div></div>").css("background", valueToShow).css("border-radius", "50%").css("width", "3rem").css("height", "3rem").css("border", "3px solid #0006").css("margin", "0 auto");
          let td = $("<td></td>");
          td.append(colorPreview);
          newRow.append(td);
        } else if ([".png", ".jpg"].includes(valueToShow.toString().substring(valueToShow.length - 4))) {
          let imgUrl = `${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/assets/${valueToShow}`;
          imgUrl = imgUrl.replaceAll("\\", "/");
          newRow.append($("<td></td>").css("background-image", 'url("'+imgUrl+'")'));
        } else {
          newRow.append($("<td></td>"));
        }
      } else {
        newRow.append($("<td></td>"));
      }

      dataTableBody.append(newRow);
    });
    dataTable.append(dataTableBody);
    elementItemsDiv.append(dataTable);
  }

  // No data to show
  else {
    elementItemsDiv.append($("<p></p>").text("Aucune donnée disponible").addClass("noStuffDiv"));
  }

  updateElementsCounter();
}
