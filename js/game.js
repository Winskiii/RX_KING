/* filepath: d:\semester 7\Realitas X\final project\js\game.js */

// Game State
const gameState = {
    score: 0,
    isMarkerVisible: false,
    sceneReady: false,
    currentTrashType: 'organik',
    isLookingAtMarker: false,
    binsAnchored: false,
    anchoredBinsPosition: null,
    trashPreviewScene: null,
    trashPreviewCamera: null,
    trashPreviewRenderer: null,
    currentTrashModel: null
};

// Trash type array untuk random spawn
const TRASH_TYPES = ['organik', 'anorganik', 'hazardous'];

// Initialize game
const scene = document.querySelector('a-scene');

scene.addEventListener('loaded', () => {
    console.log('✅ Scene loaded!');
    gameState.sceneReady = true;
    setupMarkerListeners();
    setupTrashButtons();
    setupTrashPreview();
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
        
        // Anchor bins pada deteksi pertama
        if (!gameState.binsAnchored) {
            anchorBinsToWorld();
            showTrashSelector();
            updateTrashSelection('organik'); // Set default trash
        }
        
        updateThrowIndicator('📍 BINS READY - Select trash & tap to THROW!', 'rgba(76, 175, 80, 0.9)');
    });
    
    marker.addEventListener('targetLost', () => {
        console.log('⚠️ Marker lost!');
        gameState.isMarkerVisible = false;
        // Tidak hide trash selector karena bins sudah di-anchor
        if (!gameState.binsAnchored) {
            hideThrowIndicator();
        }
    });
}

function anchorBinsToWorld() {
    const marker = document.querySelector('#marker');
    const scene = document.querySelector('a-scene');
    
    if (!marker || !scene || gameState.binsAnchored) return;
    
    // Dapatkan posisi world dari marker
    const markerWorldPosition = new THREE.Vector3();
    marker.object3D.getWorldPosition(markerWorldPosition);
    
    const markerWorldRotation = new THREE.Quaternion();
    marker.object3D.getWorldQuaternion(markerWorldRotation);
    
    console.log('🔗 Anchoring bins to world position:', markerWorldPosition);
    
    // Buat container untuk bins yang di-anchor
    const anchoredContainer = document.createElement('a-entity');
    anchoredContainer.setAttribute('id', 'anchored-bins');
    anchoredContainer.object3D.position.copy(markerWorldPosition);
    anchoredContainer.object3D.quaternion.copy(markerWorldRotation);
    
    // Pindahkan semua bin entities ke container baru
    const binEntities = marker.querySelectorAll('a-entity:not(#trash-display)');
    binEntities.forEach((binEntity, index) => {
        // Skip ground box
        if (binEntity.tagName === 'A-BOX') {
            const groundClone = binEntity.cloneNode(true);
            anchoredContainer.appendChild(groundClone);
            return;
        }
        
        // Clone bin dengan semua children-nya
        const binClone = binEntity.cloneNode(true);
        
        // Hitung posisi world dari bin original
        const binWorldPos = new THREE.Vector3();
        binEntity.object3D.getWorldPosition(binWorldPos);
        
        // Set posisi relatif terhadap anchored container
        const relativePos = binWorldPos.sub(markerWorldPosition);
        binClone.object3D.position.copy(relativePos);
        
        anchoredContainer.appendChild(binClone);
    });
    
    // Tambahkan anchored container ke scene
    scene.appendChild(anchoredContainer);
    
    gameState.binsAnchored = true;
    gameState.anchoredBinsPosition = markerWorldPosition;
    
    console.log('✅ Bins anchored successfully!');
}

function setupTrashButtons() {
    const buttons = document.querySelectorAll('.trash-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent throw action
            const trashType = button.getAttribute('data-trash-type');
            updateTrashSelection(trashType);
        });
    });
}

