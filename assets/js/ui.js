/* filepath: d:\semester 7\Realitas X\final project\js\ui.js */
// UI Management
const scoreDisplay = document.getElementById('score-display');
const throwIndicator = document.getElementById('throw-indicator');

function updateScore(points) {
    gameState.score += points;
    scoreDisplay.textContent = `Skor: ${gameState.score}`;
    
    // Visual feedback
    scoreDisplay.style.color = points > 0 ? '#4CAF50' : '#f44336';
    setTimeout(() => {
        scoreDisplay.style.color = 'white';
    }, 500);
}

function updateThrowIndicator(message, backgroundColor) {
    throwIndicator.textContent = message;
    throwIndicator.style.background = backgroundColor;
    throwIndicator.classList.remove('hidden');
    
    setTimeout(() => {
        throwIndicator.classList.add('hidden');
    }, 2000);
}

function showThrowHint() {
    throwIndicator.classList.remove('hidden');
    throwIndicator.textContent = 'TAP LAYAR untuk LEMPAR! 🎯';
    throwIndicator.style.background = 'rgba(76, 175, 80, 0.9)';
}

function hideThrowHint() {
    throwIndicator.classList.add('hidden');
}