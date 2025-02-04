export let IMAGE_parameters = [
  { name: "<span class='spacerIcon spacerIconCentered'>🪪</span><span>Informations Générales</span>", type: "spacer" },
  {
    name: "Nom du Composant",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Image(s) Source", refValue: "src", type: "text", title: "Si vous désirez créer une chaîne d'images, séparez-les par des virgules" },

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
  {
    name: "Copies sans Rotation",
    refValue: "mirror",
    type: "select",
    options: [
      { value: "none", label: "AUCUNE" },
      { value: "hori", label: "GAUCHE / DROITE" },
      { value: "corners", label: "DANS LES COINS" }
    ],
  },
  { name: "<span class='spacerIcon'>🎨</span><span>Teinte & Opacité</span>", type: "spacer" },
  { name: "Filtre de Teinte", refValue: "tint", type: "color" },
  { name: "Opacité", refValue: "opacity", type: "range" },

  { name: "<span class='spacerIcon'>☀️</span><span>Ombre Portée</span>", type: "spacer" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },
  { name: "Flou", refValue: "shadowBlur", type: "text" },

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
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  {
    name: "Forme à Afficher",
    refValue: "src",
    type: "select",
    options: [
      { value: "wing", label: "🪽 AILE" },
      { value: "ring", label: "⭕ ANNEAU" },
      { value: "tree", label: "🌳 ARBRE" },
      { value: "banner", label: "🔖 BANNIÈRE" },
      { value: "battery", label: "🔋 BATTERIE" },
      { value: "shield", label: "🛡️ BOUCLIER" },
      { value: "avatar", label: "👤 BUSTE" },
      { value: "lock", label: "🔒 CADENAS" },// A FAIRE
      { value: "target", label: "🎯 CIBLE" },
      { value: "key", label: "🔑 CLÉ" },
      { value: "tick", label: "✔️ COCHE" },
      { value: "heart", label: "💖 COEUR" },
      { value: "crown", label: "👑 COURONNE" },
      { value: "cross", label: "✖️ CROIX" },
      { value: "diam", label: "💎 DIAMANT" },
      { value: "flag", label: "🏴 DRAPEAU" },
      { value: "bolt", label: "⚡ ÉCLAIR" },
      { value: "sword", label: "⚔️ ÉPÉE" }, // A FAIRE
      { value: "star", label: "⭐ ÉTOILE" },
      { value: "ellipse", label: "🔵 ELLIPSE" },
      { value: "gear", label: "⚙️ ENGRENAGE" }, // A FAIRE
      { value: "leaf", label: "🍃 FEUILLE" },
      { value: "flask", label: "⚗️ FIOLE" },// A FAIRE
      { value: "fire", label: "🔥 FLAMME" }, 
      { value: "arrow", label: "➡️ FLÈCHE" },
      { value: "flower", label: "🌷 FLEUR" },
      { value: "drop", label: "💧 GOUTTE" },
      { value: "hexa", label: "🔢 HEXAGONE" },
      { value: "book", label: "📖 LIVRE" },
      { value: "loz", label: "🪁 LOSANGE" },
      { value: "moon", label: "🌙 LUNE" },
      { value: "medal", label: "🎖️ MÉDAILLE" },// A FAIRE
      { value: "mountain", label: "🗻 MONTAGNE" },
      { value: "note", label: "🎵 NOTE" },// A FAIRE
      { value: "cloud", label: "☁️ NUAGE" },
      { value: "octo", label: "🔢 OCTOGONE" },
      { value: "egg", label: "🥚 ŒUF" }, 
      { value: "pent", label: "🔢 PENTAGONE" },
      { value: "stone", label: "🪨 PIERRE" },
      { value: "scroll", label: "📜 PARCHEMIN" }, // A FAIRE
      { value: "puzzle", label: "🧩 PUZZLE" },
      { value: "hourglass", label: "⌛ SABLIER"},
      { value: "tri", label: "🗻 TRIANGLE" },
      { value: "triSqr", label: "📐 TRIANGLE RECTANGLE" },
      { value: "rect", label: "🟧 RECTANGLE" },
      { value: "rectRounded", label: "⏹️ RECTANGLE ARRONDI"},
      { value: "sun", label: "☀️ SOLEIL" },
    ],
  },

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
  {
    name: "Copies sans Rotation",
    refValue: "mirror",
    type: "select",
    options: [
      { value: "none", label: "AUCUNE" },
      { value: "hori", label: "GAUCHE / DROITE" },
      { value: "corners", label: "DANS LES COINS" }
    ],
  },

  { name: "<span class='spacerIcon'>🎨</span><span>Couleurs & Bordure</span>", type: "spacer" },
  { name: "Couleur de Fond", refValue: "color", type: "color" },
  { name: "Opacité du Fond", refValue: "opacity", type: "range" },
  { name: "Couleur de Bordure", refValue: "borderColor", type: "color" },
  { name: "Opacité de la Bordure", refValue: "borderOpacity", type: "range" },
  { name: "Épaisseur de la Bordure", refValue: "borderWeight", type: "text" },

  { name: "<span class='spacerIcon'>☀️</span><span>Ombre Portée</span>", type: "spacer" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },
  { name: "Flou", refValue: "shadowBlur", type: "text" },
];

export let TEXT_parameters = [
  { name: "<span class='spacerIcon spacerIconCentered'>🪪</span><span>Informations Générales</span>", type: "spacer" },
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
  {
    name: "Copies sans Rotation",
    refValue: "mirror",
    type: "select",
    options: [
      { value: "none", label: "AUCUNE" },
      { value: "hori", label: "GAUCHE / DROITE" },
      { value: "corners", label: "DANS LES COINS" }
    ],
  },
  { name: "<span class='spacerIcon'>🎨</span><span>Aspect Visuel</span>", type: "spacer" },
  { name: "Couleur", refValue: "color", type: "color" },
  { name: "Taille", refValue: "size", type: "text" },
  { name: "Police d'Écriture", refValue: "font", type: "select", optionRef: "allSystemFonts" },
  { name: "Opacité", refValue: "opacity", type: "range" },

  { name: "<span class='spacerIcon'>☀️</span><span>Ombre Portée</span>", type: "spacer" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },
  { name: "Flou", refValue: "shadowBlur", type: "text" },
];
