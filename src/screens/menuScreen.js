import { collectionsAvailable, createNewCollection, setCurrentCollection } from "../core/collectionsManager.js";
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
    var activeProjects = [...projectsSorted].filter((col) => !col.archived);
    var archivedProjects = [...projectsSorted].filter((col) => col.archived);

    $("#activeProjectsDiv").empty();
    if (activeProjects.length > 0) {
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

          var archiveBtn = $("<button></button>")
          .text("archiver")
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            archiveProject(project.UID);
            
          });

          var duplicateBtn = $("<button></button>")
          .text("dupliquer")
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            duplicateProject(project.UID);
            
          });

          var deleteBtn = $("<button></button>")
          .text("supprimer")
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteProject(project.UID);
            
          });

        btnElement.append(archiveBtn);
        btnElement.append(duplicateBtn);
        btnElement.append(deleteBtn);
        $("#activeProjectsDiv").append(btnElement);
      });
    }

    if (archivedProjects.length > 0) {
      $("#archivedProjectsContainer").css("display", "block");
      $("#archivedProjectsContainer").on("click", () => {
        if ($("#archivedProjectsContainer").hasClass("active")) {
          $("#archivedProjectsContainer").css("max-height", "4rem");
          $("#archivedProjectsContainer").removeClass("active");
        } else {
          $("#archivedProjectsContainer").css("max-height", `calc(${4.5 * Math.ceil(archivedProjects.length / 5)}rem + 4rem)`);
          $("#archivedProjectsContainer").addClass("active");
        }
      });

      $("#archivedProjectsDiv").empty();
      archivedProjects.forEach((project) => {
        var btnElement = $("<button></button>")
          .addClass("deckBtn")
          .text(project.projectName)
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentProject(project.UID);
            openScene("projectEdition");
          });

        $("#archivedProjectsDiv").append(btnElement);
      });
    } else {
      $("#archivedProjectsContainer").css("display", "none");
    }
  }

  //No Collections to show
  else {
    $("#projectSelectionPanel").append($("<div></div>").addClass("noStuffDiv other_noProject"));
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

    $("#activeCollectionsDiv").empty();
    if (activeCollections.length > 0) {
      activeCollections.forEach((coll) => {
        var btnElement = $("<button></button>")
          .addClass("deckBtn")
          .text(coll.collectionInfo.collectionName)
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentCollection(coll.collectionInfo.UID);
            openScene("collectionEdition");
          });

        $("#activeCollectionsDiv").append(btnElement);
      });
    }

    if (archivedCollections.length > 0) {
      $("#archivedCollectionsContainer").css("display", "block");
      $("#archivedCollectionsContainer").on("click", () => {
        if ($("#archivedCollectionsContainer").hasClass("active")) {
          $("#archivedCollectionsContainer").css("max-height", "4rem");
        } else {
          $("#archivedCollectionsContainer").css("max-height", `calc(${4.5 * Math.ceil(archivedProjects.length / 5)}rem + 4rem)`);
        }

        $("#archivedCollectionsContainer").toggleClass("active");
      });

      $("#archivedCollectionsDiv").empty();
      archivedCollections.forEach((coll) => {
        var btnElement = $("<button></button>")
          .addClass("deckBtn")
          .text(coll.collectionInfo.collectionName)
          .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentCollection(coll.collectionInfo.UID);
            openScene("collectionEdition");
          });

        $("#archivedCollectionsDiv").append(btnElement);
      });
    } else {
      $("#archivedCollectionsContainer").css("display", "none");
    }
  }

  //No Collections to show
  else {
    $("#projectEditionPanel").append($("<div></div>").addClass("noStuffDiv other_noCollection"));
  }

  //ACTIONS
  $(".btn_newCollection").on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    createNewCollection();
  });

  $("btn_deleteProject").on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  $("btn_duplicateProject").on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  $("btn_archiveProject").on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  setupLangage();
}
