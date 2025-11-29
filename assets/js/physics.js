/* filepath: d:\semester 7\Realitas X\final project\js\physics.js */
// Physics Configuration
const THROW_CONFIG = {
    power: 4.5,
    angle: 45,
    ballRadius: 0.05,
    ballMass: 0.2,
    linearDamping: 0.01,
    angularDamping: 0.01,
    lifespan: 5000 // ms
};

function createPaperBall() {
    console.log('🎾 Creating paper ball...');
    
    const marker = document.querySelector('#marker');
    if (!marker) {
        console.error('❌ Marker not found!');
        return null;
    }
    
    const ball = document.createElement('a-sphere');
    
    // Set ball properties
    ball.setAttribute('radius', THROW_CONFIG.ballRadius);
    ball.setAttribute('color', '#f4f4f4');
    ball.setAttribute('shadow', 'cast: true');
    ball.setAttribute('metalness', '0.2');
    ball.setAttribute('roughness', '0.8');
    ball.setAttribute('position', '0 -0.3 -0.8');
    
    // Add physics body
    ball.setAttribute('dynamic-body', {
        shape: 'sphere',
        mass: THROW_CONFIG.ballMass,
        linearDamping: THROW_CONFIG.linearDamping,
        angularDamping: THROW_CONFIG.angularDamping
    });
    
    marker.appendChild(ball);
    console.log('✅ Ball added to scene');
    
    // Apply throw force after physics loads
    ball.addEventListener('body-loaded', function() {
        console.log('⚙️ Physics body loaded');
        setTimeout(() => {
            applyThrowForce(ball);
        }, 50);
    });
    
    // Collision detection
    ball.addEventListener('collide', function(e) {
        handleBallCollision(ball, e);
    });
    
    // Auto-remove ball after lifespan
    setTimeout(() => {
        if (ball.parentNode) {
            console.log('🗑️ Removing old ball');
            ball.parentNode.removeChild(ball);
        }
    }, THROW_CONFIG.lifespan);
    
    return ball;
}

function applyThrowForce(ball) {
    if (!ball.body) return;
    
    // Lemparan parabolik
    const forceX = (Math.random() - 0.5) * 0.5;
    const forceY = THROW_CONFIG.power * 0.8;
    const forceZ = THROW_CONFIG.power * 1.2;
    
    const impulse = new CANNON.Vec3(forceX, forceY, forceZ);
    const worldPoint = new CANNON.Vec3(0, 0, 0);
    
    ball.body.applyImpulse(impulse, worldPoint);
    console.log('🚀 Ball thrown!');
    
    // Add spin
    ball.body.angularVelocity.set(
        Math.random() * 8 - 4,
        Math.random() * 8 - 4,
        Math.random() * 8 - 4
    );
}

function handleBallCollision(ball, event) {
    const collidedEl = event.detail.body.el;
    
    if (collidedEl && collidedEl.classList.contains('goal-zone')) {
        const binType = collidedEl.getAttribute('data-bin-type');
        console.log('🎯 GOAL! Scored in:', binType);
        
        updateScore(10);
        updateThrowIndicator('🎉 MASUK! +10 Poin!', 'rgba(76, 175, 80, 0.9)');
        ball.setAttribute('color', '#4CAF50');
        
        setTimeout(() => {
            if (ball.parentNode) ball.parentNode.removeChild(ball);
        }, 1000);
    }
}