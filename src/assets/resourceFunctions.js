const { rootPath } = require("electron-root-path");
import { currentAssetsList, removeAsset } from "../assets/assetLoader.js";
import { currentCollectionUID } from "../collection/collectionManager.js";


export function setupResources() {
    while (ressItemsDiv.firstChild) {
      ressItemsDiv.removeChild(ressItemsDiv.lastChild);
    }
  
    if (currentAssetsList.length > 0) {

      currentAssetsList.forEach((item, itemIndex) => {
        createNewResource(item, itemIndex);
      });
    } else {
      var noResourceText = document.createElement("div");
      noResourceText.classList.add("noStuffDiv");
      noResourceText.innerHTML = "Aucune Ressource dans votre Collection<br><br><br><br>Cliquez sur le bouton en bas pour en ajouter une";
  
      ressItemsDiv.appendChild(noResourceText);
    }
  }
  
  export function createNewResource(item, itemIndex) {
    var itemAccordion = document.createElement("div");

    itemAccordion.id = itemIndex;
    itemAccordion.classList.add("assetContainer");
  
    let file = item.split("//")[1];
    let fileName = file.split(".")[0];
    let extension = file.split(".")[1];
  
    itemAccordion.innerHTML = "<img src='"+rootPath+"/collections/"+currentCollectionUID+"/assets/"+file+"'>";
    
  
    var deleteResourceBtn = document.createElement("img");
    deleteResourceBtn.classList.add("deleteResourceBtn");
    deleteResourceBtn.src = "./assets/delete.png";
    deleteResourceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeAsset(currentAssetsList[itemAccordion.id]);
    });
    itemAccordion.appendChild(deleteResourceBtn);

    var uidTag = document.createElement("div");
    uidTag.classList.add("uidTagCorner");
    uidTag.innerHTML = fileName;
    uidTag.title = "Copier l'UID de la ressource"
    uidTag.addEventListener("click", () => {
      navigator.clipboard.writeText(fileName);
    });
    itemAccordion.appendChild(uidTag);
  
    ressItemsDiv.appendChild(itemAccordion);
  }