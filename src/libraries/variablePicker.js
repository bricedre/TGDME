// VariablePicker - A preset variable picker component
class VariablePicker {
  constructor(options = {}) {
    this.presets = options.presets || [
      { label: 'Width', value: ':W' },
      { label: 'Height', value: ':H' },
      { label: 'Half Width', value: ':W*0.5' },
      { label: 'Half Height', value: ':H*0.5' },
      { label: 'Double Width', value: ':W*2' },
      { label: 'Double Height', value: ':H*2' }
    ];
    this.onChange = options.onChange || (() => {});
    this.targetInput = null;
    this.picker = null;
    
    this.init();
  }
  
  init() {
    // Create picker container
    this.picker = document.createElement('div');
    this.picker.className = 'variable-picker';
    this.picker.style.cssText = `
      position: absolute;
      background: #273541ff;
      box-shadow: 0 4px 12px #273541ff;
      z-index: 10000;
      display: none;
      padding: 8px;
      max-width: 300px;
      border-radius: 0.5rem;
    `;
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    `;
    
    // Create buttons for each preset
    this.presets.forEach(preset => {
      const button = document.createElement('button');
      button.textContent = preset.value;
      button.style.cssText = `
        padding: 8px 12px;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 15px;
        transition: all 0.2s;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      
      // Add hover effect
      button.addEventListener('mouseenter', () => {
        button.style.background = '#2d94c7';
        button.style.color = 'white';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.background = 'white';
        button.style.color = 'black';
      });
      
      // Add click handler
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectPreset(preset.value);
      });
      
      buttonContainer.appendChild(button);
    });
    
    this.picker.appendChild(buttonContainer);
    
    document.body.appendChild(this.picker);
  }
  
  show(input) {
    this.targetInput = input;
    
    // Position picker near input
    const rect = input.getBoundingClientRect();
    this.picker.style.display = 'block';
    this.picker.style.left = rect.left + 'px';
    this.picker.style.top = (rect.bottom + 10) + 'px';
    
    // Adjust if picker goes off screen
    setTimeout(() => {
      const pickerRect = this.picker.getBoundingClientRect();
      if (pickerRect.right > window.innerWidth) {
        this.picker.style.left = (window.innerWidth - pickerRect.width - 10) + 'px';
      }
      if (pickerRect.bottom > window.innerHeight) {
        this.picker.style.top = (rect.top - pickerRect.height - 10) + 'px';
      }
    }, 0);
  }
  
  hide() {
    this.picker.style.display = 'none';
    this.targetInput = null;
  }
  
  selectPreset(value) {
    if (this.targetInput) {
      this.targetInput.value = value;
      this.targetInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    this.onChange(value);
    this.hide();
  }
  
  destroy() {
    if (this.picker && this.picker.parentNode) {
      this.picker.parentNode.removeChild(this.picker);
    }
  }
}

// Global instance management
let currentVariablePicker = null;

// Main API function (similar to Coloris and AnglePicker)
function VariablePickerInit(options = {}) {
  if (!currentVariablePicker) {
    currentVariablePicker = new VariablePicker(options);
  } else {
    // Update existing picker with new options
    if (options.presets) {
      currentVariablePicker.destroy();
      currentVariablePicker = new VariablePicker(options);
    }
  }
  return currentVariablePicker;
}

// Close picker when clicking outside
document.addEventListener('click', (e) => {
  if (currentVariablePicker && currentVariablePicker.picker) {
    if (!currentVariablePicker.picker.contains(e.target) && 
        !e.target.hasAttribute('data-variable-picker')) {
      currentVariablePicker.hide();
    }
  }
});
