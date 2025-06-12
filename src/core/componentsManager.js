import { updateDataView } from "./elementsManager.js";

import { IMAGE_parameters, TEXT_parameters, SHAPE_parameters, TITLE_parameters } from "./componentsUI.js";
import { currentCollection } from "./collectionsManager.js";
import { allSystemFonts } from "./assetsManager.js";
import { moveComponent } from "../screens/editionScreen.js";

const $ = require("jquery");

export function setupComponents() {
  while (templateItemsDiv.firstChild) {
    templateItemsDiv.removeChild(templateItemsDiv.lastChild);
  }

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
  let itemAccordion = document.createElement("button");
  itemAccordion.id = item.UID;
  itemAccordion.classList.add("accordion");

  let icon;
  let parametersToLoad;
  switch (item.component) {
    case "IMAGE":
      icon = "assets/addImageComponent.png";
      parametersToLoad = IMAGE_parameters;
      break;
    case "TEXT":
      icon = "assets/addTextComponent.png";
      parametersToLoad = TEXT_parameters;
      break;
    case "TITLE":
      icon = "assets/addTitleComponent.png";
      parametersToLoad = TITLE_parameters;
      break;
    case "SHAPE":
      icon = "assets/addShapeComponent.png";
      parametersToLoad = SHAPE_parameters;
      break;
  }

  itemAccordion.innerHTML = `<img src="${icon}"><span class="itemLabel">${item.componentName.value != "" ? item.componentName.value : "Composant sans Nom"}</span><span class="headerSpacer"><span>`;

  //
  if (itemIndex > 0) {
    let upElementBtn = document.createElement("img");
    upElementBtn.classList.add("upElementBtn");
    upElementBtn.src = "./assets/moveUp.png";
    upElementBtn.title = "Reculer le Composant";
    upElementBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveComponent(itemIndex, -1);
    });
    itemAccordion.appendChild(upElementBtn);
  }

  if (itemIndex < currentCollection.template.length - 1) {
    let downElementBtn = document.createElement("img");
    downElementBtn.classList.add("downElementBtn");
    downElementBtn.src = "./assets/moveDown.png";
    downElementBtn.title = "Avancer le Composant";
    downElementBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveComponent(itemIndex, 1);
    });
    itemAccordion.appendChild(downElementBtn);
  }

  let visibilityBtn = document.createElement("img");
  visibilityBtn.classList.add("visibilityBtn");
  visibilityBtn.title = "Afficher/Cacher";
  if (item.isVisible) visibilityBtn.src = "./assets/visibilityOn.png";
  else visibilityBtn.src = "./assets/visibilityOff.png";
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
  duplicateComponentBtn.src = "./assets/duplicateComponent.png";
  duplicateComponentBtn.title = "Dupliquer le Composant";
  duplicateComponentBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let componentToDuplicate = currentCollection.template.filter((el) => el.UID == e.target.parentNode.id)[0];
    let indexWhereToDuplicate = currentCollection.template.indexOf(componentToDuplicate) + 1;

    let newComponent = JSON.parse(JSON.stringify(componentToDuplicate));
    newComponent.UID = currentCollection.collectionInfo.lastComponentIndex;
    currentCollection.collectionInfo.lastComponentIndex++;

    currentCollection.template.splice(indexWhereToDuplicate, 0, newComponent);
    setupComponents();
    updateDataView();

    generateCollectionBtn.click();
  });
  itemAccordion.appendChild(duplicateComponentBtn);

  let deleteComponentBtn = document.createElement("img");
  deleteComponentBtn.classList.add("deleteComponentBtn");
  deleteComponentBtn.src = "./assets/delete.png";
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
      panel.style.marginBottom = "0rem";
      panel.style.padding = "0rem";
    } else {
      panel.style.maxHeight = "max-content";
      panel.style.marginBottom = "1rem";
      panel.style.padding = "1rem";
    }

    itemAccordion.classList.toggle("active");
  });

  let itemPanel = document.createElement("div");
  itemPanel.classList.add("itemPanel");

  // ADDING PARAMETERS TO COMPONENTS
  let currentPanel = null;
  parametersToLoad.forEach((param, paramIndex) => {
    if (param.type == "catHeader") {
      let paramAccordion = document.createElement("button");
      paramAccordion.classList.add("paramAccordion");
      paramAccordion.innerHTML = param.name;

      let paramPanel = document.createElement("div");
      paramPanel.classList.add("paramPanel");
      currentPanel = paramPanel;

      paramAccordion.addEventListener("click", () => {
        if (paramAccordion.classList.contains("active")) {
          paramPanel.style.maxHeight = "0";
          paramPanel.style.marginBottom = "0rem";
          paramPanel.style.padding = "0rem";
        } else {
          paramPanel.style.maxHeight = "max-content";
          paramPanel.style.marginBottom = "1rem";
          paramPanel.style.padding = "1rem";
        }

        paramAccordion.classList.toggle("active");
      });

      itemPanel.appendChild(paramAccordion);
      itemPanel.appendChild(paramPanel);
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
        } catch {
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
        } catch {
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

        modeInput.src = currentMode == "0" ? "./assets/fixedType.png" : "./assets/elementBasedType.png";
        modeInput.title = currentMode == "0" ? "Fixe" : "Basé sur les données";
        modeInput.id = inputID;

        modeInput.addEventListener("click", (e) => {
          currentCollection.template[itemIndex][param.refValue]["type"] = currentCollection.template[itemIndex][param.refValue]["type"] == "0" ? "1" : "0";

          let typeOfParameter = currentCollection.template[itemIndex][param.refValue]["type"];
          e.target.src = typeOfParameter == "0" ? "./assets/fixedType.png" : "./assets/elementBasedType.png";
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
          if (param.type === "color") parameterInput.style.padding = "0.2rem";
          parameterInput.type = param.type;
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
      
      currentPanel.appendChild(parameterSlot);
    }
  });

  templateItemsDiv.appendChild(itemAccordion);
  templateItemsDiv.appendChild(itemPanel);
}

export function populateComponents() {
  let allAccordions = templateItemsDiv.querySelectorAll(".accordion");

  currentCollection.template.forEach((item, index) => {
    let icon;
    let parametersToLoad;
    switch (item.component) {
      case "IMAGE":
        icon = "assets/addImageComponent.png";
        parametersToLoad = IMAGE_parameters;
        break;
      case "TEXT":
        icon = "assets/addTextComponent.png";
        parametersToLoad = TEXT_parameters;
        break;
      case "SHAPE":
        icon = "assets/addShapeComponent.png";
        parametersToLoad = SHAPE_parameters;
        break;
      case "TITLE":
        icon = "assets/addTitleComponent.png";
        parametersToLoad = TITLE_parameters;
        break;
    }

    allAccordions[index].querySelector("img").src = icon;

    allAccordions[index].querySelector("span").innerHTML = item.componentName.value;
    if (item.isVisible) allAccordions[index].querySelector(".visibilityBtn").src = "./assets/visibilityOn.png";
    else allAccordions[index].querySelector(".visibilityBtn").src = "./assets/visibilityOff.png";
  });
}
