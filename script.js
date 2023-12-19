let currentIndex = 0;
let interval;
let words = [];
const maxSpeed = 1000; // Maximum slider value (slowest speed)
const minSpeed = 50;  // Minimum slider value (fastest speed)
let speed = (maxSpeed + minSpeed) / 2; // Initial speed

// Calculate reading speed based on slider value
function calculateReadingSpeed(sliderValue) {
    const minInterval = 100;  // Minimum interval (fastest speed)
    const maxInterval = 1000; // Maximum interval (slowest speed)
    const interval = maxInterval - ((sliderValue - minSpeed) / (maxSpeed - minSpeed) * (maxInterval - minInterval));
    return interval;
}

// Update the speed based on slider input
function updateSpeed() {
    const sliderValue = parseInt(document.getElementById('speed-control').value);
    speed = calculateReadingSpeed(sliderValue);
    if (interval) {
        clearInterval(interval);
        startInterval();
    }
}

let voices = [];
window.onload = function() {
    voices = speechSynthesis.getVoices();
};

// Function to speak a word
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    if (voices.length > 0) {
        utterance.voice = voices.find(voice => voice.lang === "en-US");
    }
    utterance.pitch = 1; // Adjust pitch if needed
    utterance.rate = 1; // Adjust rate if needed
    speechSynthesis.speak(utterance);
}

// Display the current word and speak it
function displayCurrentWord() {
    const textDisplay = document.getElementById('text-display');
    if (currentIndex < words.length) {
        const currentWord = words[currentIndex];
        textDisplay.textContent = currentWord;
        speakWord(currentWord); // Speak the word
    }
}

// Start the reading process
function startReading(text) {
    clearInterval(interval);
    words = text.split(/\s+/);
    currentIndex = 0;
    displayCurrentWord();
    startInterval();
}

// Handle the interval for displaying words
function startInterval() {
    clearInterval(interval);
    interval = setInterval(function() {
        if (currentIndex < words.length - 1) {
            currentIndex++;
            displayCurrentWord();
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// Show all words for navigation
function showAllWordsForNavigation() {
    clearInterval(interval);
    const backdrop = document.getElementById('backdrop');
    const textDisplay = document.getElementById('text-display');
    const quitReading = document.getElementById('quit-reading');
    textDisplay.style.display = 'none';
    quitReading.style.display = 'none';
    const wordsContainer = document.createElement('div');
    wordsContainer.id = 'words-navigation';
    backdrop.appendChild(wordsContainer);
    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word + ' ';
        wordSpan.classList.add('word');
        if (index === currentIndex) {
            wordSpan.classList.add('highlight');
        }
        wordSpan.onclick = function() {
            currentIndex = index;
            displayCurrentWord();
            wordsContainer.style.display = 'none';
            textDisplay.style.display = 'block';
            quitReading.style.display = 'block';
            backdrop.removeChild(wordsContainer);
            startInterval();
        };
        wordsContainer.appendChild(wordSpan);
    });
}

// Event listeners
document.getElementById('start-reading').addEventListener('click', function() {
    const textInput = document.getElementById('text-input').value;
    if (textInput.trim() !== '') {
        startReading(textInput);
    } else {
        alert('Please enter some text before starting to read.');
    }
});

document.getElementById('back-button').addEventListener('click', showAllWordsForNavigation);
document.getElementById('quit-reading').addEventListener('click', function() {
    clearInterval(interval);
    document.getElementById('backdrop').style.display = 'none';
    currentIndex = 0;
});

document.getElementById('speed-control').addEventListener('input', updateSpeed);
document.getElementById('speed-control').min = minSpeed;
document.getElementById('speed-control').max = maxSpeed;
document.getElementById('speed-control').value = speed;