function updateTrashSelection(trashType) {
    gameState.currentTrashType = trashType;
    
    // Update button visual
    document.querySelectorAll('.trash-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    const selectedButton = document.querySelector(`[data-trash-type="${trashType}"]`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
    
    // Update preview
    updateTrashPreview(trashType);
    
    console.log('🗑️ Trash selected:', trashType);
}

function setupTrashPreview() {
    const previewContainer = document.getElementById('trash-preview');
    if (!previewContainer) return;
    
    // Create Three.js scene for preview
    const width = 200;
    const height = 200;
    
    gameState.trashPreviewScene = new THREE.Scene();
    gameState.trashPreviewCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    gameState.trashPreviewCamera.position.set(0, 0, 2);
    
    gameState.trashPreviewRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    gameState.trashPreviewRenderer.setSize(width, height);
    gameState.trashPreviewRenderer.setClearColor(0x000000, 0);
    previewContainer.appendChild(gameState.trashPreviewRenderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    gameState.trashPreviewScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    gameState.trashPreviewScene.add(directionalLight);
    
    // Start animation loop
    animateTrashPreview();
}

function updateTrashPreview(trashType) {
    if (!gameState.trashPreviewScene) return;
    
    // Remove old model
    if (gameState.currentTrashModel) {
        gameState.trashPreviewScene.remove(gameState.currentTrashModel);
    }
    
    // Load new model
    const loader = new THREE.GLTFLoader();
    const modelPath = `./assets/models/trash-${trashType}.glb`;
    
    // Set ukuran berbeda untuk setiap jenis sampah
    let modelScale = 0.5; // Default
    if (trashType === 'organik') {
        modelScale = 0.25; // Tissue lebih kecil
    } else if (trashType === 'anorganik') {
        modelScale = 0.6; // Botol lebih besar
    } else if (trashType === 'hazardous') {
        modelScale = 0.5; // Battery ukuran sedang
    }
    
    loader.load(modelPath, (gltf) => {
        gameState.currentTrashModel = gltf.scene;
        gameState.currentTrashModel.scale.set(modelScale, modelScale, modelScale);
        gameState.trashPreviewScene.add(gameState.currentTrashModel);
        console.log(`✅ Loaded preview model: ${trashType} with scale ${modelScale}`);
    }, undefined, (error) => {
        console.error(`❌ Error loading model ${modelPath}:`, error);
    });
}

function animateTrashPreview() {
    requestAnimationFrame(animateTrashPreview);
    
    // SPINNING DIHAPUS - model tidak berputar lagi
    // if (gameState.currentTrashModel) {
    //     gameState.currentTrashModel.rotation.y += 0.02;
    // }
    
    if (gameState.trashPreviewRenderer && gameState.trashPreviewScene && gameState.trashPreviewCamera) {
        gameState.trashPreviewRenderer.render(gameState.trashPreviewScene, gameState.trashPreviewCamera);
    }
}

function showTrashSelector() {
    const selector = document.getElementById('trash-selector');
    if (selector) {
        selector.classList.remove('hidden');
    }
}

function hideTrashSelector() {
    const selector = document.getElementById('trash-selector');
    if (selector) {
        selector.classList.add('hidden');
    }
}

function handleThrow(event) {
    // Prevent throw if clicking on buttons
    if (event.target.classList.contains('trash-button')) {
        return;
    }
    
    if (!gameState.sceneReady) {
        console.log('⏳ Scene not ready yet...');
        return;
    }
    
    if (!gameState.binsAnchored) {
        console.log('⚠️ Bins not anchored yet! Scan marker first.');
        updateThrowIndicator('⚠️ Scan MARKER first!', 'rgba(244, 67, 54, 0.9)');
        return;
    }
    
    console.log('🚀 Throwing trash:', gameState.currentTrashType);
    createPhysicsTrash();
}

function createPhysicsTrash() {
    const targetContainer = gameState.binsAnchored 
        ? document.querySelector('#anchored-bins')
        : document.querySelector('#marker');
    
    if (!targetContainer) return;
    
    // Buat entity baru untuk trash yang akan dilempar
    const trash = document.createElement('a-entity');
    const trashId = `thrown-trash-${Date.now()}`;
    
    // Set ukuran berbeda untuk setiap jenis sampah
    let trashScale = '0.3 0.3 0.3'; // Default
    if (gameState.currentTrashType === 'organik') {
        trashScale = '0.2 0.2 0.2'; // Tissue lebih kecil
    } else if (gameState.currentTrashType === 'anorganik') {
        trashScale = '0.35 0.35 0.35'; // Botol lebih besar
    } else if (gameState.currentTrashType === 'hazardous') {
        trashScale = '0.3 0.3 0.3'; // Battery ukuran sedang
    }
    
    trash.setAttribute('id', trashId);
    trash.setAttribute('position', '0 0.5 -0.3');
    trash.setAttribute('gltf-model', `#trash-${gameState.currentTrashType}`);
    trash.setAttribute('scale', trashScale);
    
    // Tambah physics untuk trash yang dilempar
    trash.setAttribute('dynamic-body', {
        shape: 'box',
        mass: 0.5
    });
    
    trash.classList.add('throwable-trash');
    trash.setAttribute('data-trash-type', gameState.currentTrashType);
    
    targetContainer.appendChild(trash);
    
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
            
            updateThrowIndicator('🚀 THROW!', 'rgba(255, 152, 0, 0.9)');
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

// Event Listeners
document.addEventListener('click', handleThrow);
document.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleThrow(event);
}, { passive: false });

function logInstructions() {
    console.log('%c🎯 AR Trash Sorting Game Loaded!', 'color: #4CAF50; font-size: 20px; font-weight: bold;');
    console.log('%cInstructions:', 'color: #2196F3; font-size: 14px;');
    console.log('1. Scan the target marker to anchor the bins');
    console.log('2. Select trash type using the buttons below');
    console.log('3. View the preview of selected trash');
    console.log('4. Tap the screen to throw trash into the correct bin');
    console.log('5. Organic (green), Inorganic (red), Hazardous (blue)');
    console.log('%c🔗 ANCHOR FEATURE: Bins will stay in place after first scan!', 'color: #FF9800; font-weight: bold;');
    console.log('%c🎮 NEW FEATURE: Select trash with buttons, no need to rescan!', 'color: #4CAF50; font-weight: bold;');
    console.log('%c📝 Debug mode ON - Check console for throw info', 'color: #FF9800');
}
