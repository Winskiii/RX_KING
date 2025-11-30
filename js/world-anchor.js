/* ============================================
   WORLD ANCHOR SYSTEM - English Version
   ============================================
   Purpose: Lock AR objects in world space after first marker detection
   
   How it works:
   1. Scan marker once → capture world position & rotation
   2. Clone all 3D models to world-anchor entity
   3. Detach from marker → objects stay fixed in space
   4. Marker can move away → objects remain visible
   
   Configuration:
   - hasSpawned: prevents duplicate spawning
   - worldAnchor: container for persistent objects
   - recenterBtn: allows repositioning if needed
============================================ */

// ==========================================
// WORLD TRACKING STATE
// ==========================================
const worldTrackingState = {
    hasSpawned: false,           // Has the scene been spawned yet?
    isLocked: false,             // Are objects locked in world space?
    markerEl: null,              // Reference to marker element
    worldAnchor: null,           // Container for world-locked objects
    persistentGroup: null,       // Group holding all persistent objects
    recenterBtn: null            // Recenter button element
};

// ==========================================
// INITIALIZATION
// ==========================================
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
    
    // Setup marker event listeners
    setupWorldTrackingListeners();
    
    // Setup recenter button
    setupRecenterButton();
    
    console.log('✅ World Anchor System Ready!');
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupWorldTrackingListeners() {
    const marker = worldTrackingState.markerEl;
    
    marker.addEventListener('targetFound', () => {
        console.log('%c✅ MARKER FOUND!', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
        
        if (!worldTrackingState.hasSpawned) {
            // First time detection - spawn and lock objects
            console.log('🎯 First detection - Spawning objects...');
            spawnAndLockObjects();
        } else if (worldTrackingState.hasSpawned && !worldTrackingState.isLocked) {
            // Objects exist but not locked - show recenter option
            console.log('📍 Objects already spawned - Show recenter option');
            showRecenterButton();
        }
        
        // Update game state
        if (typeof gameState !== 'undefined') {
            gameState.isMarkerVisible = true;
        }
        showThrowHint();
    });
    
    marker.addEventListener('targetLost', () => {
        console.log('%c⚠️ MARKER LOST', 'color: #FF9800; font-size: 14px;');
        
        // Update game state but keep objects visible
        if (typeof gameState !== 'undefined') {
            gameState.isMarkerVisible = false;
        }
        
        if (worldTrackingState.hasSpawned) {
            console.log('✅ Objects remain in world space (persistent mode)');
        }
        
        hideThrowHint();
    });
}

// ==========================================
// SPAWN AND LOCK OBJECTS
// ==========================================
function spawnAndLockObjects() {
    console.log('%c🔧 Spawning and locking objects...', 'color: #9C27B0; font-size: 14px;');
    
    const marker = worldTrackingState.markerEl;
    const worldAnchor = worldTrackingState.worldAnchor;
    
    // Create a persistent group container
    const persistentGroup = document.createElement('a-entity');
    persistentGroup.setAttribute('id', 'persistent-group');
    
    // ==========================================
    // STEP 1: Capture marker's world transformation
    // ==========================================
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
    
    // ==========================================
    // STEP 2: Apply transformation to persistent group
    // ==========================================
    persistentGroup.object3D.position.copy(markerWorldPosition);
    persistentGroup.object3D.quaternion.copy(markerWorldQuaternion);
    persistentGroup.object3D.scale.copy(markerWorldScale);
    
    // ==========================================
    // STEP 3: Clone all objects from marker
    // ==========================================
    cloneMarkerContents(marker, persistentGroup);
    
    // ==========================================
    // STEP 4: Add to world anchor (detached from marker)
    // ==========================================
    worldAnchor.appendChild(persistentGroup);
    
    // ==========================================
    // STEP 5: Hide original marker content
    // ==========================================
    marker.object3D.visible = false;
    
    // Update state
    worldTrackingState.hasSpawned = true;
    worldTrackingState.isLocked = true;
    worldTrackingState.persistentGroup = persistentGroup;
    
    console.log('%c✨ Objects locked in world space!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    console.log('📦 Persistent group created with world position');
    
    // Show success indicator
    if (typeof updateThrowIndicator !== 'undefined') {
        updateThrowIndicator('✅ Bins anchored!', 'rgba(76, 175, 80, 0.9)');
    }
    
    // Show recenter button for future adjustments
    setTimeout(() => {
        showRecenterButton();
    }, 2000);
}

// ==========================================
// CLONE MARKER CONTENTS
// ==========================================
function cloneMarkerContents(sourceMarker, targetGroup) {
    console.log('📋 Cloning marker contents...');
    
    // Get all children from marker (except specific exclusions)
    const children = Array.from(sourceMarker.children);
    
    children.forEach(child => {
        // Skip cloning certain elements
        if (child.id === 'trash-display') return;
        
        // Clone the element
        const clone = child.cloneNode(true);
        
        // Preserve local transform
        if (child.object3D) {
            clone.object3D.position.copy(child.object3D.position);
            clone.object3D.rotation.copy(child.object3D.rotation);
            clone.object3D.scale.copy(child.object3D.scale);
        }
        
        // Add to persistent group
        targetGroup.appendChild(clone);
        
        console.log('  ✓ Cloned:', child.tagName, child.className || '');
    });
    
    console.log('✅ All objects cloned to world space');
}

// ==========================================
// RECENTER FUNCTIONALITY
// ==========================================
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
    
    // Remove old persistent group
    if (worldTrackingState.persistentGroup) {
        worldTrackingState.persistentGroup.parentNode.removeChild(worldTrackingState.persistentGroup);
    }
    
    // Show marker again temporarily
    worldTrackingState.markerEl.object3D.visible = true;
    
    // Reset state
    worldTrackingState.hasSpawned = false;
    worldTrackingState.isLocked = false;
    worldTrackingState.persistentGroup = null;
    
    // Respawn at new location
    setTimeout(() => {
        spawnAndLockObjects();
        if (typeof updateThrowIndicator !== 'undefined') {
            updateThrowIndicator('✅ Position updated!', 'rgba(76, 175, 80, 0.9)');
        }
    }, 100);
}

// ==========================================
// UTILITY: Get reference to persistent objects
// ==========================================
function getPersistentObjectsContainer() {
    if (worldTrackingState.isLocked && worldTrackingState.persistentGroup) {
        return worldTrackingState.persistentGroup;
    }
    // Fallback to marker if not locked yet
    return worldTrackingState.markerEl;
}

// ==========================================
// UTILITY: Show/Hide throw hint
// ==========================================
function showThrowHint() {
    // Handled by game.js
}

function hideThrowHint() {
    // Handled by game.js
}

// ==========================================
// EXPORT FOR USE IN OTHER MODULES
// ==========================================
window.worldTrackingState = worldTrackingState;
window.initWorldAnchorSystem = initWorldAnchorSystem;
window.getPersistentObjectsContainer = getPersistentObjectsContainer;
window.recenterObjects = recenterObjects;
