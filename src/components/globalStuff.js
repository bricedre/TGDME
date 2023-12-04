import { app } from "../app.js";
import { setUI } from "./DOM.js";
import { assetsLibrary, loadAssets } from "./assetLoader.js";
import { renderCardUsingTemplate } from "./render.js";

const fs = require("fs").promises;

export let currentDeckIndex = -1;
export let currentDeck;

export function setCurrentDeckIndex(value){
    currentDeckIndex = value;
    if(currentDeckIndex != -1) getDataFromDeck();
    
}

function setCurrentDeck(value){
    currentDeck = value;
    console.log(currentDeck.deckInfo.deckName);
    loadAssets(app);
    console.log(assetsLibrary)
    app.setupCanvas(300, 500);
    renderCardUsingTemplate(app, app.currentIndex);
}

async function getDataFromDeck (){
    try {
        // Use fs.promises.readFile to read the file asynchronously
        const data = await fs.readFile("./src/decks/"+currentDeckIndex+"/deck.json");
        setCurrentDeck(JSON.parse(data));
        setUI();
    } catch (error) {
        // Handle errors during file loading
        console.error('Error loading file:', error);
    }
}


