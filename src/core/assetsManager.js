const fs = require("fs");
const fontList = require("font-list");

// import { exec } from "child_process";
import { appDataFolder, currentCollection, currentCollectionUID, currentProjectUID } from "./collectionsManager.js";

export let allSystemFonts;
export let assetsLibrary = {};
export let currentAssetsList = [];
export let errorImage;

export function setupResources() {

  console.log("> setupResources")

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

    console.log("> createNewResource")

  var ressContainer = document.createElement("div");

  ressContainer.id = itemIndex;
  ressContainer.classList.add("ressContainer");

  let file = item.split("//")[1];
  let fileName = file.split(".")[0];

  ressContainer.title = "Cliquer pour copier le nom de la ressource";
  ressContainer.addEventListener("click", () => {
    navigator.clipboard.writeText(file);
  });

  const bgImg = document.createElement("img");
  bgImg.classList.add("ResBgImg");
  bgImg.src = `${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/assets/${file}`;
  ressContainer.appendChild(bgImg);

  const ressTitle = document.createElement("div");
  ressTitle.classList.add("ressTitle");
  ressTitle.innerHTML = file;
  ressContainer.appendChild(ressTitle);

  ressItemsDiv.appendChild(ressContainer);
}

export function loadAssets(p) {

    console.log("> loadAssets")

  let assetsPath = `${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/assets/`;
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
      assetsLibrary[file] = img;
    });
  }

  errorImage = p.loadImage("./assets/uiIcons/imageError.png");

  setupResources();
}

function getFiles(dir, files = []) {

    console.log("> loadAssets > getFiles")

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

  console.log("> getFontList")

  try {
    const fonts = await fontList.getFonts();
    allSystemFonts = fonts.map((font) => {
      return {
        label: font.replace(/"/g, ""),
        value: font,
      };
    });
  } catch (e) {
    console.log("Error fetching font list:", e);
  }
}
