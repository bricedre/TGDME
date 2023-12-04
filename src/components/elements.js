import { assetsLibrary } from "./assetLoader.js";
import { currentDeck } from "./globalStuff.js";

export function renderImageElement(p5, elementIndex, cardIndex) {

  let currentCards = currentDeck.cards;
  let currentDeckInfo = currentDeck.deckInfo;
  let currentTemplate = currentDeck.template;

  let cardData = currentCards[cardIndex];

  var cardW = currentDeckInfo.cardW;
  var cardH = currentDeckInfo.cardH;
  var resolution = currentDeckInfo.resolution;

  let _img;
  let _type = "";
  let _position_x = "";
  let _position_y = "";
  let _width = "";
  let _height = "";

  // No render if no src
  if (
    currentTemplate[elementIndex].trigger == null ||
    cardData[currentTemplate[elementIndex].trigger]
  ) {
    if (currentTemplate[elementIndex].src) {
      if (currentTemplate[elementIndex].type) {
        _type = currentTemplate[elementIndex].type;

        if (_type === "static")
          _img = assetsLibrary[currentTemplate[elementIndex].src];
        else if (_type === "dynamic")
          _img = assetsLibrary[currentTemplate[elementIndex].src + "_" + cardIndex];
        else {
          console.log("Image Type NOT SUPPORTED. Set to static.");
          assetsLibrary[currentTemplate[elementIndex].src];
        }
      }

      _position_x =
      currentTemplate[elementIndex].position_x != null
          ? eval(currentTemplate[elementIndex].position_x)
          : 0;
      _position_y =
      currentTemplate[elementIndex].position_y != null
          ? eval(currentTemplate[elementIndex].position_y)
          : 0;
      _width = currentTemplate[elementIndex].width
        ? eval(currentTemplate[elementIndex].width)
        : 100;
      _height = currentTemplate[elementIndex].height
        ? eval(currentTemplate[elementIndex].height)
        : 100;

      try {
        p5.card.imageMode(p5.CENTER);
        p5.card.image(_img, _position_x, _position_y, _width, _height);
      } catch (e) {
        console.log(e)
      }
    }
  }
}

export function renderTextElement(p5, elementIndex, cardIndex) {

  let currentCards = currentDeck.cards;
  let currentDeckInfo = currentDeck.deckInfo;
  let currentTemplate = currentDeck.template;

  let cardData = currentCards[cardIndex];

  var cardW = currentDeckInfo.cardW;
  var cardH = currentDeckInfo.cardH;
  var resolution = currentDeckInfo.resolution;

  let _textToWrite = "";
  let _align = "";
  let _position_x = "";
  let _position_y = "";
  let _size = "";
  let _font = "";
  let _color;

  // No render if no src
  if (
    currentTemplate[elementIndex].trigger == null ||
    cardData[currentTemplate[elementIndex].trigger]
  ) {
    if (currentTemplate[elementIndex].src) {
      _textToWrite = cardData[currentTemplate[elementIndex].src];
      _position_x =
      currentTemplate[elementIndex].position_x != null
          ? eval(currentTemplate[elementIndex].position_x)
          : 0;
      _position_y =
      currentTemplate[elementIndex].position_y != null
          ? eval(currentTemplate[elementIndex].position_y)
          : 0;
      _size = currentTemplate[elementIndex].size
        ? eval(currentTemplate[elementIndex].size)
        : 20;
      _color = currentTemplate[elementIndex].color
        ? p5.color(eval(currentTemplate[elementIndex].color))
        : p5.color(0);
      if (currentTemplate[elementIndex].align) {
        if (currentTemplate[elementIndex].align === "CENTER") _align = p5.CENTER;
        else if (currentTemplate[elementIndex].align === "RIGHT") _align = p5.RIGHT;
      } else _align = p5.LEFT;
      if (currentTemplate[elementIndex].font) {
        _font = assetsLibrary[currentTemplate[elementIndex].font];
      }

      try {
        p5.card.noStroke();
        p5.card.textAlign(_align, p5.CENTER);
        if (_font !== "") p5.card.textFont(_font);
        else _font = p5.card.textFont("Verdana");
        p5.card.textSize(_size*resolution*0.1);
        p5.card.fill(_color);

        p5.card.text(_textToWrite, _position_x, _position_y);
      } catch (e) {
        console.log(e)
      }
    }
  }
}

