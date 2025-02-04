import { currentCollection } from "./core/collectionsManager.js";
import { generatePDF } from "./pdfGeneration.js";
import { app } from "./app.js";
import { assetsLibrary, errorImage } from "./core/assetsManager.js";
import { IMAGE_parameters, TEXT_parameters, SHAPE_parameters } from "./core/componentsUI.js";

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
  let currentElements = currentCollection.elements.data;
  let currentTemplate = currentCollection.template;

  let componentData = currentTemplate[componentIndex];

  let elementData = currentElements[elementIndex];

  var _src = getActualValue(componentData.src, elementIndex, "", false).toString();

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

  var _positionX = getActualValue(componentData.positionX, elementIndex, 0, true);
  var _positionY = getActualValue(componentData.positionY, elementIndex, 0, true);
  var _width = getActualValue(componentData.width, elementIndex, "W", true);
  var _height = getActualValue(componentData.height, elementIndex, "W", true);
  var _anchor = getActualValue(componentData.anchor, elementIndex, p5.CENTER, true);
  var _mirror = getActualValue(componentData.mirror, elementIndex, "none", false);
  var _angle = getActualValue(componentData.angle, elementIndex, 0, true);
  var _tint = getActualValue(componentData.tint, elementIndex, "#FFFFFF", false);
  var _opacity = getActualValue(componentData.opacity, elementIndex, 1, true);
  var _size = getActualValue(componentData.size, elementIndex, 5, true);
  var _font = getActualValue(componentData.font, elementIndex, "Verdana", false);
  var _color = getActualValue(componentData.color, elementIndex, "#000000", false);
  var _borderColor = getActualValue(componentData.borderColor, elementIndex, "#FF0000", false);
  var _borderOpacity = getActualValue(componentData.borderOpacity, elementIndex, 1, false);
  var _borderWeight = getActualValue(componentData.borderWeight, elementIndex, 3, false);

  var _listAnchor = getActualValue(componentData.listAnchor, elementIndex, p5.CENTER, true);
  var _spacingX = getActualValue(componentData.spacingX, elementIndex, 0, true);
  var _spacingY = getActualValue(componentData.spacingY, elementIndex, 0, true);
  var _style = getActualValue(componentData.style, elementIndex, "straight", false);
  var _offsetX = getActualValue(componentData.offsetX, elementIndex, 0, true);
  var _offsetY = getActualValue(componentData.offsetY, elementIndex, 0, true);

  var _shadow = getActualValue(componentData.shadow, elementIndex, false, false);
  var _shadowColor = getActualValue(componentData.shadowColor, elementIndex, "#000000", false);
  var _shadowOpacity = getActualValue(componentData.shadowOpacity, elementIndex, 30, true);
  var _shadowOffsetX = getActualValue(componentData.shadowOffsetX, elementIndex, 10, true);
  var _shadowOffsetY = getActualValue(componentData.shadowOffsetY, elementIndex, 10, true);
  var _shadowBlur = getActualValue(componentData.shadowBlur, elementIndex, 0, true);

  try {
    p5.card.angleMode(p5.DEGREES);

    var totalCopies = 1;
    var W = currentCollection.collectionInfo.W * currentCollection.collectionInfo.resolution;
    var H = currentCollection.collectionInfo.H * currentCollection.collectionInfo.resolution;
    if (_mirror == "hori") totalCopies = 2;
    if (_mirror == "corners") totalCopies = 4;

    for (let copy = 0; copy < totalCopies; copy++) {
      p5.card.push();

      p5.card.translate(_positionX, _positionY);

      if ((copy == 1 && _mirror == "hori") || (copy == 1 && _mirror == "corners")) p5.card.translate((W / 2 - _positionX) * 2, 0);
      else if (copy == 2 && _mirror == "corners") {
        p5.card.translate((W / 2 - _positionX) * 2, 0);
        p5.card.translate(0, (H / 2 - _positionY) * 2);
        p5.card.rotate(180);
      } else if (copy == 3 && _mirror == "corners") {
        p5.card.translate(0, (H / 2 - _positionY) * 2);
        p5.card.rotate(180);
      }

      if (_angle !== 0) p5.card.rotate(_angle);

      //! SHAPE
      if (componentType == "SHAPE") {
        var passes = 1;
        if (_shadow) passes = 2;
        p5.card.strokeJoin(p5.ROUND);

        for (var pass = 0; pass < passes; pass++) {
          if (pass == 0) {
            if (_anchor === p5.CENTER) p5.card.translate(-_width / 2, -_height / 2);
            if (_shadow) {
              p5.card.fill(_shadowColor + zeroPad(Math.floor(_shadowOpacity * 255).toString(16), 2));
              p5.card.noStroke();
              p5.card.translate(_shadowOffsetX, _shadowOffsetY);
            } else {
              p5.card.fill(_color + zeroPad(Math.floor(_opacity * 255).toString(16), 2));
              p5.card.stroke(_borderColor + Math.floor(_borderOpacity * 255).toString(16));
              if (_borderWeight != 0) p5.card.strokeWeight(_borderWeight);
              else p5.card.noStroke();
            }
          } else {
            p5.card.fill(_color + zeroPad(Math.floor(_opacity * 255).toString(16), 2));
            p5.card.stroke(_borderColor + Math.floor(_borderOpacity * 255).toString(16));
            if (_borderWeight != 0) p5.card.strokeWeight(_borderWeight);
            else p5.card.noStroke();
          }

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

              p5.card.stroke(_borderColor + zeroPad(Math.floor(_borderOpacity * 255).toString(16), 2));
              if (_borderWeight != 0) p5.card.strokeWeight(_borderWeight);
              else p5.card.noStroke();
              p5.card.noFill();
              p5.card.ellipse(0, 0, _width, _height);
              p5.card.ellipse(0, 0, _width * 0.4, _height * 0.4);
              break;
            case "target":
              p5.card.translate(_width / 2, _height / 2);
              p5.card.noStroke();
              p5.card.beginShape();
              for (var i = 0; i < 61; i++) {
                p5.card.vertex(Math.cos((i / 60) * Math.PI * 2) * _width * 0.5, Math.sin((i / 60) * Math.PI * 2) * _height * 0.5);
              }
              for (var i = 0; i < 61; i++) {
                p5.card.vertex(Math.cos((i / 60) * Math.PI * 2) * _width * 0.4, -Math.sin((i / 60) * Math.PI * 2) * _height * 0.4);
              }
              p5.card.endShape(p5.CLOSE);

              p5.card.beginShape();
              for (var i = 0; i < 61; i++) {
                p5.card.vertex(Math.cos((i / 60) * Math.PI * 2) * _width * 0.3, Math.sin((i / 60) * Math.PI * 2) * _height * 0.3);
              }
              for (var i = 0; i < 61; i++) {
                p5.card.vertex(Math.cos((i / 60) * Math.PI * 2) * _width * 0.2, -Math.sin((i / 60) * Math.PI * 2) * _height * 0.2);
              }
              p5.card.endShape(p5.CLOSE);

              p5.card.ellipse(0, 0, _width * 0.2, _height * 0.2);

              p5.card.stroke(_borderColor + zeroPad(Math.floor(_borderOpacity * 255).toString(16), 2));
              if (_borderWeight != 0) p5.card.strokeWeight(_borderWeight);
              else p5.card.noStroke();
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
                var radiusX = _width * 0.3 + (i % 2) * _width * 0.2;
                var radiusY = _height * 0.3 + (i % 2) * _height * 0.2;
                p5.card.vertex(Math.cos(Math.PI / (branches * 2) + (i / branches) * Math.PI) * radiusX, Math.sin(Math.PI / (branches * 2) + (i / branches) * Math.PI) * radiusY);
              }
              p5.card.endShape(p5.CLOSE);
              break;
            case "sun":
              var branches = 20;
              p5.card.beginShape();
              p5.card.translate(_width / 2, _height / 2);
              for (var i = 0; i < branches * 2; i++) {
                var radiusX = _width * 0.45 + (i % 2) * _width * 0.05;
                var radiusY = _height * 0.45 + (i % 2) * _height * 0.05;
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
              p5.card.vertex(_width * 0, _height * 0.1);
              p5.card.bezierVertex(_width * 0.25, _height * 0, _width * 0.25, _height * 0, _width * 0.5, _height * 0.1);
              p5.card.bezierVertex(_width * 0.75, _height * 0, _width * 0.75, _height * 0, _width * 1, _height * 0.1);
              p5.card.vertex(_width * 1, _height * 1);
              p5.card.bezierVertex(_width * 0.75, _height * 0.9, _width * 0.75, _height * 0.9, _width * 0.5, _height * 1);
              p5.card.bezierVertex(_width * 0.25, _height * 0.9, _width * 0.25, _height * 0.9, _width * 0, _height * 1);
              p5.card.endShape(p5.CLOSE);
              break;
            case "cloud":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.3, _height * 0.8);
              p5.card.bezierVertex(_width * -0.08, _height * 0.8, _width * -0.1, _height * 0.4, _width * 0.2, _height * 0.35);
              p5.card.bezierVertex(_width * 0.2, _height * 0.1, _width * 0.55, _height * 0.1, _width * 0.6, _height * 0.3);
              p5.card.bezierVertex(_width * 0.7, _height * 0.2, _width * 0.85, _height * 0.3, _width * 0.83, _height * 0.4);
              p5.card.bezierVertex(_width * 1.1, _height * 0.4, _width * 1.05, _height * 0.8, _width * 0.75, _height * 0.8);
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
              p5.card.rect(0, 0, _width, _height, _height * 0.05);
              p5.card.endShape(p5.CLOSE);
              break;
            case "leaf":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.055, _height * 0.94);
              p5.card.bezierVertex(_width * 0.11, _height * 0.8375, _width * 0.11, _height * 0.8375, _width * 0.1775, _height * 0.73);
              p5.card.bezierVertex(_width * 0.08, _height * 0.5, _width * 0.07, _height * 0.2, _width * 0.635, _height * 0.1525);
              p5.card.bezierVertex(_width * 0.8125, _height * 0.12, _width * 0.8125, _height * 0.12, _width * 0.9025, _height * 0);
              p5.card.bezierVertex(_width * 1.17, _height * 0.7, _width * 0.5, _height * 1.05, _width * 0.255, _height * 0.7975);
              p5.card.bezierVertex(_width * 0.2075, _height * 0.895, _width * 0.2075, _height * 0.895, _width * 0.18, _height * 0.965);
              p5.card.bezierVertex(_width * 0.15, _height * 1.02, _width * 0.055, _height * 0.9825, _width * 0.055, _height * 0.94);
              p5.card.endShape(p5.CLOSE);
              break;
            case "wing":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.095, _height * 0.9825);
              p5.card.bezierVertex(_width * -0.14, _height * 0.7, _width * 0.0275, _height * 0.4, _width * 0.57, _height * 0.25);
              p5.card.bezierVertex(_width * 0.75, _height * 0.2, _width * 0.85, _height * 0.13, _width * 1, _height * 0.0);
              p5.card.bezierVertex(_width * 1.025, _height * 0.1525, _width * 0.8825, _height * 0.34, _width * 0.63, _height * 0.45);
              p5.card.bezierVertex(_width * 0.72, _height * 0.445, _width * 0.72, _height * 0.445, _width * 0.885, _height * 0.38);
              p5.card.bezierVertex(_width * 0.8775, _height * 0.53, _width * 0.72, _height * 0.65, _width * 0.47, _height * 0.67);
              p5.card.bezierVertex(_width * 0.53, _height * 0.6875, _width * 0.5975, _height * 0.6875, _width * 0.7, _height * 0.67);
              p5.card.bezierVertex(_width * 0.6425, _height * 0.815, _width * 0.57, _height * 0.8225, _width * 0.3875, _height * 0.85);
              p5.card.bezierVertex(_width * 0.245, _height * 0.8625, _width * 0.1425, _height * 0.885, _width * 0.095, _height * 0.9825);
              p5.card.endShape(p5.CLOSE);
              break;
            case "tree":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.3175, _height * 1);
              p5.card.bezierVertex(_width * 0.3525, _height * 0.845, _width * 0.385, _height * 0.725, _width * 0.3775, _height * 0.61);
              p5.card.vertex(_width * 0.345, _height * 0.565);
              p5.card.bezierVertex(_width * 0.15, _height * 0.7, _width * -0.1, _height * 0.575, _width * 0.03, _height * 0.33);
              p5.card.bezierVertex(_width * -0.12, _height * 0.0, _width * 0.3, _height * -0.05, _width * 0.4325, _height * 0.045);
              p5.card.bezierVertex(_width * 0.65, _height * -0.05, _width * 0.75, _height * 0.05, _width * 0.7825, _height * 0.1925);
              p5.card.bezierVertex(_width * 1.08, _height * 0.22, _width * 1.02, _height * 0.43, _width * 0.88, _height * 0.485);
              p5.card.bezierVertex(
                _width * 0.88,
                _height * 0.59,

                _width * 0.75,
                _height * 0.73,
                _width * 0.595,
                _height * 0.595
              );
              p5.card.vertex(_width * 0.525, _height * 0.6375);
              p5.card.bezierVertex(
                _width * 0.51,
                _height * 0.77,
                _width * 0.54,
                _height * 0.88,

                _width * 0.5875,
                _height * 1
              );
              p5.card.vertex(_width * 0.3175, _height * 1);
              p5.card.endShape(p5.CLOSE);
              break;
            case "tick":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.3, _height * 0.86);
              p5.card.vertex(_width * 0.03, _height * 0.59);
              p5.card.bezierVertex(_width * -0.07, _height * 0.49, _width * 0.1, _height * 0.34, _width * 0.18, _height * 0.43);
              p5.card.vertex(_width * 0.4, _height * 0.63);
              p5.card.vertex(_width * 0.8, _height * 0.12);
              p5.card.bezierVertex(_width * 0.88, _height * 0.03, _width * 1.06, _height * 0.16, _width * 0.97, _height * 0.28);
              p5.card.vertex(_width * 0.48, _height * 0.87);
              p5.card.bezierVertex(_width * 0.45, _height * 0.92, _width * 0.35, _height * 0.92, _width * 0.3, _height * 0.86);
              p5.card.endShape(p5.CLOSE);
              break;
            case "banner":
              p5.card.beginShape();
              p5.card.vertex(_width * 0, _height * 0);
              p5.card.vertex(_width * 1, _height * 0);
              p5.card.vertex(_width * 1, _height * 1);
              p5.card.vertex(_width * 0.5, _height * 0.8);
              p5.card.vertex(_width * 0, _height * 1);
              p5.card.endShape(p5.CLOSE);
              break;
            case "moon":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.5, _height * 0);
              p5.card.bezierVertex(_width * 1.15, _height * 0, _width * 1.15, _height * 1, _width * 0.5, _height * 1);
              p5.card.bezierVertex(_width * 0.7, _height * 0.6, _width * 0.7, _height * 0.4, _width * 0.5, _height * 0);
              p5.card.endShape(p5.CLOSE);
              break;
            case "fire":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.49, _height * 1);
              p5.card.bezierVertex(_width * 0.12, _height * 0.95, _width * 0.05, _height * 0.53, _width * 0.22, _height * 0.31);
              p5.card.bezierVertex(_width * 0.22, _height * 0.35, _width * 0.22, _height * 0.4, _width * 0.28, _height * 0.45);
              p5.card.bezierVertex(_width * 0.25, _height * 0.3, _width * 0.34, _height * 0.1, _width * 0.61, _height * 0.0);
              p5.card.bezierVertex(_width * 0.485, _height * 0.25, _width * 0.73, _height * 0.34, _width * 0.75, _height * 0.57);
              p5.card.bezierVertex(_width * 0.78, _height * 0.49, _width * 0.81, _height * 0.45, _width * 0.8, _height * 0.34);
              p5.card.bezierVertex(_width * 0.95, _height * 0.59, _width * 0.9, _height * 0.98, _width * 0.49, _height * 1);
              p5.card.endShape(p5.CLOSE);
              break;
            case "mountain":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.0, _height * 0.83);
              p5.card.vertex(_width * 0.25, _height * 0.35);
              p5.card.vertex(_width * 0.36, _height * 0.39);
              p5.card.vertex(_width * 0.51, _height * 0.16);
              p5.card.vertex(_width * 0.72, _height * 0.49);
              p5.card.vertex(_width * 0.76, _height * 0.46);
              p5.card.vertex(_width * 0.99, _height * 0.83);
              p5.card.endShape(p5.CLOSE);
              break;
            case "hourglass":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.25, _height * 0.93);
              p5.card.bezierVertex(_width * 0.25, _height * 0.71, _width * 0.29, _height * 0.63, _width * 0.39, _height * 0.56);
              p5.card.bezierVertex(_width * 0.44, _height * 0.53, _width * 0.44, _height * 0.47, _width * 0.39, _height * 0.43);
              p5.card.bezierVertex(_width * 0.29, _height * 0.37, _width * 0.25, _height * 0.29, _width * 0.25, _height * 0.07);
              p5.card.bezierVertex(_width * 0.18, _height * 0.07, _width * 0.18, _height * 0.0, _width * 0.25, _height * 0.0);
              p5.card.vertex(_width * 0.75, _height * 0.0);
              p5.card.bezierVertex(_width * 0.82, _height * 0.0, _width * 0.82, _height * 0.07, _width * 0.75, _height * 0.07);
              p5.card.bezierVertex(_width * 0.75, _height * 0.29, _width * 0.71, _height * 0.37, _width * 0.6, _height * 0.44);
              p5.card.bezierVertex(_width * 0.56, _height * 0.47, _width * 0.56, _height * 0.53, _width * 0.6, _height * 0.55);
              p5.card.bezierVertex(_width * 0.71, _height * 0.63, _width * 0.75, _height * 0.71, _width * 0.75, _height * 0.93);
              p5.card.bezierVertex(_width * 0.82, _height * 0.93, _width * 0.82, _height * 1, _width * 0.76, _height * 1);
              p5.card.vertex(_width * 0.25, _height * 1.0);
              p5.card.bezierVertex(_width * 0.18, _height * 1, _width * 0.18, _height * 0.93, _width * 0.25, _height * 0.93);
              p5.card.endShape(p5.CLOSE);
              break;
            case "stone":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.0, _height * 0.47);
              p5.card.vertex(_width * 0.28, _height * 0.26);
              p5.card.vertex(_width * 0.53, _height * 0.24);
              p5.card.vertex(_width * 0.69, _height * 0.21);
              p5.card.vertex(_width * 1.0, _height * 0.44);
              p5.card.vertex(_width * 0.97, _height * 0.7);
              p5.card.vertex(_width * 0.95, _height * 0.75);
              p5.card.vertex(_width * 0.57, _height * 0.83);
              p5.card.vertex(_width * 0.39, _height * 0.8);
              p5.card.vertex(_width * 0.23, _height * 0.84);
              p5.card.vertex(_width * 0.04, _height * 0.72);
              p5.card.vertex(_width * 0.02, _height * 0.68);
              p5.card.endShape(p5.CLOSE);
              break;
            case "battery":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.33, _height * 1);
              p5.card.bezierVertex(_width * 0.29, _height * 1, _width * 0.25, _height * 0.97, _width * 0.25, _height * 0.92);
              p5.card.vertex(_width * 0.25, _height * 0.15);
              p5.card.bezierVertex(_width * 0.25, _height * 0.12, _width * 0.27, _height * 0.08, _width * 0.31, _height * 0.08);
              p5.card.vertex(_width * 0.38, _height * 0.08);
              p5.card.vertex(_width * 0.38, _height * 0.03);
              p5.card.bezierVertex(_width * 0.38, _height * 0, _width * 0.4, _height * 0, _width * 0.41, _height * 0);
              p5.card.vertex(_width * 0.59, _height * 0);
              p5.card.bezierVertex(_width * 0.6, _height * 0, _width * 0.62, _height * 0, _width * 0.62, _height * 0.03);
              p5.card.vertex(_width * 0.62, _height * 0.08);
              p5.card.vertex(_width * 0.68, _height * 0.08);
              p5.card.bezierVertex(_width * 0.73, _height * 0.08, _width * 0.75, _height * 0.12, _width * 0.75, _height * 0.15);
              p5.card.vertex(_width * 0.75, _height * 0.92);
              p5.card.bezierVertex(_width * 0.75, _height * 0.97, _width * 0.71, _height * 1, _width * 0.67, _height * 1);
              p5.card.vertex(_width * 0.33, _height * 1);
              p5.card.endShape(p5.CLOSE);
              break;
            case "egg":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.11, _height * 0.57);
              p5.card.bezierVertex(_width * 0.18, _height * -0.17, _width * 0.82, _height * -0.17, _width * 0.89, _height * 0.57);
              p5.card.bezierVertex(_width * 0.9, _height * 1.13, _width * 0.1, _height * 1.13, _width * 0.11, _height * 0.57);
              p5.card.endShape(p5.CLOSE);
              break;
            case "puzzle":
              p5.card.beginShape();
              p5.card.vertex(_width * 0.21, _height * 0.78);
              p5.card.vertex(_width * 0.21, _height * 0.59);
              p5.card.bezierVertex(_width * 0.18, _height * 0.5, _width * 0.08, _height * 0.7, _width * 0.08, _height * 0.5);
              p5.card.bezierVertex(_width * 0.08, _height * 0.3, _width * 0.18, _height * 0.5, _width * 0.21, _height * 0.41);
              p5.card.vertex(_width * 0.21, _height * 0.22);
              p5.card.vertex(_width * 0.39, _height * 0.22);
              p5.card.bezierVertex(_width * 0.5, _height * 0.25, _width * 0.3, _height * 0.35, _width * 0.5, _height * 0.35);
              p5.card.bezierVertex(_width * 0.7, _height * 0.35, _width * 0.5, _height * 0.25, _width * 0.61, _height * 0.22);
              p5.card.vertex(_width * 0.79, _height * 0.22);
              p5.card.vertex(_width * 0.79, _height * 0.39);
              p5.card.bezierVertex(_width * 0.82, _height * 0.5, _width * 0.92, _height * 0.3, _width * 0.92, _height * 0.5);
              p5.card.bezierVertex(_width * 0.92, _height * 0.7, _width * 0.82, _height * 0.5, _width * 0.79, _height * 0.61);
              p5.card.vertex(_width * 0.79, _height * 0.78);
              p5.card.vertex(_width * 0.61, _height * 0.78);
              p5.card.bezierVertex(_width * 0.5, _height * 0.75, _width * 0.7, _height * 0.65, _width * 0.5, _height * 0.65);
              p5.card.bezierVertex(_width * 0.3, _height * 0.65, _width * 0.5, _height * 0.75, _width * 0.39, _height * 0.78);
              p5.card.endShape(p5.CLOSE);
              break;
            case "key":
              p5.card.noStroke();
              p5.card.beginShape();
              p5.card.vertex(_width * 0.44, _height * 0.62);
              p5.card.bezierVertex(_width * 0.26, _height * 0.86, _width * 0, _height * 0.68, _width * 0, _height * 0.5);
              p5.card.bezierVertex(_width * 0, _height * 0.32, _width * 0.26, _height * 0.14, _width * 0.44, _height * 0.38);
              p5.card.vertex(_width * 0.91, _height * 0.38);
              p5.card.vertex(_width * 1, _height * 0.48);
              p5.card.vertex(_width * 0.89, _height * 0.59);
              p5.card.vertex(_width * 0.83, _height * 0.54);
              p5.card.vertex(_width * 0.77, _height * 0.59);
              p5.card.vertex(_width * 0.71, _height * 0.54);
              p5.card.vertex(_width * 0.66, _height * 0.59);
              p5.card.vertex(_width * 0.6, _height * 0.54);
              p5.card.vertex(_width * 0.53, _height * 0.62);
              p5.card.vertex(_width * 0.44, _height * 0.62);

              for (var i = 0; i < 61; i++) {
                p5.card.vertex(_width * 0.135 + Math.cos((i / 60) * Math.PI * 2) * _width * 0.065, _height * 0.5 - Math.sin((i / 60) * Math.PI * 2) * _height * 0.065);
              }
              p5.card.endShape(p5.CLOSE);

              p5.card.stroke(_borderColor + zeroPad(Math.floor(_borderOpacity * 255).toString(16), 2));
              if (_borderWeight != 0) p5.card.strokeWeight(_borderWeight);
              else p5.card.noStroke();
              p5.card.noFill();

              p5.card.beginShape();
              p5.card.vertex(_width * 0.44, _height * 0.62);
              p5.card.bezierVertex(_width * 0.26, _height * 0.86, _width * 0, _height * 0.68, _width * 0, _height * 0.5);
              p5.card.bezierVertex(_width * 0, _height * 0.32, _width * 0.26, _height * 0.14, _width * 0.44, _height * 0.38);
              p5.card.vertex(_width * 0.91, _height * 0.38);
              p5.card.vertex(_width * 1, _height * 0.48);
              p5.card.vertex(_width * 0.89, _height * 0.59);
              p5.card.vertex(_width * 0.83, _height * 0.54);
              p5.card.vertex(_width * 0.77, _height * 0.59);
              p5.card.vertex(_width * 0.71, _height * 0.54);
              p5.card.vertex(_width * 0.66, _height * 0.59);
              p5.card.vertex(_width * 0.6, _height * 0.54);
              p5.card.vertex(_width * 0.53, _height * 0.62);
              p5.card.vertex(_width * 0.44, _height * 0.62);
              p5.card.endShape(p5.CLOSE);

              p5.card.ellipse(_width * 0.135, _height * 0.5, _width * 0.065 * 2, _height * 0.065 * 2);

              break;

            default:
              // Handle the case where the element value doesn't match any of the cases
              break;
          }

          if (pass == 0 && _shadow) {
            p5.card.translate(-_shadowOffsetX, -_shadowOffsetY);
          }
        }
      }

      //! TEXT
      else if (componentType == "TEXT") {
        p5.card.noStroke();
        p5.card.textAlign(_anchor, p5.CENTER);
        p5.card.textFont(_font);
        p5.card.textSize(_size * currentCollection.collectionInfo.H * currentCollection.collectionInfo.resolution * 0.02);

        if (_shadow) {
          p5.card.fill(_shadowColor + zeroPad(Math.floor(_shadowOpacity * 255).toString(16), 2));
          p5.card.text(_textToWrite, _shadowOffsetX, _shadowOffsetY);
        }

        p5.card.fill(_color + zeroPad(Math.floor(_opacity * 255).toString(16), 2));
        p5.card.text(_textToWrite, 0, 0);
      }

      //! IMAGE / STRIP
      else if (componentType == "IMAGE") {
        var _totalWidth = (_elementsList.length * Math.min(_width, _spacingX) + (_elementsList.length - 2) * _spacingX) / 2;
        var _totalHeight = (_elementsList.length * Math.min(_height, _spacingY) + (_elementsList.length - 1) * _spacingY) / 2;

        p5.card.imageMode(_anchor);

        var passes = 1;
        if (_shadow) passes = 2;

        for (let i = 0; i < _elementsList.length; i++) {
          for (var pass = 0; pass < passes; pass++) {
            if (pass == 0 && _shadow) {
              p5.card.tint(_shadowColor + zeroPad(Math.floor(_shadowOpacity * 255).toString(16), 2));
              p5.card.translate(_shadowOffsetX, _shadowOffsetY);
            } else {
              p5.card.tint(_tint + zeroPad(Math.floor(_opacity * 255).toString(16), 2));
            }

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

            if (pass == 0 && _shadow) {
              p5.card.translate(-_shadowOffsetX, -_shadowOffsetY);
            }
          }
        }
      }
    }
  } catch (e) {
    console.log(e.message);
    if (componentType == "IMAGE") {
      p5.card.image(errorImage, 0, 0, _width, _height);
    }
  }

  p5.card.pop();
}

