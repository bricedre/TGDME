import { app } from "../../app.js";
import { addNewElement, addNewImage, addNewShape, addNewText, archiveCollection, currentCollection, deleteCurrentCollection, duplicateCollection, saveCollection } from "../collectionManager.js";
import { rootElement } from "./mainLayout.js";
import { IMAGE_parameters, TEXT_parameters, SHAPE_parameters, ELEMENT_parameters, resetElementParameters } from "../componentParameters.js";
import { renderCardUsingTemplate } from "../render.js";
import { addAsset, allSystemFonts, currentAssetsList, removeAsset } from "../assetLoader.js";

//COLLECTION PARAMETERS

duplicateCollectionBtn.addEventListener("click", () => duplicateCollection());
archiveCollectionBtn.addEventListener("click", () => archiveCollection());
deleteCollectionBtn.addEventListener("click", () => deleteCurrentCollection());

renderCollectionBtn.addEventListener("click", () => triggerGeneration(app));

generateCollectionBtn.addEventListener("click", () => {
  saveCollection(false);
  generateCollectionBtn.style.animation = "0.5s beyblade";
});

generateCollectionBtn.addEventListener("animationend", () => {
  generateCollectionBtn.style.animation = "none";
});

bigPrevCardBtn.addEventListener("click", () => goToOtherCard(-10));
prevCardBtn.addEventListener("click", () => goToOtherCard(-1));
nextCardBtn.addEventListener("click", () => goToOtherCard(1));
bigNextCardBtn.addEventListener("click", () => goToOtherCard(10));

addImageComponentBtn.addEventListener("click", () => addNewImage());
addShapeComponentBtn.addEventListener("click", () => addNewShape());
addTextComponentBtn.addEventListener("click", () => addNewText());

addNewElementBtn.addEventListener("click", () => addNewElement());

newResourceInput.addEventListener("change", function (e) {
  if (e.target.files[0]) {
    addAsset(e.target.files[0]);
  }
});

/*        
GLOBAL
*/

export function updateCardCounter() {

  var currentIndex = app.currentIndex;

  //INDEX
  if (currentCollection.elements.length > 0) {

    cardCounterDivLabel.innerHTML =
      "Élément " +
      (currentIndex + 1) +
      " sur " +
      currentCollection.elements.length +
      " - " +
      currentCollection.elements[currentIndex].quantity +
      (currentCollection.elements[currentIndex].quantity > 1 ? " copies" : " copie");
  } else {
    cardCounterDivLabel.innerHTML = "PAS DE CARTE À AFFICHER";
  }

  if (app.currentIndex != 0) {
    prevCardBtn.disabled = false;
    bigPrevCardBtn.disabled = false;
  }
  else {
    prevCardBtn.disabled = true;
    bigPrevCardBtn.disabled = true;
  }

  if (currentCollection.elements.length > 0 && app.currentIndex != currentCollection.elements.length - 1) {
    nextCardBtn.disabled = false;
    bigNextCardBtn.disabled = false;
  }
  else {
    nextCardBtn.disabled = true;
    bigNextCardBtn.disabled = true;
  }
}

export function goToOtherCard(delta) {
  app.currentIndex = Math.min(Math.max(parseInt(app.currentIndex + delta), 0), currentCollection.elements.length - 1);
  renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
  updateCardCounter();
  rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
}

export function populateEditionFields() {
  collectionNameInput.value = currentCollection.collectionInfo.collectionName;
  mainTitleDiv.innerHTML = currentCollection?.collectionInfo.collectionName;
  elementFormatSelect.value = currentCollection.collectionInfo.elementFormat;
  elementWidthInput.value = currentCollection.collectionInfo.W;
  elementHeightInput.value = currentCollection.collectionInfo.H;
  visualGuideSelect.value = currentCollection.collectionInfo.visualGuide;

  pageFormatSelect.value = currentCollection.collectionInfo.pageFormat;
  pageOrientationSelect.value = currentCollection.collectionInfo.pageOrientation;
  pageWidthInput.value = currentCollection.collectionInfo.pageWidth;
  pageHeightInput.value = currentCollection.collectionInfo.pageHeight;
  pageResolutionInput.value = currentCollection.collectionInfo.resolution;
  cuttingHelpInput.value = currentCollection.collectionInfo.cuttingHelp;
}

