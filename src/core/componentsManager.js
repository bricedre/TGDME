import { updateDataView } from "./elementsManager.js";

import { IMAGE_parameters, TEXT_parameters, SHAPE_parameters } from "./componentsUI.js";
import { currentCollection } from "./collectionsManager.js";
import { allSystemFonts } from "./assetsManager.js";
import { moveComponent } from "../screens/editionScreen.js";

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
    var noResourceText = document.createElement("div");
    noResourceText.classList.add("noStuffDiv");
    noResourceText.innerHTML = "Aucun Composant dans votre Modèle";

    templateItemsDiv.appendChild(noResourceText);
  }
}

export function createNewComponent(item, itemIndex) {
  var itemAccordion = document.createElement("button");
  itemAccordion.id = item.UID;
  itemAccordion.classList.add("accordion");

  var icon;
  var parametersToLoad;
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
  }

  itemAccordion.innerHTML = "<img src='" + icon + "'><span class='itemLabel'>" + item.componentName.value + "</span><span class='uidTag'>(#" + item.UID + ")<span>";

  if (itemIndex > 0) {
    var upElementBtn = document.createElement("img");
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
    var downElementBtn = document.createElement("img");
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

  var visibilityBtn = document.createElement("img");
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

  var deleteComponentBtn = document.createElement("img");
  deleteComponentBtn.classList.add("deleteComponentBtn");
  deleteComponentBtn.src = "./assets/delete.png";
  deleteComponentBtn.title = "Supprimer le Composant";
  deleteComponentBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    var componentToDelete = currentCollection.template.filter((el) => el.UID == e.target.parentNode.id)[0];
    currentCollection.template.splice(currentCollection.template.indexOf(componentToDelete), 1);
    setupComponents();
    updateDataView();

    generateCollectionBtn.click();
  });
  itemAccordion.appendChild(deleteComponentBtn);

  itemAccordion.addEventListener("click", () => {
    var panel = itemAccordion.nextElementSibling;
    if (itemAccordion.classList.contains("active")) {
      panel.style.maxHeight = "0";
      panel.style.marginBottom = "0rem";
      panel.style.padding = "0rem";
    } else {
      panel.style.maxHeight = "calc(2rem + " + panel.scrollHeight + "px)";
      panel.style.marginBottom = "1rem";
      panel.style.padding = "1rem";
    }

    itemAccordion.classList.toggle("active");
  });

  var itemPanel = document.createElement("div");
  itemPanel.classList.add("itemPanel");

  parametersToLoad.forEach((param, paramIndex) => {
    var parameterSlot = document.createElement("div");
    parameterSlot.classList.add("parameterSlot");

    var parameterName = document.createElement("p");
    parameterName.classList.add("parameterName");
    parameterName.innerHTML = param.name;
    if (param.title) {
      parameterName.title = param.title;
      parameterName.innerHTML += " 🔍";
    }

    var parameterInputLine = document.createElement("div");
    parameterInputLine.classList.add("parameterInputLine");

    var parameterInput = document.createElement("input");
    var inputID = itemIndex + "-" + param.refValue;
    parameterInput.id = inputID;
    parameterInput.addEventListener("input", (e) => {
      try {
        currentCollection.template[itemIndex][param.refValue]["value"] = e.target.value;
      } catch {
        currentCollection.template[itemIndex][param.refValue] = {
          value: e.target.value,
          type: "0",
          valueCB: "",
        };
      }

      populateComponents();
    });

    var parameterCBInput = document.createElement("input");
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

    var modeInput = document.createElement("img");
    modeInput.classList.add("modeInput");

    if (param.type !== "spacer") {
      var currentMode;
      try {
        currentMode = currentCollection.template[itemIndex][param.refValue]["type"];
      } catch (e) {
        currentMode = "0";
      }

      modeInput.src = currentMode == "0" ? "./assets/fixedType.png" : "./assets/elementBasedType.png";
      modeInput.title = currentMode == "0" ? "Fixe" : "Basé sur les données";
      modeInput.id = inputID;

      modeInput.addEventListener("click", (e) => {
        currentCollection.template[itemIndex][param.refValue]["type"] = currentCollection.template[itemIndex][param.refValue]["type"] == "0" ? "1" : "0";

        var typeOfParameter = currentCollection.template[itemIndex][param.refValue]["type"];
        e.target.src = typeOfParameter == "0" ? "./assets/fixedType.png" : "./assets/elementBasedType.png";
        e.target.title = typeOfParameter == "0" ? "Fixe" : "Basé sur les données";
        generateCollectionBtn.click();
        populateComponents();
      });
    }

    if (param.type !== "spacer") {

      //SELECTS
      if (param.type === "select") {
        parameterInput = document.createElement("select");
        parameterInput.classList.add("parameterInput","mainInput");
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

        var refOptionList = param.optionRef ? eval(param.optionRef) : param.options;

        refOptionList.forEach((opt) => {
          var option = document.createElement("option");
          if (param.optionRef) option.style.fontFamily = opt.value;
          option.value = opt.value;
          option.innerHTML = opt.label;
          parameterInput.appendChild(option);
        });


        if (item[param.refValue]) parameterInput.value = item[param.refValue]["value"];
        else parameterInput.value = "";

        
        parameterCBInput.classList.add("parameterInput","CBInput");

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
          parameterInput.value = item[param.refValue]["value"];
        } catch (e) {
          parameterInput.value = "";
        }
        parameterCBInput.classList.add("parameterInput", "CBInput");
        parameterSlot.appendChild(parameterName);
        parameterInputLine.appendChild(parameterInput);
        if (!param.forced) {
          parameterInputLine.appendChild(modeInput);
          parameterInputLine.appendChild(parameterCBInput);
        }
        parameterSlot.appendChild(parameterInputLine);

        // if (currentCollection.template[itemIndex][param.refValue]["type"] == "1") parameterInput.style.display = "none";
        // else parameterCBInput.style.display = "none";
      }
    } else {
      parameterName.classList.add("spacer");
      if (paramIndex == 0) parameterName.classList.add("firstSpacer");
      parameterSlot.appendChild(parameterName);
    }

    itemPanel.appendChild(parameterSlot);
  });

  templateItemsDiv.appendChild(itemAccordion);
  templateItemsDiv.appendChild(itemPanel);
}

export function populateComponents() {
  var allAccordions = templateItemsDiv.querySelectorAll(".accordion");

  currentCollection.template.forEach((item, index) => {
    var icon;
    var parametersToLoad;
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
    }

    allAccordions[index].querySelector("img").src = icon;

    allAccordions[index].querySelector("span").innerHTML = item.componentName.value;
    if (item.isVisible) allAccordions[index].querySelector(".visibilityBtn").src = "./assets/visibilityOn.png";
    else allAccordions[index].querySelector(".visibilityBtn").src = "./assets/visibilityOff.png";
  });
}
