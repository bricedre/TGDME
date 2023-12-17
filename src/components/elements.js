import { app } from "../app.js";
import { assetsLibrary, errorImage } from "./assetLoader.js";
import { currentCollection } from "./collectionManager.js";

export function renderImageComponent(p5, componentIndex, elementIndex) {
  let currentElements = currentCollection.elements;
  let currentTemplate = currentCollection.template;

  let cardData = currentElements[elementIndex];
  let templateData = currentTemplate[componentIndex];

  let _img, _type, _position_x, _position_y, _width, _height, _anchor, _angle, _tint, _opacity;

  // No render if no src

  if (templateData.trigger.value == "" || cardData[templateData.trigger.value]) {
    var _src = getActualValue(templateData.src, "", false);

    _type = templateData.src.type;

    if (_type === "0") {
      _img = assetsLibrary[_src.value];
    } else if (_type === "1") {
      _img = assetsLibrary[currentElements[elementIndex][_src.value]];
    }

    _position_x = getActualValue(templateData.position_x, 0, true);
    _position_y = getActualValue(templateData.position_y, 0, true);
    _width = getActualValue(templateData.width, "W", true);
    _height = getActualValue(templateData.height, "W", true);
    _anchor = getActualValue(templateData.anchor, p5.CENTER, true);
    _angle = getActualValue(templateData.angle, 0, true);
    _tint = getActualValue(templateData.tint, "#FFFFFF", false);
    _opacity = getActualValue(templateData.opacity, 100, true);

    p5.card.push();
    try {
      p5.card.angleMode(p5.DEGREES);
      p5.card.imageMode(_anchor);
      p5.card.translate(_position_x, _position_y);
      if (_angle !== 0) p5.card.rotate(_angle);
      p5.card.tint(_tint + Math.round(_opacity * 2.55).toString(16));
      p5.card.image(_img, 0, 0, _width, _height);
    } catch (e) {
      console.log(e);
      p5.card.image(errorImage, 0, 0, _width, _height);
    }
    p5.card.pop();
  }
}

export function renderTextComponent(p5, componentIndex, elementIndex) {
  let currentElements = currentCollection.elements;
  let currentTemplate = currentCollection.template;

  let cardData = currentElements[elementIndex];

  let _textToWrite = "";
  let _type = "";
  let _align = "";
  let _position_x = "";
  let _position_y = "";
  let _size = "";
  let _font = "";
  let _color;
  let _opacity;
  let _angle;

  // No render if no src
  if (currentTemplate[componentIndex].trigger.value == "" || cardData[currentTemplate[componentIndex].trigger.value]) {
    if (currentTemplate[componentIndex].src) {
      if (currentTemplate[componentIndex].src.type) {
        _type = currentTemplate[componentIndex].src.type;
        _textToWrite =
          _type === "0"
            ? currentTemplate[componentIndex].src.value
            : cardData[currentTemplate[componentIndex].src.value];
      }

      _position_x = currentTemplate[componentIndex].position_x
        ? eval(currentTemplate[componentIndex].position_x.value)
        : 0;
      _position_y = currentTemplate[componentIndex].position_y
        ? eval(currentTemplate[componentIndex].position_y.value)
        : 0;

      _size = currentTemplate[componentIndex].size ? eval(currentTemplate[componentIndex].size.value) : 20;

      _color = currentTemplate[componentIndex].color ? currentTemplate[componentIndex].color.value : "#000000";

      _align = currentTemplate[componentIndex].align
        ? eval("p5." + currentTemplate[componentIndex].align.value)
        : p5.CENTER;

      _font =
        currentTemplate[componentIndex].font.value != ""
          ? assetsLibrary[currentTemplate[componentIndex].font.value]
          : "Verdana";

      _opacity = currentTemplate[componentIndex].opacity ? currentTemplate[componentIndex].opacity.value : "100";

      _angle = currentTemplate[componentIndex].angle ? currentTemplate[componentIndex].angle.value : "0";

      p5.card.push();
      try {
        p5.card.angleMode(p5.DEGREES);
        p5.card.translate(_position_x, _position_y);
        if (_angle !== 0) p5.card.rotate(_angle);
        p5.card.noStroke();
        p5.card.textAlign(_align, p5.CENTER);
        p5.card.textFont(_font);
        p5.card.textSize(_size * H * 0.02);
        p5.card.fill(_color + Math.round(_opacity * 2.55).toString(16));

        p5.card.text(_textToWrite, 0, 0);
      } catch (e) {
        console.log(e);
      }

      p5.card.pop();
    }
  }
}

