// script.js

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const driveButtonsDiv = document.getElementById('driveButtons');
  const customDriveInputDiv = document.getElementById('customDriveInput');
  const numDrivesInput = document.getElementById('numDrives');
  const driveSizesDiv = document.getElementById('driveSizes');
  const parityButtons = document.querySelectorAll('#parityButtons input');
  const parityDrivesDiv = document.getElementById('parityDrives');
  const resultsDiv = document.getElementById('results');

  let numDrives = 1; // Default number of data drives
  let numParityDrives = 0; // Default number of parity drives

  // Generate Data Drive Buttons
  for (let i = 1; i <= 12; i++) {
    const label = document.createElement('label');
    label.className = 'btn btn-secondary';
    if (i === 1) label.classList.add('active');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'driveOptions';
    input.autocomplete = 'off';
    input.dataset.value = i;
    if (i === 1) input.checked = true;

    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${i}`));

    driveButtonsDiv.appendChild(label);
  }

  // Create the [ >12 ] button
  const customLabel = document.createElement('label');
  customLabel.className = 'btn btn-secondary';

  const customInput = document.createElement('input');
  customInput.type = 'radio';
  customInput.name = 'driveOptions';
  customInput.autocomplete = 'off';
  customInput.dataset.value = 'custom';

  customLabel.appendChild(customInput);
  customLabel.appendChild(document.createTextNode(' >12'));

  driveButtonsDiv.appendChild(customLabel);

  // Handle Data Drive Selection
  driveButtonsDiv.addEventListener('change', function (event) {
    const selectedValue = event.target.dataset.value;
    if (selectedValue === 'custom') {
      customDriveInputDiv.style.display = 'block';
      numDrives = parseInt(numDrivesInput.value) || 13;
      numDrivesInput.focus();
    } else {
      customDriveInputDiv.style.display = 'none';
      numDrives = parseInt(selectedValue);
    }
    updateDriveInputs();
  });

  // Handle Custom Number of Drives Input
  numDrivesInput.addEventListener('input', function () {
    const value = parseInt(this.value);
    if (value >= 13) {
      numDrives = value;
      updateDriveInputs();
    }
  });

  numDrivesInput.addEventListener('blur', function () {
    const value = parseInt(this.value);
    if (isNaN(value) || value < 13) {
      this.value = 13;
      numDrives = 13;
      updateDriveInputs();
    }
  });

  // Function to update drive inputs
  function updateDriveInputs() {
    driveSizesDiv.innerHTML = '';
    for (let i = 1; i <= numDrives; i++) {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-row align-items-center mb-2';

      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'col';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.value = '4';
      sizeInput.className = 'form-control drive-size';
      sizeInput.placeholder = `Drive ${i} Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);
      sizeDiv.appendChild(sizeInput);

      const unitDiv = document.createElement('div');
      unitDiv.className = 'col-auto';
      const unitSelect = document.createElement('select');
      unitSelect.className = 'form-control drive-unit';
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

      formGroup.appendChild(sizeDiv);
      formGroup.appendChild(unitDiv);

      driveSizesDiv.appendChild(formGroup);
    }
    calculateTotalStorage();
  }

  // Handle Parity Drive Selection
  parityButtons.forEach((button) => {
    button.addEventListener('change', () => {
      numParityDrives = parseInt(button.dataset.value);
      updateParityDrives();
    });
  });

  // Function to update parity drive inputs
  function updateParityDrives() {
    parityDrivesDiv.innerHTML = '';
    for (let i = 1; i <= numParityDrives; i++) {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-row align-items-center mb-2';

      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'col';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.value = '4';
      sizeInput.className = 'form-control parity-size';
      sizeInput.placeholder = `Parity Drive ${i} Size`;
      sizeInput.addEventListener('input', calculateTotalStorage);
      sizeDiv.appendChild(sizeInput);

      const unitDiv = document.createElement('div');
      unitDiv.className = 'col-auto';
      const unitSelect = document.createElement('select');
      unitSelect.className = 'form-control parity-unit';
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

      formGroup.appendChild(sizeDiv);
      formGroup.appendChild(unitDiv);

      parityDrivesDiv.appendChild(formGroup);
    }
    calculateTotalStorage();
  }

  // Function to calculate total storage
  function calculateTotalStorage() {