export function checkOtherInputs(eventTargetId, eventTargetValue) {
  switch (eventTargetId) {
    case "elementFormatSelect":
      if (eventTargetValue === "custom") {
        elementHeightInput.disabled = false;
        elementWidthInput.disabled = false;
        populateEditionFields();
      } else {
        elementHeightInput.disabled = true;
        elementWidthInput.disabled = true;
      }
      break;

    case "pageFormat":
      if (eventTargetValue === "custom") {
        pageWidthInput.disabled = false;
        pageHeight.disabled = false;
        pageOrientationSelect.disabled = true;
        populateEditionFields();
      } else {
        pageWidthInput.disabled = true;
        pageHeightInput.disabled = true;
        pageOrientationSelect.disabled = false;
      }
      break;
  }
}

/*        
RESSOURCES
*/
export function setupResources() {
  while (ressItemsDiv.firstChild) {
    ressItemsDiv.removeChild(ressItemsDiv.lastChild);
  }

  if (currentAssetsList.length > 0) {
    currentAssetsList.forEach((item, itemIndex) => {
      createNewResource(item, itemIndex);
    });
  } else {
    var noResourceText = document.createElement("div");
    noResourceText.classList.add("noStuffDiv");
    noResourceText.innerHTML = "Aucune Ressource dans votre Collection<br><br><br><br>Cliquez sur le bouton en bas pour en ajouter une";

    ressItemsDiv.appendChild(noResourceText);
  }
}

export function createNewResource(item, itemIndex) {
  var itemAccordion = document.createElement("button");
  var emptyDiv = document.createElement("div");
  itemAccordion.id = itemIndex;
  itemAccordion.classList.add("accordion");

  let file = item.split("//")[1];
  let fileName = file.split(".")[0];
  let extension = file.split(".")[1];

  itemAccordion.innerHTML = "<img src='assets/imgResource.png'><span title='Cliquez pour copier le nom de la ressource'>" + fileName + "</span>";
  itemAccordion.addEventListener("click", () => {
    navigator.clipboard.writeText(fileName);
  });

  var deleteResourceBtn = document.createElement("img");
  deleteResourceBtn.classList.add("deleteResourceBtn");
  deleteResourceBtn.src = "./assets/delete.png";
  deleteResourceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeAsset(currentAssetsList[itemAccordion.id]);
  });
  itemAccordion.appendChild(deleteResourceBtn);

  ressItemsDiv.appendChild(itemAccordion);
  ressItemsDiv.appendChild(emptyDiv);
}

