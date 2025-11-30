/* AR Trash Sorting Game - Dropdown + Click Bin Version */

// Game State
const gameState = {
    score: 0,
    sceneReady: false,
    selectedTrashType: null
};

// Initialize game
const scene = document.querySelector('a-scene');

// Wait for document ready before setup
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Ready!');
    setupDropdown();
});

scene.addEventListener('loaded', () => {
    console.log('✅ Scene loaded!');
    gameState.sceneReady = true;
    
    // Initialize world anchor system
    if (typeof initWorldAnchorSystem !== 'undefined') {
        initWorldAnchorSystem();
    }
    
    // Setup bin click handlers after scene loads
    setTimeout(() => {
        setupBinClickHandlers();
    }, 1000);
    
    logInstructions();
});

// ==============================
// Dropdown Handler
// ==============================
function setupDropdown() {
    const dropdown = document.getElementById('trash-dropdown');
    if (!dropdown) {
        console.error('❌ Dropdown not found!');
        return;
    }
    
    dropdown.addEventListener('change', (e) => {
        const selected = e.target.value;
        if (selected) {
            gameState.selectedTrashType = selected;
            console.log('🗑️ Selected trash type:', selected);
            
            const trashNames = {
                'organik': 'ORGANIC',
                'anorganik': 'INORGANIC',
                'hazardous': 'HAZARDOUS'
            };
            
            updateThrowIndicator(`✅ ${trashNames[selected]} selected! Click correct bin!`, 'rgba(76, 175, 80, 0.9)');
        } else {
            gameState.selectedTrashType = null;
            hideThrowIndicator();
        }
    });
    
    console.log('✅ Dropdown initialized');
}

// ==============================
// Bin Click Handlers
// ==============================
function setupBinClickHandlers() {
    // Find all bin models (the actual GLB models)
    const bins = document.querySelectorAll('.bin-model');
    console.log(`🗑️ Found ${bins.length} bin models`);
    
    bins.forEach(bin => {
        const binType = bin.getAttribute('data-bin-type');
        console.log(`  Setting up bin model: ${binType}`);
        
        // Add click event listener
        bin.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('🖱️ Bin model clicked!');
            handleBinClick(binType);
        });
        
        // Also add for mobile touch
        bin.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            console.log('👆 Bin model touched!');
            handleBinClick(binType);
        });
    });
    
    console.log('✅ Bin click handlers initialized');
}

function handleBinClick(binType) {
    console.log('🎯 Bin clicked:', binType);
    
    // Check if trash type is selected
    if (!gameState.selectedTrashType) {
        console.log('⚠️ No trash type selected!');
        showPopup('⚠️ SELECT TRASH TYPE FIRST!', 'warning');
        return;
    }
    
    // Verify match
    if (gameState.selectedTrashType === binType) {
        // CORRECT!
        console.log('🎉 CORRECT! Trash matches bin!');
        updateScore(10);
        showPopup('🎉 CORRECT!\n+10 Points!', 'success');
        
        // Add visual feedback to bin
        flashBin(binType, true);
        
        // Reset selection after delay
        setTimeout(() => {
            resetSelection();
        }, 1500);
    } else {
        // WRONG!
        const trashNames = {
            'organik': 'ORGANIC',
            'anorganik': 'INORGANIC',
            'hazardous': 'HAZARDOUS'
        };
        const binNames = {
            'organik': 'ORGANIC',
            'anorganik': 'INORGANIC',
            'hazardous': 'HAZARDOUS'
        };
        console.log(`❌ WRONG! ${trashNames[gameState.selectedTrashType]} doesn't go in ${binType} bin!`);
        showPopup(`❌ WRONG!\n${trashNames[gameState.selectedTrashType]} ≠ ${binNames[binType]}\n\n🔄 TRY AGAIN!`, 'error');
        
        // Add negative visual feedback
        flashBin(binType, false);
        
        // Don't reset selection - let user try again
    }
}

function flashBin(binType, isCorrect) {
    // Find the bin container
    const bins = document.querySelectorAll('.bin-container');
    bins.forEach(binContainer => {
        const goalZone = binContainer.querySelector(`[data-bin-type="${binType}"]`);
        if (goalZone) {
            const model = binContainer.querySelector('a-gltf-model');
            if (model) {
                // Flash animation
                const color = isCorrect ? '#4CAF50' : '#F44336';
                model.setAttribute('animation', {
                    property: 'scale',
                    from: '0.5 0.5 0.5',
                    to: '0.55 0.55 0.55',
                    dur: 200,
                    dir: 'alternate',
                    loop: 2
                });
            }
        }
    });
}

function resetSelection() {
    gameState.selectedTrashType = null;
    const dropdown = document.getElementById('trash-dropdown');
    if (dropdown) {
        dropdown.value = '';
    }
    
    setTimeout(() => {
        hideThrowIndicator();
    }, 2000);
}

// ==============================
// UI Functions
// ==============================
function showPopup(message, type = 'info') {
    // Remove existing popup if any
    let popup = document.getElementById('game-popup');
    if (popup) {
        popup.remove();
    }
    
    // Create new popup
    popup = document.createElement('div');
    popup.id = 'game-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : (type === 'error' ? 'rgba(244, 67, 54, 0.95)' : 'rgba(255, 152, 0, 0.95)')};
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        animation: popupIn 0.3s ease-out;
        white-space: pre-line;
        max-width: 80%;
    `;
    
    popup.innerHTML = message;
    document.body.appendChild(popup);
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        if (popup && popup.parentNode) {
            popup.style.animation = 'popupOut 0.3s ease-in';
            setTimeout(() => popup.remove(), 300);
        }
    }, 2000);
    
    console.log('📢 Popup shown:', message);
}

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
}

function hideThrowIndicator() {
    const throwIndicator = document.getElementById('throw-indicator');
    if (throwIndicator) {
        throwIndicator.classList.add('hidden');
    }
}

// Helper functions for world-anchor.js compatibility
function showTrashButtons() {
    const selector = document.getElementById('trash-selector');
    if (selector) {
        selector.style.display = 'flex';
    }
}

function hideTrashButtons() {
    const selector = document.getElementById('trash-selector');
    if (selector) {
        selector.style.display = 'none';
    }
}

function logInstructions() {
    console.log('%c🎯 AR Trash Sorting Game Loaded!', 'color: #4CAF50; font-size: 20px; font-weight: bold;');
    console.log('%cInstructions:', 'color: #2196F3; font-size: 14px;');
    console.log('1. Scan the target marker to anchor the bins');
    console.log('2. Select trash type from the dropdown');
    console.log('3. Click the correct bin to score points');
    console.log('4. Match: Organic→Green, Inorganic→Red, Hazardous→Blue');
    console.log('%c🌍 WORLD ANCHOR: Bins will stay in place after first scan!', 'color: #FF9800; font-weight: bold;');
    console.log('%c🔄 RECENTER: Use recenter button to reposition bins', 'color: #2196F3; font-weight: bold;');
}

// Export functions for world-anchor.js
window.showTrashButtons = showTrashButtons;
window.hideTrashButtons = hideTrashButtons;
window.updateThrowIndicator = updateThrowIndicator;
window.hideThrowIndicator = hideThrowIndicator;
