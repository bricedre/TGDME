// ProjectNamePicker - An emoji and name picker component
class ProjectNamePicker {
  constructor(options = {}) {
    this.emojis = options.emojis || [
      "⚡",
      "🔥",
      "✨",
      "🌟",
      "🌷",
      "🐱",
      "🐶",
      "🏝️",
      "💡",
      "🎯",
      "🏆",
      "🎴",
      "📚",
      "🎲",
      "🎬",
      "📷",
      "🎭",
      "🌈",
      "🦄",
      "🍕",
      "🍔",
      "☕",
      "🍺",
      "🏀",
      "⚽",
      "🎵",
      "🎸",
      "🎤",
      "🎉",
      "✈️",
      "🚗",
      "💎",
      "📦",
      "🛠️",
      "🔧",
      "⚔️",
      "💥",
      "🌍",
      "🌙",
      "🚀",
      "🪐",
      "👽",
      "🤖",
      "👻",
      "⌛",
      "🕔",
      "💰",
      "🎁",
      "🔴",
      "🟡",
      "🟢",
      "🔵",
      "🟣",
      "🟤",
      "🟥",
      "🟨",
      "🟩",
      "🟦",
      "🟪",
      "🟫",
    ];

    this.onChange = options.onChange || (() => {});
    this.targetInput = null;
    this.picker = null;
    this.selectedEmoji = "";
    this.projectName = "";

    this.init();
  }

