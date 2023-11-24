// ELEMENTS ARE : IMAGE, TEXT, STRIP (multiple images with a given offset)

const template = [
  // BASIC TEMPLATE TO ADAPT TO YOUR NEEDS
  // TEMPLATE WILL RENDER ELEMENTS IN ORDER
  // START WITH THE BACKGROUND AND END WITH THE CLOSEST ELEMENTS
  // IN KEY:VALUE pairs, VALUES MUST BE DOUBLE-QUOTED
  {
    element: "IMAGE",
    src: "bg",
    type: "dynamic", // "dynamic" will look for src_0, src_1, src_2...
    position_x: "cardW*0.5", // You can use pixels or cardW, cardH for evenly sized elements
    position_y: "cardH*0.5",
    width: "cardW",
    height: "cardH*0.95",
    anchor: "CENTER", // Images are positioned by their center by default, (CENTER, CORNER)

    // A CODER
    image_tint : "[255, 0, 0]",
    card_tint : "custom_color"
  },
  {
    element: "IMAGE",
    src: "ui",
    type: "static", // "static" will look for the src in assets/ folder)
    position_x: "cardW*0.5",
    position_y: "cardH*0.5",
    width: "cardW",
    height: "cardH",
  },
  {
    element: "TEXT",
    src: "title", // Texts use the keys you put in the cards list as sources
    position_x: "cardW*0.5",
    position_y: "cardH*0.1",
    size: "60", // defaults to 20, change it only if needed
    align: "CENTER", // defaults to "LEFT", change it only if needed ("LEFT", "CENTER", "RIGHT")
    font: "title_font", //Custom font will be loaded if found in assets folder. Don't forget the type !

    // A CODER
    shadow_offset_x : "5",
    shadow_offset_y : "5",
    shadow_color : "[0, 100]",
  },

  {
    element: "TEXT",
    trigger: "has_text_effect", // Triggers can be set in cards to activate an element or not
    src: "effect",
    position_x: "cardW*0.5",
    position_y: "cardH*0.855",
    size: "35",
    align: "CENTER",
  },
  {
    element: "IMAGE",
    trigger: "has_image_effect",
    src: "image_effect",
    type: "static",
    position_x: "cardW*0.5",
    position_y: "cardH*0.843",
    width: "150",
    height: "150",
  },
  {
    element: "TEXT",
    src: "observation",
    position_x: "cardW*0.195",
    position_y: "cardH*0.35",
    align: "CENTER",
    size: "80",
    font: "title_font",
    color: "[255, 100, 0]",
    // A CODER
    angle: "5", // Rotations are expressed in degrees
  },
  {
    element: "TEXT",
    src: "storage",
    position_x: "cardW*0.825",
    position_y: "cardH*0.35",
    align: "CENTER",
    size: "80",
    font: "title_font",
    color: "[127, 68, 0]",
  },
  {
    element: "STRIP",
    src: "effect_cost", //The list of images to show

    //A CODER
    type : "card_based", //Like any image, STRIP can be cardBased, src then refers to the card parameter

    position_x: "cardW*0.5",
    position_y: "cardH*0.755",
    width: "60",
    height: "60",
    spacing_x: "70", // The horizontal spacing between elements
    spacing_y: "0",  // The vertical   spacing between elements
    style : "alternate", // Each item will drift from their position by corresponding offset amount
    offset_x : "0",
    offset_y : "0",
    align: "CENTER", // Where is the strip anchored, defaults to LEFT
  },
];
