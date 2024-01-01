import { currentAssetsList, removeAsset } from "../assets/assetLoader.js";


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
    var itemAccordion = document.createElement("button");
    var emptyDiv = document.createElement("div");
    itemAccordion.id = itemIndex;
    itemAccordion.classList.add("accordion");
  
    let file = item.split("//")[1];
    let fileName = file.split(".")[0];
    let extension = file.split(".")[1];
  
    itemAccordion.innerHTML = "<img src='assets/imgResource.png'><span class='itemLabel'>" + fileName + "</span><span class='uidTag' title=\"Cliquez pour copier l'UID de la ressource\">(#"+itemIndex+")<span>";
    itemAccordion.addEventListener("click", () => {
      navigator.clipboard.writeText(fileName);
    });
  
    var deleteResourceBtn = document.createElement("img");
    deleteResourceBtn.classList.add("deleteResourceBtn");
    deleteResourceBtn.src = "./assets/delete.png";
    deleteResourceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeAsset(currentAssetsList[itemAccordion.id]);
    });
    itemAccordion.appendChild(deleteResourceBtn);
  
    ressItemsDiv.appendChild(itemAccordion);
    ressItemsDiv.appendChild(emptyDiv);
  }