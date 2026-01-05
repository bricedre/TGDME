import { updateDataView } from "./elementsManager.js";

import { IMAGE_parameters, TEXT_parameters, SHAPE_parameters, TITLE_parameters } from "./componentsUI.js";
import { currCollInfo, currentCollection, saveCollection } from "./collectionsManager.js";
import { allSystemFonts } from "./assetsManager.js";
import { moveComponent } from "../screens/editionScreen.js";
import { debugMode } from "../screens/mainLayout.js";

const $ = require("jquery");
const cloneDeep = require("lodash/cloneDeep");
import { imageComponentTemplate, textComponentTemplate, shapeComponentTemplate, titleComponentTemplate } from "./templates.js";

let dragging = false;
let draggedIndex = null;
let dragOverIndex = null;

export function setupComponents() {
  if(debugMode) console.log("> setupComponents");

  $("#templateItemsDiv").empty();

  if (currentCollection.template.length > 0) {
    templateItemsDiv.style.display = "block";

    currentCollection.template.forEach((item, itemIndex) => {
      createNewComponent(item, itemIndex);
    });
  } else {
    templateItemsDiv.style.display = "flex";
    let noResourceText = document.createElement("div");
    noResourceText.classList.add("noStuffDiv");
    noResourceText.innerHTML = "Aucun Composant dans votre Modèle";

    templateItemsDiv.appendChild(noResourceText);
  }
}



