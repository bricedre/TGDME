import { currentCollection } from "./collectionManager.js";
import { generatePDF } from "./pdf.js";
import { app } from "../app.js";
import { assetsLibrary, errorImage } from "./assetLoader.js";

export function renderComponent(p5, componentType, componentIndex, elementIndex) {
  let currentElements = currentCollection.elements;
  let currentTemplate = currentCollection.template;

  let elementData = currentElements[elementIndex];
  let templateData = currentTemplate[componentIndex];

  // Render only if trigger is empty OR equal to good value
  if (templateData.trigger.value == "" || elementData[templateData.trigger.value]) {
    var _src = getActualValue(templateData.src, "", false);

    var _type = templateData.src.type;
    var _img;
    var _textToWrite;
    var _elementsList = [];
    var _imgs = [];

    if (_type === "0") {
      if (componentType == "IMAGE") _img = assetsLibrary[_src];
      else if (componentType == "TEXT") _textToWrite = _src;
      else if (componentType == "STRIP")_elementsList = _src.split(",");
    } else if (_type === "1") {
      if (componentType == "IMAGE") _img = assetsLibrary[elementData[_src]];
      else if (componentType == "TEXT") _textToWrite = elementData[_src];
      else if (componentType == "STRIP") {
        if(elementData[_src]) _elementsList = elementData[_src].split(",");
      }
    }

    if (_elementsList.length > 0) {
      for (let i = 0; i < _elementsList.length; i++) {
        if(assetsLibrary[_elementsList[i].trim()]) _imgs.push(assetsLibrary[_elementsList[i].trim()]);
      }
    }

    var _position_x = getActualValue(templateData.position_x, 0, true);
    var _position_y = getActualValue(templateData.position_y, 0, true);
    var _width = getActualValue(templateData.width, "W", true);
    var _height = getActualValue(templateData.height, "W", true);
    var _anchor = getActualValue(templateData.anchor, p5.CENTER, true);
    var _angle = getActualValue(templateData.angle, 0, true);
    var _tint = getActualValue(templateData.tint, "#FFFFFF", false);
    var _opacity = getActualValue(templateData.opacity, 100, true);
    var _size = getActualValue(templateData.size, 5, true);
    var _font = getActualValue(templateData.font, "Verdana", false);
    var _color = getActualValue(templateData.color, "#000000", false);
    var _spacing_x = getActualValue(templateData.spacing_x, 0, true);
    var _spacing_y = getActualValue(templateData.spacing_y, 0, true);
    var _style = getActualValue(templateData.style, "straight", false);
    var _offset_x = getActualValue(templateData.offset_x, 0, true);
    var _offset_y = getActualValue(templateData.offset_y, 0, true);

    p5.card.push();
    try {
      p5.card.angleMode(p5.DEGREES);
      p5.card.translate(_position_x, _position_y);
      if (_angle !== 0) p5.card.rotate(_angle);

      //! IMAGE
      if (componentType == "IMAGE") {
        p5.card.imageMode(_anchor);
        p5.card.tint(_tint + Math.round(_opacity * 2.55).toString(16));
        p5.card.image(_img, 0, 0, _width, _height);
      }

      //! TEXT
      else if (componentType == "TEXT") {
        p5.card.noStroke();
        p5.card.textAlign(_anchor, p5.CENTER);
        p5.card.textFont(_font);
        p5.card.textSize(_size * currentCollection.collectionInfo.H * currentCollection.collectionInfo.resolution * 0.02);
        p5.card.fill(_color + Math.round(_opacity * 2.55).toString(16));
        p5.card.text(_textToWrite, 0, 0);
      }

      //! STRIP
      else if (componentType == "STRIP") {
        var _totalWidth = (_elementsList.length * Math.min(_width, _spacing_x) + (_elementsList.length - 2) * _spacing_x) / 2;
        var _totalHeight = (_elementsList.length * Math.min(_height, _spacing_y) + (_elementsList.length - 1) * _spacing_y) / 2;

        p5.card.imageMode(p5.CENTER);
        for (let i = 0; i < _elementsList.length; i++) {

          console.log(_anchor)
          
          if (_anchor == p5.CENTER) {
            p5.card.image(
              _imgs[i],
              _elementsList.length > 1 ? (_spacing_x > 0 ? i * _spacing_x - _totalWidth / 2 : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offset_x : -_offset_x) : 0) : 0,
              _elementsList.length > 1 ? (_spacing_y > 0 ? i * _spacing_y - _totalHeight / 2 : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offset_y : -_offset_y) : 0) : 0,
              _width,
              _height
            );
          } else if (_anchor == p5.LEFT) {
            p5.card.image(
              _imgs[i],
              _elementsList.length > 1 ? i * _spacing_x + (_style == "alternate" ? (i % 2 == 0 ? _offset_x : -_offset_x) : 0) : 0,
              _elementsList.length > 1 ? i * _spacing_y + (_style == "alternate" ? (i % 2 == 0 ? _offset_y : -_offset_y) : 0) : 0,
              _width,
              _height
            );
          } else if (_anchor == p5.CENTER.RIGHT) {
            p5.card.image(
              _imgs[i],
              _elementsList.length > 1 ? (_spacing_x > 0 ? i * _spacing_x - _totalWidth : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offset_x : -_offset_x) : 0) : 0,
              _elementsList.length > 1 ? (_spacing_y > 0 ? i * _spacing_y - _totalHeight : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offset_y : -_offset_y) : 0) : 0,
              _width,
              _height
            );
          }
        }
      }
    } catch (e) {
      console.log(e);

      if (componentType == "IMAGE") {
        p5.card.image(errorImage, 0, 0, _width, _height);
      }
    }
    p5.card.pop();
  }
}

