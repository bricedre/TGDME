import { getFolderContents, openScene } from "../screens/mainLayout.js";
import { setupProjectSelectionPanel } from "../screens/menuScreen.js";
import { getCollections, saveCollection } from "./collectionsManager.js";
import { projectTemplate } from "./templates.js";

const getAppDataPath = require("appdata-path");
const rimraf = require("rimraf");
const $ = require("jquery");

export let appDataFolder;
export let projectsAvailable = [];
export let currentProjectUID = -1;
export let currentProject;

const fs = require("fs").promises;
const fs2 = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");

getAppDataFolder();

async function getAppDataFolder() {
  console.log("> getAppDataFolder");

  let _appDataFolder = getAppDataPath();

  //First launch
  if (!fs2.existsSync(_appDataFolder + "/Cabane a Protos")) {
    mkdirSync(_appDataFolder + "/Cabane a Protos");
  }

  appDataFolder = _appDataFolder + "/Cabane a Protos";

  if (!fs2.existsSync(appDataFolder + "/projects")) {
    patchIfNotUsingProjectSystem();
  }

  getProjects();
}

async function patchIfNotUsingProjectSystem() {
  console.log("> patchIfNotUsingProjectSystem");

  if (confirm("NOUVELLE FEATURE - LES PROJETS : L'application va mettre vos données en conformité et s'éteindre d'elle-même. Redémarrez-la ensuite.")) {
    await fs.mkdir(appDataFolder + "/projects");

    await copyDirectoryRecursive(appDataFolder + "/collections", appDataFolder + "/projects");

    const projectsAvailable = await fs.readdir(appDataFolder + "/projects", { withFileTypes: true });
    const projectDirs = projectsAvailable.filter((dirent) => dirent.isDirectory());

    for (const proj of projectDirs) {
      const projectPath = path.join(appDataFolder, "projects", proj.name);
      const collectionsPath = path.join(projectPath, "collections");
      const collection0Path = path.join(collectionsPath, "0");

      await fs.mkdir(collectionsPath, { recursive: true });
      await fs.mkdir(collection0Path);

      const originalCollectionPath = path.join(projectPath, "collection.json");
      const collectionData = await fs.readFile(originalCollectionPath, "utf8");
      const collectionJson = JSON.parse(collectionData);
      const _collectionInfo = collectionJson.collectionInfo;

      const _projectTemplate = {
        UID: _collectionInfo.UID,
        projectName: _collectionInfo.collectionName,
        lastSavingTime: _collectionInfo.lastSavingTime,
        archived: _collectionInfo.archived,
      };

      const projectJsonPath = path.join(projectPath, "project.json");
      await fs.writeFile(projectJsonPath, JSON.stringify(_projectTemplate, null, 2));

      const filesToMove = [
        { from: "collection.json", to: "collections/0/collection.json" },
        { from: "assets", to: "collections/0/assets" },
        { from: "data.xlsx", to: "collections/0/data.xlsx" },
      ];

      for (const file of filesToMove) {
        const fromPath = path.join(projectPath, file.from);
        const toPath = path.join(projectPath, file.to);
        await fs.rename(fromPath, toPath);
      }

      const movedCollectionPath = path.join(projectPath, "collections", "0", "collection.json");
      const movedCollectionData = await fs.readFile(movedCollectionPath, "utf8");
      const movedCollection = JSON.parse(movedCollectionData);
      movedCollection.collectionInfo.UID = "0";
      await fs.writeFile(movedCollectionPath, JSON.stringify(movedCollection, null, 2));
    }

    await fs.rmdir(appDataFolder + "/collections", { recursive: true });

    window.close();
  }
}

// Helper function to copy directory recursively
async function copyDirectoryRecursive(src, dest) {
  console.log("> copyDirectoryRecursive");

  try {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDirectoryRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory ${src} to ${dest}:`, error);
    throw error;
  }
}

export function createNewProject() {
  console.log("> createNewProject");

  const newUID = getNextProjectUID();
  var dir = `${appDataFolder}/projects/${newUID}`;

  if (!fs2.existsSync(dir)) {
    fs2.mkdirSync(dir);
    fs2.mkdirSync(dir + "/renders");
    fs2.mkdirSync(dir + "/collections");
    fs2.writeFileSync(dir + "/project.json", JSON.stringify(projectTemplate(newUID)));

    getProjects();
  }
}

export function saveProject(projectName = "") {
  console.log("> saveProject");

  if (projectName === "") currentProject.projectName = $("#projectNameInput").text();
  else currentProject.projectName = projectName;

  currentProject.lastSavingTime = Date.now();

  //SAVE CURRENT PROJECT IN FOLDER
  var deckToSave = JSON.stringify(currentProject);
  fs.writeFile(`${appDataFolder}/projects/${currentProjectUID}/project.json`, deckToSave, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

export function importProject() {}

export async function getProjects() {
  console.log("> getProjects");

  projectsAvailable = await getFolderContents(`${appDataFolder}/projects`, "project.json");
  setupProjectSelectionPanel();
}

export function setCurrentProject(projectUID) {
  console.log("> setCurrentProject", projectUID, currentProjectUID);

  if (projectUID !== currentProjectUID) {
    currentProjectUID = projectUID;
    currentProject = projectsAvailable.filter((proj) => proj.UID == projectUID)[0];
  }
}

function getNextProjectUID() {
  if (projectsAvailable.length == 0) return 0;
  else {
    let biggestUID = 0;
    projectsAvailable.forEach((proj) => {
      if (proj.UID > biggestUID) biggestUID = parseInt(proj.UID);
    });
    return biggestUID + 1;
  }
}

export function deleteProject(UID) {
  console.log("> deleteCurrentProject");

  if (confirm("Attention ! Cette action est irréversible ! Supprimer ?")) {
    setCurrentProject(UID);

    rimraf
      .rimraf(`${appDataFolder}/projects/${currentProjectUID}`)
      .then(() => {
        getProjects();
      })
      .catch((e) => console.log(e));
  }
}

export function duplicateProject(UID) {
  console.log("> duplicateProject");

  setCurrentProject(UID);

  const newUID = getNextProjectUID();
  var oldDir = `${appDataFolder}/projects/${currentProjectUID}`;
  var newDir = `${appDataFolder}/projects/${newUID}`;

  fsExtra.copy(oldDir, newDir);

  getProjects();

  setTimeout(() => {
    projectsAvailable[projectsAvailable.length - 1].UID = newUID;
    projectsAvailable[projectsAvailable.length - 1].projectName = "Copie de " + currentProject.projectName;
    var deckToSave = JSON.stringify(projectsAvailable[projectsAvailable.length - 1]);
    fs.writeFile(`${newDir}/project.json`, deckToSave, (err) => {
      if (err) {
        console.error(err);
      }
    });
    getProjects();
    setupProjectSelectionPanel();
  }, 500);
}

export function archiveProject(UID) {
  console.log("> archiveProject");

  setCurrentProject(UID);

  currentProject.archived = !currentProject.archived;
  saveProject(currentProject.projectName);
  getProjects();
  setupProjectSelectionPanel();
}