export function renderStripElement(p5, elementIndex, cardIndex) {

  let currentCards = currentDeck.cards;
  let currentDeckInfo = currentDeck.deckInfo;
  let currentTemplate = currentDeck.template;

  let cardData = currentCards[cardIndex];

  var cardW = currentDeckInfo.cardW;
  var cardH = currentDeckInfo.cardH;
  var resolution = currentDeckInfo.resolution;

  let _imgs = [];
  let _position_x;
  let _position_y;
  let _width;
  let _height;
  let _spacing_x;
  let _spacing_y;
  let _style;
  let _offset_x;
  let _offset_y;
  let _align;
  let _totalWidth;
  let _totalHeight;

  // No render if no src
  if (
    currentTemplate[elementIndex].trigger == null ||
    cardData[template[elementIndex].trigger]
  ) {
    if (currentTemplate[elementIndex].src) {
      var elementsList = cardData[currentTemplate[elementIndex].src]
        ? cardData[currentTemplate[elementIndex].src]
        : [];

      if (elementsList.length > 0) {
        for (let i = 0; i < elementsList.length; i++) {
          _imgs.push(assetsLibrary[elementsList[i]]);
        }

        _position_x =
        currentTemplate[elementIndex].position_x != null
            ? eval(currentTemplate[elementIndex].position_x)
            : 0;
        _position_y =
        currentTemplate[elementIndex].position_y != null
            ? eval(currentTemplate[elementIndex].position_y)
            : 0;
        _width = currentTemplate[elementIndex].width
          ? eval(currentTemplate[elementIndex].width)
          : 100;
        _height = currentTemplate[elementIndex].height
          ? eval(currentTemplate[elementIndex].height)
          : 100;
        _spacing_x = currentTemplate[elementIndex].spacing_x
          ? eval(currentTemplate[elementIndex].spacing_x)
          : 0;
        _spacing_y = currentTemplate[elementIndex].spacing_y
          ? eval(currentTemplate[elementIndex].spacing_y)
          : 0;
          _style = currentTemplate[elementIndex].style
          ? currentTemplate[elementIndex].style
          : "straight";
          _offset_x = currentTemplate[elementIndex].offset_x
          ? eval(currentTemplate[elementIndex].offset_x)
          : 0;
          _offset_y = currentTemplate[elementIndex].offset_y
          ? eval(currentTemplate[elementIndex].offset_y)
          : 0;
        _align = currentTemplate[elementIndex].align
          ? currentTemplate[elementIndex].align
          : "LEFT";

        _totalWidth =
          (elementsList.length * Math.min(_width,_spacing_x) +
            (elementsList.length -2) * _spacing_x) /
          2;

          _totalHeight =
          (elementsList.length * Math.min(_height,_spacing_y) +
            (elementsList.length - 1) * _spacing_y) /
          2;

        try {
          p5.card.imageMode(p5.CENTER);
          for (let i = 0; i < elementsList.length; i++) {
            if (_align == "CENTER") {
              p5.card.image(
                _imgs[i],
                _position_x + (elementsList.length > 1?((_spacing_x > 0) ? i * _spacing_x - _totalWidth / 2 : 0) + ((_style == "alternate") ? ((i%2 == 0) ? _offset_x : -_offset_x) : 0):0),
                _position_y + (elementsList.length > 1?((_spacing_y > 0) ? i * _spacing_y - _totalHeight / 2 : 0) + ((_style == "alternate") ? ((i%2 == 0) ? _offset_y : -_offset_y) : 0):0),
                _width,
                _height
              );
            } else if (_align == "LEFT") {
              p5.card.image(
                _imgs[i],
                _position_x + (elementsList.length > 1 ? i * _spacing_x + ((_style == "alternate") ? ((i%2 == 0) ? _offset_x : -_offset_x) : 0):0),
                _position_y + (elementsList.length > 1 ? i * _spacing_y + ((_style == "alternate") ? ((i%2 == 0) ? _offset_y : -_offset_y) : 0):0),
                _width,
                _height
              );
            } else if (_align == "RIGHT") {
              p5.card.image(
                _imgs[i],
                _position_x + (elementsList.length > 1? ((_spacing_x > 0) ? i * _spacing_x - _totalWidth : 0) + ((_style == "alternate") ? ((i%2 == 0) ? _offset_x : -_offset_x) : 0):0),
                _position_y + (elementsList.length > 1? ((_spacing_y > 0) ? i * _spacing_y - _totalHeight : 0) + ((_style == "alternate") ? ((i%2 == 0) ? _offset_y : -_offset_y) : 0):0),
                _width,
                _height
              );
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}