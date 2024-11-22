// script.js

document.addEventListener('DOMContentLoaded', function () {
  // Generate Data Drive Buttons
  const driveButtonsDiv = document.getElementById('driveButtons');
  const customDriveInputDiv = document.getElementById('customDriveInput');
  let numDrives = 1; // Default number of drives

  // Create buttons from 1 to 12
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
      numDrives = parseInt(document.getElementById('numDrives').value) || 13;
    } else {
      customDriveInputDiv.style.display = 'none';
      numDrives = parseInt(selectedValue);
    }
    updateDriveInputs();
    calculateTotalStorage();
  });

  // Handle Custom Number of Drives Input
  document
    .getElementById('numDrives')
    .addEventListener('input', function () {
      numDrives = parseInt(this.value) || 13;
      updateDriveInputs();
      calculateTotalStorage();
    });

  // Rest of the code...

  const driveSizesDiv = document.getElementById('driveSizes');
  const parityButtons = document.querySelectorAll('#parityButtons input');
  const parityDrivesDiv = document.getElementById('parityDrives');
  const resultsDiv = document.getElementById('results');

  let numParityDrives = 0; // Default parity drives

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
  }

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

  function calculateTotalStorage() {
    const driveSizes = document.querySelectorAll('.drive-size');
    const driveUnits = document.querySelectorAll('.drive-unit');
    const paritySizes = document.querySelectorAll('.parity-size');
    const parityUnits = document.querySelectorAll('.parity-unit');

    let totalStorage = 0;
    let largestDriveSize = 0;
    let error = '';

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
        error = `Parity Drive ${index + 1} must be at least ${largestDriveSize.toFixed(
          2
        )} TB`;
      }
    });

    if (error) {
      resultsDiv.innerHTML = `<div id="error">${error}</div>`;
    } else {
      const usableStorage = totalStorage - largestDriveSize * numParityDrives;
      resultsDiv.innerHTML = `<div>Total Usable Storage: ${usableStorage.toFixed(
        2
      )} TB</div>`;
    }
  }

  // Handle Parity Drive Selection
  parityButtons.forEach((button) => {
    button.addEventListener('change', () => {
      numParityDrives = parseInt(button.dataset.value);
      updateParityDrives();
    });
  });

  // Initialize inputs
  updateDriveInputs();
  updateParityDrives();
});
