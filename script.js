document.addEventListener('DOMContentLoaded', function() {
  const numDrivesInput = document.getElementById('numDrives');
  const updateDrivesButton = document.getElementById('updateDrives');
  const driveSizesDiv = document.getElementById('driveSizes');
  const calculateButton = document.getElementById('calculate');
  const resultsDiv = document.getElementById('results');

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

      driveInputDiv.appendChild(label);
      driveInputDiv.appendChild(sizeInput);
      driveInputDiv.appendChild(unitSelect);

      driveSizesDiv.appendChild(driveInputDiv);
    }
  }

  function calculateTotalStorage() {
    const driveSizes = document.querySelectorAll('.drive-size');
    const driveUnits = document.querySelectorAll('.drive-unit');
    const numParity = parseInt(document.getElementById('numParity').value);
    const paritySize = parseFloat(document.getElementById('paritySize').value);
    const parityUnit = document.getElementById('parityUnit').value;

    let totalStorage = 0;
    let smallestDriveSize = Infinity;

    driveSizes.forEach((input, index) => {
      let size = parseFloat(input.value);
      const unit = driveUnits[index].value;

      if (unit === 'GB') size = size / 1024; // Convert GB to TB

      totalStorage += size;
      if (size < smallestDriveSize) smallestDriveSize = size;
    });

    let paritySizeTB = paritySize;
    if (parityUnit === 'GB') paritySizeTB = paritySize / 1024;

    // UNRAID uses the largest parity drive as the parity limit
    const parityLimit = paritySizeTB;

    // Adjust total storage by subtracting parity drives
    const usableStorage = totalStorage - parityLimit * numParity;

    resultsDiv.textContent = `Total Usable Storage: ${usableStorage.toFixed(2)} TB`;
  }

  updateDrivesButton.addEventListener('click', updateDriveInputs);
  calculateButton.addEventListener('click', calculateTotalStorage);

  // Initialize drive inputs
  updateDriveInputs();
});