export function renderStripComponent(p5, componentIndex, elementIndex) {
  let currentElements = currentCollection.elements;
  let currentTemplate = currentCollection.template;

  let cardData = currentElements[elementIndex];

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
  if (currentTemplate[componentIndex].trigger == null || cardData[template[componentIndex].trigger]) {
    if (currentTemplate[componentIndex].src) {
      var elementsList = cardData[currentTemplate[componentIndex].src]
        ? cardData[currentTemplate[componentIndex].src]
        : [];

      if (elementsList.length > 0) {
        for (let i = 0; i < elementsList.length; i++) {
          _imgs.push(assetsLibrary[elementsList[i]]);
        }

        _position_x =
          currentTemplate[componentIndex].position_x != null ? eval(currentTemplate[componentIndex].position_x) : 0;
        _position_y =
          currentTemplate[componentIndex].position_y != null ? eval(currentTemplate[componentIndex].position_y) : 0;
        _width = currentTemplate[componentIndex].width ? eval(currentTemplate[componentIndex].width) : 100;
        _height = currentTemplate[componentIndex].height ? eval(currentTemplate[componentIndex].height) : 100;
        _spacing_x = currentTemplate[componentIndex].spacing_x ? eval(currentTemplate[componentIndex].spacing_x) : 0;
        _spacing_y = currentTemplate[componentIndex].spacing_y ? eval(currentTemplate[componentIndex].spacing_y) : 0;
        _style = currentTemplate[componentIndex].style ? currentTemplate[componentIndex].style : "straight";
        _offset_x = currentTemplate[componentIndex].offset_x ? eval(currentTemplate[componentIndex].offset_x) : 0;
        _offset_y = currentTemplate[componentIndex].offset_y ? eval(currentTemplate[componentIndex].offset_y) : 0;
        _align = currentTemplate[componentIndex].align ? currentTemplate[componentIndex].align : "LEFT";

        _totalWidth = (elementsList.length * Math.min(_width, _spacing_x) + (elementsList.length - 2) * _spacing_x) / 2;

        _totalHeight =
          (elementsList.length * Math.min(_height, _spacing_y) + (elementsList.length - 1) * _spacing_y) / 2;

        try {
          p5.card.imageMode(p5.CENTER);
          for (let i = 0; i < elementsList.length; i++) {
            if (_align == "CENTER") {
              p5.card.image(
                _imgs[i],
                _position_x +
                  (elementsList.length > 1
                    ? (_spacing_x > 0 ? i * _spacing_x - _totalWidth / 2 : 0) +
                      (_style == "alternate" ? (i % 2 == 0 ? _offset_x : -_offset_x) : 0)
                    : 0),
                _position_y +
                  (elementsList.length > 1
                    ? (_spacing_y > 0 ? i * _spacing_y - _totalHeight / 2 : 0) +
                      (_style == "alternate" ? (i % 2 == 0 ? _offset_y : -_offset_y) : 0)
                    : 0),
                _width,
                _height
              );
            } else if (_align == "LEFT") {
              p5.card.image(
                _imgs[i],
                _position_x +
                  (elementsList.length > 1
                    ? i * _spacing_x + (_style == "alternate" ? (i % 2 == 0 ? _offset_x : -_offset_x) : 0)
                    : 0),
                _position_y +
                  (elementsList.length > 1
                    ? i * _spacing_y + (_style == "alternate" ? (i % 2 == 0 ? _offset_y : -_offset_y) : 0)
                    : 0),
                _width,
                _height
              );
            } else if (_align == "RIGHT") {
              p5.card.image(
                _imgs[i],
                _position_x +
                  (elementsList.length > 1
                    ? (_spacing_x > 0 ? i * _spacing_x - _totalWidth : 0) +
                      (_style == "alternate" ? (i % 2 == 0 ? _offset_x : -_offset_x) : 0)
                    : 0),
                _position_y +
                  (elementsList.length > 1
                    ? (_spacing_y > 0 ? i * _spacing_y - _totalHeight : 0) +
                      (_style == "alternate" ? (i % 2 == 0 ? _offset_y : -_offset_y) : 0)
                    : 0),
                _width,
                _height
              );
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
}

export function renderComponent(p5, componentType, componentIndex, elementIndex) {
  let currentElements = currentCollection.elements;
  let currentTemplate = currentCollection.template;

  let cardData = currentElements[elementIndex];
  let templateData = currentTemplate[componentIndex];

  let _imgs,
    _img,
    _textToWrite,
    _type,
    _position_x,
    _position_y,
    _width,
    _height,
    _size,
    _font,
    _anchor,
    _angle,
    _color,
    _tint,
    _opacity,
    _spacing_x,
    _spacing_y,
    _style,
    _offset_x,
    _offset_y,
    _totalWidth,
    _totalHeight;

  // No render if no src

  if (templateData.trigger.value == "" || cardData[templateData.trigger.value]) {
    var _src = getActualValue(templateData.src, "", false);

    _type = templateData.src.type;

    if (_type === "0") {
      if (componentType == "IMAGE") {
        _img = assetsLibrary[_src.value];
      }
    } else if (_type === "1") {
      if (componentType == "IMAGE") {
        _img = assetsLibrary[currentElements[elementIndex][_src.value]];
      }
    }

    _position_x = getActualValue(templateData.position_x, 0, true);
    _position_y = getActualValue(templateData.position_y, 0, true);
    _width = getActualValue(templateData.width, "W", true);
    _height = getActualValue(templateData.height, "W", true);
    _anchor = getActualValue(templateData.anchor, p5.CENTER, true);
    _angle = getActualValue(templateData.angle, 0, true);
    _tint = getActualValue(templateData.tint, "#FFFFFF", false);
    _opacity = getActualValue(templateData.opacity, 100, true);

    p5.card.push();
    try {
      p5.card.angleMode(p5.DEGREES);
      p5.card.imageMode(_anchor);
      p5.card.translate(_position_x, _position_y);
      if (_angle !== 0) p5.card.rotate(_angle);
      p5.card.tint(_tint + Math.round(_opacity * 2.55).toString(16));
      p5.card.image(_img, 0, 0, _width, _height);
    } catch (e) {
      console.log(e);
      p5.card.image(errorImage, 0, 0, _width, _height);
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

  var finalValue;
  if (refValue) {
    if (ev) finalValue = eval(refValue.value);
    else finalValue = refValue.value;
  } else finalValue == null;
  return finalValue ? finalValue : dft;
}
