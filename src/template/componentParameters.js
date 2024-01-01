export let IMAGE_parameters = [
  { name: "<span class='spacerIcon spacerIconCentered'>🪪</span><span>Informations Générales</span>", type: "spacer" },
  { name: "Déclenchement conditionné", refValue: "trigger", type: "checkbox", forced: true, title: "Définir dans chaque élément si ce composant est visible ou non" },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Source", refValue: "src", type: "text", title: "Image ou liste d'images à afficher. Si vous désirez créer une chaîne d'images, séparez-les par des virgules" },

  { name: "<span class='spacerIcon'>📏</span><span>Positionnement, Dimensions & Rotation</span>", type: "spacer" },
  { name: "Position Horizontale", refValue: "positionX", type: "text" },
  { name: "Position Verticale", refValue: "positionY", type: "text" },
  { name: "Largeur", refValue: "width", type: "text" },
  { name: "Hauteur", refValue: "height", type: "text" },
  { name: "Rotation", refValue: "angle", type: "text" },
  {
    name: "Ancre",
    refValue: "anchor",
    type: "select",
    options: [
      { value: "CENTER", label: "CENTRE" },
      { value: "CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
    ],
  },
  { name: "<span class='spacerIcon'>🎨</span><span>Teinte & Opacité</span>", type: "spacer" },
  { name: "Filtre de Teinte", refValue: "tint", type: "color" },
  { name: "Opacité", refValue: "opacity", type: "range" },

  { name: "<span class='spacerIcon'>🔗</span><span>Configuration de chaîne (liste d'images)</span>", type: "spacer" },
  {
    name: "Alignement de Chaîne",
    refValue: "listAnchor",
    type: "select",
    options: [
      { value: "LEFT", label: "GAUCHE" },
      { value: "CENTER", label: "CENTRE" },
      { value: "RIGHT", label: "DROITE" },
    ],
  },
  { name: "Espacement Horizontal", refValue: "spacingX", type: "text" },
  { name: "Espacement Vertical", refValue: "spacingY", type: "text" },
  {
    name: "Style de Chaîne",
    refValue: "style",
    type: "select",
    title: "Le style DÉCALÉE permet de placer plus d'images en moins d'espace",
    options: [
      { value: "straight", label: "DROITE" },
      { value: "alternate", label: "DÉCALÉE" },
    ],
  },
  { name: "Décalage Horizontal", refValue: "offsetX", type: "text", title: "Actif uniquement si Style de Chaîne = DÉCALÉE" },
  { name: "Décalage Vertical", refValue: "offsetY", type: "text", title: "Actif uniquement si Style de Chaîne = DÉCALÉE" },
];

export let SHAPE_parameters = [
  { name: "<span class='spacerIcon spacerIconCentered'>🪪</span><span>Informations Générales</span>", type: "spacer" },
  { name: "Déclenchement conditionné", refValue: "trigger", type: "checkbox", forced: true },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  {
    name: "Source",
    refValue: "src",
    type: "select",
    title: "Forme à Afficher",
    options: [
      { value: "ring", label: "⭕ANNEAU" },
      { value: "shield", label: "🛡️BOUCLIER" },
      { value: "avatar", label: "👤BUSTE" },
      { value: "heart", label: "💖COEUR" },
      { value: "crown", label: "👑COURONNE" },
      { value: "cross", label: "✖️CROIX" },
      { value: "diam", label: "💎DIAMANT" },
      { value: "flag", label: "🏴DRAPEAU" },
      { value: "bolt", label: "⚡ÉCLAIR" },
      { value: "star", label: "⭐ÉTOILE" },
      { value: "ellipse", label: "🔵ELLIPSE" },
      { value: "arrow", label: "➡️FLÈCHE" },
      { value: "flower", label: "🌷FLEUR" },
      { value: "drop", label: "💧GOUTTE" },
      { value: "hexa", label: "🔢HEXAGONE" },
      { value: "book", label: "📖LIVRE" },
      { value: "cloud", label: "☁️NUAGE" },
      { value: "octo", label: "🔢OCTOGONE" },
      { value: "pent", label: "🔢PENTAGONE" },
      { value: "trap", label: "🪁TRAPÈZE" },
      { value: "tri", label: "🗻TRIANGLE" },
      { value: "triSqr", label: "📐TRIANGLE RECTANGLE" },
      { value: "rect", label: "🟧RECTANGLE" },
    ],
  },

  { name: "<span class='spacerIcon'>📏</span><span>Positionnement, Dimensions & Rotation</span>", type: "spacer" },
  {
    name: "Ancre",
    refValue: "anchor",
    type: "select",
    options: [
      { value: "CENTER", label: "CENTRE" },
      { value: "CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
    ],
  },
  { name: "Position Horizontale", refValue: "positionX", type: "text" },
  { name: "Position Verticale", refValue: "positionY", type: "text" },
  { name: "Largeur", refValue: "width", type: "text" },
  { name: "Hauteur", refValue: "height", type: "text" },
  { name: "Rotation", refValue: "angle", type: "text" },

  { name: "<span class='spacerIcon'>🎨</span><span>Couleurs & Bordure</span>", type: "spacer" },
  { name: "Couleur de Fond", refValue: "color", type: "color" },
  { name: "Opacité du Fond", refValue: "opacity", type: "range" },
  { name: "Couleur de Bordure", refValue: "borderColor", type: "color" },
  { name: "Opacité de la Bordure", refValue: "borderOpacity", type: "range" },
  { name: "Épaisseur de la Bordure", refValue: "borderWeight", type: "text" },
];
export let TEXT_parameters = [
  { name: "<span class='spacerIcon spacerIconCentered'>🪪</span><span>Informations Générales</span>", type: "spacer" },
  { name: "Déclenchement conditionné", refValue: "trigger", type: "checkbox", forced: true },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Texte à Afficher", refValue: "src", type: "text" },

  { name: "<span class='spacerIcon'>📏</span><span>Positionnement, Dimensions & Rotation</span>", type: "spacer" },
  { name: "Position Horizontale", refValue: "positionX", type: "text" },
  { name: "Position Verticale", refValue: "positionY", type: "text" },
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
  { name: "<span class='spacerIcon'>🎨</span><span>Aspect Visuel</span>", type: "spacer" },
  { name: "Couleur", refValue: "color", type: "color" },
  { name: "Taille", refValue: "size", type: "text" },
  { name: "Police d'Écriture", refValue: "font", type: "select", optionRef: "allSystemFonts" },
  { name: "Opacité", refValue: "opacity", type: "range" },

  { name: "<span class='spacerIcon'>☀️</span><span>Ombre Portée</span>", type: "spacer" },
  { name: "Ombre Portée ?", refValue: "shadow", type: "checkbox", title: "Une légère ombre portée permet de mieux détacher votre texte du fond" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },
  { name: "Flou", refValue: "shadowBlur", type: "text" },
];

export function resetElementParameters() {
  ELEMENT_parameters = [];
}

export let ELEMENT_parameters = [];
