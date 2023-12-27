import { app } from "../../app.js";
import { collectionsAvailable, currentCollection, currentCollectionUID, getCollections, setCurrentCollection } from "../collectionManager.js";
import { checkOtherInputs, updateCardCounter, populateComponents } from "./editionScreen.js";

const bottomBar = document.querySelector(".bottomBar");

export const rootElement = document.querySelector(":root");

homeBtn.addEventListener("click", () => {
  setCurrentCollection(-1);
  getCollections();
  openPanel("start");
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    generateCollectionBtn.click();
  } else if (event.key === "F1") {
    document.getElementById("tabConfigInput").checked = true;
  } else if (event.key === "F2") {
    document.getElementById("tabRessInput").checked = true;
  } else if (event.key === "F3") {
    document.getElementById("tabTemplateInput").checked = true;
  } else if (event.key === "F4") {
    document.getElementById("tabElementsInput").checked = true;
  } else if (event.key === "F5") {
    document.getElementById("tabPrintingInput").checked = true;
  }
});

const allInputs = document.querySelectorAll('input:not([type="radio"])');
const allSelects = document.querySelectorAll("select");

allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    populateComponents();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    generateCollectionBtn.click();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

export function setUI() {
  //MENU
  if (currentCollectionUID == -1) {
    mainTitleDiv.innerHTML = "LA CABANE À PROTOS";
    tutorialBtn.style.display = "flex";
    newCollectionBtn.style.display = "flex";
    loadCollectionBtn.style.display = "flex";

    generateCollectionBtn.style.display = "none";
    renderCollectionBtn.style.display = "none";
    deleteCollectionBtn.style.display = "none";
    duplicateCollectionBtn.style.display = "none";
    archiveCollectionBtn.style.display = "none";
    addTextComponentBtn.style.display = "none";
    addShapeComponentBtn.style.display = "none";
    addImageComponentBtn.style.display = "none";
    addNewElementBtn.style.display = "none";
    checkAllBtn.style.display = "none";
    wizardFillBtn.style.display = "none";
    renderCollectionBtn.style.display = "none";
    cardCounterDiv.style.display = "none";
    canvasDiv.style.display = "none";
    bottomBar.style.display = "none";
  }

  //EDITION
  else {
    mainTitleDiv.innerHTML = currentCollection?.collectionInfo.collectionName;
    homeBtn.style.display = "flex";
    generateCollectionBtn.style.display = "flex";
    renderCollectionBtn.style.display = "flex";
    deleteCollectionBtn.style.display = "flex";
    duplicateCollectionBtn.style.display = "flex";
    archiveCollectionBtn.style.display = "flex";
    archiveCollectionBtn.innerHTML = currentCollection.collectionInfo.archived
      ? "DÉSARCHIVER LA COLLECTION<img src='./assets/archiveCollection.png'>"
      : "ARCHIVER LA COLLECTION<img src='./assets/archiveCollection.png'>";
    addTextComponentBtn.style.display = "flex";
    addShapeComponentBtn.style.display = "flex";
    addImageComponentBtn.style.display = "flex";
    addNewElementBtn.style.display = "flex";
    wizardFillBtn.style.display = "flex";
    checkAllBtn.style.display = "flex";
    cardCounterDiv.style.display = "flex";
    bottomBar.style.display = "flex";
    canvasDiv.style.display = "flex";

    tutorialBtn.style.display = "none";
    newCollectionBtn.style.display = "none";
    loadCollectionBtn.style.display = "none";

    updateCardCounter(app.currentIndex);
  }
}

export function openPanel(panelName) {
  switch (panelName) {
    case "start":
      loadingPanelDiv.style.display = "none";
      editionPanelDiv.style.display = "none";
      startPanelDiv.style.display = "flex";
      setUI();
      break;

    case "loading":
      getCollections();

      setTimeout(() => {
        mainTitleDiv.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";

        while (activeCollectionsDiv.firstChild) {
          activeCollectionsDiv.removeChild(activeCollectionsDiv.lastChild);
        }

        while (archivedCollectionsDiv.firstChild) {
          archivedCollectionsDiv.removeChild(archivedCollectionsDiv.lastChild);
        }

        if (collectionsAvailable.length > 0) {
          collectionsAvailable.forEach((collection) => {
            var btnElement = document.createElement("button");
            btnElement.classList.add("deckBtn");
            btnElement.innerHTML = collection.collectionInfo.collectionName;
            btnElement.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentCollection(collection.collectionInfo.UID);
            });

            if (!collection.collectionInfo.archived) activeCollectionsDiv.appendChild(btnElement);
            else archivedCollectionsDiv.appendChild(btnElement);
          });
        } else {
          loadingPanelDiv.style.display = "flex";
          var noResourceText = document.createElement("div");
          noResourceText.classList.add("noStuffDiv");
          noResourceText.innerHTML = "Aucune Collection dans votre Bibliothèque<br><br><br><br>Retournez sur la page d'accueil pour en créer une";

          loadingPanelDiv.appendChild(noResourceText);
        }

        startPanelDiv.style.display = "none";
        editionPanelDiv.style.display = "none";
        loadingPanelDiv.style.display = "block";

        setUI();
      }, 500);
      
      break;

    case "edition":
      editionPanelDiv.style.display = "flex";
      loadingPanelDiv.style.display = "none";
      startPanelDiv.style.display = "none";
      setUI();
      break;
  }
}
