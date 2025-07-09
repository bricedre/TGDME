import {
  collectionsAvailable,
  createNewCollection,
  currentCollectionUID,
  getCollections,
  getProjects,
  projectsAvailable,
  setCurrentCollection,
  setCurrentProject,
} from "../core/collectionsManager.js";
import { changeColorScheme, changeLangage, currentPanel, openScene, setupLangage } from "./mainLayout.js";

const $ = require("jquery");

$("#homeBtn").on("click", () => {
  openScene("home");
});

let isSettingsBarOpen = false;
$("#settingsBtn").on("click", () => {
  if (isSettingsBarOpen) $(".settingsBar").css("right", "-9rem");
  else $(".settingsBar").css("right", "0");

  isSettingsBarOpen = !isSettingsBarOpen;
});

$("#colorModeBtn").on("click", () => {
  changeColorScheme();
});

$("#langBtn").on("click", () => {
  changeLangage();
});

export function setupProjectSelectionPanel() {
  let projectsSorted = [...projectsAvailable].sort((a, b) => {
    return b.lastSavingTime - a.lastSavingTime;
  });

  $("#projectSelectionPanel").empty();

  //Title
  $("#projectSelectionPanel").append($("<div></div>").addClass("homePageHeader other_projectsHeader"));

  // Collections to show
  if (projectsSorted.length > 0) {
    var activeProjects = [...projectsSorted].filter((col) => !col.archived);
    var archivedProjects = [...projectsSorted].filter((col) => col.archived);

    if (activeProjects.length > 0) {
      var activeCol = $("<div></div>").attr("id", "activeCollectionsDiv");

      activeProjects.forEach((project) => {
        var btnElement = $("<button></button>")
          .addClass("deckBtn")
          .text(project.projectName)
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentProject(project.UID);
            openScene("projectEdition");
          });

        activeCol.append(btnElement);
      });

      $("#projectSelectionPanel").append(activeCol);
    }

    if (archivedProjects.length > 0) {
      var archivedColContainer = $("<div></div>")
        .attr("id", "archivedProjectsContainer")
        .on("click", () => {
          if (archivedColContainer.hasClass("active")) {
            archivedColContainer.css("max-height", "4rem");
          } else {
            archivedColContainer.css("max-height", `calc(${4.5 * Math.ceil(archivedProjects.length / 5)}rem + 4rem)`);
          }

          archivedColContainer.toggleClass("active");
        });
        
      let archivedCollectionsHeader = $("<div></div>").addClass("archivedCollectionsHeader");
      archivedCollectionsHeader.append($(`<img></img`).attr("src", `assets/btnIcons/archiveCollection.png`));
      archivedCollectionsHeader.append($("<span></span>").addClass("other_archivedProjects"));
      archivedCollectionsHeader.append($("<span></span>").addClass("archivedSeparator"));
      archivedCollectionsHeader.append($("<span></span>").text(">").addClass("archivedArrow"));
      archivedColContainer.append(archivedCollectionsHeader);
      $("#projectSelectionPanel").append(archivedColContainer);

      var archivedCol = $("<div></div>").attr("id", "archivedCollectionsDiv");
      archivedColContainer.append(archivedCol);

      archivedProjects.forEach((project) => {
        var btnElement = $("<button></button>")
          .addClass("deckBtn")
          .text(project.projectName)
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentProject(project.UID);
            openSc("projectEdition");
          });

        archivedCol.append(btnElement);
      });
    }
  }

  //No Collections to show
  else {
    var noResourceText = $("<div></div>").addClass("noStuffDiv other_noProject");

    $("#projectSelectionPanel").append(noResourceText);
  }

  //Spacer
  $("#projectSelectionPanel").append($("<div></div>").css("flex", "1"));

  //ACTIONS
  const actionRow = $("<div></div>").addClass("btnContainer");

  const newCollectionBtn = $("<button></button>")
    .addClass("navBtn bigBtn btn_newProto")
    .on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // createNewCollection();
    });
  actionRow.append(newCollectionBtn);

  $("#projectSelectionPanel").append(actionRow);

  const importCollectionBtn = $("<button></button>")
    .addClass("navBtn bigBtn btn_importProto")
    .on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // createNewCollection();
    });
  actionRow.append(importCollectionBtn);

  $("#projectSelectionPanel").append(actionRow);

  setupLangage();
}

export function setupProjectEditionPanel() {
  let collectionsSorted = [...collectionsAvailable].sort((a, b) => {
    return b.collectionInfo.lastSavingTime - a.collectionInfo.lastSavingTime;
  });

  $("#projectEditionPanel").empty();

  //Title
  $("#projectEditionPanel").append($("<div></div>").addClass("homePageHeader other_collectionsHeader"));

  // Collections to show
  if (collectionsSorted.length > 0) {
    var activeCollections = [...collectionsSorted].filter((col) => !col.collectionInfo.archived);
    var archivedCollections = [...collectionsSorted].filter((col) => col.collectionInfo.archived);

    if (activeCollections.length > 0) {
      var activeCol = $("<div></div>").attr("id", "activeCollectionsDiv");

      activeCollections.forEach((collection) => {
        var btnElement = $("<button></button>")
          .addClass("deckBtn")
          .text(collection.collectionInfo.collectionName)
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentCollection(collection.collectionInfo.UID);
            openScene("collectionEdition");
          });

        activeCol.append(btnElement);
      });

      $("#projectEditionPanel").append(activeCol);
    }

    if (archivedCollections.length > 0) {
      var archivedColContainer = $("<div></div>")
        .attr("id", "archivedCollectionsContainer")
        .on("click", () => {
          if (archivedColContainer.hasClass("active")) {
            archivedColContainer.css("max-height", "4rem");
          } else {
            archivedColContainer.css("max-height", `calc(${4.5 * Math.ceil(archivedCollections.length / 5)}rem + 4rem)`);
          }

          archivedColContainer.toggleClass("active");
        });
      // archivedColContainer.css("display", "flex");
      let archivedCollectionsHeader = $("<div></div>").addClass("archivedCollectionsHeader");
      archivedCollectionsHeader.append($(`<img></img`).attr("src", `assets/btnIcons/archiveCollection.png`));
      archivedCollectionsHeader.append($("<span></span>").addClass("other_archivedCollections"));
      archivedColContainer.append(archivedCollectionsHeader);
      $("#projectEditionPanel").append(archivedColContainer);

      var archivedCol = $("<div></div>").attr("id", "archivedCollectionsDiv");
      archivedColContainer.append(archivedCol);

      archivedCollections.forEach((collection) => {
        var btnElement = $("<button></button>")
          .addClass("deckBtn")
          .text(collection.collectionInfo.collectionName)
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentCollection(collection.collectionInfo.UID);
            openScene("collectionEdition");
          });

        archivedCol.append(btnElement);
      });
    }
  }

  //No Collections to show
  else {
    var noResourceText = $("<div></div>").addClass("noStuffDiv other_noCollection");

    $("#projectEditionPanel").append(noResourceText);
  }

  //Spacer
  $("#projectEditionPanel").append($("<div></div>").css("flex", "1"));

  //ACTIONS
  const actionRow = $("<div></div>").addClass("btnContainer");
  const newCollectionBtn = $("<button></button>")
    .addClass("navBtn bigBtn btn_newCollection")
    .on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      createNewCollection();
    });
  actionRow.append(newCollectionBtn);
  $("#projectEditionPanel").append(actionRow);

  setupLangage();
}
