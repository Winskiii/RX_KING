const worldTrackingState = {
    hasSpawned: false,           
    isLocked: false,             
    markerEl: null,              
    worldAnchor: null,           
    persistentGroup: null,       
    recenterBtn: null            
};

function initWorldAnchorSystem() {
    console.log('%c🌍 World Anchor System Initializing...', 'color: #00BCD4; font-size: 16px; font-weight: bold;');
    
    // Get references
    worldTrackingState.markerEl = document.querySelector('#marker');
    worldTrackingState.worldAnchor = document.querySelector('#world-anchor');
    worldTrackingState.recenterBtn = document.querySelector('#recenter-btn');
    
    if (!worldTrackingState.markerEl || !worldTrackingState.worldAnchor) {
        console.error('❌ Required elements not found!');
        return;
    }
    
    setupWorldTrackingListeners();
    
    // Setup recenter button
    setupRecenterButton();
    
    console.log('✅ World Anchor System Ready!');
}

function setupWorldTrackingListeners() {
    const marker = worldTrackingState.markerEl;
    
    marker.addEventListener('targetFound', () => {
        console.log('%c✅ MARKER FOUND!', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
        
        if (!worldTrackingState.hasSpawned) {
            
            console.log('🎯 First detection - Spawning objects...');
            spawnAndLockObjects();
        } else if (worldTrackingState.hasSpawned && !worldTrackingState.isLocked) {
            
            console.log('📍 Objects already spawned - Show recenter option');
            showRecenterButton();
        }
        
        if (typeof gameState !== 'undefined') {
            gameState.isMarkerVisible = true;
        }
        showThrowHint();
    });
    
    marker.addEventListener('targetLost', () => {
        console.log('%c⚠️ MARKER LOST', 'color: #FF9800; font-size: 14px;');
        
        if (typeof gameState !== 'undefined') {
            gameState.isMarkerVisible = false;
        }
        
        if (worldTrackingState.hasSpawned) {
            console.log('✅ Objects remain in world space (persistent mode)');
        }
        
        hideThrowHint();
    });
}

function spawnAndLockObjects() {
    console.log('%c🔧 Spawning and locking objects...', 'color: #9C27B0; font-size: 14px;');
    
    const marker = worldTrackingState.markerEl;
    const worldAnchor = worldTrackingState.worldAnchor;
    
    const persistentGroup = document.createElement('a-entity');
    persistentGroup.setAttribute('id', 'persistent-group');
    
    const markerWorldPosition = new THREE.Vector3();
    const markerWorldQuaternion = new THREE.Quaternion();
    const markerWorldScale = new THREE.Vector3();
    
    marker.object3D.updateMatrixWorld();
    marker.object3D.matrixWorld.decompose(
        markerWorldPosition,
        markerWorldQuaternion,
        markerWorldScale
    );
    
    console.log('📍 Captured marker world position:', markerWorldPosition);
    
    persistentGroup.object3D.position.copy(markerWorldPosition);
    persistentGroup.object3D.quaternion.copy(markerWorldQuaternion);
    persistentGroup.object3D.scale.copy(markerWorldScale);
    
    cloneMarkerContents(marker, persistentGroup);
    
    worldAnchor.appendChild(persistentGroup);
    
    marker.object3D.visible = false;
    
    worldTrackingState.hasSpawned = true;
    worldTrackingState.isLocked = true;
    worldTrackingState.persistentGroup = persistentGroup;
    
    console.log('%c✨ Objects locked in world space!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    console.log('📦 Persistent group created with world position');
    
    if (typeof updateThrowIndicator !== 'undefined') {
        updateThrowIndicator('✅ Bins anchored!', 'rgba(76, 175, 80, 0.9)');
    }
    
    setTimeout(() => {
        showRecenterButton();
    }, 2000);
}

function cloneMarkerContents(sourceMarker, targetGroup) {
    console.log('📋 Cloning marker contents...');
    
    const children = Array.from(sourceMarker.children);
    
    children.forEach(child => {
        // Skip trash-display (removed in new version)
        if (child.id === 'trash-display') return;
        
        const clone = child.cloneNode(true);
        
        if (child.object3D) {
            clone.object3D.position.copy(child.object3D.position);
            clone.object3D.rotation.copy(child.object3D.rotation);
            clone.object3D.scale.copy(child.object3D.scale);
        }
        
        targetGroup.appendChild(clone);
        
        console.log('  ✓ Cloned:', child.tagName, child.className || '');
    });
    
    console.log('✅ All objects cloned to world space');
    
    // Re-setup bin click handlers for cloned bins
    setTimeout(() => {
        if (typeof setupBinClickHandlers !== 'undefined') {
            console.log('🔄 Re-initializing bin click handlers for cloned bins...');
            setupBinClickHandlers();
        }
    }, 500);
}

function setupRecenterButton() {
    const btn = worldTrackingState.recenterBtn;
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        console.log('🔄 Recenter requested...');
        recenterObjects();
    });
}

function showRecenterButton() {
    const btn = worldTrackingState.recenterBtn;
    if (btn) {
        btn.classList.remove('hidden');
        console.log('👆 Recenter button shown');
    }
}

function hideRecenterButton() {
    const btn = worldTrackingState.recenterBtn;
    if (btn) {
        btn.classList.add('hidden');
    }
}

function recenterObjects() {
    if (typeof gameState !== 'undefined' && !gameState.isMarkerVisible) {
        if (typeof updateThrowIndicator !== 'undefined') {
            updateThrowIndicator('⚠️ Scan marker to recenter!', 'rgba(244, 67, 54, 0.9)');
        }
        console.log('⚠️ Cannot recenter - marker not visible');
        return;
    }
    
    console.log('%c🔄 RECENTERING OBJECTS...', 'color: #2196F3; font-size: 14px; font-weight: bold;');
    
    if (worldTrackingState.persistentGroup) {
        worldTrackingState.persistentGroup.parentNode.removeChild(worldTrackingState.persistentGroup);
    }
    
    worldTrackingState.markerEl.object3D.visible = true;
    
    worldTrackingState.hasSpawned = false;
    worldTrackingState.isLocked = false;
    worldTrackingState.persistentGroup = null;
    
    setTimeout(() => {
        spawnAndLockObjects();
        if (typeof updateThrowIndicator !== 'undefined') {
            updateThrowIndicator('✅ Position updated!', 'rgba(76, 175, 80, 0.9)');
        }
    }, 100);
}

function getPersistentObjectsContainer() {
    if (worldTrackingState.isLocked && worldTrackingState.persistentGroup) {
        return worldTrackingState.persistentGroup;
    }
    return worldTrackingState.markerEl;
}

function showThrowHint() {
    if (typeof showTrashButtons !== 'undefined') {
        showTrashButtons();
    }
    const btn = document.getElementById('recenter-btn');
    if (btn) btn.classList.remove('hidden');
}

function hideThrowHint() {
    const indicator = document.getElementById('throw-indicator');
    if (indicator) indicator.classList.add('hidden');
}

window.worldTrackingState = worldTrackingState;
window.initWorldAnchorSystem = initWorldAnchorSystem;
window.getPersistentObjectsContainer = getPersistentObjectsContainer;
window.recenterObjects = recenterObjects;