function zeroPad(num, places) {
  return String(num).padStart(places, "0");
}

function getActualValue(refValue, elementIndex, dft, evaluated) {
  //GLOBAL VARIABLES THAT CAN BE USED IN EVALUATED VALUES
  let currentCollectionInfo = currentCollection.collectionInfo;
  var W = currentCollectionInfo.W * currentCollectionInfo.resolution;
  var L = currentCollectionInfo.W * currentCollectionInfo.resolution;
  var H = currentCollectionInfo.H * currentCollectionInfo.resolution;
  var INDEX = elementIndex;
  var CENTER = app.CENTER;
  var CENTRE = app.CENTER;
  var CORNER = app.CORNER;
  var COIN = app.CORNER;
  var LEFT = app.LEFT;
  var GAUCHE = app.LEFT;
  var RIGHT = app.RIGHT;
  var DROITE = app.RIGHT;

  var finalValue = "";

  //Value is not undefined
  if (refValue) {
    let fixedValue = refValue.value;
    let valueType = refValue.type;
    let cardBasedValue = refValue.valueCB;

    try {
      //Card Based
      if (valueType == "1") {
        let indexOfValue = currentCollection.elements.headers.indexOf(cardBasedValue);
        //Header present in the data
        if (indexOfValue != -1) {
          //Value with evaluation i.e. calculus available, access to global variables...
          if (evaluated) finalValue = eval(currentCollection.elements.data[elementIndex][indexOfValue]);
          //Straight values, no mods
          else finalValue = currentCollection.elements.data[elementIndex][indexOfValue];
        }
      }
      //Fixed value
      else {
        if (evaluated) finalValue = eval(fixedValue);
        else finalValue = fixedValue;
      }
    } catch (e) {
      console.log(e);
    }
  }

  return finalValue || "0" ? finalValue : dft;
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
  p.card.resetMatrix();

  //WHITE BG BY DEFAULT
  p.card.background(255);

  //COLLECTION WITH ELEMENTS
  if (currentCollection.elements.data.length > 0) {
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

  p.card.resetMatrix();
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
