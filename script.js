let currentIndex = 0;
let interval;
let words = [];
let maxSpeed = 1000; // Maximum interval time in milliseconds (slowest speed)
let minSpeed = 50; // Minimum interval time in milliseconds (fastest speed)
let defaultSpeed = (maxSpeed + minSpeed) / 2; // Middle value for moderate speed
let speed = defaultSpeed; // Current speed

// Function to update the display with the current word
function displayCurrentWord() {
    const textDisplay = document.getElementById('text-display');
    if (currentIndex < words.length) {
        textDisplay.textContent = words[currentIndex];
    }
}

// Function to start the reading process
function startReading(text) {
    clearInterval(interval); // Clear any existing intervals
    words = text.split(/\s+/); // Split the text into words
    currentIndex = 0; // Reset the index to the start
    displayCurrentWord(); // Display the first word
    document.getElementById('backdrop').style.display = 'flex'; // Show the reading backdrop
    startInterval(); // Start the interval to display each word
}

// Function to handle the interval for displaying words
function startInterval() {
    clearInterval(interval); // Ensure any existing interval is cleared
    interval = setInterval(function() {
        if (currentIndex < words.length - 1) {
            currentIndex++;
            displayCurrentWord();
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// Function to update speed based on the speed control input
function updateSpeed() {
    const sliderValue = document.getElementById('speed-control').value;
    speed = maxSpeed - sliderValue; // Invert the speed calculation
    if (interval) {
        clearInterval(interval); // Clear current interval
        startInterval(); // Restart reading with the new speed
    }
}

// Function to show all words within the backdrop
function showAllWordsForNavigation() {
    clearInterval(interval); // Stop the current reading interval
    const backdrop = document.getElementById('backdrop');
    backdrop.innerHTML = ''; // Clear existing content in the backdrop

    // Create a new container for words navigation
    const wordsContainer = document.createElement('div');
    wordsContainer.id = 'words-navigation';

    // Populate the new container with all words as clickable elements
    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word + ' ';
        wordSpan.classList.add('word'); // Add class for styling
        wordSpan.onclick = function() {
            currentIndex = index; // Set the currentIndex to the word clicked
            displayCurrentWord(); // Update the displayed word

            // Re-setup the backdrop for reading session
            backdrop.innerHTML = ''; // Clear words navigation
            backdrop.appendChild(document.getElementById('text-display')); // Append the text display
            backdrop.appendChild(document.getElementById('quit-reading')); // Append the quit button
            backdrop.style.display = 'flex'; // Show the backdrop
            startInterval(); // Restart the reading interval
        };
        wordsContainer.appendChild(wordSpan);
    });

    backdrop.appendChild(wordsContainer); // Append the words container to the backdrop
}

// Event listener for the "Start Reading" button
document.getElementById('start-reading').addEventListener('click', function() {
    const textInput = document.getElementById('text-input').value; // Get the input text
    if (textInput.trim() !== '') {
        startReading(textInput); // Start reading the input text
    } else {
        alert('Please enter some text before starting to read.'); // Alert if there is no text
    }
});

// Event listener for the "Back" button
document.getElementById('back-button').addEventListener('click', showAllWordsForNavigation);

// Event listener for the "Quit" button
document.getElementById('quit-reading').addEventListener('click', function() {
    clearInterval(interval); // Stop the reading process
    document.getElementById('backdrop').style.display = 'none'; // Hide the reading backdrop
    currentIndex = 0; // Reset the index
});

// Event listener for the speed control
document.getElementById('speed-control').addEventListener('input', updateSpeed);

// Initialize the speed control slider
document.getElementById('speed-control').min = minSpeed;
document.getElementById('speed-control').max = maxSpeed;
document.getElementById('speed-control').value = defaultSpeed;
