const { rootPath } = require("electron-root-path");
const fs = require("fs");

import { currentCollectionIndex } from "./collectionManager.js";
import { setupResources } from "./routes/editionScreen.js";

export let currentAssetsList;
export let assetsLibrary = {};
export let errorImage;


export function loadAssets(p) {
  let assetsPath = rootPath + "/src/decks/" + currentCollectionIndex + "/assets/";
  assetsLibrary = {};

  currentAssetsList = getFiles(assetsPath);
  if (currentAssetsList) {
    currentAssetsList.forEach((asset) => {
      let file = asset.split("//")[1];
      let fileName = file.split(".")[0];
      let extension = file.split(".")[1];

      if (extension === "jpg" || extension === "png") {
        let img = p.loadImage(asset);
        assetsLibrary[fileName] = img;
      } else if (extension === "ttf" || extension === "otf") assetsLibrary[fileName] = p.loadFont(asset);
    });
  }

  errorImage = p.loadImage(rootPath + "/assets/imageError.png");

  setupResources();
}

export function addAsset(newAsset) {
  let assetsPath = rootPath + "/src/decks/" + currentCollectionIndex + "/assets/";
  fs.copyFile(newAsset.path, assetsPath+newAsset.name, (err) => {
    if (err) {
      console.log("Error Found:", err);
    }
  });
}

export function removeAsset(assetToDelete) {
  fs.unlink(assetToDelete, (err) => {
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
