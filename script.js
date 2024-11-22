// script.js

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const driveButtonsDiv = document.getElementById('driveButtons');
  const customDriveInputDiv = document.getElementById('customDriveInput');
  const customButton = document.getElementById('customButton');
  const numDrivesInput = document.getElementById('numDrives');
  const driveSizesDiv = document.getElementById('driveSizes');
  const parityButtonsDiv = document.getElementById('parityButtons');
  const parityDrivesDiv = document.getElementById('parityDrives');
  const resultsDiv = document.getElementById('results');
  const updateAllDrivesBtn = document.getElementById('updateAllDrivesBtn');
  const updateAllDrivesModal = document.getElementById('updateAllDrivesModal');
  const applyNewSizeBtn = document.getElementById('applyNewSizeBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const newDriveSizeInput = document.getElementById('newDriveSize');
  const newDriveUnitSelect = document.getElementById('newDriveUnit');

  let numDrives = 1; // Default number of data drives
  let numParityDrives = 0; // Default number of parity drives

  // Arrays to store drive values
  let driveValues = [];
  let parityValues = [];

  // Generate Data Drive Buttons
  for (let i = 1; i <= 10; i++) {
    const button = document.createElement('button');
    button.className = 'btn-drive w-full sm:w-auto px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300';
    button.dataset.value = i;
    button.textContent = i;
    if (i === 1) button.classList.add('active', 'bg-orange-700');

    // Tooltip
    button.setAttribute('data-tooltip', `Select ${i} data drives`);

    driveButtonsDiv.appendChild(button);
  }

  // Handle Data Drive Selection
  driveButtonsDiv.addEventListener('click', function (event) {
    if (event.target.matches('.btn-drive')) {
      const selectedValue = event.target.dataset.value;
      document.querySelectorAll('.btn-drive').forEach(btn => btn.classList.remove('active', 'bg-orange-700'));
      event.target.classList.add('active', 'bg-orange-700');

      customDriveInputDiv.style.display = 'none';
      numDrivesInput.value = '';
      numDrivesInput.classList.remove('border-orange-300');

      numDrives = parseInt(selectedValue);
      updateDriveInputs();
    }
  });

  // Handle Custom Number Button
  customButton.addEventListener('click', function () {
    document.querySelectorAll('.btn-drive').forEach(btn => btn.classList.remove('active', 'bg-orange-700'));
    customButton.classList.add('active', 'bg-orange-700');
    customDriveInputDiv.style.display = 'block';
    numDrivesInput.focus();
    numDrives = parseInt(numDrivesInput.value) || 11;
    updateDriveInputs();
  });

  // Handle Custom Number of Drives Input
  numDrivesInput.addEventListener('input', function () {
    let value = parseInt(this.value);
    if (value > 100) {
      this.value = 100;
      value = 100;
    }
    if (value >= 11 && value <= 100) {
      numDrives = value;
      updateDriveInputs();
      this.classList.remove('border-orange-300');
    } else {
      this.classList.add('border-orange-300');
    }
  });

  numDrivesInput.addEventListener('blur', function () {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 11) {
      this.value = 11;
      numDrives = 11;
      updateDriveInputs();
      this.classList.remove('border-orange-300');
    }
  });

  // Function to update drive values
  function updateDriveValues() {
    const sizeInputs = document.querySelectorAll('.drive-size');
    const unitSelects = document.querySelectorAll('.drive-unit-select');

    sizeInputs.forEach((input, index) => {
      const size = input.value;
      const unit = unitSelects[index].value;
      driveValues[index] = { size, unit };
    });
  }

  // Function to update drive inputs
  function updateDriveInputs() {
    // Update driveValues with current inputs
    updateDriveValues();
  
    driveSizesDiv.innerHTML = '';
    for (let i = 1; i <= numDrives; i++) {
      const formGroup = document.createElement('div');
      formGroup.className = 'drive-input-group flex items-center gap-1 mb-2'; // Reduced gap between items
  
      const labelDiv = document.createElement('div');
      labelDiv.className = 'drive-label w-20';
      labelDiv.textContent = `Drive ${i}:`;
  
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.className = 'drive-size w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-300';
      sizeInput.placeholder = `Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);
  
      const unitSelect = document.createElement('select');
      unitSelect.className = 'drive-unit-select w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-300';
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.addEventListener('change', calculateTotalStorage);
  
      // Set existing value if available
      if (driveValues[i - 1]) {
        sizeInput.value = driveValues[i - 1].size;
        unitSelect.value = driveValues[i - 1].unit;
      } else {
        sizeInput.value = '8';
        unitSelect.value = 'TB';
        driveValues[i - 1] = { size: '8', unit: 'TB' };
      }
  
      formGroup.appendChild(labelDiv);
      formGroup.appendChild(sizeInput);
      formGroup.appendChild(unitSelect);
  
      driveSizesDiv.appendChild(formGroup);
    }
    calculateTotalStorage();
  }
  

  // Generate Parity Drive Buttons
  for (let i = 0; i <= 2; i++) {
    const button = document.createElement('button');
    button.className = 'btn-parity w-full sm:w-auto px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300';
    button.dataset.value = i;
    button.textContent = i;
    if (i === 0) button.classList.add('active', 'bg-orange-700');

    // Tooltip
    button.setAttribute('data-tooltip', `Select ${i} parity drives`);

    parityButtonsDiv.appendChild(button);
  }

  // Handle Parity Drive Selection
  parityButtonsDiv.addEventListener('click', function (event) {
    if (event.target.matches('.btn-parity')) {
      numParityDrives = parseInt(event.target.dataset.value);
      document.querySelectorAll('.btn-parity').forEach(btn => btn.classList.remove('active', 'bg-orange-700'));
      event.target.classList.add('active', 'bg-orange-700');
      updateParityDrives();
    }
  });

  // Function to update parity values
  function updateParityValues() {
    const sizeInputs = document.querySelectorAll('.parity-size');
    const unitSelects = document.querySelectorAll('.parity-unit-select');

    sizeInputs.forEach((input, index) => {
      const size = input.value;
      const unit = unitSelects[index].value;
      parityValues[index] = { size, unit };
    });
  }

  // Function to get largest data drive size
  function getLargestDriveSize() {
    let largestSize = 0;
    const driveSizes = document.querySelectorAll('.drive-size');
    const driveUnits = document.querySelectorAll('.drive-unit-select');

    driveSizes.forEach((input, index) => {
      let size = parseFloat(input.value) || 0;
      const unit = driveUnits[index].value;

      if (unit === 'GB') size = size / 1024; // Convert GB to TB

      if (size > largestSize) largestSize = size;
    });

    return largestSize;
  }

  // Function to update parity drive inputs
  function updateParityDrives() {
    // Update parityValues with current inputs
    updateParityValues();

    const largestDriveSize = getLargestDriveSize() || 4;

    parityDrivesDiv.innerHTML = '';
    for (let i = 1; i <= numParityDrives; i++) {
      const formGroup = document.createElement('div');
      formGroup.className = 'drive-input-group flex items-center mb-2';

      const labelDiv = document.createElement('div');
      labelDiv.className = 'drive-label w-24 mr-2';
      labelDiv.textContent = `Parity ${i}:`;

      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.className = 'parity-size w-24 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-300';
      sizeInput.placeholder = `Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);

      const unitSelect = document.createElement('select');
      unitSelect.className = 'parity-unit-select w-20 ml-2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-300';
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.addEventListener('change', calculateTotalStorage);

      // Set existing value if available
      if (parityValues[i - 1]) {
        sizeInput.value = parityValues[i - 1].size;
        unitSelect.value = parityValues[i - 1].unit;
      } else {
        sizeInput.value = largestDriveSize;
        unitSelect.value = 'TB';
        parityValues[i - 1] = { size: sizeInput.value, unit: 'TB' };
      }

      formGroup.appendChild(labelDiv);
      formGroup.appendChild(sizeInput);
      formGroup.appendChild(unitSelect);

      parityDrivesDiv.appendChild(formGroup);
    }
    calculateTotalStorage();
  }

  // Function to calculate total storage
  function calculateTotalStorage() {
    const driveSizes = document.querySelectorAll('.drive-size');
    const driveUnits = document.querySelectorAll('.drive-unit-select');
    const paritySizes = document.querySelectorAll('.parity-size');
    const parityUnits = document.querySelectorAll('.parity-unit-select');
  
    let totalStorage = 0;
    let largestDriveSize = 0;
    let errorMessages = [];
  
    driveSizes.forEach((input, index) => {
      let size = parseFloat(input.value) || 0;
      const unit = driveUnits[index].value;
  
      if (unit === 'GB') size = size / 1024; // Convert GB to TB
  
      totalStorage += size;
      if (size > largestDriveSize) largestDriveSize = size;
    });
  
    paritySizes.forEach((input, index) => {
      let size = parseFloat(input.value) || 0;
      const unit = parityUnits[index].value;
  
      if (unit === 'GB') size = size / 1024; // Convert GB to TB
  
      // Check parity size against largest drive
      if (size < largestDriveSize) {
        errorMessages.push(
          `Parity Drive ${index + 1} must be at least ${largestDriveSize.toFixed(2)} TB`
        );
      }
    });
  
    if (errorMessages.length > 0) {
      resultsDiv.innerHTML = `<div class="text-red-300">${errorMessages.join('<br>')}</div>`;
    } else {
      const totalDrives = numDrives + numParityDrives;
      const usableStorage = totalStorage.toFixed(2);
      const faultTolerance = numParityDrives;
  
      resultsDiv.innerHTML = `
        <div class="bg-gray-800 p-4 rounded">
          <p class="mb-2">
            <i class="fa-solid fa-server text-green-400 mr-2"></i>
            Usable Storage: <span class="text-green-400">${usableStorage} TB</span>
          </p>
          <p class="mb-2">
            <i class="fa fa-shield-halved text-red-400 mr-2"></i>
            Drive Fault Tolerance: <span class="text-red-400">${faultTolerance} drive(s)</span>
          </p>
          <p>
            <i class="fa-solid fa-hard-drive text-indigo-400 mr-2"></i>
            Total Drives (including parity): <span class="text-indigo-400">${totalDrives} Drive(s)</span>
          </p>
        </div>
      `;
    }
  }
  

  // Initialize inputs
  updateDriveInputs();
  updateParityDrives();

  // Update All Drive Sizes functionality
  updateAllDrivesBtn.addEventListener('click', function () {
    // Show modal
    updateAllDrivesModal.classList.remove('hidden');
  });

  applyNewSizeBtn.addEventListener('click', function () {
    const newSize = parseFloat(newDriveSizeInput.value);
    const newUnit = newDriveUnitSelect.value;

    if (!isNaN(newSize) && newSize > 0) {
      // Update all drive sizes
      document.querySelectorAll('.drive-size').forEach((input, index) => {
        input.value = newSize;
        driveValues[index].size = newSize;
      });
      document.querySelectorAll('.drive-unit-select').forEach((select, index) => {
        select.value = newUnit;
        driveValues[index].unit = newUnit;
      });

      // Update parity drive sizes
      document.querySelectorAll('.parity-size').forEach((input, index) => {
        input.value = newSize;
        parityValues[index].size = newSize;
      });
      document.querySelectorAll('.parity-unit-select').forEach((select, index) => {
        select.value = newUnit;
        parityValues[index].unit = newUnit;
      });

      calculateTotalStorage();
      updateAllDrivesModal.classList.add('hidden');
      newDriveSizeInput.value = '';
    } else {
      alert('Please enter a valid drive size.');
    }
  });

  closeModalBtn.addEventListener('click', function () {
    updateAllDrivesModal.classList.add('hidden');
  });

  // Tooltip Functionality
  document.addEventListener('mouseover', function (e) {
    if (e.target.dataset.tooltip) {
      const tooltip = document.getElementById('tooltip');
      let left = e.pageX;
      let top = e.pageY + 20;

      // Adjust to avoid going outside viewport boundaries
      if (left + tooltip.clientWidth > window.innerWidth) {
        left = window.innerWidth - tooltip.clientWidth - 10;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.textContent = e.target.dataset.tooltip;
      tooltip.classList.remove('hidden');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.dataset.tooltip) {
      const tooltip = document.getElementById('tooltip');
      tooltip.classList.add('hidden');
    }
  });

  // Accessibility: Keyboard Navigation for Modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !updateAllDrivesModal.classList.contains('hidden')) {
      updateAllDrivesModal.classList.add('hidden');
    }
  });
});
