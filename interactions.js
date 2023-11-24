function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    goToPreviousCard();
  } else if (keyCode === RIGHT_ARROW){
    goToNextCard();
  }
}

function goToPreviousCard(){
  if(currentIndex > 0) {
    currentIndex--;
    renderCardUsingTemplate(currentIndex);
    updateCardCounter();
    rootElement.style.setProperty("--cardAngle", (3-random()*6)+"deg");

    checkButtons();
  }
}

function goToNextCard(){
  if(currentIndex < cards.length - 1) {
    currentIndex++;
    renderCardUsingTemplate(currentIndex);
    updateCardCounter();
    rootElement.style.setProperty("--cardAngle", (3-random()*6)+"deg");
    checkButtons();
  }
}

function checkButtons(){
  if(currentIndex != 0) prevCardBtn.disabled = false;
  else prevCardBtn.disabled = true;

  if(currentIndex != cards.length-1) nextCardBtn.disabled = false;
  else nextCardBtn.disabled = true;
}

