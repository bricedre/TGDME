export let IMAGE_parameters = [
  { name: `<img src="assets/id.webp" class='spacerIcon'><span>Informations Générales</span>`, type: "spacer" },
  {
    name: "Nom du Composant",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Image(s) Source", refValue: "src", type: "text", title: "Si vous désirez créer une chaîne d'images, séparez-les par des virgules" },

  { name: "<img src='assets/ruler.webp'class='spacerIcon'><span>Positionnement, Dimensions & Rotation</span>", type: "spacer" },
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
  { name: "<img src='assets/color.webp'class='spacerIcon'><span>Teinte & Opacité</span>", type: "spacer" },
  { name: "Filtre de Teinte", refValue: "tint", type: "color" },
  { name: "Opacité", refValue: "opacity", type: "range" },

  { name: "<img src='assets/shadow.webp'class='spacerIcon'><span>Ombre Portée</span>", type: "spacer" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },

  { name: "<img src='assets/list.webp'class='spacerIcon'><span>Configuration de chaîne (liste d'images)</span>", type: "spacer" },
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
  { name: "<img src='assets/id.webp'class='spacerIcon'><span>Informations Générales</span>", type: "spacer" },
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
    title: "Le mot entre parenthèses est celui à utiliser dans les données",
    isShapesSelect : true,
    options: [
      { value: "none", label: "🚫 AUCUNE FORME (none)", cat: "none" },
      { value: "wing", label: "🪽 AILE (wing)", cat: "nature" },
      { value: "ring", label: "⭕ ANNEAU (ring)", cat: "basic_shapes" },
      { value: "tree", label: "🌳 ARBRE (tree)", cat: "nature" },
      { value: "banner", label: "🔖 BANNIÈRE (banner)", cat: "basic_shapes" },
      { value: "battery", label: "🔋 BATTERIE (battery)", cat: "complex_shapes" },
      { value: "shield", label: "🛡️ BOUCLIER (shield)", cat: "basic_shapes" },
      { value: "avatar", label: "👤 BUSTE (avatar)", cat:"complex_shapes" },
      // { value: "lock", label: "🔒 CADENAS (lock)", cat:"complex_shapes" }, // A FAIRE
      { value: "target", label: "🎯 CIBLE (target)", cat:"complex_shapes" },
      { value: "key", label: "🔑 CLÉ (key)", cat:"complex_shapes" },
      { value: "tick", label: "✔️ COCHE (tick)", cat:"nature" },
      { value: "heart", label: "💖 COEUR (heart)", cat:"basic_shapes" },
      { value: "crown", label: "👑 COURONNE (crown)", cat:"basic_shapes" },
      { value: "cross", label: "✖️ CROIX (cross)", cat:"basic_shapes" },
      { value: "diam", label: "💎 DIAMANT (diam)", cat:"basic_shapes" },
      { value: "flag", label: "🏴 DRAPEAU (flag)", cat:"basic_shapes" },
      { value: "bolt", label: "⚡ ÉCLAIR (bolt)", cat:"nature" },
      // { value: "sword", label: "⚔️ ÉPÉE (sword)", cat:"complex_shapes" }, // A FAIRE
      { value: "star", label: "⭐ ÉTOILE (star)", cat:"basic_shapes" },
      { value: "ellipse", label: "🔵 ELLIPSE (ellipse)", cat:"basic_shapes" },
      // { value: "gear", label: "⚙️ ENGRENAGE (gear)", cat:"complex_shapes" }, // A FAIRE
      { value: "leaf", label: "🍃 FEUILLE (leaf)", cat:"nature" },
      // { value: "flask", label: "⚗️ FIOLE (flask)", cat:"complex_shapes" }, // A FAIRE
      { value: "fire", label: "🔥 FLAMME (fire)", cat:"nature" },
      { value: "arrow", label: "➡️ FLÈCHE (arrow)", cat:"basic_shapes" },
      { value: "flower", label: "🌷 FLEUR (flower)", cat:"basic_shapes" },
      { value: "drop", label: "💧 GOUTTE (drop)", cat:"basic_shapes" },
      { value: "hexa", label: "🔢 HEXAGONE (hexa)", cat:"polygons" },
      { value: "book", label: "📖 LIVRE (book)", cat:"basic_shapes" },
      { value: "loz", label: "🪁 LOSANGE (loz)", cat:"polygons" },
      { value: "moon", label: "🌙 LUNE (moon)", cat:"basic_shapes" },
      // { value: "medal", label: "🎖️ MÉDAILLE (medal)", cat:"complex_shapes" }, // A FAIRE
      { value: "mountain", label: "🗻 MONTAGNE (mountain)", cat:"nature" },
      // { value: "note", label: "🎵 NOTE (note)", cat:"complex_shapes" }, // A FAIRE
      { value: "cloud", label: "☁️ NUAGE (cloud)", cat:"nature" },
      { value: "octo", label: "🔢 OCTOGONE (octo)", cat:"polygons" },
      { value: "egg", label: "🥚 ŒUF (egg)", cat:"nature" },
      { value: "pent", label: "🔢 PENTAGONE (pent)", cat:"polygons" },
      { value: "stone", label: "🪨 PIERRE (stone)", cat:"nature" },
      // { value: "scroll", label: "📜 PARCHEMIN (scroll)", cat:"basic_shapes" }, // A FAIRE
      { value: "puzzle", label: "🧩 PUZZLE (puzzle)", cat:"complex_shapes" },
      { value: "hourglass", label: "⌛ SABLIER (hourglass)", cat:"complex_shapes" },
      { value: "tri", label: "🗻 TRIANGLE (tri)", cat:"polygons" },
      { value: "triSqr", label: "📐 TRIANGLE RECTANGLE (triSqr)", cat:"polygons" },
      { value: "rect", label: "🟧 RECTANGLE (rect)", cat:"polygons" },
      { value: "rectRounded", label: "⏹️ RECTANGLE ARRONDI (rectRounded)", cat:"polygons" },
      { value: "sun", label: "☀️ SOLEIL (sun)", cat:"nature" },
    ],
  },

  { name: "<img src='assets/ruler.webp'class='spacerIcon'><span>Positionnement, Dimensions & Rotation</span>", type: "spacer" },
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

  { name: "<img src='assets/color.webp'class='spacerIcon'><span>Couleurs & Bordure</span>", type: "spacer" },
  { name: "Couleur de Fond", refValue: "color", type: "color" },
  { name: "Opacité du Fond", refValue: "opacity", type: "range" },
  { name: "Couleur de Bordure", refValue: "borderColor", type: "color" },
  { name: "Opacité de la Bordure", refValue: "borderOpacity", type: "range" },
  { name: "Épaisseur de la Bordure", refValue: "borderWeight", type: "text" },

  { name: "<img src='assets/shadow.webp'class='spacerIcon'><span>Ombre Portée</span>", type: "spacer" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },
];

