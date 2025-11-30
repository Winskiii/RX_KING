/* AR Trash Sorting Game - Combined with World Anchor */

// Game State
const gameState = {
    score: 0,
    isMarkerVisible: false,
    sceneReady: false,
    currentTrashType: null,
    isLookingAtMarker: false
};

// Initialize game
const scene = document.querySelector('a-scene');

// Wait for document ready before setup
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Ready!');
    setupTrashButtons();
    setupRecenterButton();
});

scene.addEventListener('loaded', () => {
    console.log('✅ Scene loaded!');
    gameState.sceneReady = true;
    
    // Initialize world anchor system
    if (typeof initWorldAnchorSystem !== 'undefined') {
        initWorldAnchorSystem();
    }
    
    logInstructions();
});

function setupTrashButtons() {
    const btnOrganik = document.getElementById('btn-organik');
    const btnAnorganik = document.getElementById('btn-anorganik');
    const btnHazardous = document.getElementById('btn-hazardous');
    
    if (btnOrganik) {
        btnOrganik.addEventListener('click', (e) => {
            e.stopPropagation();
            handleTrashSelection('organik');
        });
    }
    if (btnAnorganik) {
        btnAnorganik.addEventListener('click', (e) => {
            e.stopPropagation();
            handleTrashSelection('anorganik');
        });
    }
    if (btnHazardous) {
        btnHazardous.addEventListener('click', (e) => {
            e.stopPropagation();
            handleTrashSelection('hazardous');
        });
    }
}

function handleTrashSelection(trashType) {
    console.log('🗑️ Selected trash type:', trashType);
    gameState.currentTrashType = trashType;
    showTrashDisplay(trashType);
    
    const trashNames = {
        'organik': 'ORGANIC',
        'anorganik': 'INORGANIC',
        'hazardous': 'HAZARDOUS'
    };
    
    updateThrowIndicator(`Throw ${trashNames[trashType]}! Tap to throw!`, 'rgba(255, 152, 0, 0.9)');
}

function showTrashDisplay(trashType) {
    const trashDisplay = document.querySelector('#trash-display');
    const trashModel = document.querySelector('#trash-model');
    
    if (!trashDisplay || !trashModel) return;
    
    // Update model source based on trash type
    const modelSrc = trashType === 'hazardous' ? '#trash-kertas' : `#trash-${trashType}`;
    trashModel.setAttribute('src', modelSrc);
    trashDisplay.setAttribute('visible', 'true');
    
    console.log(`📦 Showing trash model: ${trashType}`);
}

function hideTrashDisplay() {
    const trashDisplay = document.querySelector('#trash-display');
    if (trashDisplay) {
        trashDisplay.setAttribute('visible', 'false');
    }
}

function showTrashButtons() {
    const buttons = document.getElementById('trash-buttons');
    if (buttons) {
        buttons.classList.remove('hidden');
    }
}

function handleThrow(event) {
    // Prevent throw if clicking on buttons
    if (event.target.classList.contains('trash-btn') || event.target.id === 'recenter-btn') {
        return;
    }
    
    if (!gameState.sceneReady) {
        console.log('⏳ Scene not ready yet...');
        return;
    }
    
    if (!gameState.currentTrashType) {
        console.log('⚠️ No trash selected!');
        updateThrowIndicator('⚠️ Select trash first!', 'rgba(244, 67, 54, 0.9)');
        return;
    }
    
    if (!worldTrackingState || !worldTrackingState.hasSpawned) {
        console.log('⚠️ Bins not anchored yet!');
        updateThrowIndicator('⚠️ Scan marker first!', 'rgba(244, 67, 54, 0.9)');
        return;
    }
    
    console.log('🚀 Throwing trash:', gameState.currentTrashType);
    createPhysicsTrash();
}

