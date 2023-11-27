import { rootPath } from 'electron-root-path';
import { assetsList } from './deck/assetsList';

let assetsPath = rootPath+"src/assets/";

export let assetsLibrary = {};

export function preload(p) {
  loadAssets(p);
}

function loadAssets(p){
  assetsList.forEach((asset) => {
    let fileName = asset.split(".")[0];
    let extension = asset.split(".")[1];

    if (extension === "jpg" || extension === "png") {
      let img = p.loadImage(assetsPath + asset);
      assetsLibrary[fileName] = img;
    } else if (extension === "ttf" || extension === "otf")
      assetsLibrary[fileName] = p.loadFont(assetsPath + asset);
  });
}