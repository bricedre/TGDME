import { assets } from "../assets/assets";

export let assetsLibrary = {};

export function preload() {
  loadAssets();
}

function loadAssets(){
  assets.forEach((asset) => {
    let fileName = asset.split(".")[0];
    let extension = asset.split(".")[1];

    if (extension === "jpg" || extension === "png") {
      let img = loadImage("../assets/" + asset);
      assetsLibrary[fileName] = img;
    } else if (extension === "ttf" || extension === "otf")
      assetsLibrary[fileName] = loadFont("../assets/" + asset);
  });
}