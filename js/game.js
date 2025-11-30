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
});

scene.addEventListener('loaded', () => {
    console.log('✅ Scene loaded!');
    gameState.sceneReady = true;
    
    // Initialize world anchor system
    if (typeof initWorldAnchorSystem !== 'undefined') {
        initWorldAnchorSystem();
    }
    
    // Check if models are loaded
    setTimeout(() => {
        const organikModel = document.querySelector('#trash-model-organik');
        const anorganikModel = document.querySelector('#trash-model-anorganik');
        const hazardousModel = document.querySelector('#trash-model-hazardous');
        
        console.log('%c🎨 Checking trash models...', 'color: #9C27B0; font-weight: bold;');
        console.log('Organik model:', organikModel ? '✅ Found' : '❌ Missing');
        console.log('Anorganik model:', anorganikModel ? '✅ Found' : '❌ Missing');
        console.log('Hazardous model:', hazardousModel ? '✅ Found' : '❌ Missing');
        
        if (organikModel) {
            organikModel.addEventListener('model-loaded', () => {
                console.log('✅ ORGANIC model GLB loaded');
            });
        }
        if (anorganikModel) {
            anorganikModel.addEventListener('model-loaded', () => {
                console.log('✅ INORGANIC model GLB loaded');
            });
        }
        if (hazardousModel) {
            hazardousModel.addEventListener('model-loaded', () => {
                console.log('✅ HAZARDOUS model GLB loaded');
            });
        }
    }, 1000);
    
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
    
    const trashNames = {
        'organik': 'ORGANIC',
        'anorganik': 'INORGANIC',
        'hazardous': 'HAZARDOUS'
    };
    
    // Show the trash display
    showTrashDisplay(trashType);
    
    updateThrowIndicator(`Throw ${trashNames[trashType]}! Tap to throw!`, 'rgba(255, 152, 0, 0.9)');
}

function showTrashDisplay(trashType) {
    console.log('🔍 showTrashDisplay called with:', trashType);
    console.log('Scene ready?', gameState.sceneReady);
    
    // Wait for scene if not ready
    if (!gameState.sceneReady) {
        console.warn('⏳ Scene not ready, waiting...');
        setTimeout(() => showTrashDisplay(trashType), 500);
        return;
    }
    
    // Get all trash models
    const organikModel = document.querySelector('#trash-model-organik');
    const anorganikModel = document.querySelector('#trash-model-anorganik');
    const hazardousModel = document.querySelector('#trash-model-hazardous');
    const trashDisplay = document.querySelector('#trash-display');
    
    console.log('📦 Elements found:', {
        organik: !!organikModel,
        anorganik: !!anorganikModel,
        hazardous: !!hazardousModel,
        display: !!trashDisplay
    });
    
    if (!organikModel || !anorganikModel || !hazardousModel) {
        console.error('❌ Models not found! Checking scene...');
        console.log('Scene children:', scene.children.length);
        return;
    }
    
    // Make sure trash-display is visible
    if (trashDisplay) {
        trashDisplay.object3D.visible = true;
        console.log('✓ trash-display container visible');
    }
    
    // Hide all trash models first
    organikModel.object3D.visible = false;
    anorganikModel.object3D.visible = false;
    hazardousModel.object3D.visible = false;
    
    console.log('✓ All models hidden');
    
    // Show only the selected trash type
    let selectedModel = null;
    if (trashType === 'organik') {
        selectedModel = organikModel;
        console.log('👉 Showing ORGANIC model');
    } else if (trashType === 'anorganik') {
        selectedModel = anorganikModel;
        console.log('👉 Showing INORGANIC model');
    } else if (trashType === 'hazardous') {
        selectedModel = hazardousModel;
        console.log('👉 Showing HAZARDOUS model');
    }
    
    if (selectedModel) {
        // Use object3D.visible for immediate effect
        selectedModel.object3D.visible = true;
        selectedModel.setAttribute('visible', 'true');
        
        // Add scale animation (scale to 0.12 to match HTML)
        selectedModel.setAttribute('scale', '0.01 0.01 0.01');
        selectedModel.setAttribute('animation', {
            property: 'scale',
            from: '0.01 0.01 0.01',
            to: '0.12 0.12 0.12',
            dur: 500,
            easing: 'easeOutElastic'
        });
        
        console.log('✅ Model visible:', selectedModel.object3D.visible);
        console.log('Position:', selectedModel.object3D.position);
        console.log('Scale:', selectedModel.object3D.scale);
    } else {
        console.error('❌ No model selected for type:', trashType);
    }
}

function hideTrashDisplay() {
    const organikModel = document.querySelector('#trash-model-organik');
    const anorganikModel = document.querySelector('#trash-model-anorganik');
    const hazardousModel = document.querySelector('#trash-model-hazardous');
    
    if (organikModel) organikModel.setAttribute('visible', 'false');
    if (anorganikModel) anorganikModel.setAttribute('visible', 'false');
    if (hazardousModel) hazardousModel.setAttribute('visible', 'false');
}

function showTrashButtons() {
    const buttons = document.getElementById('trash-buttons');
    if (buttons) {
        buttons.classList.remove('hidden');
    }
}

function hideTrashButtons() {
    const buttons = document.getElementById('trash-buttons');
    if (buttons) {
        buttons.classList.add('hidden');
    }
    hideTrashDisplay();
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
    let trashScale = '0.6 0.6 0.6'; // Default
    if (gameState.currentTrashType === 'organik') {
        trashScale = '0.06 0.06 0.06'; // Tissue smaller
    } else if (gameState.currentTrashType === 'anorganik') {
        trashScale = '0.3 0.3 0.3'; // Bottle bigger
    } else if (gameState.currentTrashType === 'hazardous') {
        trashScale = '0.9 0.9 0.9'; // Battery medium
    }
    
    const modelSrc = gameState.currentTrashType === 'hazardous' ? '#trash-hazardous' : `#trash-${gameState.currentTrashType}`;
    
    trash.setAttribute('id', trashId);
    trash.setAttribute('position', '0 0.2 -0.6');
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

// Export functions for world-anchor.js
window.showTrashButtons = showTrashButtons;
window.hideTrashButtons = hideTrashButtons;