function getActualValue(refValue, dft, ev) {
  let currentCollectionInfo = currentCollection.collectionInfo;
  var W = currentCollectionInfo.W * currentCollectionInfo.resolution;
  var H = currentCollectionInfo.H * currentCollectionInfo.resolution;
  var CENTER = app.CENTER;
  var CORNER = app.CORNER;
  var LEFT = app.LEFT;
  var RIGHT = app.RIGHT;

  var finalValue;
  if (refValue) {
    if (ev) finalValue = eval(refValue.value);
    else finalValue = refValue.value;
  } else finalValue == null;
  return finalValue ? finalValue : dft;
}

export function triggerGeneration() {
  app.generateMode = true;
}

// GENERATE 3x3 A4 PAGES OF CARDS
export function generatePages(p5) {
  var W = currentCollection.collectionInfo.W * currentCollection.collectionInfo.resolution;
  var H = currentCollection.collectionInfo.H * currentCollection.collectionInfo.resolution;
  var colCount = currentCollection.collectionInfo.colCount;
  var rowCount = currentCollection.collectionInfo.rowCount;
  var marginX = currentCollection.collectionInfo.marginX;
  var marginY = currentCollection.collectionInfo.marginY;
  var pageWidth = currentCollection.collectionInfo.pageWidth * currentCollection.collectionInfo.resolution;
  var pageHeight = currentCollection.collectionInfo.pageHeight * currentCollection.collectionInfo.resolution;

  var pages = [];

  var currentPage;

  var _allCardsIndices = [];
  var currentElementIndex = 0;
  currentCollection.elements.forEach((card) => {
    if (card.quantity) {
      for (let i = 0; i < card.quantity; i++) _allCardsIndices.push(currentElementIndex);
    } else {
      _allCardsIndices.push(currentElementIndex);
    }
    currentElementIndex++;
  });

  for (let i = 0; i < _allCardsIndices.length; i++) {
    var elementIndex = _allCardsIndices[i];
    if (i % (colCount * rowCount) == 0) {
      currentPage = p5.createGraphics(pageWidth, pageHeight);
      currentPage.background(255);
    }
    renderCardUsingTemplate(p5, elementIndex, currentCollection.collectionInfo.visualGuide);
    currentPage.image(p5.card, marginX + ((i % (colCount * rowCount)) % colCount) * W, marginY + Math.floor((i % (colCount * rowCount)) / colCount) * H, W, H);

    if (i % (colCount * rowCount) == colCount * rowCount - 1 || i === _allCardsIndices.length - 1) {
      pages.push(currentPage);
    }
  }

  generatePDF(pages);
}

