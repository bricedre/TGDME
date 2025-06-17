import { collectionsAvailable, createNewCollection, currentCollectionUID, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { changeLangage, openScene, setupLangage } from "./mainLayout.js";

const $ = require("jquery");

$("#homeBtn").on("click", () => {
  getCollections();
  openScene("home");
});

$("#langBtn").on("click", () => {
  changeLangage();
});

export function setupMenu() {

  let collectionsSorted = [...collectionsAvailable].sort((a, b) => {
    return b.collectionInfo.lastSavingTime - a.collectionInfo.lastSavingTime;
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
          archivedColContainer.css("max-height", "4rem");
        } else {
          archivedColContainer.css("max-height", `calc(${4.5*Math.ceil(archivedCollections.length/5)}rem + 4rem)`);
        }

        archivedColContainer.toggleClass("active");
      });
      // archivedColContainer.css("display", "flex");
      let archivedCollectionsHeader = $("<div></div>").addClass("archivedCollectionsHeader");
      archivedCollectionsHeader.append($(`<img></img`).attr("src", `assets/btnIcons/archiveCollection.png`));
      archivedCollectionsHeader.append($("<span></span>").addClass("other_archivedCollections").text("Collections Archivées"));
      archivedColContainer.append(archivedCollectionsHeader);
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
    var noResourceText = $("<div></div>").addClass("noStuffDiv other_noProject");

    $("#startPanelDiv").append(noResourceText);
  }

  //Spacer
  $("#startPanelDiv").append($("<div></div>").css('flex', "1"));

  //ACTIONS
  const actionRow = $("<div></div>").addClass("btnContainer");
  const newCollectionBtn = $("<button></button>")
    .addClass("navBtn bigBtn btn_newProto")
    .on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      createNewCollection();
    });
  actionRow.append(newCollectionBtn);
  $("#startPanelDiv").append(actionRow);
  // actionRow.insertBefore($("#archivedCollectionsContainer"));



  setupLangage();

}