function createPhysicsTrash() {
    // Use persistent container from world-anchor system
    const container = typeof getPersistentObjectsContainer !== 'undefined' 
        ? getPersistentObjectsContainer() 
        : document.querySelector('#world-anchor');
    
    if (!container) return;
    
    // Create new entity for thrown trash
    const trash = document.createElement('a-entity');
    const trashId = `thrown-trash-${Date.now()}`;
    
    // Different sizes for each trash type
    let trashScale = '0.3 0.3 0.3'; // Default
    if (gameState.currentTrashType === 'organik') {
        trashScale = '0.2 0.2 0.2'; // Tissue smaller
    } else if (gameState.currentTrashType === 'anorganik') {
        trashScale = '0.35 0.35 0.35'; // Bottle bigger
    } else if (gameState.currentTrashType === 'hazardous') {
        trashScale = '0.3 0.3 0.3'; // Battery medium
    }
    
    const modelSrc = gameState.currentTrashType === 'hazardous' ? '#trash-kertas' : `#trash-${gameState.currentTrashType}`;
    
    trash.setAttribute('id', trashId);
    trash.setAttribute('position', '0 0.5 -0.3');
    trash.setAttribute('gltf-model', modelSrc);
    trash.setAttribute('scale', trashScale);
    
    // Add physics to thrown trash
    trash.setAttribute('dynamic-body', {
        shape: 'box',
        mass: 0.5
    });
    
    trash.classList.add('throwable-trash');
    trash.setAttribute('data-trash-type', gameState.currentTrashType);
    
    container.appendChild(trash);
    
    // Apply throw force after physics ready
    setTimeout(() => {
        const trashEl = document.querySelector(`#${trashId}`);
        if (trashEl && trashEl.body) {
            // Simulate throw with impulse
            const forceX = (Math.random() - 0.5) * 2;
            const forceY = 5; // Throw upward
            const forceZ = 8; // Throw forward
            
            const impulse = new CANNON.Vec3(forceX, forceY, forceZ);
            trashEl.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
            
            updateThrowIndicator('🚀 THROW!', 'rgba(255, 152, 0, 0.9)');
        }
    }, 100);
    
    // Setup collision detection
    trash.addEventListener('collide', (e) => {
        handleTrashCollision(trash, e);
    });
    
    // Auto-remove trash after 10 seconds
    setTimeout(() => {
        if (trash.parentNode) {
            trash.parentNode.removeChild(trash);
        }
    }, 10000);
}

function handleTrashCollision(trash, event) {
    const collidedEl = event.detail.body.el;
    const trashType = trash.getAttribute('data-trash-type');
    
    if (collidedEl && collidedEl.classList.contains('goal-zone')) {
        const binType = collidedEl.getAttribute('data-bin-type');
        
        if (trashType === binType) {
            // Correct!
            console.log('🎉 CORRECT! Trash', trashType, 'goes into bin', binType);
            updateScore(10);
            updateThrowIndicator('🎉 CORRECT! +10 Points!', 'rgba(76, 175, 80, 0.9)');
            trash.setAttribute('visible', 'false');
        } else {
            // Wrong bin
            console.log('❌ WRONG! Trash', trashType, 'should go to', trashType, 'bin');
            updateThrowIndicator(`❌ WRONG! That's ${trashType} trash, not ${binType}!`, 'rgba(244, 67, 54, 0.9)');
        }
    }
}

// UI Functions
function updateScore(points) {
    gameState.score += points;
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${gameState.score}`;
        scoreDisplay.style.color = points > 0 ? '#4CAF50' : '#f44336';
        setTimeout(() => {
            scoreDisplay.style.color = 'white';
        }, 500);
    }
}

function updateThrowIndicator(message, backgroundColor) {
    const throwIndicator = document.getElementById('throw-indicator');
    if (!throwIndicator) return;
    
    throwIndicator.textContent = message;
    throwIndicator.style.background = backgroundColor;
    throwIndicator.classList.remove('hidden');
    
    setTimeout(() => {
        throwIndicator.classList.add('hidden');
    }, 2000);
}

function hideThrowIndicator() {
    const throwIndicator = document.getElementById('throw-indicator');
    if (throwIndicator) {
        throwIndicator.classList.add('hidden');
    }
}

// Helper functions for world-anchor.js
function showThrowHint() {
    showTrashButtons();
    const btn = document.getElementById('recenter-btn');
    if (btn) btn.classList.remove('hidden');
}

function hideThrowHint() {
    // Keep buttons visible since bins are anchored
    hideThrowIndicator();
}

// Event Listeners for both desktop and mobile
document.addEventListener('click', handleThrow);
document.addEventListener('touchstart', (event) => {
    // Don't prevent default on buttons
    if (!event.target.classList.contains('trash-btn') && event.target.id !== 'recenter-btn') {
        event.preventDefault();
        handleThrow(event);
    }
}, { passive: false });

function logInstructions() {
    console.log('%c🎯 AR Trash Sorting Game Loaded!', 'color: #4CAF50; font-size: 20px; font-weight: bold;');
    console.log('%cInstructions:', 'color: #2196F3; font-size: 14px;');
    console.log('1. Scan the target marker to anchor the bins');
    console.log('2. Select trash type using the buttons below');
    console.log('3. Tap screen (mobile) or click (desktop) to throw trash');
    console.log('4. Sort into correct bin: Organic (green), Inorganic (red), Hazardous (blue)');
    console.log('%c🌍 WORLD ANCHOR: Bins will stay in place after first scan!', 'color: #FF9800; font-weight: bold;');
    console.log('%c🔄 RECENTER: Use recenter button to reposition bins', 'color: #2196F3; font-weight: bold;');
    console.log('%c📝 Debug mode ON - Check console for throw info', 'color: #FF9800');
}
