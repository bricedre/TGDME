function renderImageElement(elementIndex, cardIndex) {
  let cardData = cards[cardIndex];

  let _img;
  let _type = "";
  let _position_x = "";
  let _position_y = "";
  let _width = "";
  let _height = "";

  // No render if no src
  if (
    template[elementIndex].trigger == null ||
    cards[cardIndex][template[elementIndex].trigger]
  ) {
    if (template[elementIndex].src) {
      if (template[elementIndex].type) {
        _type = template[elementIndex].type;

        if (_type === "static")
          _img = assetsLibrary[template[elementIndex].src];
        else if (_type === "dynamic")
          _img = assetsLibrary[template[elementIndex].src + "_" + cardIndex];
        else {
          console.log("Image Type NOT SUPPORTED. Set to static.");
          assetsLibrary[template[elementIndex].src];
        }
      }

      _position_x =
        template[elementIndex].position_x != null
          ? eval(template[elementIndex].position_x)
          : 0;
      _position_y =
        template[elementIndex].position_y != null
          ? eval(template[elementIndex].position_y)
          : 0;
      _width = template[elementIndex].width
        ? eval(template[elementIndex].width)
        : 100;
      _height = template[elementIndex].height
        ? eval(template[elementIndex].height)
        : 100;

      try {
        card.imageMode(CENTER);
        card.image(_img, _position_x, _position_y, _width, _height);
      } catch (e) {}
    }
  }
}

function renderTextElement(elementIndex, cardIndex) {
  let cardData = cards[cardIndex];

  let _textToWrite = "";
  let _align = "";
  let _position_x = "";
  let _position_y = "";
  let _size = "";
  let _font = "";

  // No render if no src
  if (
    template[elementIndex].trigger == null ||
    cards[cardIndex][template[elementIndex].trigger]
  ) {
    if (template[elementIndex].src) {
      _textToWrite = cards[cardIndex][template[elementIndex].src];
      _position_x =
        template[elementIndex].position_x != null
          ? eval(template[elementIndex].position_x)
          : 0;
      _position_y =
        template[elementIndex].position_y != null
          ? eval(template[elementIndex].position_y)
          : 0;
      _size = template[elementIndex].size
        ? eval(template[elementIndex].size)
        : 20;
      _color = template[elementIndex].color
        ? color(eval(template[elementIndex].color))
        : color(0);
      if (template[elementIndex].align) {
        if (template[elementIndex].align === "CENTER") _align = CENTER;
        else if (template[elementIndex].align === "RIGHT") _align = RIGHT;
      } else _align = LEFT;
      if (template[elementIndex].font) {
        _font = assetsLibrary[template[elementIndex].font];
      }

      try {
        card.noStroke();
        card.textAlign(_align, CENTER);
        if (_font !== "") card.textFont(_font);
        else _font = card.textFont("Verdana");
        card.textSize(_size);
        card.fill(_color);

        card.text(_textToWrite, _position_x, _position_y);
      } catch (e) {}
    }
  }
}

function renderStripElement(elementIndex, cardIndex) {
  let cardData = cards[cardIndex];

  let _imgs = [];
  let _position_x = "";
  let _position_y = "";
  let _width = "";
  let _height = "";
  let spacing_x = "";

  // No render if no src
  if (
    template[elementIndex].trigger == null ||
    cards[cardIndex][template[elementIndex].trigger]
  ) {
    if (template[elementIndex].src) {
      var elementsList = cards[cardIndex][template[elementIndex].src]
        ? cards[cardIndex][template[elementIndex].src]
        : [];

      if (elementsList.length > 0) {
        for (let i = 0; i < elementsList.length; i++) {
          _imgs.push(assetsLibrary[elementsList[i]]);
        }

        _position_x =
          template[elementIndex].position_x != null
            ? eval(template[elementIndex].position_x)
            : 0;
        _position_y =
          template[elementIndex].position_y != null
            ? eval(template[elementIndex].position_y)
            : 0;
        _width = template[elementIndex].width
          ? eval(template[elementIndex].width)
          : 100;
        _height = template[elementIndex].height
          ? eval(template[elementIndex].height)
          : 100;
        _spacing_x = template[elementIndex].spacing_x
          ? eval(template[elementIndex].spacing_x)
          : 0;
        _spacing_y = template[elementIndex].spacing_y
          ? eval(template[elementIndex].spacing_y)
          : 0;
          _style = template[elementIndex].style
          ? template[elementIndex].style
          : "straight";
          _offset_x = template[elementIndex].offset_x
          ? eval(template[elementIndex].offset_x)
          : 0;
          _offset_y = template[elementIndex].offset_y
          ? eval(template[elementIndex].offset_y)
          : 0;
        _align = template[elementIndex].align
          ? template[elementIndex].align
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
          card.imageMode(CENTER);
          for (let i = 0; i < elementsList.length; i++) {
            if (_align == "CENTER") {
              card.image(
                _imgs[i],
                _position_x + (elementsList.length > 1?((_spacing_x > 0) ? i * _spacing_x - _totalWidth / 2 : 0) + ((_style == "alternate") ? ((i%2 == 0) ? _offset_x : -_offset_x) : 0):0),
                _position_y + (elementsList.length > 1?((_spacing_y > 0) ? i * _spacing_y - _totalHeight / 2 : 0) + ((_style == "alternate") ? ((i%2 == 0) ? _offset_y : -_offset_y) : 0):0),
                _width,
                _height
              );
            } else if (_align == "LEFT") {
              card.image(
                _imgs[i],
                _position_x + (elementsList.length > 1 ? i * _spacing_x + ((_style == "alternate") ? ((i%2 == 0) ? _offset_x : -_offset_x) : 0):0),
                _position_y + (elementsList.length > 1 ? i * _spacing_y + ((_style == "alternate") ? ((i%2 == 0) ? _offset_y : -_offset_y) : 0):0),
                _width,
                _height
              );
            } else if (_align == "RIGHT") {
              card.image(
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