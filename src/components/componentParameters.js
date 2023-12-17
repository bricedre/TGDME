export let IMAGE_parameters = [
  { name: "Informations Générales", type: "spacer" },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Image à Afficher", refValue: "src", type: "text" },
  { name: "Déclenchement conditionné", refValue: "trigger", type: "checkbox", forced: true },
  { name: "Positionnement, Dimensions & Rotation", type: "spacer" },
  {
    name: "Ancre",
    refValue: "anchor",
    type: "select",
    options: [
      { value: "CENTER", label: "CENTRE" },
      { value: "CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
    ],
  },
  { name: "Position Horizontale", refValue: "position_x", type: "text" },
  { name: "Position Verticale", refValue: "position_y", type: "text" },
  { name: "Largeur", refValue: "width", type: "text" },
  { name: "Hauteur", refValue: "height", type: "text" },
  { name: "Rotation", refValue: "angle", type: "text" },
  { name: "Teinte & Opacité", type: "spacer" },
  { name: "Filtre de Teinte", refValue: "tint", type: "color" },
  { name: "Opacité", refValue: "opacity", type: "range" },
];
export let TEXT_parameters = [
  { name: "Informations Générales", type: "spacer" },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Texte à Afficher", refValue: "src", type: "text" },
  { name: "Déclenchement conditionné", refValue: "trigger", type: "checkbox", forced: true },

  { name: "Positionnement, Dimensions & Rotation", type: "spacer" },
  { name: "Position Horizontale", refValue: "position_x", type: "text" },
  { name: "Position Verticale", refValue: "position_y", type: "text" },
  { name: "Rotation", refValue: "angle", type: "text" },
  {
    name: "Alignement",
    refValue: "anchor",
    type: "select",
    options: [
      { value: "LEFT", label: "GAUCHE" },
      { value: "CENTER", label: "CENTRE" },
      { value: "RIGHT", label: "DROITE" },
    ],
  },

  { name: "Aspect Visuelle", type: "spacer" },
  { name: "Couleur", refValue: "color", type: "color" },
  { name: "Taille", refValue: "size", type: "text" },
  { name: "Police d'Écriture", refValue: "font", type: "text" },
  { name: "Opacité", refValue: "opacity", type: "range" },
];
export let STRIP_parameters = [
  { name: "Informations Générales", type: "spacer" },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Images à Afficher", refValue: "src", type: "text" },
  { name: "Déclenchement conditionné", refValue: "trigger", type: "checkbox", forced: true },

  { name: "Positionnement, Dimensions & Rotation", type: "spacer" },
  { name: "Position Horizontale", refValue: "position_x", type: "text" },
  { name: "Position Verticale", refValue: "position_y", type: "text" },
  { name: "Rotation", refValue: "angle", type: "text" },
  {
    name: "Alignement",
    refValue: "anchor",
    type: "select",
    options: [
      { value: "LEFT", label: "GAUCHE" },
      { value: "CENTER", label: "CENTRE" },
      { value: "RIGHT", label: "DROITE" },
    ],
  },
  { name: "Configuration des Images", type: "spacer" },
  { name: "Largeur", refValue: "width", type: "text" },
  { name: "Hauteur", refValue: "height", type: "text" },
  { name: "Espacement Horizontal", refValue: "spacing_x", type: "text" },
  { name: "Espacement Vertical", refValue: "spacing_y", type: "text" },
  { name: "Style de Bandeau", refValue: "style", type: "select",
  options: [
    { value: "straight", label: "DROIT" },
    { value: "alternate", label: "ALTERNÉ" }
  ], },
  { name: "Décalage Horizontal", refValue: "offset_x", type: "text" },
  { name: "Décalage Vertical", refValue: "offset_y", type: "text" },
  
];