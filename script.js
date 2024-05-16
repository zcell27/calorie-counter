const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

//new code
// Function to save data to local storage
function saveDataToLocalStorage(data) {
  const savedData = JSON.parse(localStorage.getItem('savedData')) || [];
  savedData.push(data);
  localStorage.setItem('savedData', JSON.stringify(savedData));
}

// Function to populate the table with saved data
function populateSavedData() {
  const savedData = JSON.parse(localStorage.getItem('savedData')) || [];
  const tableBody = document.getElementById('savedDataBody');

  // Clear existing table data
  tableBody.innerHTML = '';

  // Populate the table with saved data
  savedData.forEach((data, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.consumedCalories}</td>
      <td>${data.remainingCalories}</td>
      <td><span id="breakfast-${index}">${data.breakfastCalories}</span></td>
      <td><span id="lunch-${index}">${data.lunchCalories}</span></td>
      <td><span id="dinner-${index}">${data.dinnerCalories}</span></td>
      <td><span id="snacks-${index}">${data.snacksCalories}</span></td>
      <td><span id="exercise-${index}">${data.exerciseCalories}</span></td>
      <td>${data.budgetCalories}</td>
      <td>
        <button onclick="deleteSavedData(${index})">Delete</button>
        <button onclick="editRow(${index})">Update</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
// Function to delete a saved data entry
function deleteSavedData(index) {
  let savedData = JSON.parse(localStorage.getItem('savedData')) || [];
  savedData.splice(index, 1);
  localStorage.setItem('savedData', JSON.stringify(savedData));
  populateSavedData(); // Refresh the table after deletion
}

// Function to update a saved data entry (example)
function updateSavedData(index, newData) {
  let savedData = JSON.parse(localStorage.getItem('savedData')) || [];
  savedData[index] = newData;
  localStorage.setItem('savedData', JSON.stringify(savedData));
  populateSavedData(); // Refresh the table after update
}

// Function to populate the table with saved data
function populateSavedData() {
  const savedData = JSON.parse(localStorage.getItem('savedData')) || [];
  const tableBody = document.getElementById('savedDataBody');

  // Clear existing table data
  tableBody.innerHTML = '';

  // Populate the table with saved data
  savedData.forEach((data, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.consumedCalories}</td>
      <td>${data.remainingCalories}</td>
      <td>${data.breakfastCalories}</td>
      <td>${data.lunchCalories}</td>
      <td>${data.dinnerCalories}</td>
      <td>${data.snacksCalories}</td>
      <td>${data.exerciseCalories}</td>
      <td>${data.budgetCalories}</td>
      <td>
        <button onclick="deleteSavedData(${index})">Delete</button>
        <button onclick="updateSavedData(${index}, newData)">Update</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Call the function to populate saved data when the page loads
window.addEventListener('load', populateSavedData);

// Your existing code for adding entries and calculating calories

//end


function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

  const data = {
    consumedCalories,
    remainingCalories,
    breakfastCalories,
    lunchCalories,
    dinnerCalories,
    snacksCalories,
    exerciseCalories,
    budgetCalories
  };

  saveDataToLocalStorage(data);

  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>

`;
  output.classList.remove('hide');
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');

  // Do not clear data from local storage
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