export function createNewComponent(item, itemIndex) {
  if(debugMode) ("> createNewComponent");

  let itemAccordion = document.createElement("button");
  itemAccordion.id = item.UID;
  itemAccordion.classList.add("accordion");

  let icon;
  let parametersToLoad;
  switch (item.component) {
    case "IMAGE":
      icon = "assets/btnIcons/addImageComponent.png";
      parametersToLoad = IMAGE_parameters;
      break;
    case "TEXT":
      icon = "assets/btnIcons/addTextComponent.png";
      parametersToLoad = TEXT_parameters;
      break;
    case "TITLE":
      icon = "assets/btnIcons/addTitleComponent.png";
      parametersToLoad = TITLE_parameters;
      break;
    case "SHAPE":
      icon = "assets/btnIcons/addShapeComponent.png";
      parametersToLoad = SHAPE_parameters;
      break;
  }

   let componentIcon = document.createElement("img");
  componentIcon.src = icon;
  componentIcon.classList.add("componentIcon");
  itemAccordion.appendChild(componentIcon);

  let itemLabel = document.createElement("span");
  itemLabel.classList.add("itemLabel");
  itemLabel.innerHTML = item.componentName.value != "" ? item.componentName.value : "Composant sans Nom";
  itemAccordion.appendChild(itemLabel);

  let spacer = document.createElement("div");
  spacer.classList.add("headerSpacer");
  itemAccordion.appendChild(spacer);

  // if (itemIndex > 0) {
  //   let upElementBtn = document.createElement("img");
  //   upElementBtn.classList.add("upElementBtn");
  //   upElementBtn.src = "./assets/elementIcons/moveUp.png";
  //   upElementBtn.title = "Reculer le Composant";
  //   upElementBtn.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     moveComponent(itemIndex, -1);
  //   });
  //   itemAccordion.appendChild(upElementBtn);
  // }

  // if (itemIndex < currentCollection.template.length - 1) {
  //   let downElementBtn = document.createElement("img");
  //   downElementBtn.classList.add("downElementBtn");
  //   downElementBtn.src = "./assets/elementIcons/moveDown.png";
  //   downElementBtn.title = "Avancer le Composant";
  //   downElementBtn.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     moveComponent(itemIndex, 1);
  //   });
  //   itemAccordion.appendChild(downElementBtn);
  // }

  let dragHandle = document.createElement("img");
  dragHandle.classList.add("dragHandle");
  dragHandle.src = "./assets/elementIcons/move.png";
  dragHandle.title = "Déplacer le Composant";
  dragHandle.style.cursor = "grab";

  dragHandle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  dragHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    draggedIndex = itemIndex;
    dragHandle.style.cursor = "grabbing";
    console.log(dragging, draggedIndex);

    //style original element
    const allAccordions = document.querySelectorAll(".accordion");
    allAccordions[itemIndex].style.opacity = "0.5";

    

  });
  
  itemAccordion.appendChild(dragHandle);

  let visibilityBtn = document.createElement("img");
  visibilityBtn.classList.add("visibilityBtn");
  visibilityBtn.title = "Afficher/Cacher";
  if (item.isVisible) visibilityBtn.src = "./assets/elementIcons/visibilityOn.png";
  else visibilityBtn.src = "./assets/elementIcons/visibilityOff.png";
  visibilityBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    item.isVisible = !item.isVisible;
    generateCollectionBtn.click();
    populateComponents();
  });
  itemAccordion.appendChild(visibilityBtn);

  let duplicateComponentBtn = document.createElement("img");
  duplicateComponentBtn.classList.add("duplicateComponentBtn");
  duplicateComponentBtn.src = "./assets/elementIcons/duplicateComponent.png";
  duplicateComponentBtn.title = "Dupliquer le Composant";
  duplicateComponentBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let componentToDuplicate = currentCollection.template.filter((el) => el.UID == e.target.parentNode.id)[0];
    let indexWhereToDuplicate = currentCollection.template.indexOf(componentToDuplicate) + 1;

    let newComponent = JSON.parse(JSON.stringify(componentToDuplicate));
    newComponent.UID = currCollInfo.lastComponentIndex;
    currCollInfo.lastComponentIndex++;

    currentCollection.template.splice(indexWhereToDuplicate, 0, newComponent);
    setupComponents();
    updateDataView();

    generateCollectionBtn.click();
  });
  itemAccordion.appendChild(duplicateComponentBtn);

  let deleteComponentBtn = document.createElement("img");
  deleteComponentBtn.classList.add("deleteComponentBtn");
  deleteComponentBtn.src = "./assets/elementIcons/delete.png";
  deleteComponentBtn.title = "Supprimer le Composant";
  deleteComponentBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let componentToDelete = currentCollection.template.filter((el) => el.UID == e.target.parentNode.id)[0];
    currentCollection.template.splice(currentCollection.template.indexOf(componentToDelete), 1);
    setupComponents();
    updateDataView();

    generateCollectionBtn.click();
  });
  itemAccordion.appendChild(deleteComponentBtn);

  itemAccordion.addEventListener("click", () => {
    let panel = itemAccordion.nextElementSibling;
    if (itemAccordion.classList.contains("active")) {
      panel.style.maxHeight = "0";
      panel.style.padding = "0rem";
    } else {
      panel.style.maxHeight = "max-content";
      panel.style.padding = "1rem";
    }

    itemAccordion.classList.toggle("active");
  });

  let itemPanel = $("<div class='itemPanel'></div>");
  let currentPanel = null;
  let paramTabsEl = $("<div class='paramTabs'</div>");
  itemPanel.append(paramTabsEl);
  let isFirstOfComp = true;

  parametersToLoad.forEach((param, paramIndex) => {
    if (param.type == "catHeader") {
      let paramTabEl = $("<div></div>").html(param.name).addClass("paramTab");
      paramTabsEl.append(paramTabEl);

      let paramContentEl = $("<div></div>").addClass("paramContent");
      itemPanel.append(paramContentEl);
      currentPanel = paramContentEl;

      paramTabEl.on("click", () => {
        itemPanel.find(".paramTab").removeClass("checked");
        paramTabEl.addClass("checked");

        itemPanel.find(".paramContent").removeClass("shown");
        paramContentEl.addClass("shown");
      });

      if (isFirstOfComp) {
        paramTabEl.addClass("checked");
        paramContentEl.addClass("shown");
        isFirstOfComp = false;
      }
    } else {
      let parameterSlot = document.createElement("div");
      parameterSlot.classList.add("parameterSlot");

      let parameterName = document.createElement("p");
      parameterName.classList.add("parameterName");
      parameterName.innerHTML = param.name;
      if (param.title) {
        parameterName.title = param.title;
        parameterName.innerHTML += " 🔍";
      }

      let parameterInputLine = document.createElement("div");
      parameterInputLine.classList.add("parameterInputLine");

      let parameterInput = document.createElement("input");
      var inputID = itemIndex + "-" + param.refValue;
      parameterInput.id = inputID;
      if (param.type == "range") {
        parameterInput.setAttribute("min", 0.0);
        parameterInput.setAttribute("max", 1.0);
        parameterInput.setAttribute("step", 0.01);
      }

      parameterInput.addEventListener("input", (e) => {
        try {
          currentCollection.template[itemIndex][param.refValue].value = e.target.value;
        } catch (e) {
          currentCollection.template[itemIndex][param.refValue] = {
            value: e.target.value,
            type: "0",
            valueCB: "",
          };
        }

        populateComponents();
      });

      let parameterCBInput = document.createElement("input");
      var inputID = itemIndex + "-" + param.refValue + "_CB";
      parameterCBInput.id = inputID;
      parameterCBInput.addEventListener("input", (e) => {
        try {
          currentCollection.template[itemIndex][param.refValue]["valueCB"] = e.target.value;
        } catch (e) {
          currentCollection.template[itemIndex][param.refValue] = {
            value: "",
            valueCB: e.target.value,
            type: "0",
          };
        }

        populateComponents();
      });

      let currentMode = "0";

      let modeInput = document.createElement("img");
      modeInput.classList.add("modeInput");

      if (param.type !== "spacer") {
        try {
          currentMode = currentCollection.template[itemIndex][param.refValue]["type"];
        } catch (e) {
          currentMode = "0";
        }

        //Disabling inputs based on mode
        if (paramIndex > 1) {
          if (currentMode == "0") {
            parameterInput.removeAttribute("disabled");
            parameterCBInput.setAttribute("disabled", "disabled");
          } else {
            parameterInput.setAttribute("disabled", "disabled");
            parameterCBInput.removeAttribute("disabled");
          }
        }

        modeInput.src = currentMode == "0" ? "./assets/paramIcons/fixedType.png" : "./assets/paramIcons/elementBasedType.png";
        modeInput.title = currentMode == "0" ? "Fixe" : "Basé sur les données";
        modeInput.id = inputID;

        modeInput.addEventListener("click", (e) => {
          currentCollection.template[itemIndex][param.refValue]["type"] = currentCollection.template[itemIndex][param.refValue]["type"] == "0" ? "1" : "0";

          let typeOfParameter = currentCollection.template[itemIndex][param.refValue]["type"];
          e.target.src = typeOfParameter == "0" ? "./assets/paramIcons/fixedType.png" : "./assets/paramIcons/elementBasedType.png";
          e.target.title = typeOfParameter == "0" ? "Fixe" : "Basé sur les données";

          let leftSibling = $(e.target).prev();
          let rightSibling = $(e.target).next();

          if (leftSibling.prop("disabled")) leftSibling.prop("disabled", false);
          else {
            leftSibling.prop("disabled", true);
          }
          if (rightSibling.prop("disabled")) rightSibling.prop("disabled", false);
          else {
            rightSibling.prop("disabled", true);
          }

          generateCollectionBtn.click();
          populateComponents();
        });
      }

      if (param.type !== "spacer") {
        //SELECTS
        if (param.type === "select") {
          parameterInput = document.createElement("select");
          parameterInput.classList.add("parameterInput", "mainInput");
          parameterInput.id = inputID;
          parameterInput.addEventListener("input", (e) => {
            if (currentCollection.template[itemIndex][param.refValue]) currentCollection.template[itemIndex][param.refValue]["value"] = e.target.value;
            else
              currentCollection.template[itemIndex][param.refValue] = {
                value: e.target.value,
                type: "0",
              };
            generateCollectionBtn.click();
            populateComponents();
          });

          let refOptionList = param.optionRef ? eval(param.optionRef) : param.options;
          if (!refOptionList) refOptionList = [];

          if (param.isShapesSelect) {
            let categorizedOpts = {
              none: [],
              polygons: [],
              basic_shapes: [],
              nature: [],
              complex_shapes: [],
            };

            refOptionList.forEach((opt) => {
              categorizedOpts[opt.cat].push(opt);
            });

            let categoryOrder = ["polygons", "basic_shapes", "complex_shapes", "nature"];
            let categoryLabels = ["Polygones", "Formes Simples", "Formes Complexes", "Nature"];

            let option = document.createElement("option");
            option.value = "none";
            option.innerHTML = categorizedOpts["none"][0].label;
            parameterInput.appendChild(option);

            categoryOrder.forEach((cat, index) => {
              let optGroupEl = $("<optgroup></optgroup>").attr("label", categoryLabels[index]);
              categorizedOpts[cat].forEach((opt) => {
                optGroupEl.append($("<option></option>").text(opt.label).val(opt.value));
              });
              $(parameterInput).append(optGroupEl);
            });
          } else {
            refOptionList.forEach((opt) => {
              let option = document.createElement("option");
              if (param.optionRef) option.style.fontFamily = opt.value;
              option.value = opt.value;
              option.innerHTML = opt.label;
              parameterInput.appendChild(option);
            });
          }

          //Set values in editor
          try {
            if (item[param.refValue].value) parameterInput.value = item[param.refValue].value;
          } catch (e) {
            parameterInput.value = "";
          }

          try {
            if (item[param.refValue].valueCB) parameterCBInput.value = item[param.refValue].valueCB;
          } catch (e) {
            parameterCBInput.value = "";
          }

          parameterCBInput.classList.add("parameterInput", "CBInput");

          parameterSlot.appendChild(parameterName);
          parameterInputLine.appendChild(parameterInput);
          if (!param.forced) {
            parameterInputLine.appendChild(modeInput);
            parameterInputLine.appendChild(parameterCBInput);
          }
          parameterSlot.appendChild(parameterInputLine);
        } else {
          parameterInput.classList.add("parameterInput", "mainInput");
          parameterInput.type = param.type;

          if (param.type === "range") {
            parameterInput.style.padding = "0";
          } else if (param.type === "color") {
            parameterInput.type = "text";
            parameterInput.style.textTransform = "uppercase";
            parameterInput.setAttribute("data-coloris", "");
            parameterInput.addEventListener("input", (e) => {
              e.target.style.background = e.target.value;
              if (getLuminanceFromHex(e.target.value) < 60) e.target.style.color = "white";
              else e.target.style.color = "black";
            });
            parameterInput.addEventListener("click", () => {
              Coloris({
                alpha: false,
                swatches: ["black", "white", "grey", "red", "#00cf00", "blue", "purple", "orange", "yellow", "#a65d29", "fuchsia"],
              });
            });
          } else if (param.type === "angle") {
            parameterInput.type = "text";
            parameterInput.setAttribute("data-angle-picker", "");

            parameterInput.addEventListener("click", () => {
              const picker = AnglePickerInit({
                size: 120,
                handleSize: 20,
                value: parseFloat(parameterInput.value) || 0,
              });
              picker.show(parameterInput);
            });
          } else if (param.type === "variable") {
            parameterInput.type = "text";
            parameterInput.setAttribute("data-variable-picker", "");

            parameterInput.addEventListener("click", () => {
              const picker = VariablePickerInit({
                presets: [{ value: ":W" }, { value: ":H" }, { value: ":W*0.5" }, { value: ":H*0.5" }],
              });
              picker.show(parameterInput);
            });
          }

          try {
            if (item[param.refValue].value) parameterInput.value = item[param.refValue].value;
          } catch (e) {
            parameterInput.value = "";
          }

          parameterCBInput.classList.add("parameterInput", "CBInput");
          try {
            if (item[param.refValue].valueCB) parameterCBInput.value = item[param.refValue].valueCB;
          } catch (e) {
            parameterCBInput.value = "";
          }

          parameterSlot.appendChild(parameterName);
          parameterInputLine.appendChild(parameterInput);
          if (!param.forced) {
            parameterInputLine.appendChild(modeInput);
            parameterInputLine.appendChild(parameterCBInput);
          }

          parameterSlot.appendChild(parameterInputLine);
        }
      }

      currentPanel.append($(parameterSlot));
    }
  });

  templateItemsDiv.appendChild(itemAccordion);
  templateItemsDiv.appendChild(itemPanel[0]);
}

