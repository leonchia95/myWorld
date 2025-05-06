// Object to hold the habits and their histories
let habits = {};

// Predefined list of habits
const predefinedHabits = {
    'book': 'Read Book',
    'gym': 'Go to Gym',
    'meditate': 'Meditate',
    'drink-water': 'Drink Water',
    'sleep': 'Sleep Early'
};

// Function to add a new habit dynamically
function addHabit() {
    const habitSelect = document.getElementById('habitSelect').value;
    const customHabit = document.getElementById('customHabit').value.trim();

    let habitId;

    // If a predefined habit is selected
    if (habitSelect !== '') {
        habitId = habitSelect;
    }
    // If a custom habit is added
    else if (customHabit !== '') {
        habitId = customHabit.toLowerCase().replace(/\s+/g, '-'); // Create unique ID from custom habit name
    } else {
        alert("Please select or add a habit.");
        return;
    }

    // If habit doesn't exist, add it to the habits object
    if (!habits[habitId]) {
        habits[habitId] = []; // Initialize the history as an empty array for the new habit
    }

    // Add only the new habit without re-rendering the whole list
    renderNewHabit(habitId);

    // Clear input fields
    document.getElementById('habitSelect').value = '';
    document.getElementById('customHabit').value = '';
}

// Function to check in for a specific habit
function checkIn(habitId) {
    const today = new Date().toLocaleDateString();

    // Check if the user has already checked in today for this habit
    if (habits[habitId].includes(today)) {
        alert("You've already checked in today!");
        return;
    }

    // Add the check-in date to the habit's history
    habits[habitId].push(today);
    updateHistory(habitId);

    // Update the status for the checked habit
    document.getElementById(`status-${habitId}`).textContent = `You checked in today for ${predefinedHabits[habitId] || habitId}`;
    document.querySelector(`#${habitId} .checkInBtn`).disabled = true; // Disable button after check-in

    // Re-enable the button after 24 hours
    setTimeout(() => {
        document.querySelector(`#${habitId} .checkInBtn`).disabled = false;
    }, 86400000); // 24 hours in milliseconds
}

// Function to update the habit history
function updateHistory(habitId) {
    const historyList = document.getElementById(`habitHistory-${habitId}`);
    historyList.innerHTML = ''; // Clear the history list before updating
    habits[habitId].forEach(date => {
        const li = document.createElement('li');
        li.textContent = date;
        historyList.appendChild(li);
    });

    // Update the daily check-in count
    const checkInCount = habits[habitId].length;
    document.getElementById(`checkInCount-${habitId}`).textContent = `Total Check-ins: ${checkInCount}`;
}

// Function to render a single new habit
function renderNewHabit(habitId) {
    const habitList = document.getElementById('habitList');

    // Create and render the new habit card
    const habitCard = document.createElement('div');
    habitCard.classList.add('habit-card');
    habitCard.id = habitId;

    habitCard.innerHTML = `
        <h2>${predefinedHabits[habitId] || habitId}</h2>
        <p>Check-in today:</p>
        <button class="checkInBtn" onclick="checkIn('${habitId}')">Check-in</button>
        <p id="status-${habitId}"></p>
        <ul id="habitHistory-${habitId}"></ul>
        <p id="checkInCount-${habitId}" class="check-in-count">Total Check-ins: 0</p>
    `;

    habitList.appendChild(habitCard);
}
