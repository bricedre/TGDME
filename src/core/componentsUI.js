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
      { value: ":CENTER", label: "CENTRE" },
      { value: ":CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
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
      { value: ":LEFT", label: "GAUCHE" },
      { value: ":CENTER", label: "CENTRE" },
      { value: ":RIGHT", label: "DROITE" },
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
    title: "Le mot entre parenthèses est le mot à utiliser dans les données",
    options: [
      { value: "wing", label: "🪽 AILE (wing)" },
      { value: "ring", label: "⭕ ANNEAU (ring)" },
      { value: "tree", label: "🌳 ARBRE (tree)" },
      { value: "banner", label: "🔖 BANNIÈRE (banner)" },
      { value: "battery", label: "🔋 BATTERIE (battery)" },
      { value: "shield", label: "🛡️ BOUCLIER (shield)" },
      { value: "avatar", label: "👤 BUSTE (avatar)" },
      { value: "lock", label: "🔒 CADENAS (lock)" },// A FAIRE
      { value: "target", label: "🎯 CIBLE (target)" },
      { value: "key", label: "🔑 CLÉ (key)" },
      { value: "tick", label: "✔️ COCHE (tick)" },
      { value: "heart", label: "💖 COEUR (heart)" },
      { value: "crown", label: "👑 COURONNE (crown)" },
      { value: "cross", label: "✖️ CROIX (cross)" },
      { value: "diam", label: "💎 DIAMANT (diam)" },
      { value: "flag", label: "🏴 DRAPEAU (flag)" },
      { value: "bolt", label: "⚡ ÉCLAIR (bolt)" },
      { value: "sword", label: "⚔️ ÉPÉE (sword)" }, // A FAIRE
      { value: "star", label: "⭐ ÉTOILE (star)" },
      { value: "ellipse", label: "🔵 ELLIPSE (ellipse)" },
      { value: "gear", label: "⚙️ ENGRENAGE (gear)" }, // A FAIRE
      { value: "leaf", label: "🍃 FEUILLE (leaf)" },
      { value: "flask", label: "⚗️ FIOLE (flask)" },// A FAIRE
      { value: "fire", label: "🔥 FLAMME (fire)" }, 
      { value: "arrow", label: "➡️ FLÈCHE (arrow)" },
      { value: "flower", label: "🌷 FLEUR (flower)" },
      { value: "drop", label: "💧 GOUTTE (drop)" },
      { value: "hexa", label: "🔢 HEXAGONE (hexa)" },
      { value: "book", label: "📖 LIVRE (book)" },
      { value: "loz", label: "🪁 LOSANGE (moon)" },
      { value: "moon", label: "🌙 LUNE (moon)" },
      { value: "medal", label: "🎖️ MÉDAILLE (medal)" },// A FAIRE
      { value: "mountain", label: "🗻 MONTAGNE (mountain)" },
      { value: "note", label: "🎵 NOTE (note)" },// A FAIRE
      { value: "cloud", label: "☁️ NUAGE (cloud)" },
      { value: "octo", label: "🔢 OCTOGONE (octo)" },
      { value: "egg", label: "🥚 ŒUF (egg)" }, 
      { value: "pent", label: "🔢 PENTAGONE (pent)" },
      { value: "stone", label: "🪨 PIERRE (stone)" },
      { value: "scroll", label: "📜 PARCHEMIN (scroll)" }, // A FAIRE
      { value: "puzzle", label: "🧩 PUZZLE (puzzle)" },
      { value: "hourglass", label: "⌛ SABLIER (hourglass)"},
      { value: "tri", label: "🗻 TRIANGLE (tri)" },
      { value: "triSqr", label: "📐 TRIANGLE RECTANGLE (triSqr)" },
      { value: "rect", label: "🟧 RECTANGLE (rect)" },
      { value: "rectRounded", label: "⏹️ RECTANGLE ARRONDI (rectRounded)"},
      { value: "sun", label: "☀️ SOLEIL (sun)" },
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
      { value: ":CENTER", label: "CENTRE" },
      { value: ":CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
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
  { name: "Limite Horizontale", refValue: "maxWidth", type: "text" },
  {
    name: "Alignement",
    refValue: "anchor",
    type: "select",
    options: [
      { value: ":LEFT", label: "GAUCHE" },
      { value: ":CENTER", label: "CENTRE" },
      { value: ":RIGHT", label: "DROITE" },
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
