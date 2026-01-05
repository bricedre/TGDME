// AnglePicker - A circular angle picker component
class AnglePicker {
  constructor(options = {}) {
    this.size = options.size || 120;
    this.handleSize = options.handleSize || 16;
    this.value = options.value || 0;
    this.onChange = options.onChange || (() => {});
    this.targetInput = null;
    this.picker = null;
    this.isDragging = false;
    
    this.init();
  }
  
  init() {
    // Create picker container
    this.picker = document.createElement('div');
    this.picker.className = 'angle-picker';
    this.picker.style.cssText = `
      position: absolute;
      width: ${this.size}px;
      height: ${this.size}px;
      background: #273541ff;
      border-radius: 50%;
      box-shadow: 0 4px 12px #273541ff;
      cursor: pointer;
      z-index: 10000;
      display: none;
    `;
    
    // Create handle
    this.handle = document.createElement('div');
    this.handle.style.cssText = `
      position: absolute;
      width: ${this.handleSize}px;
      height: ${this.handleSize}px;
      background: #2d94c7;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: grab;
      z-index: 1;
    `;
    this.picker.appendChild(this.handle);
    
    // Create tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.style.cssText = `
      position: absolute;
      background: #1c2e3db8;
      color: white;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      white-space: nowrap;
      display: none;
    `;
    this.picker.appendChild(this.tooltip);
    
    // Create angle markers
    this.createAngleMarkers();
    
    // Add event listeners
    this.picker.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    document.body.appendChild(this.picker);
    
    // Update initial position
    this.updateHandlePosition();
  }
  
  createAngleMarkers() {
    const markers = [0, 90, 180, 270];
    markers.forEach(angle => {
      const marker = document.createElement('div');
      const rad = (angle - 90) * Math.PI / 180;
      const x = this.size / 2 + (this.size / 2 - 20) * Math.cos(rad);
      const y = this.size / 2 + (this.size / 2 - 20) * Math.sin(rad);
      
      marker.textContent = angle + '°';
      marker.style.cssText = `
        position: absolute;
        font-size: 12px;
        font-weight: bold;
        color: white;
        pointer-events: none;
        transform: translate(-50%, -50%);
        left: ${x}px;
        top: ${y}px;
      `;
      this.picker.appendChild(marker);
    });
  }
  
  show(input) {
    this.targetInput = input;
    this.value = parseFloat(input.value) || 0;
    this.updateHandlePosition();
    
    // Position picker near input
    const rect = input.getBoundingClientRect();
    this.picker.style.display = 'block';
    this.picker.style.left = rect.left + 'px';
    this.picker.style.top = (rect.bottom + 10) + 'px';
    
    // Show tooltip
    this.tooltip.style.display = 'block';
    this.updateTooltip();
  }
  
  hide() {
    this.picker.style.display = 'none';
    this.tooltip.style.display = 'none';
    this.targetInput = null;
  }
  
  handleMouseDown(e) {
    e.preventDefault();
    this.isDragging = true;
    this.handle.style.cursor = 'grabbing';
    this.updateAngle(e.clientX, e.clientY, e.shiftKey);
  }
  
  handleMouseMove(e) {
    if (this.isDragging) {
      this.updateAngle(e.clientX, e.clientY, e.shiftKey);
    }
  }
  
  handleMouseUp() {
    this.isDragging = false;
    this.handle.style.cursor = 'grab';
  }
  
  updateAngle(clientX, clientY, shiftKey = false) {
    const rect = this.picker.getBoundingClientRect();
    const centerX = rect.left + this.size / 2;
    const centerY = rect.top + this.size / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // Calculate angle (0-360, with 0 at top)
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (shiftKey) {
       angle = Math.round(angle / 15) * 15;
     }
    
    this.value = Math.round(angle);
    this.updateHandlePosition();
    this.updateTooltip();
    
    if (this.targetInput) {
      this.targetInput.value = this.value;
      this.targetInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    this.onChange(this.value);
  }
  
  updateHandlePosition() {
    const rad = (this.value - 90) * Math.PI / 180;
    const radius = this.size / 2;
    const x = this.size / 2 + radius * Math.cos(rad);
    const y = this.size / 2 + radius * Math.sin(rad);
    
    this.handle.style.left = (x - this.handleSize / 2) + 'px';
    this.handle.style.top = (y - this.handleSize / 2) + 'px';

  }
  
  updateTooltip() {
    this.tooltip.textContent = `${this.value}°`;
    
    // Position tooltip near handle
    const rad = (this.value - 90) * Math.PI / 180;
    const radius = this.size / 2 - this.handleSize / 2;
    const x = this.size / 2 + radius * Math.cos(rad);
    const y = this.size / 2 + radius * Math.sin(rad);
    
    // Offset tooltip based on quadrant
    let offsetX = 20;
    let offsetY = -10;
    
    if (this.value > 180) {
      offsetX = -60;
    }
    
    this.tooltip.style.left = (x + offsetX) + 'px';
    this.tooltip.style.top = (y + offsetY) + 'px';
  }
  
  destroy() {
    if (this.picker && this.picker.parentNode) {
      this.picker.parentNode.removeChild(this.picker);
    }
  }
}

// Global instance management
let currentAnglePicker = null;

// Main API function (similar to Coloris)
function AnglePickerInit(options = {}) {
  if (!currentAnglePicker) {
    currentAnglePicker = new AnglePicker(options);
  } else {
    // Update existing picker with new options
    if (options.size) currentAnglePicker.size = options.size;
    if (options.handleSize) currentAnglePicker.handleSize = options.handleSize;
  }
  return currentAnglePicker;
}

// Close picker when clicking outside
document.addEventListener('click', (e) => {
  if (currentAnglePicker && currentAnglePicker.picker) {
    if (!currentAnglePicker.picker.contains(e.target) && 
        !e.target.hasAttribute('data-angle-picker')) {
      currentAnglePicker.hide();
    }
  }
});

// Usage example with your code pattern:
/*
if (param.type === "angle") {
  parameterInput.type = "text";
  parameterInput.setAttribute("data-angle-picker", "");
  parameterInput.addEventListener("click", () => {
    const picker = AnglePickerInit({
      size: 150,        // Picker diameter in pixels
      handleSize: 20,   // Handle diameter in pixels
      value: parseFloat(parameterInput.value) || 0
    });
    picker.show(parameterInput);
  });
}
*/