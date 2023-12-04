// const { app, BrowserWindow } = require("electron");
const {rootPath} = require("electron-root-path");

import { currentAssetsList } from "../app.js";

let assetsPath = rootPath+"/assets/";

export let assetsLibrary = {};

export function preload(p) {
  loadAssets(p);
}

function loadAssets(p){
  if(currentAssetsList){
    currentAssetsList.forEach((asset) => {
      let fileName = asset.split(".")[0];
      let extension = asset.split(".")[1];
  
      if (extension === "jpg" || extension === "png") {
        let img = p.loadImage(assetsPath + asset);
        assetsLibrary[fileName] = img;
      } else if (extension === "ttf" || extension === "otf")
        assetsLibrary[fileName] = p.loadFont(assetsPath + asset);
    });
  }
}