/*        
TEMPLATE
*/

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
    noResourceText.innerHTML = "Aucun Composant dans votre Modèle<br><br><br><br>Cliquez sur un des boutons en bas pour en ajouter un";

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

  itemAccordion.innerHTML = "<img src='" + icon + "'><span>" + item.componentName.value + "</span>";

  if (itemIndex > 0) {
    var upElementBtn = document.createElement("img");
    upElementBtn.classList.add("upElementBtn");
    upElementBtn.src = "./assets/moveUp.png";
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
    downElementBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveComponent(itemIndex, 1);
    });
    itemAccordion.appendChild(downElementBtn);
  }

  var visibilityBtn = document.createElement("img");
  visibilityBtn.classList.add("visibilityBtn");
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
  deleteComponentBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    var componentToDelete = currentCollection.template.filter(el => el.UID == e.target.parentNode.id)[0];
    currentCollection.template.splice(currentCollection.template.indexOf(componentToDelete), 1);
    setupComponents();
    setupElements();
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
    var inputID = item.UID + "-" + param.refValue;
    parameterInput.id = inputID;
    parameterInput.addEventListener("input", (e) => {
      try {
        currentCollection.template[itemIndex][param.refValue]["value"] = e.target.value;
      } catch {
        currentCollection.template[itemIndex][param.refValue] = {
          value: e.target.value,
          type: "0",
        };
      }

      if (param.refValue === "componentName") {
        console.log("comp title");
        populateComponents();
        setupElements();
        populateElements();
      }
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
      modeInput.title = currentMode == "0" ? "Fixe" : "Basé sur l'élement";
      modeInput.id = inputID;
      if (paramIndex > 2) parameterInput.disabled = currentMode == "0" ? false : true;
      modeInput.addEventListener("click", () => {
        console.log("change mod");
        var typeOfParameter = currentCollection.template[itemIndex][param.refValue]["type"];
        currentCollection.template[itemIndex][param.refValue]["type"] = typeOfParameter == "0" ? "1" : "0";
        generateCollectionBtn.click();
        populateComponents();
        setupElements();
        populateElements();
      });
    }

    if (param.type !== "spacer") {
      //CHECKBOXES
      if (param.type === "checkbox") {
        var oldName = parameterName.innerHTML;
        var oldTitle = parameterName.title;
        parameterInput.type = param.type;
        parameterInput.checked = item[param.refValue]["value"];
        parameterInput.addEventListener("input", (e) => {
          currentCollection.template[itemIndex][param.refValue]["value"] = e.target.checked;
          generateCollectionBtn.click();
        });
        parameterName = document.createElement("label");
        parameterName.setAttribute("for", inputID);
        parameterName.classList.add("parameterName");
        parameterName.innerHTML = oldName;
        parameterName.title = oldTitle;
        parameterInputLine.appendChild(parameterInput);
        parameterInputLine.appendChild(parameterName);
        if (!param.forced) parameterInputLine.appendChild(modeInput);
        parameterSlot.appendChild(parameterInputLine);
      }

      //SELECTS
      else if (param.type === "select") {
        parameterInput = document.createElement("select");
        parameterInput.classList.add("parameterInput");
        parameterInput.id = inputID;
        parameterInput.addEventListener("input", (e) => {
          currentCollection.template[itemIndex][param.refValue]["value"] = e.target.value;
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
        parameterInput.value = item[param.refValue]["value"];

        parameterSlot.appendChild(parameterName);
        parameterInputLine.appendChild(parameterInput);
        if (!param.forced) parameterInputLine.appendChild(modeInput);
        parameterSlot.appendChild(parameterInputLine);
      } else {
        parameterInput.classList.add("parameterInput");
        if (param.type === "color") parameterInput.style.padding = "0.2rem";
        parameterInput.type = param.type;
        try {
          parameterInput.value = item[param.refValue]["value"];
        } catch (e) {
          parameterInput.value = "";
        }
        parameterSlot.appendChild(parameterName);
        parameterInputLine.appendChild(parameterInput);
        if (!param.forced) parameterInputLine.appendChild(modeInput);
        parameterSlot.appendChild(parameterInputLine);
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

    resetElementParameters();
    allAccordions.forEach((acc, accIndex) => {

      var accInputs = acc.nextElementSibling.querySelectorAll("input, select");

      accInputs.forEach((input, inputIndex) => {

        var inputRefValue = input.id.split("-")[1];

        try {
          input.value = currentCollection.template[accIndex][inputRefValue]["value"];
          if (inputIndex > 1) input.disabled = currentCollection.template[accIndex][inputRefValue]["type"] == "0" ? false : true;
        } catch (e) {
          input.value = 0;
        }

        var parameterType = currentCollection.template[accIndex].component;
        var parametersLoaded = eval(parameterType + "_parameters").filter((item) => item.type != "spacer");
        var parameter = parametersLoaded[inputIndex];

        if (currentCollection.template[accIndex][inputRefValue].type === "1") {
          ELEMENT_parameters.push({
            name: parameter.name + " de " + currentCollection.template[accIndex]["componentName"].value,
            value: null,
            type: parameter.type,
          });
        }
      });
    });
  });

  var allModeBtns = templateItemsDiv.querySelectorAll(".modeInput");
  allModeBtns.forEach((input) => {
    var inputID = input.id;
    var inputIndex = inputID.split("-")[0];
    var inputRefValue = inputID.split("-")[1];
    var currentMode;
    try {
      currentMode = currentCollection.template[inputIndex][inputRefValue]["type"];
    } catch (e) {
      currentMode = "0";
    }
    input.src = currentMode == "0" ? "./assets/fixedType.png" : "./assets/elementBasedType.png";
    input.title = currentMode == "0" ? "Fixe" : "Basé sur l'élement";
  });
}

export function moveComponent(currentIndex, delta) {
  var allAccordions = templateItemsDiv.querySelectorAll(".accordion");

  var destinationIndex = currentIndex + delta;
  var currentElement = { ...currentCollection.template[currentIndex] };
  var destinationElement = { ...currentCollection.template[destinationIndex] };

  currentCollection.template[destinationIndex] = currentElement;
  currentCollection.template[currentIndex] = destinationElement;

  allAccordions[currentIndex].style.translate = "0 " + 145 * delta + "%";
  allAccordions[destinationIndex].style.translate = "0 " + 145 * -delta + "%";

  setTimeout(() => {
    setupComponents();
    generateCollectionBtn.click();
  }, 200);
}

/*        
ELEMENTS
*/
export function setupElements() {
  while (elementItemsDiv.firstChild) {
    elementItemsDiv.removeChild(elementItemsDiv.lastChild);
  }

  if (currentCollection.elements.length > 0) {
    elementItemsDiv.style.display = "block";
    currentCollection.elements.forEach((item, itemIndex) => {
      createNewElement(item, itemIndex);
    });
  } else {
    elementItemsDiv.style.display = "flex";
    var noResourceText = document.createElement("div");
    noResourceText.classList.add("noStuffDiv");
    noResourceText.innerHTML = "Aucun Élément dans votre Collection<br><br><br><br>Cliquez sur le bouton en bas pour en ajouter un";

    elementItemsDiv.appendChild(noResourceText);
  }

  updateCardCounter();
}

export function createNewElement(item, itemIndex) {
  var itemWrapper = document.createElement("div");
  itemWrapper.classList.add("elementItemWrapper");

  var toPrintCheckBoxLabel = document.createElement("label");
  toPrintCheckBoxLabel.classList.add("checkboxContainer");
  toPrintCheckBoxLabel.innerHTML = "<input type='checkbox'><span class='checkmark'></span>";
  var printInput = toPrintCheckBoxLabel.firstChild;
  printInput.checked = currentCollection.elements[itemIndex]["toPrint"];
  toPrintCheckBoxLabel.addEventListener("click", (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    var elementToEdit = currentCollection.elements.filter(el => el.UID == e.target.parentNode.nextElementSibling.nextElementSibling.id)[0];
    console.log(elementToEdit, e.target.parentNode.firstChild.checked)
    elementToEdit["toPrint"] = e.target.parentNode.firstChild.checked;
    saveCollection(false);
  });

  itemWrapper.appendChild(toPrintCheckBoxLabel);

  var qtyInput = document.createElement("input");
  qtyInput.classList.add("qtyInput");
  qtyInput.type = "text";
  qtyInput.value = currentCollection.elements[itemIndex]["quantity"];
  qtyInput.addEventListener("input", (e) => {
    currentCollection.elements[itemIndex]["quantity"] = parseInt(e.target.value);
  });

  itemWrapper.appendChild(qtyInput);

  var itemAccordion = document.createElement("button");
  itemAccordion.id = item.UID;
  itemAccordion.classList.add("accordion");

  itemAccordion.innerHTML = "<img src='assets/element.png'><span>Élément " + (itemIndex + 1) + "</span>";

  var deleteElementBtn = document.createElement("img");
  deleteElementBtn.classList.add("deleteElementBtn");
  deleteElementBtn.src = "./assets/delete.png";
  deleteElementBtn.addEventListener("click", (e) => {
    console.log("del elem");
    e.preventDefault();
    e.stopPropagation();
    var elementToDelete = currentCollection.elements.filter(el => el.UID == e.target.parentNode.id)[0];
    currentCollection.elements.splice(currentCollection.elements.indexOf(elementToDelete), 1);
    setupElements();
    generateCollectionBtn.click();
  });
  itemAccordion.appendChild(deleteElementBtn);


  itemAccordion.addEventListener("click", () => {
    var panel = itemAccordion.parentNode.nextElementSibling;
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
  itemPanel.classList.add("elementItemPanel");

  if (ELEMENT_parameters.length > 0) {
    ELEMENT_parameters.forEach((param, paramIndex) => {
      var parameterSlot = document.createElement("div");
      parameterSlot.classList.add("parameterSlot");

      var parameterName = document.createElement("p");
      parameterName.classList.add("parameterName");
      parameterName.innerHTML = param.name;

      var parameterInputLine = document.createElement("div");
      parameterInputLine.classList.add("parameterInputLine");

      var parameterInput = document.createElement("input");
      var inputID = item.UID + "-" + param.name;
      parameterInput.id = inputID;
      parameterInput.addEventListener("input", (e) => {
        try {
          currentCollection.elements[itemIndex][param.name] = e.target.value;
        } catch { }
      });

      if (param.type !== "spacer") {
        //CHECKBOXES
        if (param.type === "checkbox") {
          var oldName = parameterName.innerHTML;
          parameterInput.type = param.type;
          try {
            parameterInput.checked = item[param.name];
          } catch (e) {
            parameterInput.checked = false;
          }
          parameterInput.addEventListener("input", (e) => {
            currentCollection.elements[itemIndex][param.name] = e.target.checked;
            generateCollectionBtn.click();
          });
          parameterName = document.createElement("label");
          parameterName.setAttribute("for", inputID);
          parameterName.classList.add("parameterName");
          parameterName.innerHTML = oldName;
          parameterInputLine.appendChild(parameterInput);
          parameterInputLine.appendChild(parameterName);
          parameterSlot.appendChild(parameterInputLine);
        }

        //SELECTS
        else if (param.type === "select") {
          parameterInput = document.createElement("select");
          parameterInput.classList.add("parameterInput");
          parameterInput.id = inputID;
          // parameterInput.addEventListener("input", (e) => {
          //   currentCollection.template[itemIndex][param.refValue]["value"] = e.target.value;
          //   generateCollectionBtn.click();
          //   populateComponents();
          // });

          // var refOptionList = param.optionRef ? eval(param.optionRef) : param.options;

          // refOptionList.forEach((opt) => {
          //   var option = document.createElement("option");
          //   if (param.optionRef) option.style.fontFamily = opt.value;
          //   option.value = opt.value;
          //   option.innerHTML = opt.label;
          //   parameterInput.appendChild(option);
          // });
          parameterInput.value = item[param.refValue]["value"];
          parameterSlot.appendChild(parameterName);
          parameterInputLine.appendChild(parameterInput);
          parameterSlot.appendChild(parameterInputLine);
        } else {
          parameterInput.classList.add("parameterInput");
          if (param.type === "color") parameterInput.style.padding = "0.2rem";
          parameterInput.type = param.type;
          try {
            parameterInput.value = item[param.refValue]["value"];
          } catch (e) {
            parameterInput.value = "";
          }
          parameterSlot.appendChild(parameterName);
          parameterInputLine.appendChild(parameterInput);
          parameterSlot.appendChild(parameterInputLine);
        }
      } else {
        parameterName.classList.add("spacer");
        if (paramIndex == 0) parameterName.classList.add("firstSpacer");
        parameterSlot.appendChild(parameterName);
      }

      itemPanel.appendChild(parameterSlot);
    });
  } else {
    var noResourceText = document.createElement("div");
    noResourceText.classList.add("noStuffDiv");
    noResourceText.innerHTML = "Aucun Paramètre basé sur l'Élément dans le Modèle";

    itemPanel.appendChild(noResourceText);
  }

  itemWrapper.appendChild(itemAccordion);
  elementItemsDiv.appendChild(itemWrapper);
  elementItemsDiv.appendChild(itemPanel);
}

export function populateElements() {
  var allInputs = elementItemsDiv.querySelectorAll("input, select");
  allInputs.forEach((input) => {
    var inputID = input.id;
    var inputIndex = inputID.split("-")[0];
    var inputRefValue = inputID.split("-")[1];
    try {
      input.value = currentCollection.elements[inputIndex][inputRefValue];
    } catch (e) {
      input.value = 0;
    }
  });

  var allQuantities = elementItemsDiv.querySelectorAll(".qtyInput");
  console.log(allQuantities.length);
  allQuantities.forEach((input, index) => {
    input.value = currentCollection.elements[index]["quantity"];
  });
}