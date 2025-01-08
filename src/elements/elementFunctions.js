import { app } from "../app.js";
import { currentCollection, saveCollection } from "../collection/collectionManager.js";
import { ELEMENT_parameters } from "../template/componentParameters.js";
import { updateCardCounter } from "../screens/editionScreen.js";

const gridjs = require("gridjs");
// import "gridjs/dist/theme/mermaid.css";

export function setupElements() {
  //Delete all content
  while (contentElementsDiv.firstChild) {
    contentElementsDiv.removeChild(contentElementsDiv.lastChild);
  }

  updateCardCounter();

  let dataTable = document.createElement("table");

  let tableCaption = document.createElement("caption");
  tableCaption.innerHTML = `${currentCollection.elements.data.length} entrée${currentCollection.elements.data.length > 1 ? "s" : ""} dans les données`;
  dataTable.appendChild(tableCaption);

  //TABLE HEADER
  let headersRow = document.createElement("tr");

  //Add header cell
  let addValueBtn = document.createElement("td");
  addValueBtn.innerHTML = "AJOUTER VALEUR";
  addValueBtn.classList.add("addValueBtn", 'actionsCell');
  addValueBtn.addEventListener("click", () => {
    addNewValue();
  });
  headersRow.appendChild(addValueBtn);

  currentCollection.elements.headers.forEach((hd, hdIndex) => {
    let hdCell = document.createElement("th");
    hdCell.setAttribute("contenteditable", "true");
    hdCell.innerHTML = hd;

    hdCell.addEventListener("input", (e) => {
      currentCollection.elements.headers[hdIndex] = e.target.innerHTML;
    });

    headersRow.appendChild(hdCell);
  });

  dataTable.appendChild(headersRow);

  //ELEMENTS ROWS
  currentCollection.elements.data.forEach((el, elIndex) => {
    let elRow = document.createElement("tr");

    //ACTION CELLS
    let actionsCell = document.createElement("td");
    actionsCell.classList.add("actionsCell", "void");

    if (elIndex > 0) {
      var upElementBtn = document.createElement("img");
      upElementBtn.classList.add("upElementBtn");
      upElementBtn.src = "./assets/moveUp.png";
      upElementBtn.addEventListener("click", (e) => {
        moveEntry(elIndex, -1);
      });
      actionsCell.appendChild(upElementBtn);
    }

    if (elIndex < currentCollection.elements.data.length - 1) {
      var downElementBtn = document.createElement("img");
      downElementBtn.classList.add("downElementBtn");
      downElementBtn.src = "./assets/moveDown.png";
      downElementBtn.addEventListener("click", (e) => {
        moveEntry(elIndex, 1);
      });
      actionsCell.appendChild(downElementBtn);
    }

    var duplicateElementBtn = document.createElement("img");
    duplicateElementBtn.classList.add("deleteComponentBtn");
    duplicateElementBtn.src = "./assets/qty.png";
    duplicateElementBtn.addEventListener("click", (e) => {
      duplicateEntry(elIndex);
    });
    actionsCell.appendChild(duplicateElementBtn);

    var deleteComponentBtn = document.createElement("img");
    deleteComponentBtn.classList.add("deleteComponentBtn");
    deleteComponentBtn.src = "./assets/delete.png";
    deleteComponentBtn.addEventListener("click", (e) => {
      deleteEntry(elIndex);
    });
    actionsCell.appendChild(deleteComponentBtn);

    elRow.appendChild(actionsCell);

    currentCollection.elements.headers.forEach((hd, paramIndex) => {
      let elCell = document.createElement("td");
      elCell.setAttribute("contenteditable", "true");
      elCell.innerHTML = el[paramIndex];

      elCell.addEventListener("input", (e) => {
        currentCollection.elements.data[elIndex][paramIndex] = e.target.innerHTML;
      });

      elRow.appendChild(elCell);
    });

    dataTable.appendChild(elRow);
  });

  //DELETE ROW
  let deleteRow = document.createElement("tr");

  let addEntryBtn = document.createElement("td");
  addEntryBtn.classList.add("addEntryBtn", "actionsCell");
  addEntryBtn.innerHTML = "AJOUTER NOUVELLE ENTRÉE";
  addEntryBtn.addEventListener("click", () => {
    addNewEntry();
  });
  deleteRow.appendChild(addEntryBtn);

  currentCollection.elements.headers.forEach((value, index) => {
    let deleteValueCell = document.createElement("td");
    deleteValueCell.classList.add("void", "deleteCell");

    var deleteValueBtn = document.createElement("img");
    deleteValueBtn.classList.add("deleteComponentBtn");
    deleteValueBtn.src = "./assets/delete.png";
    deleteValueBtn.addEventListener("click", (e) => {
      deleteValue(index);
    });
    deleteValueCell.appendChild(deleteValueBtn);
    deleteRow.appendChild(deleteValueCell);
  });

  dataTable.appendChild(deleteRow);

  contentElementsDiv.appendChild(dataTable);
}

