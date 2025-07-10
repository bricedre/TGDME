import { app } from "../app.js";
import {
  archiveCollection,
  currCollInfo,
  currentCollection,
  currentCollectionUID,
  deleteCurrentCollection,
  duplicateCollection,
  saveCollection,
} from "../core/collectionsManager.js";
import { generatePages, renderCardUsingTemplate } from "../core/render.js";
import { allSystemFonts, loadAssets } from "../core/assetsManager.js";
import { addNewImage, addNewShape, addNewText, addNewTitle, setupComponents } from "../core/componentsManager.js";
import { checkForFileUpdate, updateDataView } from "../core/elementsManager.js";
import { appDataFolder, currentProjectUID } from "../core/projectsManager.js";

const $ = require("jquery");

//GENERAL BUTTONS
$("#generateCollectionBtn")
  .on("click", () => {
    saveCollection(false, true);
    $("#generateCollectionBtn").css("animation", "0.5s beyblade");
  })
  .on("animationend", () => {
    $("#generateCollectionBtn").css("animation", "none");
  });

$("#startPrevCardBtn").on("click", () => goToOtherCard(-500));
$("#bigPrevCardBtn").on("click", () => goToOtherCard(-10));
$("#prevCardBtn").on("click", () => goToOtherCard(-1));
$("#nextCardBtn").on("click", () => goToOtherCard(1));
$("#bigNextCardBtn").on("click", () => goToOtherCard(10));
$("#endNextCardBtn").on("click", () => goToOtherCard(500));

//TABS BUTTONS
$("#duplicateCollectionBtn").on("click", () => duplicateCollection());
$("#unarchiveCollectionBtn").on("click", () => archiveCollection());
$("#archiveCollectionBtn").on("click", () => archiveCollection());
$("#deleteCollectionBtn").on("click", () => {
  if (confirm("Attention, cette action est irréversible !\nSupprimer ?")) deleteCurrentCollection();
});

$("#openResFolderBtn").on("click", () => openLocation(`${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/assets`));
$("#reloadResBtn").on("click", () => {
  loadAssets(app);
  generateCollectionBtn.click();
});

$("#addImageComponentBtn").on("click", () => addNewImage());
$("#addShapeComponentBtn").on("click", () => addNewShape());
$("#addTextComponentBtn").on("click", () => addNewText());
$("#addTitleComponentBtn").on("click", () => addNewTitle());

$("#modifyDataBtn").on("click", () => openLocation(`${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/data.xlsx`));
$("#updateDataBtn").on("click", () => {
  checkForFileUpdate();
  updateDataView();
});

$("#printPagesBtn").on("click", () => generatePages());
$("#showRendersBtn").on("click", () => openLocation(`${appDataFolder}/projects/${currentProjectUID}/renders`));

$("#turnCanvasBtn").on("click", () => turnCanvas());
$("#scaleUpCanvasBtn").on("click", () => scaleCanvas(1));
$("#scaleDownCanvasBtn").on("click", () => scaleCanvas(-1));

/*        
GLOBAL
*/

let canvasRotation = 0;
let canvasScale = 1;

export function updateElementsCounter() {
  var currentIndex = app.currentIndex;

  //INDEX
  if (currentCollection.elements.data.length > 0) {
    cardCounterDivLabel.innerHTML = `Élément ${currentIndex + 1} sur ${currentCollection.elements.data.length}`;
  } else {
    cardCounterDivLabel.innerHTML = "PAS DE CARTE À AFFICHER";
  }

  if (app.currentIndex != 0) {
    prevCardBtn.disabled = false;
    bigPrevCardBtn.disabled = false;
    startPrevCardBtn.disabled = false;
  } else {
    prevCardBtn.disabled = true;
    bigPrevCardBtn.disabled = true;
    startPrevCardBtn.disabled = true;
  }

  if (currentCollection.elements.data.length > 0 && app.currentIndex != currentCollection.elements.data.length - 1) {
    nextCardBtn.disabled = false;
    bigNextCardBtn.disabled = false;
    endNextCardBtn.disabled = false;
  } else {
    nextCardBtn.disabled = true;
    bigNextCardBtn.disabled = true;
    endNextCardBtn.disabled = true;
  }
}

export function goToOtherCard(value) {
  app.currentIndex = Math.min(Math.max(parseInt(app.currentIndex + value), 0), currentCollection.elements.data.length - 1);
  renderCardUsingTemplate(app, app.currentIndex, currCollInfo.visualGuide);
  updateElementsCounter();
  updateDataView();
}

export function populateEditionFields() {
  collectionNameInput.value = currCollInfo.collectionName;
  elementFormatSelect.value = currCollInfo.elementFormat;
  elementWidthInput.value = currCollInfo.W;
  elementHeightInput.value = currCollInfo.H;
  visualGuideSelect.value = currCollInfo.visualGuide;

  pageExportFormatSelect.value = currCollInfo.pageExportFormat;
  maxElementQty.value = currCollInfo.maxElementQty;
  pageFormatSelect.value = currCollInfo.pageFormat;
  pageOrientationSelect.value = currCollInfo.pageOrientation;
  pageWidthInput.value = currCollInfo.pageWidth;
  pageHeightInput.value = currCollInfo.pageHeight;
  pageResolutionInput.value = currCollInfo.resolution;
  cuttingHelpInput.checked = currCollInfo.cuttingHelp;
}

export function checkOtherInputs(eventTargetId, eventTargetValue) {
  switch (eventTargetId) {
    case "elementFormatSelect":
      if (eventTargetValue === "custom") {
        elementHeightInput.disabled = false;
        elementWidthInput.disabled = false;
        populateEditionFields();
      } else {
        elementHeightInput.disabled = true;
        elementWidthInput.disabled = true;
      }
      break;

    case "pageFormatSelect":
      if (eventTargetValue === "custom") {
        pageWidthInput.disabled = false;
        pageHeightInput.disabled = false;
        pageOrientationSelect.disabled = true;
        populateEditionFields();
      } else {
        pageWidthInput.disabled = true;
        pageHeightInput.disabled = true;
        pageOrientationSelect.disabled = false;
      }
      break;
  }
}

export function moveComponent(currentIndex, delta) {
  var allAccordions = templateItemsDiv.querySelectorAll(".accordion");

  var destinationIndex = currentIndex + delta;
  var currentElement = { ...currentCollection.template[currentIndex] };
  var destinationElement = { ...currentCollection.template[destinationIndex] };

  currentCollection.template[destinationIndex] = currentElement;
  currentCollection.template[currentIndex] = destinationElement;

  allAccordions[currentIndex].style.translate = "0 " + 145 * delta + "%";
  allAccordions[destinationIndex].style.translate = "0 " + 145 * -delta + "%";

  setTimeout(() => {
    setupComponents();
    generateCollectionBtn.click();
  }, 200);
}

export function openLocation(folder) {
  const filePath = `${folder}`;

  // Open the folder
  require("child_process").exec(`start "" "${filePath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Le dossier n'a pas pu être trouvé :", err);
      return;
    }
  });
}

function turnCanvas() {
  canvasRotation = canvasRotation + 90;
  $("#canvasDiv main").css("rotate", canvasRotation + "deg");
}

function scaleCanvas(sign) {
  canvasScale = canvasScale + 0.1 * sign;
  $("#canvasDiv main").css("scale", canvasScale);
}
