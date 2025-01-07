import { currentCollection, getCollections, setCurrentCollection } from "../collection/collectionManager.js";
import { checkOtherInputs, updateCardCounter } from "./editionScreen.js";
import { populateComponents } from "../template/componentsFunctions.js";

const bottomBar = document.querySelector(".bottomBar");

export const rootElement = document.querySelector(":root");
let currentPanel = "start";

homeBtn.addEventListener("click", () => {
  setCurrentCollection(-1);
  getCollections();

  if (currentPanel == "edition") {
    openPanel("loading");
  } else {
    openPanel("start");
  }
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

export function openPanel(panelName) {
  switch (panelName) {
    case "start":
      startPanelDiv.style.display = "flex";
      loadingPanelDiv.style.display = "none";
      editionPanelDiv.style.display = "none";
      bottomBarDiv.style.display = "none";
      mainTitleDiv.innerHTML = "LA CABANE À PROTOS";
      homeIcon.src = "./assets/home.png";

      break;

    case "loading":
      startPanelDiv.style.display = "none";
      loadingPanelDiv.style.display = "flex";
      editionPanelDiv.style.display = "none";
      bottomBarDiv.style.display = "none";
      mainTitleDiv.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";
      homeIcon.src = "./assets/home.png";
      break;

    case "edition":
      startPanelDiv.style.display = "none";
      loadingPanelDiv.style.display = "none";
      editionPanelDiv.style.display = "flex";
      bottomBarDiv.style.display = "flex";
      homeIcon.src = "./assets/loadCollectionBtn.png";

      //Go back to Config all the time
      let firstRadio = document.querySelector(".tabs input");
      firstRadio.checked = true;

      updateCardCounter();
      mainTitleDiv.innerHTML = currentCollection?.collectionInfo.collectionName;
      archiveCollectionBtn.innerHTML = currentCollection.collectionInfo.archived ? "DÉSARCHIVER<img src='./assets/archiveCollection.png'>" : "ARCHIVER<img src='./assets/archiveCollection.png'>";
      break;
  }

  currentPanel = panelName;
}
