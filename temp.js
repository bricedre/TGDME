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

    let currentMode = "0";

    var modeInput = document.createElement("img");
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

        var typeOfParameter = currentCollection.template[itemIndex][param.refValue]["type"];
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

        var refOptionList = param.optionRef ? eval(param.optionRef) : param.options;
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

          var option = document.createElement("option");
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
            var option = document.createElement("option");
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
    } else {
      parameterName.classList.add("spacer");
      // if (paramIndex == 0) parameterName.classList.add("firstSpacer");

      // $(parameterSlot).removeClass("param");
      $(parameterSlot).addClass("catHeader accordion");
      // if (paramIndex == 0) {
      //   $(parameterSlot).addClass("open");
      // }
      // $(parameterSlot).on("click", () => $(parameterSlot).toggleClass("open"));

      var itemPanel = document.createElement("div");
      itemPanel.classList.add("itemPanel");

      parameterSlot.addEventListener("click", () => {
        var panel = parameterSlot.nextElementSibling;
        if (parameterSlot.classList.contains("active")) {
          panel.style.maxHeight = "0";
          panel.style.marginBottom = "0rem";
          panel.style.padding = "0rem";
        } else {
          panel.style.maxHeight = "calc(2rem + " + panel.scrollHeight + "px)";
          panel.style.marginBottom = "1rem";
          panel.style.padding = "1rem";
        }

        parameterSlot.classList.toggle("active");
      });

      parameterSlot.appendChild(parameterName);
    }

    itemPanel.appendChild(parameterSlot);