export let TEXT_parameters = [
  { name: "<img src='assets/id.webp'class='spacerIcon'><span>Informations Générales</span>", type: "spacer" },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Texte à Afficher", refValue: "src", type: "text" },

  { name: "<img src='assets/ruler.webp'class='spacerIcon'><span>Positionnement, Dimensions & Rotation</span>", type: "spacer" },
  { name: "Position Horizontale", refValue: "positionX", type: "text" },
  { name: "Position Verticale", refValue: "positionY", type: "text" },
  { name: "Rotation", refValue: "angle", type: "text" },
  { name: "Limite Horizontale", refValue: "maxWidth", type: "text" },
  {
    name: "Alignement Horizontal",
    refValue: "textAnchorHori",
    type: "select",
    options: [
      { value: ":LEFT", label: "GAUCHE" },
      { value: ":CENTER", label: "CENTRE" },
      { value: ":RIGHT", label: "DROITE" },
    ],
  },
  {
    name: "Alignement Vertical",
    refValue: "textAnchorVert",
    type: "select",
    options: [
      { value: "TOP", label: "HAUT" },
      { value: "CENTER", label: "CENTRE" },
      { value: "BOTTOM", label: "BAS" },
    ],
  },
  { name: "Interligne", refValue: "interline", type: "text" },

  { name: "<img src='assets/color.webp'class='spacerIcon'><span>Aspect Visuel</span>", type: "spacer" },
  { name: "Couleur", refValue: "color", type: "color" },
  { name: "Taille", refValue: "size", type: "text" },
  { name: "Police d'Écriture", refValue: "font", type: "select", optionRef: "allSystemFonts" },
  { name: "Opacité", refValue: "opacity", type: "range" },

  { name: "<img src='assets/shadow.webp'class='spacerIcon'><span>Ombre Portée</span>", type: "spacer" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },
  
  { name: "<img src='assets/inlineIcon.webp'class='spacerIcon'><span>Icônes Incluses</span>", type: "spacer" },
  { name: "Taille des Icônes", refValue: "inlineImgsSize", type: "text" },
  { name: "Décalage Horizontal des Icônes", refValue: "inlineImgsXOffset", type: "text" },
];

export let TITLE_parameters = [
  { name: "<img src='assets/id.webp'class='spacerIcon'><span>Informations Générales</span>", type: "spacer" },
  {
    name: "Nom du Composant ",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "Titre à Afficher", refValue: "src", type: "text" },

  { name: "<img src='assets/ruler.webp'class='spacerIcon'><span>Positionnement, Dimensions & Rotation</span>", type: "spacer" },
  { name: "Position Horizontale", refValue: "positionX", type: "text" },
  { name: "Position Verticale", refValue: "positionY", type: "text" },
  { name: "Rotation", refValue: "angle", type: "text" },
  
  { name: "<img src='assets/color.webp'class='spacerIcon'><span>Aspect Visuel</span>", type: "spacer" },
  { name: "Largeur Cible", refValue: "titleWidth", type: "text" },
  { name: "Taille Maximale", refValue: "maxSize", type: "text" },
  { name: "Couleur", refValue: "color", type: "color" },
  { name: "Police d'Écriture", refValue: "font", type: "select", optionRef: "allSystemFonts" },
  { name: "Opacité", refValue: "opacity", type: "range" },

  { name: "<img src='assets/shadow.webp'class='spacerIcon'><span>Ombre Portée</span>", type: "spacer" },
  { name: "Couleur", refValue: "shadowColor", type: "color" },
  { name: "Décalage Horizontal", refValue: "shadowOffsetX", type: "text" },
  { name: "Décalage Vertical", refValue: "shadowOffsetY", type: "text" },
  { name: "Opacité", refValue: "shadowOpacity", type: "range" },
];