export function addNewImage() {
  currentCollection.template.push(cloneDeep(imageComponentTemplate));
  assignUIDToNewComponent();
  setupComponents();
  generateCollectionBtn.click();
}

export function addNewText() {
  currentCollection.template.push(cloneDeep(textComponentTemplate));
  assignUIDToNewComponent();
  setupComponents();
  generateCollectionBtn.click();
}

export function addNewTitle() {
  currentCollection.template.push(cloneDeep(titleComponentTemplate));
  assignUIDToNewComponent();
  setupComponents();
  generateCollectionBtn.click();
}

export function addNewShape() {
  currentCollection.template.push(cloneDeep(shapeComponentTemplate));
  assignUIDToNewComponent();
  setupComponents();
  generateCollectionBtn.click();
}

function assignUIDToNewComponent() {
  if(debugMode) console.log("> assignUIDToNewComponent");
  currentCollection.template[currentCollection.template.length - 1].UID = currCollInfo.lastComponentIndex;
  currCollInfo.lastComponentIndex++;
}

export function populateComponents() {
  if(debugMode) console.log("> populateComponents");

  let allAccordions = templateItemsDiv.querySelectorAll(".accordion");

  currentCollection.template.forEach((item, index) => {
    let icon;
    let parametersToLoad;
    switch (item.component) {
      case "IMAGE":
        icon = "assets/btnIcons/addImageComponent.png";
        parametersToLoad = IMAGE_parameters;
        break;
      case "TEXT":
        icon = "assets/btnIcons/addTextComponent.png";
        parametersToLoad = TEXT_parameters;
        break;
      case "SHAPE":
        icon = "assets/btnIcons/addShapeComponent.png";
        parametersToLoad = SHAPE_parameters;
        break;
      case "TITLE":
        icon = "assets/btnIcons/addTitleComponent.png";
        parametersToLoad = TITLE_parameters;
        break;
    }

    allAccordions[index].querySelector(".componentIcon").src = icon;

    allAccordions[index].querySelector(".itemLabel").innerHTML = item.componentName.value;
    if (item.isVisible) allAccordions[index].querySelector(".visibilityBtn").src = "./assets/elementIcons/visibilityOn.png";
    else allAccordions[index].querySelector(".visibilityBtn").src = "./assets/elementIcons/visibilityOff.png";
  });
}

function getLuminanceFromHex(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16) / 255;
  var g = parseInt(result[2], 16) / 255;
  var b = parseInt(result[3], 16) / 255;

  return Math.round((Math.max(r, g, b) + Math.min(r, g, b)) * 50);
}

document.addEventListener("mouseup", () => {
  if (dragging) {
    dragging = false;
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      moveComponent(draggedIndex, dragOverIndex);
      setupComponents();
      generateCollectionBtn.click();
    }
    draggedIndex = null;
    dragOverIndex = null;
    const dragHandles = document.querySelectorAll(".drag-handle");
    dragHandles.forEach((handle) => {
      handle.style.cursor = "grab";
    });
    const allAccordions = document.querySelectorAll(".accordion");
    allAccordions.forEach((accordion) => {
      accordion.style.opacity = "1";
    });
  }
});

document.addEventListener("mousemove", (e) => {
  if (dragging) {
    const allAccordions = document.querySelectorAll(".accordion");
    allAccordions.forEach((accordion, index) => {
      const rect = accordion.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        dragOverIndex = index;
        //style hovered element
        accordion.classList.add("drag-over");
      } else {
        accordion.classList.remove("drag-over");
      }
    });
  } else {
    dragOverIndex = null;
  }
});
