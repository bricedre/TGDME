// UPLOAD ALL YOUR ASSETS TO THE ASSETS/ FOLDER
// AND LIST ALL THE ASSETS YOU WANT TO USE IN THE CODE
// UNLISTED ASSETS WON'T BE TAKEN INTO ACCOUNT
//
// TYPE IS AUTO-DETECTED (types allowed - for image : .jpg, .png, for font : .ttf, .otf)
// NAME OF THE FILE WILL BE THE PATH WITHOUT THE EXTENSION, MAKE THEM UNIQUE !

let assetsLibrary = {};

function preload() {
  loadAssets();
}

function loadAssets(){
  assets.forEach((asset) => {
    let fileName = asset.split(".")[0];
    let extension = asset.split(".")[1];

    if (extension === "jpg" || extension === "png") {
      let img = loadImage("assets/" + asset);
      assetsLibrary[fileName] = img;
    } else if (extension === "ttf" || extension === "otf")
      assetsLibrary[fileName] = loadFont("assets/" + asset);
  });
}

const assets = [
  "title_font.ttf",
  "bg_0.jpg",
  "bg_1.jpg",
  "bg_2.jpg",
  "bg_3.jpg",
  "ui.png",
  "image_effect.png",
  "coin.png",
  "looking_glass.png"
];
