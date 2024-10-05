// Select elements
const assetsList = document.querySelector('.assets-ul-list');
const liabilitiesList = document.querySelector('.liablity-ul-list');
const total = document.getElementById('total');
const congrats = document.getElementById('congrats');
const goalInput = document.getElementById('goal');
const saveGoalButton = document.getElementById('save-goal');
const savedGoalDisplay = document.getElementById('saved-goal');
const addAssetButton = document.getElementById('add-asset');
const addLiabilityButton = document.getElementById('add-liability');
const progressBar = document.getElementById('goal-progress');

// Function to create a new item
function createNewItem(type, label = '', value = '') {
    const li = document.createElement('li');
    const textInput = document.createElement('input');
    const numberInput = document.createElement('input');

    textInput.type = 'text';
    textInput.id = `input-${type}_text`;
    textInput.value = label;
    textInput.placeholder = type === 'asset' ? 'Add your asset' : 'Add your liability';

    numberInput.type = 'number';
    numberInput.id = `input-${type}`;
    numberInput.value = value;
    numberInput.placeholder = '0000';

    li.appendChild(textInput);
    li.appendChild(numberInput);

    return li;
}

// Function to add a new item
function addNewItem(type) {
    const newItem = createNewItem(type);
    const list = type === 'asset' ? assetsList : liabilitiesList;
    list.insertBefore(newItem, list.lastElementChild);
    addInputListeners(newItem);
    saveInputs();
    updateTotal();
}

// Add event listeners for plus buttons
addAssetButton.addEventListener('click', () => addNewItem('asset'));
addLiabilityButton.addEventListener('click', () => addNewItem('liability'));

// Function to save input values to localStorage
function saveInputs() {
    const assetInputs = assetsList.querySelectorAll('li:not(.add-item)');
    const liabilityInputs = liabilitiesList.querySelectorAll('li:not(.add-item)');

    const assetValues = Array.from(assetInputs).map(li => li.querySelector('input[type="number"]').value);
    const liabilityValues = Array.from(liabilityInputs).map(li => li.querySelector('input[type="number"]').value);
    const assetLabelValues = Array.from(assetInputs).map(li => li.querySelector('input[type="text"]').value);
    const liabilityLabelValues = Array.from(liabilityInputs).map(li => li.querySelector('input[type="text"]').value);

    localStorage.setItem('assetValues', JSON.stringify(assetValues));
    localStorage.setItem('liabilityValues', JSON.stringify(liabilityValues));
    localStorage.setItem('assetLabelValues', JSON.stringify(assetLabelValues));
    localStorage.setItem('liabilityLabelValues', JSON.stringify(liabilityLabelValues));
}

// Function to load input values from localStorage
function loadInputs() {
    const savedAssetValues = JSON.parse(localStorage.getItem('assetValues')) || [];
    const savedLiabilityValues = JSON.parse(localStorage.getItem('liabilityValues')) || [];
    const savedAssetLabelValues = JSON.parse(localStorage.getItem('assetLabelValues')) || [];
    const savedLiabilityLabelValues = JSON.parse(localStorage.getItem('liabilityLabelValues')) || [];

    // Clear existing items except the add button
    Array.from(assetsList.children).slice(0, -1).forEach(child => child.remove());
    Array.from(liabilitiesList.children).slice(0, -1).forEach(child => child.remove());

    // Add saved items
    savedAssetLabelValues.forEach((label, index) => {
        const newItem = createNewItem('asset', label, savedAssetValues[index]);
        assetsList.insertBefore(newItem, assetsList.lastElementChild);
        addInputListeners(newItem);
    });

    savedLiabilityLabelValues.forEach((label, index) => {
        const newItem = createNewItem('liability', label, savedLiabilityValues[index]);
        liabilitiesList.insertBefore(newItem, liabilitiesList.lastElementChild);
        addInputListeners(newItem);
    });

    updateTotal();
}

// Function to add input listeners to a new item
function addInputListeners(item) {
    item.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            updateTotal();
            saveInputs();
        });
    });
}

// Function to update total net worth and display congratulations message
function updateTotal() {
    let totalAssets = 0;
    let totalLiabilities = 0;

    // Calculate total assets
    assetsList.querySelectorAll('input[type="number"]').forEach(input => {
        totalAssets += Number(input.value) || 0;
    });

    // Calculate total liabilities
    liabilitiesList.querySelectorAll('input[type="number"]').forEach(input => {
        totalLiabilities += Number(input.value) || 0;
    });

    // Calculate and update net worth
    const netWorth = totalAssets - totalLiabilities;
    total.textContent = netWorth.toLocaleString();

    // Display congrats message if goal is met and update progress bar
    const goal = Number(localStorage.getItem('savedGoal'));
    if (goal) {
        const progress = Math.min((netWorth / goal) * 100, 100);
        progressBar.style.width = `${progress}%`;
        
        if (netWorth >= goal) {
            congrats.textContent = 'Congratulations! You have achieved your financial goal!';
            progressBar.style.backgroundColor = '#4CAF50'; // Green color for achieved goal
        } else if (netWorth > goal * 0.75) {
            congrats.textContent = 'You are close to achieving your goal!';
            progressBar.style.backgroundColor = '#FFA500'; // Orange color for close to goal
        } else {
            congrats.textContent = 'Keep going! You are on your way to achieving your goal.';
            progressBar.style.backgroundColor = '#2196F3'; // Blue color for in progress
        }
    } else {
        progressBar.style.width = '0%';
    }
}

// Save and display financial goal
saveGoalButton.addEventListener('click', () => {
    const goalValue = goalInput.value;
    if (goalValue) {
        localStorage.setItem('savedGoal', goalValue);
        savedGoalDisplay.textContent = goalValue;
        updateTotal();
    }
});

// Load saved goal on page load
function loadSavedGoal() {
    const savedGoal = localStorage.getItem('savedGoal');
    if (savedGoal) {
        savedGoalDisplay.textContent = savedGoal;
        goalInput.value = savedGoal;
    }
}

// Initialize the calculator
function init() {
    loadInputs();
    loadSavedGoal();
}

// Run initialization
init();
