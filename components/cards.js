export const cards = [
  //BASIC CARDS MADE USING THE TEMPLATE
  {
    title: "Lucy", //Text MUST be double-quoted
    storage: "2", //Numbers are also considered text if they are used in TEXT elements.
    observation: "2",
    effect : "This is a rather long text,\nso I need to create line\nbreaks to fit it all.", // Line breaks "\n" can be used in TEXT elements
    has_text_effect : true, // Triggers use booleans (true or false); default is false
    effect_cost :  ["coin", "coin", "coin"],
  },
  {
    title: "Kendrik",
    storage: "1",
    observation: "3",
    effect : "This is a short effect.",
    has_text_effect : true,
    quantity : 2, //Allow multiple copies of the same card
    effect_cost :  ["looking_glass", "looking_glass", "coin", "coin"],
  },
  {
    title: "Tom",
    storage: "1",
    observation: "4",
    has_image_effect : true,
    quantity : 3
  },
  {
    title: "Sophia",
    storage: "3",
    observation: "3",
    effect : "This is a short effect.",
    has_text_effect : true,
    quantity : 3, 
    effect_cost :  ["looking_glass"],
  }
]
  
