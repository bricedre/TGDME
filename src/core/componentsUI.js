export let IMAGE_parameters = [
  { name: `<img src="assets/paramIcons/id.webp" class='spacerIcon'><span class="paramCat_general">Informations Générales</span>`, type: "catHeader" },
  {
    name: "<span class='param_componentName'>Nom du Composant</span>",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "<span class='param_imageSource'>Image(s) Source</span>", refValue: "src", type: "text", title: "Si vous désirez créer une chaîne d'images, séparez-les par des virgules" },

  { name: "<img src='assets/paramIcons/ruler.webp'class='spacerIcon'><span class='paramCat_transform'>Position & Dimensions</span>", type: "catHeader" },
  { name: "<span class='param_positionX'>Position Horizontale</span>", refValue: "positionX", type: "text" },
  { name: "<span class='param_positionY'>Position Verticale</span>", refValue: "positionY", type: "text" },
  { name: "<span class='param_width'>Largeur</span>", refValue: "width", type: "text" },
  { name: "<span class='param_height'>Hauteur</span>", refValue: "height", type: "text" },
  { name: "<span class='param_rotation'>Rotation</span>", refValue: "angle", type: "text" },
  {
    name: "<span class='param_anchor'>Ancre</span>",
    refValue: "anchor",
    type: "select",
    options: [
      { value: ":CENTER", label: "CENTRE" },
      { value: ":CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
    ],
  },
  { name: "<img src='assets/paramIcons/color.webp'class='spacerIcon'><span class='paramCat_tint'>Teinte & Opacité</span>", type: "catHeader" },
  { name: "<span class='param_tintFilter'>Filtre de Teinte</span>", refValue: "tint", type: "color" },
  { name: "<span class='param_opacity'>Opacité</span>", refValue: "opacity", type: "range" },

  { name: "<img src='assets/paramIcons/shadow.webp'class='spacerIcon'><span class='paramCat_shadow'>Ombre Portée</span>", type: "catHeader" },
  { name: "<span class='param_shadowColor'>Couleur</span>", refValue: "shadowColor", type: "color" },
  { name: "<span class='param_shadowOffsetX'>Décalage Horizontal</span>", refValue: "shadowOffsetX", type: "text" },
  { name: "<span class='param_shadowOffsetY'>Décalage Vertical</span>", refValue: "shadowOffsetY", type: "text" },
  { name: "<span class='param_shadowOpacity'>Opacité</span>", refValue: "shadowOpacity", type: "range" },

  { name: "<img src='assets/paramIcons/list.webp'class='spacerIcon'><span class='paramCat_chainConfig'>Chaîne d'Images</span>", type: "catHeader" },
  {
    name: "<span class='param_chainAlignment'>Alignement de Chaîne</span>",
    refValue: "listAnchor",
    type: "select",
    options: [
      { value: ":LEFT", label: "GAUCHE" },
      { value: ":CENTER", label: "CENTRE" },
      { value: ":RIGHT", label: "DROITE" },
    ],
  },
  { name: "<span class='param_spacingX'>Espacement Horizontal</span>", refValue: "spacingX", type: "text" },
  { name: "<span class='param_spacingY'>Espacement Vertical</span>", refValue: "spacingY", type: "text" },
  {
    name: "<span class='param_chainStyle'>Style de Chaîne</span>",
    refValue: "style",
    type: "select",
    title: "Le style DÉCALÉE permet de placer plus d'images en moins d'espace",
    options: [
      { value: "straight", label: "DROITE" },
      { value: "alternate", label: "DÉCALÉE" },
    ],
  },
  { name: "<span class='param_offsetX'>Décalage Horizontal</span>", refValue: "offsetX", type: "text", title: "Actif uniquement si Style de Chaîne = DÉCALÉE" },
  { name: "<span class='param_offsetY'>Décalage Vertical</span>", refValue: "offsetY", type: "text", title: "Actif uniquement si Style de Chaîne = DÉCALÉE" },
];

export let SHAPE_parameters = [
  { name: "<img src='assets/paramIcons/id.webp'class='spacerIcon'><span class='paramCat_general'>Informations Générales</span>", type: "catHeader" },
  {
    name: "<span class='param_componentName'>Nom du Composant</span>",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  {
    name: "<span class='param_shapeToDisplay'>Forme à Afficher</span>",
    refValue: "src",
    type: "select",
    title: "Le mot entre parenthèses est celui à utiliser dans les données",
    isShapesSelect: true,
    options: [
      { value: "none", label: "🚫 AUCUNE FORME (none)", cat: "none" },
      { value: "wing", label: "🪽 AILE (wing)", cat: "nature" },
      { value: "ring", label: "⭕ ANNEAU (ring)", cat: "basic_shapes" },
      { value: "tree", label: "🌳 ARBRE (tree)", cat: "nature" },
      { value: "banner", label: "🔖 BANNIÈRE (banner)", cat: "basic_shapes" },
      { value: "battery", label: "🔋 BATTERIE (battery)", cat: "complex_shapes" },
      { value: "shield", label: "🛡️ BOUCLIER (shield)", cat: "basic_shapes" },
      { value: "avatar", label: "👤 BUSTE (avatar)", cat: "complex_shapes" },
      // { value: "lock", label: "🔒 CADENAS (lock)", cat:"complex_shapes" }, // A FAIRE
      { value: "target", label: "🎯 CIBLE (target)", cat: "complex_shapes" },
      { value: "key", label: "🔑 CLÉ (key)", cat: "complex_shapes" },
      { value: "tick", label: "✔️ COCHE (tick)", cat: "nature" },
      { value: "heart", label: "💖 COEUR (heart)", cat: "basic_shapes" },
      { value: "crown", label: "👑 COURONNE (crown)", cat: "basic_shapes" },
      { value: "cross", label: "✖️ CROIX (cross)", cat: "basic_shapes" },
      { value: "diam", label: "💎 DIAMANT (diam)", cat: "basic_shapes" },
      { value: "flag", label: "🏴 DRAPEAU (flag)", cat: "basic_shapes" },
      { value: "bolt", label: "⚡ ÉCLAIR (bolt)", cat: "nature" },
      // { value: "sword", label: "⚔️ ÉPÉE (sword)", cat:"complex_shapes" }, // A FAIRE
      { value: "star", label: "⭐ ÉTOILE (star)", cat: "basic_shapes" },
      { value: "ellipse", label: "🔵 ELLIPSE (ellipse)", cat: "basic_shapes" },
      // { value: "gear", label: "⚙️ ENGRENAGE (gear)", cat:"complex_shapes" }, // A FAIRE
      { value: "leaf", label: "🍃 FEUILLE (leaf)", cat: "nature" },
      // { value: "flask", label: "⚗️ FIOLE (flask)", cat:"complex_shapes" }, // A FAIRE
      { value: "fire", label: "🔥 FLAMME (fire)", cat: "nature" },
      { value: "arrow", label: "➡️ FLÈCHE (arrow)", cat: "basic_shapes" },
      { value: "flower", label: "🌷 FLEUR (flower)", cat: "basic_shapes" },
      { value: "drop", label: "💧 GOUTTE (drop)", cat: "basic_shapes" },
      { value: "hexa", label: "🔢 HEXAGONE (hexa)", cat: "polygons" },
      { value: "book", label: "📖 LIVRE (book)", cat: "basic_shapes" },
      { value: "loz", label: "🪁 LOSANGE (loz)", cat: "polygons" },
      { value: "moon", label: "🌙 LUNE (moon)", cat: "basic_shapes" },
      // { value: "medal", label: "🎖️ MÉDAILLE (medal)", cat:"complex_shapes" }, // A FAIRE
      { value: "mountain", label: "🗻 MONTAGNE (mountain)", cat: "nature" },
      // { value: "note", label: "🎵 NOTE (note)", cat:"complex_shapes" }, // A FAIRE
      { value: "cloud", label: "☁️ NUAGE (cloud)", cat: "nature" },
      { value: "octo", label: "🔢 OCTOGONE (octo)", cat: "polygons" },
      { value: "egg", label: "🥚 ŒUF (egg)", cat: "nature" },
      { value: "pent", label: "🔢 PENTAGONE (pent)", cat: "polygons" },
      { value: "stone", label: "🪨 PIERRE (stone)", cat: "nature" },
      // { value: "scroll", label: "📜 PARCHEMIN (scroll)", cat:"basic_shapes" }, // A FAIRE
      { value: "puzzle", label: "🧩 PUZZLE (puzzle)", cat: "complex_shapes" },
      { value: "hourglass", label: "⌛ SABLIER (hourglass)", cat: "complex_shapes" },
      { value: "tri", label: "🗻 TRIANGLE (tri)", cat: "polygons" },
      { value: "triSqr", label: "📐 TRIANGLE RECTANGLE (triSqr)", cat: "polygons" },
      { value: "rect", label: "🟧 RECTANGLE (rect)", cat: "polygons" },
      { value: "rectRounded", label: "⏹️ RECTANGLE ARRONDI (rectRounded)", cat: "polygons" },
      { value: "sun", label: "☀️ SOLEIL (sun)", cat: "nature" },
    ],
  },

  { name: "<img src='assets/paramIcons/ruler.webp'class='spacerIcon'><span class='paramCat_transform'>Position & Dimensions</span>", type: "catHeader" },
  { name: "<span class='param_positionX'>Position Horizontale</span>", refValue: "positionX", type: "text" },
  { name: "<span class='param_positionY'>Position Verticale</span>", refValue: "positionY", type: "text" },
  { name: "<span class='param_width'>Largeur</span>", refValue: "width", type: "text" },
  { name: "<span class='param_height'>Hauteur</span>", refValue: "height", type: "text" },
  { name: "<span class='param_rotation'>Rotation</span>", refValue: "angle", type: "text" },
  {
    name: "<span class='param_anchor'>Ancre</span>",
    refValue: "anchor",
    type: "select",
    options: [
      { value: ":CENTER", label: "CENTRE" },
      { value: ":CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
    ],
  },

  { name: "<img src='assets/paramIcons/color.webp'class='spacerIcon'><span class='paramCat_color'>Couleurs & Bordure</span>", type: "catHeader" },
  { name: "<span class='param_backgroundColor'>Couleur de Fond</span>", refValue: "color", type: "color" },
  { name: "<span class='param_backgroundOpacity'>Opacité du Fond</span>", refValue: "opacity", type: "range" },
  { name: "<span class='param_borderColor'>Couleur de Bordure</span>", refValue: "borderColor", type: "color" },
  { name: "<span class='param_borderOpacity'>Opacité de la Bordure</span>", refValue: "borderOpacity", type: "range" },
  { name: "<span class='param_borderWeight'>Épaisseur de la Bordure</span>", refValue: "borderWeight", type: "text" },

  { name: "<img src='assets/paramIcons/shadow.webp'class='spacerIcon'><span class='paramCat_shadow'>Ombre Portée</span>", type: "catHeader" },
  { name: "<span class='param_shadowColor'>Couleur</span>", refValue: "shadowColor", type: "color" },
  { name: "<span class='param_shadowOffsetX'>Décalage Horizontal</span>", refValue: "shadowOffsetX", type: "text" },
  { name: "<span class='param_shadowOffsetY'>Décalage Vertical</span>", refValue: "shadowOffsetY", type: "text" },
  { name: "<span class='param_shadowOpacity'>Opacité</span>", refValue: "shadowOpacity", type: "range" },
];

export let TEXT_parameters = [
  { name: "<img src='assets/paramIcons/id.webp'class='spacerIcon'><span class='paramCat_general'>Informations Générales</span>", type: "catHeader" },
  {
    name: "<span class='param_componentName'>Nom du Composant</span>",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "<span class='param_textToDisplay'>Texte à Afficher</span>", refValue: "src", type: "text" },

  { name: "<img src='assets/paramIcons/ruler.webp'class='spacerIcon'><span class='paramCat_transform'>Position & Dimensions</span>", type: "catHeader" },
  { name: "<span class='param_positionX'>Position Horizontale</span>", refValue: "positionX", type: "text" },
  { name: "<span class='param_positionY'>Position Verticale</span>", refValue: "positionY", type: "text" },
  { name: "<span class='param_rotation'>Rotation</span>", refValue: "angle", type: "text" },
  { name: "<span class='param_horizontalLimit'>Limite Horizontale</span>", refValue: "maxWidth", type: "text" },
  {
    name: "<span class='param_horizontalAlignment'>Alignement Horizontal</span>",
    refValue: "textAnchorHori",
    type: "select",
    options: [
      { value: ":LEFT", label: "GAUCHE" },
      { value: ":CENTER", label: "CENTRE" },
      { value: ":RIGHT", label: "DROITE" },
    ],
  },
  {
    name: "<span class='param_verticalAlignment'>Alignement Vertical</span>",
    refValue: "textAnchorVert",
    type: "select",
    options: [
      { value: "TOP", label: "HAUT" },
      { value: "CENTER", label: "CENTRE" },
      { value: "BOTTOM", label: "BAS" },
    ],
  },
  { name: "<span class='param_lineSpacing'>Interligne</span>", refValue: "interline", type: "text" },

  { name: "<img src='assets/paramIcons/color.webp'class='spacerIcon'><span class='paramCat_font'>Aspect Visuel</span>", type: "catHeader" },
  { name: "<span class='param_color'>Couleur</span>", refValue: "color", type: "color" },
  { name: "<span class='param_fontSize'>Taille</span>", refValue: "size", type: "text" },
  { name: "<span class='param_fontFamily'>Police d'Écriture</span>", refValue: "font", type: "select", optionRef: "allSystemFonts" },
  { name: "<span class='param_opacity'>Opacité</span>", refValue: "opacity", type: "range" },

  { name: "<img src='assets/paramIcons/shadow.webp'class='spacerIcon'><span class='paramCat_shadow'>Ombre Portée</span>", type: "catHeader" },
  { name: "<span class='param_shadowColor'>Couleur</span>", refValue: "shadowColor", type: "color" },
  { name: "<span class='param_shadowOffsetX'>Décalage Horizontal</span>", refValue: "shadowOffsetX", type: "text" },
  { name: "<span class='param_shadowOffsetY'>Décalage Vertical</span>", refValue: "shadowOffsetY", type: "text" },
  { name: "<span class='param_shadowOpacity'>Opacité</span>", refValue: "shadowOpacity", type: "range" },

  { name: "<img src='assets/paramIcons/inlineIcon.webp'class='spacerIcon'><span class='paramCat_inlineIcons'>Icônes Incluses</span>", type: "catHeader" },
  { name: "<span class='param_inlineIconSize'>Taille des Icônes</span>", refValue: "inlineImgsSize", type: "text" },
  { name: "<span class='param_inlineIconOffsetX'>Décalage Horizontal des Icônes</span>", refValue: "inlineImgsXOffset", type: "text" },
];

export let TITLE_parameters = [
  { name: "<img src='assets/paramIcons/id.webp'class='spacerIcon'><span class='paramCat_general'>Informations Générales</span>", type: "catHeader" },
  {
    name: "<span class='param_componentName'>Nom du Composant</span>",
    refValue: "componentName",
    type: "text",
    forced: true,
  },
  { name: "<span class='param_titleToDisplay'>Titre à Afficher</span>", refValue: "src", type: "text" },

  { name: "<img src='assets/paramIcons/ruler.webp'class='spacerIcon'><span class='paramCat_transform'>Position & Dimensions</span>", type: "catHeader" },
  { name: "<span class='param_positionX'>Position Horizontale</span>", refValue: "positionX", type: "text" },
  { name: "<span class='param_positionY'>Position Verticale</span>", refValue: "positionY", type: "text" },
  { name: "<span class='param_rotation'>Rotation</span>", refValue: "angle", type: "text" },

  { name: "<img src='assets/paramIcons/color.webp'class='spacerIcon'><span class='paramCat_font'>Aspect Visuel</span>", type: "catHeader" },
  { name: "<span class='param_targetWidth'>Largeur Cible</span>", refValue: "titleWidth", type: "text" },
  { name: "<span class='param_maxSize'>Taille Maximale</span>", refValue: "maxSize", type: "text" },
  { name: "<span class='param_color'>Couleur</span>", refValue: "color", type: "color" },
  { name: "<span class='param_fontFamily'>Police d'Écriture</span>", refValue: "font", type: "select", optionRef: "allSystemFonts" },
  { name: "<span class='param_opacity'>Opacité</span>", refValue: "opacity", type: "range" },

  { name: "<img src='assets/paramIcons/shadow.webp'class='spacerIcon'><span class='paramCat_shadow'>Ombre Portée</span>", type: "catHeader" },
  { name: "<span class='param_shadowColor'>Couleur</span>", refValue: "shadowColor", type: "color" },
  { name: "<span class='param_shadowOffsetX'>Décalage Horizontal</span>", refValue: "shadowOffsetX", type: "text" },
  { name: "<span class='param_shadowOffsetY'>Décalage Vertical</span>", refValue: "shadowOffsetY", type: "text" },
  { name: "<span class='param_shadowOpacity'>Opacité</span>", refValue: "shadowOpacity", type: "range" },
];
