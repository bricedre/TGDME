import { currentCollection } from "./collection/collectionManager.js";
import { generatePDF } from "./pdfGeneration.js";
import { app } from "./app.js";
import { assetsLibrary, errorImage } from "./assets/assetLoader.js";
import { IMAGE_parameters, TEXT_parameters, SHAPE_parameters, ELEMENT_parameters } from "./template/componentParameters.js";

//FUTURE IDEES : 
/*

Générer le fichier .csv du template actuel pour servir de base
Masque d'image
miroir : H V HV R
Autres formes : ligne, sablier, arbre, coche
ombre portée généralisée
liste sur les icones
icone dans texte

*/

export function renderComponent(p5, componentType, componentIndex, elementIndex) {
  let currentElements = currentCollection.elements;
  let currentTemplate = currentCollection.template;

  let elementData = currentElements[elementIndex];
  let componentData = currentTemplate[componentIndex];

  // Render only if trigger is empty OR equal to good value
  if (componentData.trigger.value == "" || elementData[componentData.trigger.value]) {
    var _src = getActualValue(componentData.src, "src", componentData, elementData, elementIndex, "", false);

    _src = _src.replace("INDEX", elementIndex.toString());

    var _textToWrite;
    var _shape;
    var _elementsList = [];
    var _imgs = [];

    if (componentType == "IMAGE") _elementsList = _src.split(",");
    else if (componentType == "TEXT") _textToWrite = _src;
    else if (componentType == "SHAPE") _shape = _src;

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
    var _borderColor = getActualValue(componentData.borderColor, "borderColor", componentData, elementData, elementIndex, "#FF0000", false);
    var _borderOpacity = getActualValue(componentData.borderOpacity, "borderOpacity", componentData, elementData, elementIndex, 50, false);
    var _borderWeight = getActualValue(componentData.borderWeight, "borderWeight", componentData, elementData, elementIndex, 3, false);

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
        console.log(_shape);
        p5.card.fill(_color + Math.round(_opacity * 2.55).toString(16));
        p5.card.stroke(_borderColor + Math.round(_borderOpacity * 2.55).toString(16));
        p5.card.strokeWeight(_borderWeight);
        p5.card.strokeJoin(p5.ROUND);
        if (_anchor === p5.CENTER) p5.card.translate(-_width / 2, -_height / 2);

        switch (_shape) {
          case "ring":
            p5.card.translate(_width / 2, _height / 2);
            p5.card.noStroke();
            p5.card.beginShape();
            for (var i = 0; i < 61; i++) {
              p5.card.vertex(Math.cos((i / 60) * Math.PI * 2) * _width * 0.5, Math.sin((i / 60) * Math.PI * 2) * _height * 0.5);
            }
            for (var i = 0; i < 61; i++) {
              p5.card.vertex(Math.cos((i / 60) * Math.PI * 2) * _width * 0.2, -Math.sin((i / 60) * Math.PI * 2) * _height * 0.2);
            }
            p5.card.endShape(p5.CLOSE);
            p5.card.stroke(_borderColor + Math.round(_borderOpacity * 2.55).toString(16));
            p5.card.noFill();
            p5.card.ellipse(0, 0, _width, _height);
            p5.card.ellipse(0, 0, _width * 0.4, _height * 0.4);

            break;
          case "shield":
            p5.card.beginShape();
            p5.card.vertex(0, 0);
            p5.card.vertex(0, _height * 0.2);
            p5.card.bezierVertex(_width * 0, _height * 0.9, _width * 0, _height * 0.8, _width * 0.5, _height);
            p5.card.bezierVertex(_width, _height * 0.8, _width, _height * 0.9, _width, 0);
            p5.card.endShape(p5.CLOSE);
            break;
          case "avatar":
            p5.card.ellipse(_width * 0.5, _height * 0.15, _width * 0.4, _height * 0.4);
            p5.card.beginShape();
            p5.card.vertex(_width * 0.2, _height);
            p5.card.vertex(_width * 0.2, _height * 0.7);
            p5.card.bezierVertex(_width * 0.2, _height * 0.25, _width * 0.8, _height * 0.25, _width * 0.8, _height * 0.7);
            p5.card.vertex(_width * 0.8, _height);
            p5.card.endShape(p5.CLOSE);
            break;
          case "heart":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.5, _height * 0.25);
            p5.card.bezierVertex(_width * 0.8, _height * -0.1, _width * 1.2, _height * 0.3, _width * 0.9, _height * 0.6);
            p5.card.vertex(_width * 0.5, _height);
            p5.card.vertex(_width * 0.1, _height * 0.6);
            p5.card.bezierVertex(-_width * 0.2, _height * 0.3, _width * 0.2, _height * -0.1, _width * 0.5, _height * 0.25);
            p5.card.endShape(p5.CLOSE);
            break;
          case "crown":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.1, _height * 0.7);
            p5.card.vertex(_width * 0, _height * 0.2);
            p5.card.vertex(_width * 0.33, _height * 0.4);
            p5.card.vertex(_width * 0.5, _height * 0.2);
            p5.card.vertex(_width * 0.66, _height * 0.4);
            p5.card.vertex(_width * 1, _height * 0.2);
            p5.card.vertex(_width * 0.9, _height * 0.7);
            p5.card.endShape(p5.CLOSE);
            break;
          case "cross":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.33, 0);
            p5.card.vertex(_width * 0.66, 0);
            p5.card.vertex(_width * 0.66, _height * 0.33);
            p5.card.vertex(_width * 1, _height * 0.33);
            p5.card.vertex(_width * 1, _height * 0.66);
            p5.card.vertex(_width * 0.66, _height * 0.66);
            p5.card.vertex(_width * 0.66, _height * 1);
            p5.card.vertex(_width * 0.33, _height * 1);
            p5.card.vertex(_width * 0.33, _height * 0.66);
            p5.card.vertex(_width * 0, _height * 0.66);
            p5.card.vertex(_width * 0, _height * 0.33);
            p5.card.vertex(_width * 0.33, _height * 0.33);
            p5.card.endShape(p5.CLOSE);
            break;
          case "diam":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.5, _height);
            p5.card.vertex(0, _height * 0.5);
            p5.card.vertex(_width * 0.3, _height * 0.25);
            p5.card.vertex(_width * 0.7, _height * 0.25);
            p5.card.vertex(_width, _height * 0.5);
            p5.card.endShape(p5.CLOSE);
            break;
          case "flag":
            p5.card.beginShape();
            p5.card.vertex(0, _height * 0.1);
            p5.card.bezierVertex(_width * 0.33, _height * -0.2, _width * 0.66, _height * 0.4, _width, _height * 0.1);
            p5.card.vertex(_width, _height * 0.9);
            p5.card.bezierVertex(_width * 0.66, _height * 1.2, _width * 0.33, _height * 0.6, 0, _height * 0.9);

            p5.card.endShape(p5.CLOSE);
            break;
          case "bolt":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.2, _height * 0.7);
            p5.card.vertex(_width * 0.5, _height * 0);
            p5.card.vertex(_width * 0.5, _height * 0.4);
            p5.card.vertex(_width * 0.8, _height * 0.3);
            p5.card.vertex(_width * 0.5, _height * 1);
            p5.card.vertex(_width * 0.5, _height * 0.6);
            p5.card.endShape(p5.CLOSE);
            break;
          case "star":
            var branches = 5;
            p5.card.beginShape();
            p5.card.translate(_width / 2, _height / 2);
            for (var i = 0; i < branches * 2; i++) {
              var radiusX = _width * 0.3 + (i % 2) * _width * 0.25;
              var radiusY = _height * 0.3 + (i % 2) * _height * 0.25;
              p5.card.vertex(Math.cos(Math.PI / (branches * 2) + (i / branches) * Math.PI) * radiusX, Math.sin(Math.PI / (branches * 2) + (i / branches) * Math.PI) * radiusY);
            }
            p5.card.endShape(p5.CLOSE);
            break;
          case "ellipse":
            p5.card.beginShape();
            p5.card.translate(_width / 2, _height / 2);
            p5.card.ellipse(0, 0, _width, _height);
            p5.card.endShape(p5.CLOSE);
            break;
          case "arrow":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.5, _height * 0.2);
            p5.card.vertex(_width * 0.5, _height * 0);
            p5.card.vertex(_width, _height * 0.5);
            p5.card.vertex(_width * 0.5, _height);
            p5.card.vertex(_width * 0.5, _height * 0.8);
            p5.card.vertex(_width * 0, _height * 0.8);
            p5.card.vertex(_width * 0, _height * 0.2);

            p5.card.endShape(p5.CLOSE);
            break;
          case "flower":
            p5.card.translate(_width / 2, _height / 2);
            p5.card.beginShape();
            p5.card.vertex(Math.cos(Math.PI / 2 + (0 * Math.PI) / 2.5) * _width * 0.2, Math.sin(Math.PI / 2 + (0 * Math.PI) / 2.5) * _height * 0.2);
            for (var i = 0; i < 5; i++) {
              var anchor1 = [Math.cos(Math.PI / 2 + (i * Math.PI) / 2.5) * _width * 0.8, Math.sin(Math.PI / 2 + (i * Math.PI) / 2.5) * _height * 0.8];
              var anchor2 = [Math.cos(Math.PI / 2 + ((i + 1) * Math.PI) / 2.5) * _width * 0.8, Math.sin(Math.PI / 2 + ((i + 1) * Math.PI) / 2.5) * _height * 0.8];
              var nextPoint = [Math.cos(Math.PI / 2 + ((i + 1) * Math.PI) / 2.5) * _width * 0.2, Math.sin(Math.PI / 2 + ((i + 1) * Math.PI) / 2.5) * _height * 0.2];
              p5.card.bezierVertex(anchor1[0], anchor1[1], anchor2[0], anchor2[1], nextPoint[0], nextPoint[1]);
            }
            p5.card.endShape(p5.CLOSE);
            break;
          case "drop":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.5, 0);
            p5.card.vertex(_width * 0.8, _height * 0.5);
            p5.card.bezierVertex(_width * 1.2, _height * 1.3, _width * -0.2, _height * 1.3, _width * 0.2, _height * 0.5);
            p5.card.endShape(p5.CLOSE);
            break;
          case "hexa":
            var branches = 6;
            p5.card.beginShape();
            p5.card.translate(_width / 2, _height / 2);
            for (var i = 0; i < branches; i++) {
              p5.card.vertex(Math.cos((i / branches) * Math.PI * 2) * _width * 0.5, Math.sin((i / branches) * Math.PI * 2) * _height * 0.5);
            }
            p5.card.endShape(p5.CLOSE);
            break;
          case "book":
            p5.card.beginShape();
            p5.card.vertex(_width*0, _height*0.1);
            p5.card.bezierVertex(_width*0.25, _height*0, _width*0.25, _height*0, _width*0.5, _height*0.1);
            p5.card.bezierVertex(_width*0.75, _height*0, _width*0.75, _height*0, _width*1, _height*0.1);
            p5.card.vertex(_width*1, _height*1);
            p5.card.bezierVertex(_width*0.75, _height*0.9, _width*0.75, _height*0.9, _width*0.5, _height*1);
            p5.card.bezierVertex(_width*0.25, _height*0.9, _width*0.25, _height*0.9, _width*0, _height*1);
            p5.card.endShape(p5.CLOSE);
            break;
          case "cloud":
            p5.card.beginShape();
            p5.card.vertex(_width*0.3, _height*0.8);
            p5.card.bezierVertex(_width*-0.08, _height*0.8, _width*-0.1, _height*0.4, _width*0.2, _height*0.35);
            p5.card.bezierVertex(_width*0.2, _height*0.1, _width*0.55, _height*0.1, _width*0.6, _height*0.3);
            p5.card.bezierVertex(_width*0.7, _height*0.2, _width*0.85, _height*0.3, _width*0.83, _height*0.4);
            p5.card.bezierVertex(_width*1.1, _height*0.4, _width*1.05, _height*0.8, _width*0.75, _height*0.8);
            p5.card.endShape(p5.CLOSE);
            break;
          case "octo":
            var branches = 8;
            p5.card.beginShape();
            p5.card.translate(_width / 2, _height / 2);
            for (var i = 0; i < branches; i++) {
              p5.card.vertex(Math.cos(Math.PI / 8 + (i / branches) * Math.PI * 2) * _width * 0.5, Math.sin(Math.PI / 8 + (i / branches) * Math.PI * 2) * _height * 0.5);
            }
            p5.card.endShape(p5.CLOSE);
            break;
          case "pent":
            var branches = 5;
            p5.card.beginShape();
            p5.card.translate(_width / 2, _height / 2);
            for (var i = 0; i < branches; i++) {
              p5.card.vertex(Math.cos(Math.PI * 1.1 + (i / branches) * Math.PI * 2) * _width * 0.5, Math.sin(Math.PI * 1.1 + (i / branches) * Math.PI * 2) * _height * 0.5);
            }
            p5.card.endShape(p5.CLOSE);
            break;
          case "loz":
            p5.card.beginShape();
            p5.card.vertex(_width * 0.5, 0);
            p5.card.vertex(_width, _height * 0.5);
            p5.card.vertex(_width * 0.5, _height);
            p5.card.vertex(0, _height * 0.5);
            p5.card.endShape(p5.CLOSE);
            break;
          case "tri":
            p5.card.beginShape();
            p5.card.vertex(0, _height);
            p5.card.vertex(_width * 0.5, 0);
            p5.card.vertex(_width, _height);
            p5.card.endShape(p5.CLOSE);
            break;
          case "triSqr":
            p5.card.beginShape();
            p5.card.vertex(0, 0);
            p5.card.vertex(_width, 0);
            p5.card.vertex(0, _height);
            p5.card.endShape(p5.CLOSE);
            break;
          case "rect":
            p5.card.beginShape();
            p5.card.rect(0, 0, _width, _height);
            p5.card.endShape(p5.CLOSE);
            break;

          case "rectRounded":
            p5.card.beginShape();
            p5.card.rect(0, 0, _width, _height, _height * 0.1);
            p5.card.endShape(p5.CLOSE);
            break;

          default:
            // Handle the case where the element value doesn't match any of the cases
            break;
        }
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

      //! IMAGE / STRIP
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
      console.log(e);
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
