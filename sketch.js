let generateMode = false;
let currentIndex = 0;

function setup() {
  createCanvas(cardW / 1.5, cardH / 1.5);

  page = createGraphics(pageW, pageH);
  card = createGraphics(cardW, cardH);

  imageMode(CORNER);
  page.imageMode(CORNER);
  card.imageMode(CENTER);

  renderCardUsingTemplate(currentIndex);
  updateCardCounter();
  checkButtons();
}

function draw() {
  if (!generateMode) {
    image(card, 0, 0, width, height);
  } else {
    generatePages();
    generateMode = false;
    renderCardUsingTemplate(currentIndex);
  }
}

function updateCardCounter(){
  //INDEX
  textAlign(CENTER, CENTER);
  fill(0, 200);
  if (cards.length > 0){
    cardCounter.innerHTML = 
      "Card #"+(currentIndex+1)+
        " of " +
        cards.length +
        " cards - " +
        (cards[currentIndex].quantity
          ? cards[currentIndex].quantity + " copies"
          : "1 copy");
        }
  else cardCounter.innerHTML = "NO CARD TO RENDER";
}






