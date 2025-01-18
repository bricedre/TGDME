const { rootPath } = require("electron-root-path");
const fs = require("fs");
const fontList = require("font-list");

import { currentCollection, currentCollectionUID, saveCollection } from "./collectionsManager.js";

export let allSystemFonts;
export let assetsLibrary = {};
export let currentAssetsList = [];
export let errorImage;

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
    noResourceText.innerHTML = "Aucune Ressource dans votre Collection";

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

  itemAccordion.innerHTML = "<img src='" + rootPath + "/collections/" + currentCollectionUID + "/assets/" + file + "'>";

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
  uidTag.title = "Copier l'UID de la ressource";
  uidTag.addEventListener("click", () => {
    navigator.clipboard.writeText(fileName);
  });
  itemAccordion.appendChild(uidTag);

  ressItemsDiv.appendChild(itemAccordion);
}

export function loadAssets(p) {
  let assetsPath = rootPath + "/collections/" + currentCollectionUID + "/assets/";
  assetsLibrary = {};

  currentAssetsList = getFiles(assetsPath);

  currentAssetsList = currentAssetsList.sort((a, b) => {
    return parseInt(a.split("//")[1], 10) - parseInt(b.split("//")[1], 10);
  });

  if (currentAssetsList) {
    currentAssetsList.forEach((asset) => {
      let file = asset.split("//")[1];
      let fileName = file.split(".")[0];
      let img = p.loadImage(asset);
      assetsLibrary[fileName] = img;
    });
  }

  errorImage = p.loadImage(rootPath + "/assets/imageError.png");

  setupResources();
}

export function addAsset(newAsset) {
  let assetsPath = rootPath + "/collections/" + currentCollectionUID + "/assets/";
  let assetUID = currentCollection.collectionInfo.lastAssetIndex;
  let extension = newAsset.name.split(".")[1];
  currentCollection.collectionInfo.lastAssetIndex++;
  fs.copyFile(newAsset.path, assetsPath + assetUID + "." + extension, (err) => {
    saveCollection(true, true);
    generateCollectionBtn.click();
    if (err) {
      console.log("Error Found:", err);
    }
  });
}

export function removeAsset(assetToDelete) {
  fs.unlink(assetToDelete, (err) => {
    saveCollection(true, true);
    generateCollectionBtn.click();
    if (err) {
      console.log("Error Found:", err);
    }
  });
}

function getFiles(dir, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files);
    } else {
      // If it is a file, push the full path to the files array
      files.push(name);
    }
  }
  return files;
}

export async function getFontList() {
  try {
    const fonts = await fontList.getFonts();
    allSystemFonts = fonts.map((font) => {
      return {
        label: font.replace(/"/g, ""),
        value: font,
      };
    });
  } catch (err) {
    console.error("Error fetching font list:", err);
  }
}
