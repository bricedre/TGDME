import { currentCollection } from "./collectionManager.js";
import { generatePDF } from "./pdf.js";
import { app } from "../app.js";
import { assetsLibrary, errorImage } from "./assetLoader.js";
import { IMAGE_parameters, TEXT_parameters, SHAPE_parameters, ELEMENT_parameters } from "./componentParameters.js";

export function renderComponent(p5, componentType, componentIndex, elementIndex) {
  console.log("FN : Rendu Composant");
  let currentElements = currentCollection.elements;
  let currentTemplate = currentCollection.template;

  let elementData = currentElements[elementIndex];
  let componentData = currentTemplate[componentIndex];

  // Render only if trigger is empty OR equal to good value
  if (componentData.trigger.value == "" || elementData[componentData.trigger.value]) {
    var _src = getActualValue(componentData.src, "src", componentData, elementData, elementIndex, "", false);

    _src = _src.replace("INDEX", elementIndex.toString());

    var _img;
    var _textToWrite;
    var _shape;
    var _elementsList = [];
    var _imgs = [];

    if (componentType == "IMAGE") _elementsList = _src.split(",");
    else if (componentType == "TEXT") _textToWrite = _src;
    else if (componentType == "STRIP") _shape = _src;

    if (_elementsList.length > 0) {
      for (let i = 0; i < _elementsList.length; i++) {
        if (assetsLibrary[_elementsList[i].trim()]) _imgs.push(assetsLibrary[_elementsList[i].trim()]);
      }
    }

    var _positionX = getActualValue(componentData.positionX, "positionX", componentData, elementData, elementIndex, 0, true);
    var _positionY = getActualValue(componentData.positionY, "positionY", componentData, elementData, elementIndex, 0, true);
    var _width = getActualValue(componentData.width, "width", componentData, elementData, elementIndex, "W", true);
    var _height = getActualValue(componentData.height, "height", componentData, elementData, elementIndex, "W", true);
    var _anchor = getActualValue(componentData.anchor, "anchor", componentData, elementData, elementIndex, p5.CENTER, true);
    var _angle = getActualValue(componentData.angle, "angle", componentData, elementData, elementIndex, 0, true);
    var _tint = getActualValue(componentData.tint, "tint", componentData, elementData, elementIndex, "#FFFFFF", false);
    var _opacity = getActualValue(componentData.opacity, "opacity", componentData, elementData, elementIndex, 100, true);
    var _size = getActualValue(componentData.size, "size", componentData, elementData, elementIndex, 5, true);
    var _font = getActualValue(componentData.font, "font", componentData, elementData, elementIndex, "Verdana", false);
    var _color = getActualValue(componentData.color, "color", componentData, elementData, elementIndex, "#000000", false);
    var _listAnchor = getActualValue(componentData.listAnchor, "listAnchor", componentData, elementData, elementIndex, p5.CENTER, true);
    var _spacingX = getActualValue(componentData.spacingX, "spacingX", componentData, elementData, elementIndex, 0, true);
    var _spacingY = getActualValue(componentData.spacingY, "spacingY", componentData, elementData, elementIndex, 0, true);
    var _style = getActualValue(componentData.style, "style", componentData, elementData, elementIndex, "straight", false);
    var _offsetX = getActualValue(componentData.offsetX, "offsetX", componentData, elementData, elementIndex, 0, true);
    var _offsetY = getActualValue(componentData.offsetY, "offsetY", componentData, elementData, elementIndex, 0, true);

    var _shadow = getActualValue(componentData.shadow, "shadow", componentData, elementData, elementIndex, false, false);
    var _shadowColor = getActualValue(componentData.shadowColor, "shadowColor", componentData, elementData, elementIndex, "#000000", false);
    var _shadowOpacity = getActualValue(componentData.shadowOpacity, "shadowOpacity", componentData, elementData, elementIndex, 30, true);
    var _shadowOffsetX = getActualValue(componentData.shadowOffsetX, "shadowOffsetX", componentData, elementData, elementIndex, 10, true);
    var _shadowOffsetY = getActualValue(componentData.shadowOffsetY, "shadowOffsetY", componentData, elementData, elementIndex, 10, true);
    var _shadowBlur = getActualValue(componentData.shadowBlur, "shadowBlur", componentData, elementData, elementIndex, 0, true);

    p5.card.push();
    try {
      p5.card.angleMode(p5.DEGREES);
      p5.card.translate(_positionX, _positionY);
      if (_angle !== 0) p5.card.rotate(_angle);

      //! SHAPE
      if (componentType == "SHAPE") {
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

        if (_shadow) {
          p5.card.fill(_shadowColor + Math.round(_shadowOpacity * 2.55).toString(16));
          p5.card.text(_textToWrite, _shadowOffsetX, _shadowOffsetY);
        }

        p5.card.fill(_color + Math.round(_opacity * 2.55).toString(16));
        p5.card.text(_textToWrite, 0, 0);
      }

      //! STRIP
      else if (componentType == "IMAGE") {
        var _totalWidth = (_elementsList.length * Math.min(_width, _spacingX) + (_elementsList.length - 2) * _spacingX) / 2;
        var _totalHeight = (_elementsList.length * Math.min(_height, _spacingY) + (_elementsList.length - 1) * _spacingY) / 2;

        p5.card.imageMode(_anchor);
        p5.card.tint(_tint + Math.round(_opacity * 2.55).toString(16));
        for (let i = 0; i < _elementsList.length; i++) {
          if (_listAnchor == p5.CENTER) {
            p5.card.image(
              _imgs[i],
              _elementsList.length > 1 ? (_spacingX > 0 ? i * _spacingX - _totalWidth / 2 : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offsetX : -_offsetX) : 0) : 0,
              _elementsList.length > 1 ? (_spacingY > 0 ? i * _spacingY - _totalHeight / 2 : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offsetY : -_offsetY) : 0) : 0,
              _width,
              _height
            );
          } else if (_listAnchor == p5.LEFT) {
            p5.card.image(
              _imgs[i],
              _elementsList.length > 1 ? i * _spacingX + (_style == "alternate" ? (i % 2 == 0 ? _offsetX : -_offsetX) : 0) : 0,
              _elementsList.length > 1 ? i * _spacingY + (_style == "alternate" ? (i % 2 == 0 ? _offsetY : -_offsetY) : 0) : 0,
              _width,
              _height
            );
          } else if (_listAnchor == p5.CENTER.RIGHT) {
            p5.card.image(
              _imgs[i],
              _elementsList.length > 1 ? (_spacingX > 0 ? i * _spacingX - _totalWidth : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offsetX : -_offsetX) : 0) : 0,
              _elementsList.length > 1 ? (_spacingY > 0 ? i * _spacingY - _totalHeight : 0) + (_style == "alternate" ? (i % 2 == 0 ? _offsetY : -_offsetY) : 0) : 0,
              _width,
              _height
            );
          }
        }
      }
    } catch (e) {
      if (componentType == "IMAGE") {
        p5.card.image(errorImage, 0, 0, _width, _height);
      }
    }
    p5.card.pop();
  }
}

function getActualValue(refValue, refValueName, componentData, elementData, elementIndex, dft, ev) {
  let currentCollectionInfo = currentCollection.collectionInfo;
  var W = currentCollectionInfo.W * currentCollectionInfo.resolution;
  var L = currentCollectionInfo.W * currentCollectionInfo.resolution;
  var H = currentCollectionInfo.H * currentCollectionInfo.resolution;
  var INDEX = elementIndex;

  var CENTER = app.CENTER;
  var CORNER = app.CORNER;
  var LEFT = app.LEFT;
  var RIGHT = app.RIGHT;

  var finalValue;
  if (refValue) {
    if (ev) {
      try {
        if (refValue.type == "1") {
          finalValue = eval(currentCollection.elements[elementIndex][componentData.UID][refValueName]);
        } else {
          finalValue = eval(refValue.value);
        }
      } catch (e) {}
    } else {
      try {
        if (refValue.type == "1") {
          finalValue = currentCollection.elements[app.currentIndex][componentData.UID][refValueName];
        } else {
          finalValue = refValue.value;
        }
      } catch (e) {}
    }
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
  console.log("FN : render card");

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
