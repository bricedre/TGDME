import { app } from "../app.js";
import { addNewElement, addNewImage, addNewShape, addNewText, archiveCollection, currentCollection, deleteCurrentCollection, duplicateCollection, saveCollection } from "../collection/collectionManager.js";
import { rootElement } from "./mainLayout.js";

import { renderCardUsingTemplate, triggerGeneration } from "../render.js";
import { addAsset, allSystemFonts, currentAssetsList, removeAsset } from "../assets/assetLoader.js";
import { setupComponents } from "../template/componentsFunctions.js";

//COLLECTION PARAMETERS

duplicateCollectionBtn.addEventListener("click", () => duplicateCollection());
archiveCollectionBtn.addEventListener("click", () => archiveCollection());
deleteCollectionBtn.addEventListener("click", () => deleteCurrentCollection());

renderCollectionBtn.addEventListener("click", () => triggerGeneration(app));

generateCollectionBtn.addEventListener("click", () => {
  saveCollection(false, true);
  generateCollectionBtn.style.animation = "0.5s beyblade";
});

generateCollectionBtn.addEventListener("animationend", () => {
  generateCollectionBtn.style.animation = "none";
});

bigPrevCardBtn.addEventListener("click", () => goToOtherCard(-10));
prevCardBtn.addEventListener("click", () => goToOtherCard(-1));
nextCardBtn.addEventListener("click", () => goToOtherCard(1));
bigNextCardBtn.addEventListener("click", () => goToOtherCard(10));

addImageComponentBtn.addEventListener("click", () => addNewImage());
addShapeComponentBtn.addEventListener("click", () => addNewShape());
addTextComponentBtn.addEventListener("click", () => addNewText());

addNewElementBtn.addEventListener("click", () => addNewElement());

newResourceInput.addEventListener("change", function (e) {
  if (e.target.files[0]) {
    addAsset(e.target.files[0]);
  }
});

/*        
GLOBAL
*/

export function updateCardCounter() {
  var currentIndex = app.currentIndex;

  //INDEX
  if (currentCollection.elements.length > 0) {
    cardCounterDivLabel.innerHTML =
      "Élément " +
      (currentIndex + 1) +
      " sur " +
      currentCollection.elements.length +
      " - " +
      currentCollection.elements[currentIndex].quantity +
      (currentCollection.elements[currentIndex].quantity > 1 ? " copies" : " copie");
  } else {
    cardCounterDivLabel.innerHTML = "PAS DE CARTE À AFFICHER";
  }

  if (app.currentIndex != 0) {
    prevCardBtn.disabled = false;
    bigPrevCardBtn.disabled = false;
  } else {
    prevCardBtn.disabled = true;
    bigPrevCardBtn.disabled = true;
  }

  if (currentCollection.elements.length > 0 && app.currentIndex != currentCollection.elements.length - 1) {
    nextCardBtn.disabled = false;
    bigNextCardBtn.disabled = false;
  } else {
    nextCardBtn.disabled = true;
    bigNextCardBtn.disabled = true;
  }
}

export function goToOtherCard(delta) {
  app.currentIndex = Math.min(Math.max(parseInt(app.currentIndex + delta), 0), currentCollection.elements.length - 1);
  renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
  updateCardCounter();
  rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
}

export function populateEditionFields() {
  collectionNameInput.value = currentCollection.collectionInfo.collectionName;
  mainTitleDiv.innerHTML = currentCollection?.collectionInfo.collectionName;
  elementFormatSelect.value = currentCollection.collectionInfo.elementFormat;
  elementWidthInput.value = currentCollection.collectionInfo.W;
  elementHeightInput.value = currentCollection.collectionInfo.H;
  visualGuideSelect.value = currentCollection.collectionInfo.visualGuide;

  pageFormatSelect.value = currentCollection.collectionInfo.pageFormat;
  pageOrientationSelect.value = currentCollection.collectionInfo.pageOrientation;
  pageWidthInput.value = currentCollection.collectionInfo.pageWidth;
  pageHeightInput.value = currentCollection.collectionInfo.pageHeight;
  pageResolutionInput.value = currentCollection.collectionInfo.resolution;
  cuttingHelpInput.value = currentCollection.collectionInfo.cuttingHelp;
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

    case "pageFormat":
      if (eventTargetValue === "custom") {
        pageWidthInput.disabled = false;
        pageHeight.disabled = false;
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

/*        
ELEMENTS
*/

