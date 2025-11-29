/* filepath: d:\semester 7\Realitas X\final project\js\game.js */
// Game State
const gameState = {
    score: 0,
    isMarkerVisible: false,
    sceneReady: false
};

// Initialize game
const scene = document.querySelector('a-scene');
scene.addEventListener('loaded', () => {
    console.log('✅ Scene loaded!');
    gameState.sceneReady = true;
    setupMarkerListeners();
    logInstructions();
});

function setupMarkerListeners() {
    const marker = document.querySelector('#marker');
    if (!marker) {
        console.error('❌ Marker not found!');
        return;
    }
    
    marker.addEventListener('targetFound', () => {
        console.log('✅ Marker detected!');
        gameState.isMarkerVisible = true;
        showThrowHint();
    });
    
    marker.addEventListener('targetLost', () => {
        console.log('⚠️ Marker lost!');
        gameState.isMarkerVisible = false;
        hideThrowHint();
    });
}

function handleThrow(event) {
    console.log('👆 Screen tapped/clicked');
    
    if (!gameState.sceneReady) {
        console.log('⏳ Scene not ready yet...');
        return;
    }
    
    if (!gameState.isMarkerVisible) {
        console.log('⚠️ Marker not visible!');
        updateThrowIndicator('⚠️ Arahkan ke MARKER dulu!', 'rgba(244, 67, 54, 0.9)');
        return;
    }
    
    createPaperBall();
    updateThrowIndicator('LEMPAR! 🚀', 'rgba(255, 152, 0, 0.9)');
}

// Event Listeners
document.addEventListener('click', handleThrow);
document.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleThrow(event);
}, { passive: false });

function logInstructions() {
    console.log('%c🎯 AR Paper Toss Game Loaded!', 'color: #4CAF50; font-size: 20px; font-weight: bold;');
    console.log('%cInstructions:', 'color: #2196F3; font-size: 14px;');
    console.log('1. Point camera at the target marker/sticker');
    console.log('2. Tap screen to throw paper ball');
    console.log('3. Score points by landing in bins!');
    console.log('%c📝 Debug mode: Check console for throwing feedback', 'color: #FF9800');
}