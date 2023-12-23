import { createNewCollection, collectionsAvailable, setCurrentCollection } from "../collectionManager.js";
import { openPanel } from "./mainLayout.js";

export function setupMenu() {
  
  tutorialBtn.addEventListener("click", () => window.open("https://www.youtube.com/watch?v=vODPa1l_9q8&list=PLk03fyx-610aRbuL8wsF-e9e5T8pKYDCJ", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'));
  
  newCollectionBtn.addEventListener("click", () => createNewCollection());
  
  loadCollectionBtn.addEventListener("click", () => {
    openPanel("loading");
    mainTitleDiv.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";

    while (loadingPanelDiv.firstChild) {
      loadingPanelDiv.removeChild(loadingPanelDiv.lastChild);
    }

    if(collectionsAvailable.length > 0){
      collectionsAvailable.forEach((collection) => {
        var btnElement = document.createElement("button");
        btnElement.classList.add("deckBtn");
        btnElement.innerHTML = collection.collectionInfo.collectionName;
        btnElement.addEventListener("click", () => {
          setCurrentCollection(collection.collectionInfo.UID);
        });
        
        loadingPanelDiv.appendChild(btnElement);
      });
    }
    else {
      loadingPanelDiv.style.display = "flex";
      var noResourceText = document.createElement("div");
      noResourceText.classList.add("noStuffDiv");
      noResourceText.innerHTML = "Aucune Collection dans votre Bibliothèque<br><br><br><br>Retournez sur la page d'accueil pour en créer une";
  
      loadingPanelDiv.appendChild(noResourceText);
    }

    
  });

}
