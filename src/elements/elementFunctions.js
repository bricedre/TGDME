import { app } from "../app.js";
import { currentCollection, saveCollection } from "../collection/collectionManager.js";
import { ELEMENT_parameters } from "../template/componentParameters.js";
import { updateCardCounter } from "../screens/editionScreen.js";

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
    toPrintCheckBoxLabel.innerHTML = "<input type='checkbox'>";
    var printInput = toPrintCheckBoxLabel.firstChild;
    printInput.checked = currentCollection.elements[itemIndex]["toPrint"];
  
    var checkMarkElement = document.createElement("span");
    checkMarkElement.classList.add("checkmark");
    toPrintCheckBoxLabel.appendChild(checkMarkElement);
  
    toPrintCheckBoxLabel.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target == checkMarkElement) {
        var elementToEdit = currentCollection.elements.filter((el) => el.UID == e.target.parentNode.nextElementSibling.nextElementSibling.id)[0];
        elementToEdit["toPrint"] = !e.target.parentNode.firstChild.checked;
        saveCollection(false, false);
        populateElements();
      }
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
  
    itemAccordion.innerHTML = "<img src='assets/element.png'><span class='itemLabel'>Élément " + (itemIndex + 1) + "</span><span class='uidTag'>(#"+item.UID+")<span>";
  
    var deleteElementBtn = document.createElement("img");
    deleteElementBtn.classList.add("deleteElementBtn");
    deleteElementBtn.src = "./assets/delete.png";
    deleteElementBtn.title= "Supprimer l'Élément";
    deleteElementBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      var elementToDelete = currentCollection.elements.filter((el) => el.UID == e.target.parentNode.id)[0];
      currentCollection.elements.splice(currentCollection.elements.indexOf(elementToDelete), 1);
      app.currentIndex = Math.max(Math.min(app.currentIndex, currentCollection.elements.length - 1), 0);
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
        parameterName.innerHTML = param.parameter.name + " de " + param.component.componentName.value;
  
        var parameterInputLine = document.createElement("div");
        parameterInputLine.classList.add("parameterInputLine");
  
        var parameterInput = document.createElement("input");
        var inputID = paramIndex;
        parameterInput.id = inputID;
        parameterInput.addEventListener("input", (e) => {
          if (!currentCollection.elements[itemIndex][param.component.UID]) {
            currentCollection.elements[itemIndex][param.component.UID] = {};
          }
          currentCollection.elements[itemIndex][param.component.UID][param.parameter.refValue] = e.target.value;
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
    var allElementWrappers = elementItemsDiv.querySelectorAll(".elementItemWrapper");
  
    allElementWrappers.forEach((wrap, wrapIndex) => {
      var toPrintInput = wrap.querySelector("input[type='checkbox']");
      toPrintInput.checked = currentCollection.elements[wrapIndex]["toPrint"];
  
      var quantityInput = wrap.querySelector(".qtyInput");
      quantityInput.value = currentCollection.elements[wrapIndex]["quantity"];
  
      var allInputs = wrap.nextElementSibling.querySelectorAll(".parameterInput");
      allInputs.forEach((input, inputIndex) => {
        var componentParent = ELEMENT_parameters[inputIndex].component.UID;
        var parameterRefValue = ELEMENT_parameters[inputIndex].parameter.refValue;
  
        try {
          if (currentCollection.elements[wrapIndex][componentParent][parameterRefValue]) input.value = currentCollection.elements[wrapIndex][componentParent][parameterRefValue];
          else input.value = "";
        } catch (e) {
          input.value = "";
        }
      });
    });
  }