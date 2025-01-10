import { app } from "../app.js";
import { currentCollection, saveCollection } from "../collection/collectionManager.js";
import { ELEMENT_parameters } from "../template/componentParameters.js";
import { updateCardCounter } from "../screens/editionScreen.js";

const $ = require("jquery");
const XLSX = require("xlsx");
const { exec } = require("child_process");


export function setupElements() {
  const $contentElementsDiv = $("#contentElementsDiv");

  // Suppression du contenu existant
  $contentElementsDiv.empty();
  updateCardCounter();

  // Table principale
  const $dataTable = $("<table></table>").addClass("dataTable");

  // Légende de la table
  const $tableCaption = $("<caption></caption>").text(
    `${currentCollection.elements.data.length} entrée${currentCollection.elements.data.length > 1 ? "s" : ""} dans les données`
  );
  $dataTable.append($tableCaption);

  // Création de l'en-tête
  const $headersRow = $("<thead><tr></tr></thead>");
  const $addValueBtn = $("<th></th>")
    .addClass("sticky-header addValueBtn actionsCell")
    .text("AJOUTER VALEUR")
    .on("click", addNewValue);
  $headersRow.find("tr").append($addValueBtn);

  currentCollection.elements.headers.forEach((header, index) => {
    const $headerCell = $("<th></th>")
      .addClass("sticky-header")
      .attr("contenteditable", "true")
      .text(header)
      .on("input", (e) => {
        currentCollection.elements.headers[index] = $(e.target).text();
      });
    $headersRow.find("tr").append($headerCell);
  });

  $dataTable.append($headersRow);

  // Ajout des lignes de données
  const $tableBody = $("<tbody></tbody>");
  currentCollection.elements.data.forEach((row, rowIndex) => {
    const $row = $("<tr></tr>");

    const $actionsCell = $("<td></td>").addClass("sticky-col actionsCell");
    if (rowIndex > 0) {
      $actionsCell.append(
        $("<img>")
          .addClass("upElementBtn")
          .attr("src", "./assets/moveUp.png")
          .on("click", () => moveEntry(rowIndex, -1))
      );
    }
    if (rowIndex < currentCollection.elements.data.length - 1) {
      $actionsCell.append(
        $("<img>")
          .addClass("downElementBtn")
          .attr("src", "./assets/moveDown.png")
          .on("click", () => moveEntry(rowIndex, 1))
      );
    }
    $actionsCell.append(
      $("<img>")
        .addClass("duplicateElementBtn")
        .attr("src", "./assets/qty.png")
        .on("click", () => duplicateEntry(rowIndex)),
      $("<img>")
        .addClass("deleteComponentBtn")
        .attr("src", "./assets/delete.png")
        .on("click", () => deleteEntry(rowIndex))
    );

    $row.append($actionsCell);

    row.forEach((cell, cellIndex) => {
      const $cell = $("<td></td>")
        .attr("contenteditable", "true")
        .text(cell?cell:"")
        .on("input", (e) => {
          currentCollection.elements.data[rowIndex][cellIndex] = $(e.target).text();
        });
      $row.append($cell);
    });

    $tableBody.append($row);
  });

  $dataTable.append($tableBody);

  // Ligne pour ajouter une nouvelle entrée ou supprimer des colonnes
  const $addRow = $("<tfoot><tr></tr></tfoot>");
  const $addEntryBtn = $("<td></td>")
    .addClass("sticky-col addEntryBtn actionsCell")
    .text("AJOUTER NOUVELLE ENTRÉE")
    .on("click", addNewEntry);
  $addRow.find("tr").append($addEntryBtn);

  currentCollection.elements.headers.forEach((_, colIndex) => {
    const $deleteValueCell = $("<td></td>").addClass("void deleteCell");
    $deleteValueCell.append(
      $("<img>")
        .addClass("deleteComponentBtn")
        .attr("src", "./assets/delete.png")
        .on("click", () => deleteValue(colIndex))
    );
    $addRow.find("tr").append($deleteValueCell);
  });

  $dataTable.append($addRow);
  $contentElementsDiv.append($dataTable);

  // Boutons d'export/import
  const $actionButtons = $("<div></div>").addClass("actionButtons");
  $actionButtons.append(
    $("<button></button>").text("AJOUTER NOUVELLE ENTRÉE").on("click", addNewEntry),
    $("<button></button>").text("AJOUTER VALEUR").on("click", addNewValue),
    $("<button></button>").text("Ouvrir les données sous Excel").on("click", openExcelFile),
    $("<button></button>").text("Mettre à jour depuis Excel").on("click", checkForFileUpdate)
  );

  // Ajout de tout au conteneur principal
  $contentElementsDiv.append($actionButtons);
}

function addNewEntry() {
  const nextEntryIndex = currentCollection.elements.data.length;
  currentCollection.elements.data.push([]);
  currentCollection.elements.headers.forEach(() => {
    currentCollection.elements.data[nextEntryIndex].push("");
  });
  setupElements();
}

function addNewValue() {
  const nextValueIndex = currentCollection.elements.headers.length;
  currentCollection.elements.headers.push("valeur");
  currentCollection.elements.data.forEach((dataSet) => {
    dataSet[nextValueIndex] = "";
  });
  setupElements();
}

function deleteEntry(index) {
  currentCollection.elements.data.splice(index, 1);
  setupElements();
}

function deleteValue(index) {
  currentCollection.elements.headers.splice(index, 1);
  currentCollection.elements.data.forEach((dataSet) => {
    dataSet.splice(index, 1);
  });
  setupElements();
}

function duplicateEntry(index) {
  const duplicatedEntry = [...currentCollection.elements.data[index]];
  currentCollection.elements.data.splice(index, 0, duplicatedEntry);
  setupElements();
}

function moveEntry(index, dep) {
  const entryA = [...currentCollection.elements.data[index]];
  const entryB = [...currentCollection.elements.data[index + dep]];
  currentCollection.elements.data[index] = entryB;
  currentCollection.elements.data[index + dep] = entryA;
  setupElements();
}


function openExcelFile() {

  const filePath = `collections/${currentCollection.collectionInfo.UID}/data.xlsx`;

  // Open the file with the default Excel application
  exec(`start "" "${filePath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Error opening Excel file:", err);
      return;
    }
  });
}

function checkForFileUpdate() {
  const filePath = `collections/${currentCollection.collectionInfo.UID}/data.xlsx`;

  // Here we simulate the manual file check. Since JavaScript in the browser can't access the local file system,
  // this code will only work if the file path is accessible through a proper API (e.g., in a Node.js environment).
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error("File not found or can't be accessed.");
      }
      return response.arrayBuffer(); // Read the file as an ArrayBuffer
    })
    .then(arrayBuffer => {
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
        // currentCollection.elements.data.pop();

        setupElements(); // Refresh the table with the new data
        generateCollectionBtn.click();
      }
    })
    .catch(error => {
      console.error(error);
      alert("Failed to fetch the file or file not found.");
    });
}

