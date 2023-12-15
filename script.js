document.getElementById('start-reading').addEventListener('click', function() {
    const textInput = document.getElementById('text-input').value;
    startReading(textInput);
});

function startReading(text) {
    const readingArea = document.getElementById('reading-area');
    const words = text.split(/\s+/);
    let index = 0;

    const interval = setInterval(function() {
        if (index < words.length) {
            readingArea.textContent = words[index++];
        } else {
            clearInterval(interval);
        }
    }, 200); // Adjust the speed as needed
}