  init() {
    // Create picker container
    this.picker = document.createElement("div");
    this.picker.className = "project-name-picker";
    this.picker.style.cssText = `
      position: absolute;
      background: #273541ff;
      box-shadow: 0 4px 12px #273541ff;
      border-radius: 8px;
      z-index: 10000;
      display: none;
      padding: 12px;
      width: 645px;
    `;

    // Create emoji section
    const emojiLabel = document.createElement("div");
    emojiLabel.textContent = "Icône :";
    emojiLabel.style.cssText = `
      font-size: 11px;
      color: white;
      margin-bottom: 8px;
    `;
    this.picker.appendChild(emojiLabel);

    // Create emoji container
    const emojiContainer = document.createElement("div");
    emojiContainer.classList.add("emoji-container");
    emojiContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 12px;
      overflow-y: auto;
      padding: 4px;
    `;

    // Create emoji buttons
    this.emojis.forEach((emoji) => {
      const button = document.createElement("button");
      button.textContent = emoji;
      button.style.cssText = `
        padding: 8px;
        background: white;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      button.addEventListener("mouseenter", () => {
        if (this.selectedEmoji !== emoji) {
          button.style.background = "#f0f0f0";
        }
      });

      button.addEventListener("mouseleave", () => {
        if (this.selectedEmoji !== emoji) {
          button.style.background = "white";
        }
      });

      button.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectEmoji(emoji, emojiContainer);
      });

      button._emoji = emoji;
      emojiContainer.appendChild(button);
    });

    this.picker.appendChild(emojiContainer);

    // Create name input section
    const nameLabel = document.createElement("div");
    nameLabel.textContent = "Nom :";
    nameLabel.style.cssText = `
      font-size: 11px;
      color: white;
      margin-bottom: 6px;
    `;
    this.picker.appendChild(nameLabel);

    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.placeholder = "Enter project name...";
    this.nameInput.style.cssText = `
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      box-sizing: border-box;
      margin-bottom: 12px;
    `;

    this.nameInput.addEventListener("input", () => {
      this.projectName = this.nameInput.value;
    });

    this.nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.apply();
      }
    });

    this.picker.appendChild(this.nameInput);

    // Create buttons section
    const buttonSection = document.createElement("div");
    buttonSection.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.cssText = `
      padding: 8px 16px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    `;

    cancelButton.addEventListener("mouseenter", () => {
      cancelButton.style.background = "#e0e0e0";
    });

    cancelButton.addEventListener("mouseleave", () => {
      cancelButton.style.background = "#f5f5f5";
    });

    cancelButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.hide();
    });

    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply";
    applyButton.style.cssText = `
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: 1px solid #4CAF50;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    `;

    applyButton.addEventListener("mouseenter", () => {
      applyButton.style.background = "#45a049";
      applyButton.style.borderColor = "#45a049";
    });

    applyButton.addEventListener("mouseleave", () => {
      applyButton.style.background = "#4CAF50";
      applyButton.style.borderColor = "#4CAF50";
    });

    applyButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.apply();
    });

    buttonSection.appendChild(cancelButton);
    buttonSection.appendChild(applyButton);
    this.picker.appendChild(buttonSection);

    document.body.appendChild(this.picker);
  }

  selectEmoji(emoji, emojiContainer) {
    this.selectedEmoji = emoji;

    // Update button styles
    const buttons = emojiContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      if (btn._emoji === emoji) {
        btn.style.background = "#e3f2fd";
        btn.style.borderColor = "#2196F3";
      } else {
        btn.style.background = "white";
        btn.style.borderColor = "transparent";
      }
    });
  }

  show(input) {
    // Handle jQuery objects
    if (input && input.jquery) {
      input = input[0];
    }

    this.targetInput = input;

    // Parse existing value
    const currentValue = input.value || input.textContent || "";
    const parts = currentValue.trim().split(/\s+/);

    // Check if first part is an emoji
    const emojiRegex = /\p{Emoji}/u;
    if (parts.length > 0 && emojiRegex.test(parts[0])) {
      this.selectedEmoji = parts[0];
      this.projectName = parts.slice(1).join(" ");
    } else {
      this.selectedEmoji = "";
      this.projectName = currentValue;
    }

    this.nameInput.value = this.projectName;

    // Update emoji selection
    const emojiContainer = this.picker.querySelector(".emoji-container");
    const buttons = emojiContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      if (btn._emoji === this.selectedEmoji) {
        btn.style.background = "#e3f2fd";
        btn.style.borderColor = "#2196F3";
      } else {
        btn.style.background = "white";
        btn.style.borderColor = "transparent";
      }
    });

    // Position picker near input
    const rect = input.getBoundingClientRect();
    this.picker.style.display = "block";
    this.picker.style.left = rect.left + "px";
    this.picker.style.top = rect.bottom + 10 + "px";

    // Adjust if picker goes off screen
    setTimeout(() => {
      const pickerRect = this.picker.getBoundingClientRect();
      if (pickerRect.right > window.innerWidth) {
        this.picker.style.left = window.innerWidth - pickerRect.width - 10 + "px";
      }
      if (pickerRect.bottom > window.innerHeight) {
        this.picker.style.top = rect.top - pickerRect.height - 10 + "px";
      }
    }, 0);

    // Focus name input
    setTimeout(() => this.nameInput.focus(), 100);
  }

  hide() {
    this.picker.style.display = "none";
    this.targetInput = null;
  }

  apply() {
    const parts = [];
    if (this.selectedEmoji) parts.push(this.selectedEmoji);
    if (this.projectName) parts.push(this.projectName);

    const finalValue = parts.join(" ");

    if (this.targetInput) {
      // Handle both input elements and text elements
      if (this.targetInput.tagName === "INPUT" || this.targetInput.tagName === "TEXTAREA") {
        this.targetInput.value = finalValue;
      } else {
        this.targetInput.textContent = finalValue;
      }
      this.targetInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    this.onChange(finalValue);
    this.hide();
  }

  destroy() {
    if (this.picker && this.picker.parentNode) {
      this.picker.parentNode.removeChild(this.picker);
    }
  }
}

// Global instance management
let currentProjectNamePicker = null;

// Main API function
function ProjectNamePickerInit(options = {}) {
  if (!currentProjectNamePicker) {
    currentProjectNamePicker = new ProjectNamePicker(options);
  } else {
    // Update existing picker with new options
    if (options.emojis) {
      currentProjectNamePicker.destroy();
      currentProjectNamePicker = new ProjectNamePicker(options);
    }
  }
  return currentProjectNamePicker;
}

// Close picker when clicking outside
document.addEventListener("click", (e) => {
  if (currentProjectNamePicker && currentProjectNamePicker.picker) {
    let target = e.target;
    // Handle jQuery objects
    if (target && target.jquery) {
      target = target[0];
    }

    if (!currentProjectNamePicker.picker.contains(target) && !target.hasAttribute("data-project-picker") && target !== currentProjectNamePicker.targetInput) {
      currentProjectNamePicker.hide();
    }
  }
});
