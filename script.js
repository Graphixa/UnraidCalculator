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
  const updateAllDrivesModal = $('#updateAllDrivesModal');
  const applyNewSizeBtn = document.getElementById('applyNewSizeBtn');
  const newDriveSizeInput = document.getElementById('newDriveSize');
  const newDriveUnitSelect = document.getElementById('newDriveUnit');

  let numDrives = 1; // Default number of data drives
  let numParityDrives = 0; // Default number of parity drives

  // Generate Data Drive Buttons
  for (let i = 1; i <= 10; i++) {
    const button = document.createElement('button');
    button.className = 'btn btn-drive';
    button.dataset.value = i;
    button.textContent = i;
    if (i === 1) button.classList.add('active');

    driveButtonsDiv.appendChild(button);
  }

  // Create the [ Custom No. ] button
  const customButton = document.createElement('button');
  customButton.className = 'btn btn-drive';
  customButton.dataset.value = 'custom';
  customButton.textContent = 'Custom No.';
  driveButtonsDiv.appendChild(customButton);

  // Handle Data Drive Selection
  driveButtonsDiv.addEventListener('click', function (event) {
    if (event.target.matches('.btn-drive')) {
      const selectedValue = event.target.dataset.value;
      document.querySelectorAll('.btn-drive').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

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
    driveSizesDiv.innerHTML = '';
    for (let i = 1; i <= numDrives; i++) {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-row align-items-center mb-2 drive-input-group';

      const labelDiv = document.createElement('div');
      labelDiv.className = 'drive-label';
      labelDiv.textContent = `Drive ${i}`;

      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'drive-input';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.value = '4';
      sizeInput.className = 'form-control drive-size';
      sizeInput.placeholder = `Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);
      sizeDiv.appendChild(sizeInput);

      const unitDiv = document.createElement('div');
      unitDiv.className = 'drive-unit';
      const unitSelect = document.createElement('select');
      unitSelect.className = 'form-control drive-unit-select';
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.addEventListener('change', calculateTotalStorage);
      unitDiv.appendChild(unitSelect);

      formGroup.appendChild(labelDiv);
      formGroup.appendChild(sizeDiv);
      formGroup.appendChild(unitDiv);

      driveSizesDiv.appendChild(formGroup);
    }
    calculateTotalStorage();
  }

  // Generate Parity Drive Buttons
  for (let i = 0; i <= 2; i++) {
    const button = document.createElement('button');
    button.className = 'btn btn-parity';
    button.dataset.value = i;
    button.textContent = i;
    if (i === 0) button.classList.add('active');

    parityButtonsDiv.appendChild(button);
  }

  // Handle Parity Drive Selection
  parityButtonsDiv.addEventListener('click', function (event) {
    if (event.target.matches('.btn-parity')) {
      numParityDrives = parseInt(event.target.dataset.value);
      document.querySelectorAll('.btn-parity').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      updateParityDrives();
    }
  });

  // Function to update parity drive inputs
  function updateParityDrives() {
    parityDrivesDiv.innerHTML = '';
    for (let i = 1; i <= numParityDrives; i++) {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-row align-items-center mb-2 drive-input-group';

      const labelDiv = document.createElement('div');
      labelDiv.className = 'drive-label';
      labelDiv.textContent = `Parity ${i}`;

      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'drive-input';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.value = '4';
      sizeInput.className = 'form-control parity-size';
      sizeInput.placeholder = `Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);
      sizeDiv.appendChild(sizeInput);

      const unitDiv = document.createElement('div');
      unitDiv.className = 'drive-unit';
      const unitSelect = document.createElement('select');
      unitSelect.className = 'form-control parity-unit-select';
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.addEventListener('change', calculateTotalStorage);
      unitDiv.appendChild(unitSelect);

      formGroup.appendChild(labelDiv);
      formGroup.appendChild(sizeDiv);
      formGroup.appendChild(unitDiv);

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
      resultsDiv.innerHTML = `<div id="error">${errorMessages.join('<br>')}</div>`;
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
    updateAllDrivesModal.modal('show');
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
      updateAllDrivesModal.modal('hide');
    } else {
      alert('Please enter a valid drive size.');
    }
  });
});