function addNewEntry() {
  let nextEntryIndex = currentCollection.elements.data.length;
  currentCollection.elements.data.push([]);
  currentCollection.elements.headers.forEach((header) => {
    currentCollection.elements.data[nextEntryIndex].push("");
  });
  setupElements();
}

function addNewValue() {
  let nextValueIndex = currentCollection.elements.headers.length;
  console.log(nextValueIndex);
  currentCollection.elements.headers.push("valeur");
  currentCollection.elements.data.forEach((dataSet) => {
    dataSet[nextValueIndex] = "";
  });
  setupElements();
}

function deleteEntry(index) {
  currentCollection.elements.data.splice(index, 1);
  setupElements();
}

function deleteValue(index) {
  currentCollection.elements.headers.splice(index, 1);
  currentCollection.elements.data.forEach((dataSet) => {
    dataSet.splice(index, 1);
  });
  setupElements();
}

function duplicateEntry(index) {
  let duplicatedEntry = [...currentCollection.elements.data[index]];
  currentCollection.elements.data.splice(index, 0, duplicatedEntry);
  setupElements();
}

function moveEntry(index, dep) {
  let entryA = [...currentCollection.elements.data[index]];
  let entryB = [...currentCollection.elements.data[index + dep]];
  currentCollection.elements.data[index] = entryB;
  currentCollection.elements.data[index + dep] = entryA;
  setupElements();
}

// export function createNewElement(item, itemIndex) {
//   var itemWrapper = document.createElement("div");
//   itemWrapper.classList.add("elementItemWrapper");

//   var itemAccordion = document.createElement("button");
//   itemAccordion.id = item.UID;
//   itemAccordion.classList.add("accordion");

//   itemAccordion.innerHTML = "<img src='assets/element.png'><span class='itemLabel'>Élément " + (itemIndex + 1) + "</span><span class='uidTag'>(#" + item.UID + ")<span>";

//   var deleteElementBtn = document.createElement("img");
//   deleteElementBtn.classList.add("deleteElementBtn");
//   deleteElementBtn.src = "./assets/delete.png";
//   deleteElementBtn.title = "Supprimer l'Élément";
//   deleteElementBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     var elementToDelete = currentCollection.elements.filter((el) => el.UID == e.target.parentNode.id)[0];
//     currentCollection.elements.splice(currentCollection.elements.indexOf(elementToDelete), 1);
//     app.currentIndex = Math.max(Math.min(app.currentIndex, currentCollection.elements.length - 1), 0);
//     setupElements();
//     generateCollectionBtn.click();
//   });
//   itemAccordion.appendChild(deleteElementBtn);

//   itemAccordion.addEventListener("click", () => {
//     var panel = itemAccordion.parentNode.nextElementSibling;
//     if (itemAccordion.classList.contains("active")) {
//       panel.style.maxHeight = "0";
//       panel.style.marginBottom = "0rem";
//       panel.style.padding = "0rem";
//     } else {
//       panel.style.maxHeight = "calc(2rem + " + panel.scrollHeight + "px)";
//       panel.style.marginBottom = "1rem";
//       panel.style.padding = "1rem";
//     }

//     itemAccordion.classList.toggle("active");
//   });

//   var itemPanel = document.createElement("div");
//   itemPanel.classList.add("itemPanel");
//   itemPanel.classList.add("elementItemPanel");

//   if (ELEMENT_parameters.length > 0) {
//     ELEMENT_parameters.forEach((param, paramIndex) => {
//       var parameterSlot = document.createElement("div");
//       parameterSlot.classList.add("parameterSlot");

//       var parameterName = document.createElement("p");
//       parameterName.classList.add("parameterName");
//       parameterName.innerHTML = param.parameter.name + " de " + param.component.componentName.value;

//       var parameterInputLine = document.createElement("div");
//       parameterInputLine.classList.add("parameterInputLine");

