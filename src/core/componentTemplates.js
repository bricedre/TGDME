export let shapeComponentTemplate = {
  UID:0,
  isVisible: true,
  component: "SHAPE",
  componentName: { value: "NOUVELLE FORME" },
  src: { value: "ring", type: "0" },
  positionX: { value: "0.5*W", type: "0" },
  positionY: { value: "0.5*H", type: "0" },
  width: { value: "100", type: "0" },
  height: { value: "100", type: "0" },
  anchor: { value: "CENTER", type: "0" },
  mirror: { value: "none", type: "0" },
  angle: { value: "0", type: "0" },
  color: { value: "#FFFFFF", type: "0" },
  opacity: { value: "100", type: "0" },
  borderColor: { value: "#000000", type: "0" },
  borderOpacity: { value: "100", type: "0" },
  borderWeight: { value: "3", type: "0" },
  shadowColor: { value: "#000000", type: "0" },
  shadowOffsetX: { value: "5", type: "0" },
  shadowOffsetY: { value: "5", type: "0" },
  shadowOpacity: { value: "100", type: "0" },
  shadowBlur: { value: "0", type: "0" },
};

export let textComponentTemplate = {
  UID:0,
  isVisible: true,
  component: "TEXT",
  componentName: { value: "NOUVEAU TEXTE" },
  src: { value: "texte", type: "0" },
  positionX: { value: "0.5*W", type: "0" },
  positionY: { value: "0.5*H", type: "0" },
  anchor: { value: "CENTER", type: "0" },
  mirror: { value: "none", type: "0" },
  color: { value: "#000000", type: "0" },
  size: { value: "4", type: "0" },
  font: { value: "Verdana", type: "0" },
  angle: { value: "0", type: "0" },
  opacity: { value: "100", type: "0" },
  shadowColor: { value: "#000000", type: "0" },
  shadowOffsetX: { value: "5", type: "0" },
  shadowOffsetY: { value: "5", type: "0" },
  shadowOpacity: { value: "100", type: "0" },
  shadowBlur: { value: "0", type: "0" },
};

export let imageComponentTemplate = {
  UID:0,
  isVisible: true,
  component: "IMAGE",
  componentName: { value: "NOUVELLE IMAGE" },
  src: { value: "", type: "0" },
  positionX: { value: "=0.5*W", type: "0" },
  positionY: { value: "=0.5*H", type: "0" },
  width: { value: "100", type: "0" },
  height: { value: "100", type: "0" },
  anchor: { value: "=CENTER", type: "0" },
  mirror: { value: "none", type: "0" },
  opacity: { value: "0", type: "0" },
  tint: { value: "#ffffff", type: "0" },
  angle: { value: "0", type: "0" },
  listAnchor: { value: "=CENTER", type: "0" },
  spacingX: { value: "0", type: "0" },
  spacingY: { value: "0", type: "0" },
  style: { value: "straight", type: "0" },
  offsetX: { value: "0", type: "0" },
  offsetY: { value: "0", type: "0" },
  shadowColor: { value: "#000000", type: "0" },
  shadowOffsetX: { value: "5", type: "0" },
  shadowOffsetY: { value: "5", type: "0" },
  shadowOpacity: { value: "0", type: "0" },
  shadowBlur: { value: "0", type: "0" },
};