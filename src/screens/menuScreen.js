import { collectionsAvailable, createNewCollection, currentCollectionUID, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { currentPanel, openScene } from "./mainLayout.js";

const { rootPath } = require("electron-root-path");
const $ = require("jquery");

export function setupMenu() {
  $("#homeBtn").on("click", () => {
    getCollections();
    openScene("home");
  });

  let collectionsSorted = [...collectionsAvailable].sort((a, b) => {
    return a.collectionInfo.collectionName - b.collectionInfo.collectionName;
  });

  $("#startPanelDiv").empty();

  // Collections to show
  if (collectionsSorted.length > 0) {
    var activeCollections = [...collectionsSorted].filter((col) => !col.collectionInfo.archived);
    var archivedCollections = [...collectionsSorted].filter((col) => col.collectionInfo.archived);

    if (activeCollections.length > 0) {
      var activeCol = $("<div></div>").attr("id", "activeCollectionsDiv");

      activeCollections.forEach((collection) => {
        var btnElement = $("<button></button>").addClass("deckBtn").text(collection.collectionInfo.collectionName).on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentCollection(collection.collectionInfo.UID);
        });

        activeCol.append(btnElement);
      });

      $("#startPanelDiv").append(activeCol);
    }

    if (archivedCollections.length > 0) {
      var archivedColContainer = $("<div></div>").attr("id", "archivedCollectionsContainer").on("click", () => {
        if (archivedColContainer.hasClass("active")) {
          archivedColContainer.css("max-height", "3.2rem");
        } else {
          archivedColContainer.css("max-height", `calc(2rem + ${archivedColContainer.css("scroll-height")}px)`);
        }

        archivedColContainer.toggleClass("active");
      });
      // archivedColContainer.text((<img src="${rootPath}/assets/archiveCollection.png"> Collections Archivées`);
      $("#startPanelDiv").append(archivedColContainer);

      var archivedCol = $("<div></div>").attr('id', "archivedCollectionsDiv");
      archivedColContainer.append(archivedCol);

      archivedCollections.forEach((collection) => {
        var btnElement = $("<button></button>").addClass("deckBtn").text(collection.collectionInfo.collectionName).on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentCollection(collection.collectionInfo.UID);
        });

        archivedCol.append(btnElement);
      });

    }
  }

  //No Collections to show
  else {
    var noResourceText = $("<div></div>").addClass("noStuffDiv");
    noResourceText.text("Aucune Collection dans votre Bibliothèque");

    startPanelDiv.append(noResourceText);
  }

  //ACTIONS
  const actionRow = $("<div></div>").addClass("btnContainer");
  const newCollectionBtn = $("<button></button>")
    .addClass("navBtn")
    .text("CRÉER UN NOUVEAU PROTO")
    .on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      createNewCollection();
    });
  actionRow.append(newCollectionBtn);
  $("#startPanelDiv").append(actionRow);
}
