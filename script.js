// script.js

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const driveButtonsDiv = document.getElementById('driveButtons');
  const customDriveInputDiv = document.getElementById('customDriveInput');
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
    button.className = 'btn-drive px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500';
    button.dataset.value = i;
    button.textContent = i;
    if (i === 1) button.classList.add('active', 'bg-red-600');

    // Tooltip
    button.setAttribute('data-tooltip', `Select ${i} data drives`);

    driveButtonsDiv.appendChild(button);
  }

  // Create the [ Custom No. ] button
  const customButton = document.createElement('button');
  customButton.className = 'btn-drive custom-number px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500';
  customButton.dataset.value = 'custom';
  customButton.textContent = 'Custom No.';
  customButton.setAttribute('data-tooltip', 'Enter a custom number of data drives');
  driveButtonsDiv.appendChild(customButton);

  // Handle Data Drive Selection
  driveButtonsDiv.addEventListener('click', function (event) {
    if (event.target.matches('.btn-drive')) {
      const selectedValue = event.target.dataset.value;
      document.querySelectorAll('.btn-drive').forEach(btn => btn.classList.remove('active', 'bg-red-600'));
      event.target.classList.add('active', 'bg-red-600');

      if (selectedValue === 'custom') {
        customDriveInputDiv.style.display = 'block';
        numDrives = parseInt(numDrivesInput.value) || 11;
        numDrivesInput.focus();
      } else {
        customDriveInputDiv.style.display = 'none';
        numDrives = parseInt(selectedValue);
      }
      updateDriveInputs();
    }
  });

  // Handle Custom Number of Drives Input
  numDrivesInput.addEventListener('input', function () {
    const value = parseInt(this.value);
    if (value >= 11) {
      numDrives = value;
      updateDriveInputs();
    }
  });

  numDrivesInput.addEventListener('blur', function () {
    const value = parseInt(this.value);
    if (isNaN(value) || value < 11) {
      this.value = 11;
      numDrives = 11;
      updateDriveInputs();
    }
  });

  // Function to update drive inputs
  function updateDriveInputs() {
    // Store existing values
    const existingInputs = document.querySelectorAll('.drive-size');
    driveValues = [];
    existingInputs.forEach((input, index) => {
      const size = input.value;
      const unit = document.querySelectorAll('.drive-unit-select')[index].value;
      driveValues.push({ size, unit });
    });

    driveSizesDiv.innerHTML = '';
    for (let i = 1; i <= numDrives; i++) {
      const formGroup = document.createElement('div');
      formGroup.className = 'drive-input-group flex items-center mb-2';

      const labelDiv = document.createElement('div');
      labelDiv.className = 'drive-label w-24 mr-2';
      labelDiv.textContent = `Drive ${i}:`;

      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.className = 'drive-size w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500';
      sizeInput.placeholder = `Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);

      // Set existing value if available
      if (driveValues[i - 1]) {
        sizeInput.value = driveValues[i - 1].size;
      } else {
        sizeInput.value = '4';
      }

      const unitSelect = document.createElement('select');
      unitSelect.className = 'drive-unit-select w-20 ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500';
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.addEventListener('change', calculateTotalStorage);

      // Set existing unit if available
      if (driveValues[i - 1]) {
        unitSelect.value = driveValues[i - 1].unit;
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
    button.className = 'btn-parity px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500';
    button.dataset.value = i;
    button.textContent = i;
    if (i === 0) button.classList.add('active', 'bg-red-600');

    // Tooltip
    button.setAttribute('data-tooltip', `Select ${i} parity drives`);

    parityButtonsDiv.appendChild(button);
  }

  // Handle Parity Drive Selection
  parityButtonsDiv.addEventListener('click', function (event) {
    if (event.target.matches('.btn-parity')) {
      numParityDrives = parseInt(event.target.dataset.value);
      document.querySelectorAll('.btn-parity').forEach(btn => btn.classList.remove('active', 'bg-red-600'));
      event.target.classList.add('active', 'bg-red-600');
      updateParityDrives();
    }
  });

  // Function to update parity drive inputs
  function updateParityDrives() {
    // Store existing values
    const existingInputs = document.querySelectorAll('.parity-size');
    parityValues = [];
    existingInputs.forEach((input, index) => {
      const size = input.value;
      const unit = document.querySelectorAll('.parity-unit-select')[index].value;
      parityValues.push({ size, unit });
    });

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
      sizeInput.className = 'parity-size w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500';
      sizeInput.placeholder = `Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);

      // Set existing value if available
      if (parityValues[i - 1]) {
        sizeInput.value = parityValues[i - 1].size;
      } else {
        sizeInput.value = '4';
      }

      const unitSelect = document.createElement('select');
      unitSelect.className = 'parity-unit-select w-20 ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500';
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.addEventListener('change', calculateTotalStorage);

      // Set existing unit if available
      if (parityValues[i - 1]) {
        unitSelect.value = parityValues[i - 1].unit;
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
      resultsDiv.innerHTML = `<div class="text-red-500">${errorMessages.join('<br>')}</div>`;
    } else {
      const usableStorage = totalStorage - largestDriveSize * numParityDrives;
      resultsDiv.innerHTML = `<div>${usableStorage.toFixed(2)} TB(s) usable | with ${numParityDrives} parity drive(s)</div>`;
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
      document.querySelectorAll('.drive-size').forEach((input) => {
        input.value = newSize;
      });
      document.querySelectorAll('.drive-unit-select').forEach((select) => {
        select.value = newUnit;
      });

      // Update parity drive sizes
      document.querySelectorAll('.parity-size').forEach((input) => {
        input.value = newSize;
      });
      document.querySelectorAll('.parity-unit-select').forEach((select) => {
        select.value = newUnit;
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
      tooltip.textContent = e.target.dataset.tooltip;
      tooltip.style.left = e.pageX + 'px';
      tooltip.style.top = e.pageY + 20 + 'px';
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
