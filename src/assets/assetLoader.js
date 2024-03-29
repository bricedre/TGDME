const { rootPath } = require("electron-root-path");
const fs = require("fs");
const fontList = require("font-list");

import { currentCollection, currentCollectionUID, saveCollection } from "../collection/collectionManager.js";
import { setupResources } from "./resourceFunctions.js";

export let currentAssetsList;
export let allSystemFonts;
export let assetsLibrary = {};
export let errorImage;

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
  console.log(assetsPath + assetUID + "."+extension);
  currentCollection.collectionInfo.lastAssetIndex++;
  fs.copyFile(newAsset.path, assetsPath + assetUID + "."+extension, (err) => {
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
