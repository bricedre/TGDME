import { collectionsAvailable, createNewCollection, currentCollectionUID, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { currentPanel, lastPanel, openScene } from "./mainLayout.js";

const $ = require("jquery");
const { rootPath } = require("electron-root-path");

export function setupMenu() {
  $("#homeBtn").on("click", () => {
    // currentCollectionUID = -1;
    getCollections();
    openScene("start");
  });

  //HOMEPAGE QUICK ACCESS
  const loadCollectionsPanel = $("#loadCollectionsPanel");
  loadCollectionsPanel.empty();

  //Elements
  const panelImageContainer = $("<div></div>").addClass("imgContainer");
  const panelImage = $("<img>").attr("src", "./assets/newCollectionBtn.png");
  panelImageContainer.append(panelImage);
  const panelHeader = $("<div></div>").addClass("panelHeader");
  const panelHeaderTitle = $("<div></div>").text("COLLECTIONS D'ÉLÉMENTS");

  panelHeader.append(panelHeaderTitle);
  loadCollectionsPanel.append(panelImageContainer, panelHeader);

  let collectionsSorted = [...collectionsAvailable].sort((a, b) => {
    return b.collectionInfo.lastSavingTime - a.collectionInfo.lastSavingTime;
  });

  collectionsSorted.forEach((collection, index) => {
    if (index < 4) {
      const btnElement = $("<button></button>")
        .addClass("homePageBtn")
        .text(collection.collectionInfo.collectionName)
        .on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentCollection(collection.collectionInfo.UID);
        });

      loadCollectionsPanel.append(btnElement);
    }
  });
  const actionRow = $("<div></div>").addClass("btnContainer");
  const newCollectionBtn = $("<button></button>")
    .addClass("navBtn")
    .text("CRÉER NOUVELLE COLLECTION")
    .on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      createNewCollection();
    });
  const seeAllCollections = $("<button></button>")
    .addClass("navBtn")
    .text("TOUT VOIR")
    .on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openScene("loading");
    });
  actionRow.append(newCollectionBtn, seeAllCollections);
  loadCollectionsPanel.append(actionRow);

  //LOADING PAGE ACCESS
  loadingPanelDiv.innerHTML = "";

  // Collections to show
  if (collectionsSorted.length > 0) {
    var activeCollections = [...collectionsSorted].filter((col) => !col.collectionInfo.archived);
    var archivedCollections = [...collectionsSorted].filter((col) => col.collectionInfo.archived);

    if (activeCollections.length > 0) {
      var activeCol = document.createElement("div");
      activeCol.id = "activeCollectionsDiv";
      loadingPanelDiv.appendChild(activeCol);

      activeCollections.forEach((collection) => {
        var btnElement = document.createElement("button");
        btnElement.classList.add("deckBtn");
        btnElement.innerHTML = collection.collectionInfo.collectionName;
        btnElement.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentCollection(collection.collectionInfo.UID);
        });

        activeCol.appendChild(btnElement);
      });
    }

    if (archivedCollections.length > 0) {
      var archivedColContainer = document.createElement("div");
      archivedColContainer.id = "archivedCollectionsContainer";
      archivedColContainer.addEventListener("click", () => {
        if (archivedColContainer.classList.contains("active")) {
          archivedColContainer.style.maxHeight = "3.2rem";
        } else {
          archivedColContainer.style.maxHeight = "calc(2rem + " + archivedColContainer.scrollHeight + "px)";
        }

        archivedColContainer.classList.toggle("active");
      });
      archivedColContainer.innerHTML = "<img src='" + rootPath + "/assets/archiveCollection.png'> Collections Archivées";
      loadingPanelDiv.appendChild(archivedColContainer);

      var archivedCol = document.createElement("div");
      archivedCol.id = "archivedCollectionsDiv";
      archivedColContainer.appendChild(archivedCol);

      archivedCollections.forEach((collection) => {
        var btnElement = document.createElement("button");
        btnElement.classList.add("deckBtn");
        btnElement.innerHTML = collection.collectionInfo.collectionName;
        btnElement.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentCollection(collection.collectionInfo.UID);
        });

        archivedCol.appendChild(btnElement);
      });
    }
  }

  //No Collections to show
  else {
    var noResourceText = document.createElement("div");
    noResourceText.classList.add("noStuffDiv");
    noResourceText.innerHTML = "Aucune Collection dans votre Bibliothèque<br><br><br><br>Retournez sur la page d'accueil pour en créer une";

    loadingPanelDiv.appendChild(noResourceText);
  }

  // tutorialBtn.addEventListener("click", () => {
  //   window.open(`https://www.youtube.com/watch?v=vODPa1l_9q8&list=PLk03fyx-610aRbuL8wsF-e9e5T8pKYDCJ`);
  // });

  // newCollectionBtn.addEventListener("click", () => createNewCollection());

  // loadCollectionsBtn.addEventListener("click", () => openScene("loading"));
}
