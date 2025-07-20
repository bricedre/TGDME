import { collectionsAvailable, createNewCollection, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { archiveProject, createNewProject, deleteProject, duplicateProject, getProjects, importProject, projectsAvailable, setCurrentProject } from "../core/projectsManager.js";
import { changeColorScheme, changeLangage, openScene, setupLangage } from "./mainLayout.js";

const $ = require("jquery");

$("#homeBtn").on("click", () => {
  getProjects();
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

  // Collections to show
  if (projectsSorted.length > 0) {
    var activeProjects = [...projectsSorted].filter((proj) => !proj.archived);
    var archivedProjects = [...projectsSorted].filter((proj) => proj.archived);

    generateSelectionButtons("#activeProjectsDiv", activeProjects, "projectName", setCurrentProject, deleteProject, archiveProject, duplicateProject, "projectEdition");

    generateSelectionButtons("#archivedProjectsDiv", archivedProjects, "projectName", setCurrentProject, deleteProject, archiveProject, duplicateProject, "projectEdition");
  }

  //No Collections to show
  else {
    $("#activeProjectsDiv").empty();
    $("#activeProjectsDiv").append($("<div></div>").addClass("noStuffDiv other_noProject"));
  }

  //ACTIONS
  $(".btn_newProto").on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    createNewProject();
  });

  $("btn_importProto").on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    importProject();
  });

  setupLangage();
}

export function setupProjectEditionPanel() {
  let collectionsSorted = [...collectionsAvailable].sort((a, b) => {
    return b.lastSavingTime - a.lastSavingTime;
  });

  // Collections to show
  if (collectionsSorted.length > 0) {
    var activeCollections = [...collectionsSorted].filter((col) => !col.archived);
    var archivedCollections = [...collectionsSorted].filter((col) => col.archived);

    generateSelectionButtons("#activeCollectionsDiv", activeCollections, "collectionName", setCurrentCollection, null, null, null, "collectionEdition", true);

    generateSelectionButtons("#archivedCollectionsDiv", archivedCollections, "collectionName", setCurrentCollection, null, null, null, "collectionEdition", true);

  }

  //No Collections to show
  else {
    $("#activeCollectionsDiv").empty();
    $("#activeCollectionsDiv").append($("<div></div>").addClass("noStuffDiv other_noCollection"));
  }

  //ACTIONS
  $(".btn_newCollection").on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    createNewCollection();
  });

  setupLangage();
}

function generateSelectionButtons(domElToFill, array, name, setFunction, deleteFunction, archiveFunction, duplicateFunction, goToScene, colMode = false) {
  $(domElToFill).empty();
  if (array.length > 0) {
    array.forEach((btn) => {
      if (colMode) btn = btn.collectionInfo;
      var btnElement = $("<button></button>")
        .addClass("deckBtn")
        .on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setFunction(btn.UID);
          if(!colMode) getCollections();
          openScene(goToScene);
        });

      btnElement.append($("<div></div>").text(btn[name]));
      btnElement.append($("<div class='ressSeparator'></div>"));

      var archiveBtn = $("<button></button>")
        .html("<img src='assets/btnIcons/archiveCollection.png'></img>")
        .attr("title", "Archiver")
        .on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          archiveFunction(btn.UID);
        });

      var duplicateBtn = $("<button></button>")
        .html("<img src='assets/btnIcons/duplicateCollection.png'></img>")
        .attr("title", "Dupliquer")
        .on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          duplicateFunction(btn.UID);
        });

      var deleteBtn = $("<button></button>")
        .html("<img src='assets/btnIcons/deleteCollection.png'></img>")
        .attr("title", "Supprimer")
        .on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteFunction(btn.UID);
        });

      btnElement.append(archiveBtn);
      btnElement.append(duplicateBtn);
      btnElement.append(deleteBtn);
      $(domElToFill).append(btnElement);
    });
  }
}
