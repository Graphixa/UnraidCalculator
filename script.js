// script.js

document.addEventListener('DOMContentLoaded', function() {
  const numDrivesInput = document.getElementById('numDrives');
  const driveSizesDiv = document.getElementById('driveSizes');
  const parityButtons = document.querySelectorAll('.parity-btn');
  const parityDrivesDiv = document.getElementById('parityDrives');
  const resultsDiv = document.getElementById('results');

  let numParityDrives = 0;

  function updateDriveInputs() {
    driveSizesDiv.innerHTML = '';
    const numDrives = parseInt(numDrivesInput.value);
    for (let i = 1; i <= numDrives; i++) {
      const driveInputDiv = document.createElement('div');
      driveInputDiv.className = 'drive-input';

      const label = document.createElement('label');
      label.textContent = `Drive ${i} Size:`;

      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.value = '4';
      sizeInput.className = 'drive-size';

      const unitSelect = document.createElement('select');
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.className = 'drive-unit';

      sizeInput.addEventListener('input', calculateTotalStorage);
      unitSelect.addEventListener('change', calculateTotalStorage);

      driveInputDiv.appendChild(label);
      driveInputDiv.appendChild(sizeInput);
      driveInputDiv.appendChild(unitSelect);

      driveSizesDiv.appendChild(driveInputDiv);
    }
    calculateTotalStorage();
  }

  function updateParityDrives() {
    parityDrivesDiv.innerHTML = '';
    for (let i = 1; i <= numParityDrives; i++) {
      const parityDiv = document.createElement('div');
      parityDiv.className = 'drive-input';

      const label = document.createElement('label');
      label.textContent = `Parity Drive ${i} Size:`;

      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = '0';
      sizeInput.value = '4';
      sizeInput.className = 'parity-size';

      const unitSelect = document.createElement('select');
      const tbOption = document.createElement('option');
      tbOption.value = 'TB';
      tbOption.textContent = 'TB';
      const gbOption = document.createElement('option');
      gbOption.value = 'GB';
      gbOption.textContent = 'GB';
      unitSelect.appendChild(tbOption);
      unitSelect.appendChild(gbOption);
      unitSelect.className = 'parity-unit';

      sizeInput.addEventListener('input', calculateTotalStorage);
      unitSelect.addEventListener('change', calculateTotalStorage);

      parityDiv.appendChild(label);
      parityDiv.appendChild(sizeInput);
      parityDiv.appendChild(unitSelect);

      parityDrivesDiv.appendChild(parityDiv);
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

    let totalParitySize = 0;
    paritySizes.forEach((input, index) => {
      let size = parseFloat(input.value) || 0;
      const unit = parityUnits[index].value;

      if (unit === 'GB') size = size / 1024; // Convert GB to TB

      totalParitySize += size;

      // Check parity size against largest drive
      if (size < largestDriveSize) {
        error = `Parity Drive ${index + 1} must be at least ${largestDriveSize.toFixed(2)} TB`;
      }
    });

    // Adjust total storage by subtracting parity drives
    const usableStorage = totalStorage;

    if (error) {
      resultsDiv.innerHTML = `<div id="error">${error}</div>`;
    } else {
      resultsDiv.innerHTML = `Total Usable Storage: ${usableStorage.toFixed(2)} TB`;
    }
  }

  // Event Listeners
  numDrivesInput.addEventListener('input', () => {
    updateDriveInputs();
    calculateTotalStorage();
  });

  parityButtons.forEach(button => {
    button.addEventListener('click', () => {
      parityButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      numParityDrives = parseInt(button.getAttribute('data-value'));
      updateParityDrives();
    });
  });

  // Initialize drive and parity inputs
  updateDriveInputs();
  updateParityDrives();
});