export function renderCardUsingTemplate(p, elementIndex, guide) {
  //WHITE BG BY DEFAULT
  p.card.background(255);

  //COLLECTION WITH ELEMENTS
  if (currentCollection.elements.length > 0) {
    for (let i = 0; i < currentCollection.template.length; i++) {
      if (currentCollection.template[i].isVisible) {
        renderComponent(p, currentCollection.template[i].component, i, elementIndex);
      }
    }

    //OVERLAYS
    if (p.generateMode) {
      if (currentCollection.collectionInfo.cuttingHelp) {
        p.card.noFill();
        p.card.stroke(0, 100);
        p.card.strokeWeight(2);
        p.card.rect(0, 0, currentCollection.collectionInfo.W, currentCollection.collectionInfo.H);
      }
    } else {
      renderVisualGuide(p, guide);
    }
  }

  //EMPTY COLLECTION
  else {
    p.card.background(200);
  }
}

function renderVisualGuide(p, guide) {
  var W = currentCollection.collectionInfo.W * currentCollection.collectionInfo.resolution;
  var H = currentCollection.collectionInfo.H * currentCollection.collectionInfo.resolution;

  p.card.stroke(255, 0, 0, 100);
  p.card.noFill();
  p.card.strokeWeight(W * 0.007);

  switch (guide) {
    case "center":
      p.card.line(W / 2, 0, W / 2, H);
      p.card.line(0, H / 2, W, H / 2);

      break;

    case "grid3":
      for (let i = 0; i < 2; i++) {
        p.card.line(W / 3 + (W / 3) * i, 0, W / 3 + (W / 3) * i, H);
      }
      for (let i = 0; i < 2; i++) {
        p.card.line(0, H / 3 + (H / 3) * i, W, H / 3 + (H / 3) * i);
      }
      break;

    case "grid4":
      for (let i = 0; i < 3; i++) {
        p.card.line(W / 4 + (W / 4) * i, 0, W / 4 + (W / 4) * i, H);
      }
      for (let i = 0; i < 3; i++) {
        p.card.line(0, H / 4 + (H / 4) * i, W, H / 4 + (H / 4) * i);
      }
      break;

    case "grid6":
      for (let i = 0; i < 5; i++) {
        p.card.line(W / 6 + (W / 6) * i, 0, W / 6 + (W / 6) * i, H);
      }
      for (let i = 0; i < 5; i++) {
        p.card.line(0, H / 6 + (H / 6) * i, W, H / 6 + (H / 6) * i);
      }
      break;

    case "circle":
      p.card.ellipse(W * 0.5, H * 0.5, W, H);
      break;

    case "hexp":
      p.card.beginShape();
      for (let i = 0; i < 6; i++) {
        p.card.vertex(W / 2 + (Math.cos(Math.PI / 2 + ((Math.PI * 2) / 6) * i) * H) / 2, H / 2 + (Math.sin(Math.PI / 2 + ((Math.PI * 2) / 6) * i) * H) / 2);
      }
      p.card.endShape(p.CLOSE);

      break;

    case "hexl":
      p.card.beginShape();
      for (let i = 0; i < 6; i++) {
        p.card.vertex(W / 2 + (Math.cos(((Math.PI * 2) / 6) * i) * W) / 2, H / 2 + (Math.sin(((Math.PI * 2) / 6) * i) * W) / 2);
      }
      p.card.endShape(p.CLOSE);

      break;

    case "oct":
      p.card.beginShape();
      for (let i = 0; i < 8; i++) {
        p.card.vertex(W / 2 + Math.cos((Math.PI * 2) / 16 + ((Math.PI * 2) / 8) * i) * W * 0.54, H / 2 + Math.sin((Math.PI * 2) / 16 + ((Math.PI * 2) / 8) * i) * H * 0.54);
      }
      p.card.endShape(p.CLOSE);

      break;
  }
}
