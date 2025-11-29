/* filepath: d:\semester 7\Realitas X\final project\js\game.js */

// Game State
const gameState = {
    score: 0,
    isMarkerVisible: false,
    sceneReady: false,
    currentTrashType: 'organik',
    isLookingAtMarker: false
};

// Trash type array untuk random spawn
const TRASH_TYPES = ['organik', 'anorganik', 'kertas'];

// Initialize game
const scene = document.querySelector('a-scene');

scene.addEventListener('loaded', () => {
    console.log('✅ Scene loaded!');
    gameState.sceneReady = true;
    setupMarkerListeners();
    logInstructions();
    spawnRandomTrash();
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
        showTrashDisplay();
        updateThrowIndicator('📍 MARKER TERDETEKSI - Tap untuk LEMPAR!', 'rgba(76, 175, 80, 0.9)');
    });
    
    marker.addEventListener('targetLost', () => {
        console.log('⚠️ Marker lost!');
        gameState.isMarkerVisible = false;
        hideTrashDisplay();
        hideThrowIndicator();
    });
}

function spawnRandomTrash() {
    // Pilih tipe sampah random
    gameState.currentTrashType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
    console.log('🗑️ New trash spawned:', gameState.currentTrashType);
    
    if (gameState.isMarkerVisible) {
        showTrashDisplay();
    }
}

function showTrashDisplay() {
    const trashDisplay = document.querySelector('#trash-display');
    const trashModel = document.querySelector('#trash-model');
    
    if (!trashDisplay || !trashModel) return;
    
    // Update model source sesuai tipe sampah
    trashModel.setAttribute('src', `#trash-${gameState.currentTrashType}`);
    trashDisplay.setAttribute('visible', 'true');
    
    console.log(`📦 Showing trash model: trash-${gameState.currentTrashType}`);
}

function hideTrashDisplay() {
    const trashDisplay = document.querySelector('#trash-display');
    if (trashDisplay) {
        trashDisplay.setAttribute('visible', 'false');
    }
}

function handleThrow(event) {
    if (!gameState.sceneReady) {
        console.log('⏳ Scene not ready yet...');
        return;
    }
    
    if (!gameState.isMarkerVisible) {
        console.log('⚠️ Marker not visible!');
        updateThrowIndicator('⚠️ Arahkan ke MARKER dulu!', 'rgba(244, 67, 54, 0.9)');
        return;
    }
    
    console.log('🚀 Throwing trash:', gameState.currentTrashType);
    createPhysicsTrash();
    spawnRandomTrash(); // Spawn trash baru setelah lempar
}

function createPhysicsTrash() {
    const marker = document.querySelector('#marker');
    if (!marker) return;
    
    // Buat entity baru untuk trash yang akan dilempar
    const trash = document.createElement('a-entity');
    const trashId = `thrown-trash-${Date.now()}`;
    
    trash.setAttribute('id', trashId);
    trash.setAttribute('position', '0 0.5 -0.3');
    trash.setAttribute('gltf-model', `#trash-${gameState.currentTrashType}`);
    trash.setAttribute('scale', '0.8 0.8 0.8');
    
    // Tambah physics untuk trash yang dilempar
    trash.setAttribute('dynamic-body', {
        shape: 'box',
        mass: 0.5
    });
    
    trash.classList.add('throwable-trash');
    trash.setAttribute('data-trash-type', gameState.currentTrashType);
    
    marker.appendChild(trash);
    
    // Apply throw force setelah physics siap
    setTimeout(() => {
        const trashEl = document.querySelector(`#${trashId}`);
        if (trashEl && trashEl.body) {
            // Simulasikan throw dengan impulse
            const forceX = (Math.random() - 0.5) * 2;
            const forceY = 5; // Lempar ke atas
            const forceZ = 8; // Lempar ke depan
            
            const impulse = new CANNON.Vec3(forceX, forceY, forceZ);
            trashEl.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));
            
            updateThrowIndicator('🚀 LEMPAR!', 'rgba(255, 152, 0, 0.9)');
        }
    }, 100);
    
    // Setup collision detection
    trash.addEventListener('collide', (e) => {
        handleTrashCollision(trash, e);
    });
    
    // Auto-remove trash setelah 10 detik
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
            // Tepat sasaran!
            console.log('🎉 BENAR! Sampah', trashType, 'masuk ke tong', binType);
            updateScore(10);
            updateThrowIndicator('🎉 BENAR! +10 Poin!', 'rgba(76, 175, 80, 0.9)');
            trash.setAttribute('visible', 'false');
        } else {
            // Salah tong
            console.log('❌ SALAH! Sampah', trashType, 'seharusnya ke tong', trashType);
            updateThrowIndicator(`❌ SALAH! Itu sampah ${trashType}, bukan ${binType}!`, 'rgba(244, 67, 54, 0.9)');
        }
    }
}

// UI Functions
function updateScore(points) {
    gameState.score += points;
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Skor: ${gameState.score}`;
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

// Event Listeners
document.addEventListener('click', handleThrow);
document.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleThrow(event);
}, { passive: false });

function logInstructions() {
    console.log('%c🎯 AR Trash Sorting Game Loaded!', 'color: #4CAF50; font-size: 20px; font-weight: bold;');
    console.log('%cInstructions:', 'color: #2196F3; font-size: 14px;');
    console.log('1. Arahkan kamera ke marker target');
    console.log('2. Lihat model sampah yang muncul');
    console.log('3. Tap layar untuk melempar sampah ke tong yang sesuai');
    console.log('4. Organik (hijau), Anorganik (merah), Kertas (biru)');
    console.log('%c📝 Debug mode ON - Cek console untuk info throw', 'color: #FF9800');
}