//       var parameterInput = document.createElement("input");
//       var inputID = paramIndex;
//       parameterInput.id = inputID;
//       parameterInput.addEventListener("input", (e) => {
//         if (!currentCollection.elements[itemIndex][param.component.UID]) {
//           currentCollection.elements[itemIndex][param.component.UID] = {};
//         }
//         currentCollection.elements[itemIndex][param.component.UID][param.parameter.refValue] = e.target.value;
//       });

//       if (param.type !== "spacer") {
//         //CHECKBOXES
//         if (param.type === "checkbox") {
//           var oldName = parameterName.innerHTML;
//           parameterInput.type = param.type;
//           try {
//             parameterInput.checked = item[param.name];
//           } catch (e) {
//             parameterInput.checked = false;
//           }
//           parameterInput.addEventListener("input", (e) => {
//             currentCollection.elements[itemIndex][param.name] = e.target.checked;
//             generateCollectionBtn.click();
//           });
//           parameterName = document.createElement("label");
//           parameterName.setAttribute("for", inputID);
//           parameterName.classList.add("parameterName");
//           parameterName.innerHTML = oldName;
//           parameterInputLine.appendChild(parameterInput);
//           parameterInputLine.appendChild(parameterName);
//           parameterSlot.appendChild(parameterInputLine);
//         }

//         //SELECTS
//         else if (param.type === "select") {
//           parameterInput = document.createElement("select");
//           parameterInput.classList.add("parameterInput");
//           parameterInput.id = inputID;
//           // parameterInput.addEventListener("input", (e) => {
//           //   currentCollection.template[itemIndex][param.refValue]["value"] = e.target.value;
//           //   generateCollectionBtn.click();
//           //   populateComponents();
//           // });

//           // var refOptionList = param.optionRef ? eval(param.optionRef) : param.options;

//           // refOptionList.forEach((opt) => {
//           //   var option = document.createElement("option");
//           //   if (param.optionRef) option.style.fontFamily = opt.value;
//           //   option.value = opt.value;
//           //   option.innerHTML = opt.label;
//           //   parameterInput.appendChild(option);
//           // });
//           parameterInput.value = item[param.refValue]["value"];
//           parameterSlot.appendChild(parameterName);
//           parameterInputLine.appendChild(parameterInput);
//           parameterSlot.appendChild(parameterInputLine);
//         } else {
//           parameterInput.classList.add("parameterInput");
//           if (param.type === "color") parameterInput.style.padding = "0.2rem";
//           parameterInput.type = param.type;
//           try {
//             parameterInput.value = item[param.refValue]["value"];
//           } catch (e) {
//             parameterInput.value = "";
//           }
//           parameterSlot.appendChild(parameterName);
//           parameterInputLine.appendChild(parameterInput);
//           parameterSlot.appendChild(parameterInputLine);
//         }
//       }

//       itemPanel.appendChild(parameterSlot);
//     });
//   } else {
//     var noResourceText = document.createElement("div");
//     noResourceText.classList.add("noStuffDiv");
//     noResourceText.innerHTML = "Aucun Paramètre basé sur l'Élément dans le Modèle";

//     itemPanel.appendChild(noResourceText);
//   }

//   itemWrapper.appendChild(itemAccordion);
//   elementItemsDiv.appendChild(itemWrapper);
//   elementItemsDiv.appendChild(itemPanel);
// }

// export function populateElements() {
//   var allElementWrappers = elementItemsDiv.querySelectorAll(".elementItemWrapper");

//   allElementWrappers.forEach((wrap, wrapIndex) => {
//     var toPrintInput = wrap.querySelector("input[type='checkbox']");
//     toPrintInput.checked = currentCollection.elements[wrapIndex]["toPrint"];

//     var quantityInput = wrap.querySelector(".qtyInput");
//     quantityInput.value = currentCollection.elements[wrapIndex]["quantity"];

//     var allInputs = wrap.nextElementSibling.querySelectorAll(".parameterInput");
//     allInputs.forEach((input, inputIndex) => {
//       var componentParent = ELEMENT_parameters[inputIndex].component.UID;
//       var parameterRefValue = ELEMENT_parameters[inputIndex].parameter.refValue;

//       try {
//         if (currentCollection.elements[wrapIndex][componentParent][parameterRefValue]) input.value = currentCollection.elements[wrapIndex][componentParent][parameterRefValue];
//         else input.value = "";
//       } catch (e) {
//         input.value = "";
//       }
//     });
//   });
// }
