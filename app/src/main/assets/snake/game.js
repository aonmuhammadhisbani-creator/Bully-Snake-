// BULLY SNAKE - Full-Featured 2D Glowing Neon Arcade Game

(function() {
    'use strict';

    // 10 Unique Snake Skins
    const SKINS = [
        {
            id: 'skin_1',
            name: 'Neon Green',
            theme: 'Classic Venom',
            cost: 0,
            headColor: '#10b981',
            bodyColor1: '#059669',
            bodyColor2: '#34d399',
            eyeColor: '#38bdf8',
            glowColor: 'rgba(16, 185, 129, 0.8)',
            accent: '#6ee7b7'
        },
        {
            id: 'skin_2',
            name: 'Cyber Blue',
            theme: 'Pulse Grid',
            cost: 100,
            headColor: '#0284c7',
            bodyColor1: '#0369a1',
            bodyColor2: '#38bdf8',
            eyeColor: '#ffffff',
            glowColor: 'rgba(56, 189, 248, 0.85)',
            accent: '#7dd3fc'
        },
        {
            id: 'skin_3',
            name: 'Lava Red',
            theme: 'Magma Core',
            cost: 200,
            headColor: '#ef4444',
            bodyColor1: '#b91c1c',
            bodyColor2: '#f97316',
            eyeColor: '#fef08a',
            glowColor: 'rgba(239, 68, 68, 0.85)',
            accent: '#fbbf24'
        },
        {
            id: 'skin_4',
            name: 'Golden Dragon',
            theme: 'Imperial Gold',
            cost: 300,
            headColor: '#eab308',
            bodyColor1: '#ca8a04',
            bodyColor2: '#fde047',
            eyeColor: '#ef4444',
            glowColor: 'rgba(234, 179, 8, 0.9)',
            accent: '#fef08a'
        },
        {
            id: 'skin_5',
            name: 'Shadow Viper',
            theme: 'Dark Nebula',
            cost: 400,
            headColor: '#7c3aed',
            bodyColor1: '#4c1d95',
            bodyColor2: '#a78bfa',
            eyeColor: '#ec4899',
            glowColor: 'rgba(124, 58, 237, 0.85)',
            accent: '#c4b5fd'
        },
        {
            id: 'skin_6',
            name: 'Electric Violet',
            theme: 'Storm Surge',
            cost: 500,
            headColor: '#d946ef',
            bodyColor1: '#a21caf',
            bodyColor2: '#f472b6',
            eyeColor: '#38bdf8',
            glowColor: 'rgba(217, 70, 239, 0.85)',
            accent: '#fbcfe8'
        },
        {
            id: 'skin_7',
            name: 'Toxic Acid',
            theme: 'Radioactive',
            cost: 600,
            headColor: '#84cc16',
            bodyColor1: '#4d7c0f',
            bodyColor2: '#a3e635',
            eyeColor: '#facc15',
            glowColor: 'rgba(132, 204, 22, 0.9)',
            accent: '#bef264'
        },
        {
            id: 'skin_8',
            name: 'Arctic Frost',
            theme: 'Glacial Ice',
            cost: 700,
            headColor: '#e0f2fe',
            bodyColor1: '#38bdf8',
            bodyColor2: '#bae6fd',
            eyeColor: '#0284c7',
            glowColor: 'rgba(186, 230, 253, 0.9)',
            accent: '#ffffff'
        },
        {
            id: 'skin_9',
            name: 'Rainbow Prism',
            theme: 'Chroma Flow',
            cost: 800,
            isRainbow: true,
            headColor: '#f43f5e',
            bodyColor1: '#8b5cf6',
            bodyColor2: '#06b6d4',
            eyeColor: '#ffffff',
            glowColor: 'rgba(244, 63, 94, 0.85)',
            accent: '#facc15'
        },
        {
            id: 'skin_10',
            name: 'Cosmic Overlord',
            theme: 'Starfire Bully',
            cost: 1000,
            isCosmic: true,
            headColor: '#fb7185',
            bodyColor1: '#6366f1',
            bodyColor2: '#ec4899',
            eyeColor: '#fef08a',
            glowColor: 'rgba(251, 113, 133, 0.95)',
            accent: '#ffffff'
        }
    ];

    // Environment Themes for Unlimited Rounds
    const THEMES = [
        { name: 'Cyber Neon', bg: '#080d1a', grid: 'rgba(56, 189, 248, 0.08)', border: '#0284c7' },
        { name: 'Mystic Jungle', bg: '#06130d', grid: 'rgba(16, 185, 129, 0.08)', border: '#10b981' },
        { name: 'Magma Volcano', bg: '#160808', grid: 'rgba(239, 68, 68, 0.08)', border: '#ef4444' },
        { name: 'Desert Mirage', bg: '#171206', grid: 'rgba(234, 179, 8, 0.08)', border: '#eab308' },
        { name: 'Deep Abyss', bg: '#041019', grid: 'rgba(6, 182, 212, 0.08)', border: '#06b6d4' },
        { name: 'Toxic Wasteland', bg: '#0e1505', grid: 'rgba(132, 204, 22, 0.08)', border: '#84cc16' },
        { name: 'Night City', bg: '#0d071a', grid: 'rgba(168, 85, 247, 0.08)', border: '#a855f7' }
    ];

    // Grid Dimensions
    const COLS = 22;
    const ROWS = 22;

    // Game State
    const state = {
        score: 0,
        highScore: 0,
        diamonds: 0,
        diamondsThisRun: 0,
        round: 1,
        roundScore: 0,
        roundTarget: 20, // 20 pts per round to advance
        lastMilestoneScore: 0,
        unlockedSkins: ['skin_1'],
        equippedSkinId: 'skin_1',
        isPlaying: false,
        isPaused: false,
        isGameOver: false,
        speed: 120, // ms per tick
        lastTickTime: 0,
        controlMode: 'joystick' // 'joystick' | 'dpad'
    };

    // Snake Body & Direction
    let snake = [];
    let currentDir = { x: 0, y: -1 };
    let inputQueue = [];

    // Items
    let food = null; // { x, y, type: 'apple' | 'banana' | 'cherry' }
    let diamondItem = null; // { x, y, pulse: 0 }
    let obstacles = []; // array of { x, y, type: 'tree' | 'log' | 'rock' }

    // Visual Effects
    let particles = [];
    let teleportPortals = []; // { x, y, color, life, maxLife }

    // Canvas & Context
    let canvas, ctx;
    let cellSize = 20;

    // DOM Elements Cache
    const dom = {
        splashAon: document.getElementById('splash-aon'),
        splashBully: document.getElementById('splash-bully'),
        menuScreen: document.getElementById('menu-screen'),
        gameplayScreen: document.getElementById('gameplay-screen'),
        shopScreen: document.getElementById('shop-screen'),
        settingsModal: document.getElementById('settings-modal'),
        gameOverModal: document.getElementById('game-over-modal'),
        pauseModal: document.getElementById('pause-modal'),

        // HUD Elements
        menuDiamonds: document.getElementById('menu-diamonds-val'),
        menuHighScore: document.getElementById('menu-high-score-val'),
        gameScore: document.getElementById('game-score-val'),
        gameDiamonds: document.getElementById('game-diamonds-val'),
        gameRound: document.getElementById('game-round-val'),
        gameTheme: document.getElementById('game-theme-name'),
        shopDiamonds: document.getElementById('shop-diamonds-val'),
        shopGrid: document.getElementById('shop-grid-container'),

        // Game Over
        finalScore: document.getElementById('final-score-val'),
        finalHighScore: document.getElementById('final-high-score-val'),
        finalDiamonds: document.getElementById('final-diamonds-val'),
        finalRound: document.getElementById('final-round-val'),

        // Controls
        joystickZone: document.getElementById('joystick-zone'),
        joystickKnob: document.getElementById('joystick-knob'),
        dpadContainer: document.getElementById('dpad-container'),

        // Settings
        sliderBgm: document.getElementById('slider-bgm'),
        sliderSfx: document.getElementById('slider-sfx'),
        btnToggleBgm: document.getElementById('btn-toggle-bgm'),
        btnToggleSfx: document.getElementById('btn-toggle-sfx')
    };

    // Persistence with Native Bridge & LocalStorage
    function loadSavedData() {
        try {
            if (window.AndroidBridge) {
                state.highScore = parseInt(window.AndroidBridge.getHighScore(), 10) || 0;
                state.diamonds = parseInt(window.AndroidBridge.getDiamonds(), 10) || 0;
                const skinsRaw = window.AndroidBridge.getSkins();
                if (skinsRaw) state.unlockedSkins = JSON.parse(skinsRaw);
                const eq = window.AndroidBridge.getEquippedSkin();
                if (eq) state.equippedSkinId = eq;
            } else {
                state.highScore = parseInt(localStorage.getItem('bully_high_score'), 10) || 0;
                state.diamonds = parseInt(localStorage.getItem('bully_diamonds'), 10) || 0;
                const savedSkins = localStorage.getItem('bully_unlocked_skins');
                if (savedSkins) state.unlockedSkins = JSON.parse(savedSkins);
                const eq = localStorage.getItem('bully_equipped_skin');
                if (eq) state.equippedSkinId = eq;
            }
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
        updateCurrencyDisplays();
    }

    function saveHighScore(score) {
        if (score > state.highScore) {
            state.highScore = score;
            try {
                localStorage.setItem('bully_high_score', score);
                if (window.AndroidBridge) window.AndroidBridge.saveHighScore(score);
            } catch (e) {}
            if (dom.menuHighScore) dom.menuHighScore.textContent = score;
            return true;
        }
        return false;
    }

    function addDiamonds(amount) {
        state.diamonds += amount;
        state.diamondsThisRun += amount;
        try {
            localStorage.setItem('bully_diamonds', state.diamonds);
            if (window.AndroidBridge) window.AndroidBridge.saveDiamonds(state.diamonds);
        } catch (e) {}
        updateCurrencyDisplays();
    }

    function saveSkins() {
        try {
            const json = JSON.stringify(state.unlockedSkins);
            localStorage.setItem('bully_unlocked_skins', json);
            localStorage.setItem('bully_equipped_skin', state.equippedSkinId);
            if (window.AndroidBridge) {
                window.AndroidBridge.saveSkins(json);
                window.AndroidBridge.saveEquippedSkin(state.equippedSkinId);
            }
        } catch (e) {}
    }

    function updateCurrencyDisplays() {
        if (dom.menuDiamonds) dom.menuDiamonds.textContent = state.diamonds;
        if (dom.gameDiamonds) dom.gameDiamonds.textContent = state.diamondsThisRun;
        if (dom.shopDiamonds) dom.shopDiamonds.textContent = state.diamonds;
        if (dom.menuHighScore) dom.menuHighScore.textContent = state.highScore;
    }

    function triggerHaptic(type) {
        try {
            if (window.AndroidBridge && window.AndroidBridge.vibrate) {
                window.AndroidBridge.vibrate(type);
            } else if (navigator.vibrate) {
                if (type === 'eat') navigator.vibrate(25);
                else if (type === 'diamond') navigator.vibrate([20, 25, 40]);
                else if (type === 'turn') navigator.vibrate(10);
                else if (type === 'button') navigator.vibrate(15);
                else if (type === 'crash') navigator.vibrate([60, 40, 120]);
            }
        } catch (e) {}
    }

    let splashCompleted = false;

    // Splash Screens Sequence
    function initSplashSequence() {
        // Splash 1: "Aon" for 1.8s
        setTimeout(() => {
            if (splashCompleted) return;
            if (dom.splashAon) dom.splashAon.classList.add('hidden');
            if (dom.splashBully) dom.splashBully.classList.remove('hidden');

            // Splash 2: "BULLY SNAKE" for 2.0s
            setTimeout(() => {
                goToMainMenu();
            }, 2000);
        }, 1800);

        // Allow instant tap to skip splash
        const skipSplash = () => {
            goToMainMenu();
            window.removeEventListener('pointerdown', skipSplash);
        };
        window.addEventListener('pointerdown', skipSplash, { once: true });
    }

    function goToMainMenu() {
        if (splashCompleted) return;
        splashCompleted = true;
        if (dom.splashAon) dom.splashAon.classList.add('hidden');
        if (dom.splashBully) dom.splashBully.classList.add('hidden');
        if (dom.gameplayScreen) dom.gameplayScreen.classList.add('hidden');
        if (dom.shopScreen) dom.shopScreen.classList.add('hidden');
        if (dom.settingsModal) dom.settingsModal.classList.add('hidden');
        if (dom.gameOverModal) dom.gameOverModal.classList.add('hidden');
        if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
        if (dom.menuScreen) dom.menuScreen.classList.remove('hidden');

        updateCurrencyDisplays();
        if (window.soundController) window.soundController.stopBgm();
    }

    // Canvas Setup
    function initCanvas() {
        canvas = document.getElementById('game-canvas');
        if (canvas) {
            ctx = canvas.getContext('2d');
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        setTimeout(resizeCanvas, 100);
        setTimeout(resizeCanvas, 400);
    }

    function resizeCanvas() {
        if (!canvas) canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        if (!ctx) ctx = canvas.getContext('2d');

        const wrapper = document.getElementById('game-canvas-wrapper');
        const w = (wrapper && wrapper.clientWidth > 0) ? wrapper.clientWidth : (window.innerWidth || 360);
        const h = (wrapper && wrapper.clientHeight > 0) ? wrapper.clientHeight : (window.innerHeight || 640);
        const minDim = Math.max(Math.min(w * 0.96, h * 0.72, 600), 220);

        cellSize = Math.max(Math.floor(minDim / COLS), 10);
        canvas.width = cellSize * COLS;
        canvas.height = cellSize * ROWS;
    }

    // Unlimited Round System: Obstacles & Theme
    function setupRound(roundNumber) {
        state.round = roundNumber;
        state.roundScore = 0;
        state.roundTarget = 20 + (roundNumber - 1) * 10;

        // Theme
        const themeIndex = (roundNumber - 1) % THEMES.length;
        const theme = THEMES[themeIndex];
        if (dom.gameRound) dom.gameRound.textContent = roundNumber;
        if (dom.gameTheme) dom.gameTheme.textContent = theme.name;

        // Obstacles: Round 1 has 0 obstacles. Round 2+ has obstacles!
        obstacles = [];
        if (roundNumber >= 2) {
            const obstacleCount = Math.min(2 + (roundNumber - 1) * 2, 16);
            const types = ['tree', 'log', 'rock'];

            for (let i = 0; i < obstacleCount; i++) {
                let ox, oy, occupied;
                let attempts = 0;
                do {
                    ox = Math.floor(Math.random() * (COLS - 4)) + 2;
                    oy = Math.floor(Math.random() * (ROWS - 4)) + 2;
                    occupied = false;

                    // Avoid snake spawn center
                    if (Math.abs(ox - Math.floor(COLS / 2)) < 3 && Math.abs(oy - Math.floor(ROWS / 2)) < 3) {
                        occupied = true;
                    }
                    // Check other obstacles
                    for (let obs of obstacles) {
                        if (obs.x === ox && obs.y === oy) {
                            occupied = true;
                            break;
                        }
                    }
                    attempts++;
                } while (occupied && attempts < 100);

                if (!occupied) {
                    const type = types[Math.floor(Math.random() * types.length)];
                    obstacles.push({ x: ox, y: oy, type });
                }
            }
        }

        // Spawn first food & check diamond
        spawnFood();
        checkMilestoneDiamond();
    }

    // Food Spawning
    function spawnFood() {
        const types = ['apple', 'banana', 'cherry'];
        const rand = Math.random();
        let selectedType = 'apple';
        if (rand > 0.85) selectedType = 'cherry';
        else if (rand > 0.55) selectedType = 'banana';

        let fx, fy, occupied;
        let attempts = 0;
        do {
            fx = Math.floor(Math.random() * COLS);
            fy = Math.floor(Math.random() * ROWS);
            occupied = false;

            for (let s of snake) {
                if (s.x === fx && s.y === fy) {
                    occupied = true;
                    break;
                }
            }
            if (!occupied) {
                for (let o of obstacles) {
                    if (o.x === fx && o.y === fy) {
                        occupied = true;
                        break;
                    }
                }
            }
            if (!occupied && diamondItem && diamondItem.x === fx && diamondItem.y === fy) {
                occupied = true;
            }
            attempts++;
        } while (occupied && attempts < 100);

        food = { x: fx, y: fy, type: selectedType, pulse: 0 };
    }

    // Special Diamond Item Spawning
    function spawnDiamond() {
        let dx, dy, occupied;
        let attempts = 0;
        do {
            dx = Math.floor(Math.random() * COLS);
            dy = Math.floor(Math.random() * ROWS);
            occupied = false;

            for (let s of snake) {
                if (s.x === dx && s.y === dy) {
                    occupied = true;
                    break;
                }
            }
            if (!occupied) {
                for (let o of obstacles) {
                    if (o.x === dx && o.y === dy) {
                        occupied = true;
                        break;
                    }
                }
            }
            if (!occupied && food && food.x === dx && food.y === dy) {
                occupied = true;
            }
            attempts++;
        } while (occupied && attempts < 100);

        if (!occupied) {
            diamondItem = { x: dx, y: dy, pulse: 0 };
            spawnSparkles(dx * cellSize + cellSize / 2, dy * cellSize + cellSize / 2, '#38bdf8', 15);
        }
    }

    function checkMilestoneDiamond() {
        // "Every 20 score points achieved triggers a guaranteed Diamond spawn"
        if (state.score >= state.lastMilestoneScore + 20) {
            state.lastMilestoneScore = Math.floor(state.score / 20) * 20;
            if (!diamondItem) {
                spawnDiamond();
            }
        }
    }

    // Start New Game
    function startGame() {
        state.score = 0;
        state.diamondsThisRun = 0;
        state.round = 1;
        state.roundScore = 0;
        state.lastMilestoneScore = 0;
        state.isPlaying = true;
        state.isPaused = false;
        state.isGameOver = false;
        state.speed = 120;
        state.lastTickTime = performance.now();

        // Initial Snake Segments (Center)
        const cx = Math.floor(COLS / 2);
        const cy = Math.floor(ROWS / 2);
        snake = [
            { x: cx, y: cy },
            { x: cx, y: cy + 1 },
            { x: cx, y: cy + 2 }
        ];

        currentDir = { x: 0, y: -1 };
        inputQueue = [];
        diamondItem = null;
        particles = [];
        teleportPortals = [];

        // Screens transition
        if (dom.menuScreen) dom.menuScreen.classList.add('hidden');
        if (dom.gameOverModal) dom.gameOverModal.classList.add('hidden');
        if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
        if (dom.gameplayScreen) dom.gameplayScreen.classList.remove('hidden');

        if (dom.gameScore) dom.gameScore.textContent = '0';
        updateCurrencyDisplays();

        // Initialize Round 1
        setupRound(1);

        // Start BGM
        if (window.soundController) window.soundController.startBgm();
    }

    // Direction & Input
    function setDirection(newDir) {
        if (!state.isPlaying || state.isPaused || state.isGameOver) return;

        const last = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : currentDir;
        // Prevent 180° instant turn into self
        if (newDir.x !== 0 && last.x !== 0) return;
        if (newDir.y !== 0 && last.y !== 0) return;

        if (inputQueue.length < 2) {
            inputQueue.push(newDir);
            if (window.soundController) window.soundController.playTurn();
            triggerHaptic('turn');
        }
    }

    // Game Loop Tick
    function tick() {
        if (!state.isPlaying || state.isPaused || state.isGameOver) return;

        if (inputQueue.length > 0) {
            currentDir = inputQueue.shift();
        }

        const head = snake[0];
        let nextX = head.x + currentDir.x;
        let nextY = head.y + currentDir.y;

        // SCREEN WRAP / TUNNEL TELEPORTATION MECHANIC
        let didTeleport = false;
        if (nextX < 0) {
            nextX = COLS - 1;
            didTeleport = true;
        } else if (nextX >= COLS) {
            nextX = 0;
            didTeleport = true;
        }

        if (nextY < 0) {
            nextY = ROWS - 1;
            didTeleport = true;
        } else if (nextY >= ROWS) {
            nextY = 0;
            didTeleport = true;
        }

        if (didTeleport) {
            if (window.soundController) window.soundController.playTeleport();
            // Teleport Portal Visual Effect
            teleportPortals.push({
                fromX: head.x, fromY: head.y,
                toX: nextX, toY: nextY,
                life: 0.35, maxLife: 0.35
            });
        }

        // Self-Collision Check
        for (let i = 0; i < snake.length - 1; i++) {
            if (snake[i].x === nextX && snake[i].y === nextY) {
                triggerGameOver('Ran into your own body!');
                return;
            }
        }

        // Obstacle Collision Check
        for (let obs of obstacles) {
            if (obs.x === nextX && obs.y === nextY) {
                triggerGameOver(`Crashed into a ${obs.type}!`);
                return;
            }
        }

        // Advance Snake Head
        const newHead = { x: nextX, y: nextY };
        snake.unshift(newHead);

        // Check Food Collision
        let ateFood = false;
        if (food && nextX === food.x && nextY === food.y) {
            ateFood = true;
            handleEatFood();
        }

        // Check Diamond Collision
        if (diamondItem && nextX === diamondItem.x && nextY === diamondItem.y) {
            handleEatDiamond();
        }

        if (!ateFood) {
            snake.pop(); // Remove tail
        }

        // Random chance of extra spontaneous Diamond spawn
        if (!diamondItem && Math.random() < 0.035) {
            spawnDiamond();
        }
    }

    function handleEatFood() {
        let pts = 10;
        if (food.type === 'banana') pts = 15;
        if (food.type === 'cherry') pts = 25;

        state.score += pts;
        state.roundScore += pts;
        if (dom.gameScore) dom.gameScore.textContent = state.score;

        if (window.soundController) window.soundController.playEatFruit(food.type);
        triggerHaptic('eat');

        // Food Burst Particles
        const px = food.x * cellSize + cellSize / 2;
        const py = food.y * cellSize + cellSize / 2;
        const color = food.type === 'banana' ? '#facc15' : (food.type === 'cherry' ? '#ec4899' : '#ef4444');
        spawnBurstParticles(px, py, color, 20);

        // Check Guaranteed 20-Point Diamond Milestone
        checkMilestoneDiamond();

        // Check Round Advancement (Unlimited Round System)
        if (state.roundScore >= state.roundTarget) {
            advanceRound();
        } else {
            spawnFood();
        }
    }

    function handleEatDiamond() {
        addDiamonds(1);
        if (window.soundController) window.soundController.playEatDiamond();
        triggerHaptic('diamond');

        const px = diamondItem.x * cellSize + cellSize / 2;
        const py = diamondItem.y * cellSize + cellSize / 2;
        spawnBurstParticles(px, py, '#38bdf8', 30);
        diamondItem = null;
    }

    function advanceRound() {
        if (window.soundController) window.soundController.playRoundClear();
        state.round++;
        state.speed = Math.max(70, 120 - (state.round - 1) * 5); // Speed gradually ramps up
        setupRound(state.round);

        // Celebration Sparkles
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                spawnBurstParticles(canvas.width / 2 + (Math.random() - 0.5) * 200, canvas.height / 2 + (Math.random() - 0.5) * 200, '#10b981', 25);
            }, i * 120);
        }
    }

    function triggerGameOver(reason) {
        state.isGameOver = true;
        state.isPlaying = false;

        if (window.soundController) window.soundController.playGameOver();
        triggerHaptic('crash');

        // Death Explosion
        const head = snake[0];
        spawnBurstParticles(head.x * cellSize + cellSize / 2, head.y * cellSize + cellSize / 2, '#ef4444', 50);

        // Save High Score
        const isNewRecord = saveHighScore(state.score);

        // Populate Modal
        if (dom.finalScore) dom.finalScore.textContent = state.score;
        if (dom.finalHighScore) dom.finalHighScore.textContent = state.highScore;
        if (dom.finalDiamonds) dom.finalDiamonds.textContent = `+${state.diamondsThisRun}`;
        if (dom.finalRound) dom.finalRound.textContent = `Round ${state.round}`;

        const badge = document.getElementById('gameover-new-record');
        if (badge) badge.style.display = isNewRecord ? 'inline-block' : 'none';

        setTimeout(() => {
            if (dom.gameOverModal) dom.gameOverModal.classList.remove('hidden');
        }, 500);
    }

    function togglePause() {
        if (!state.isPlaying || state.isGameOver) return;
        state.isPaused = !state.isPaused;

        if (state.isPaused) {
            if (dom.pauseModal) dom.pauseModal.classList.remove('hidden');
            if (window.soundController) window.soundController.stopBgm();
        } else {
            if (dom.pauseModal) dom.pauseModal.classList.add('hidden');
            state.lastTickTime = performance.now();
            if (window.soundController) window.soundController.startBgm();
        }
    }

    // Particle Systems
    function spawnBurstParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4.5;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2.5 + Math.random() * 3.5,
                color,
                life: 0.6 + Math.random() * 0.4,
                maxLife: 1.0
            });
        }
    }

    function spawnSparkles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 14;
            particles.push({
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2.0 - 0.5,
                size: 2.0 + Math.random() * 2.0,
                color,
                life: 0.5 + Math.random() * 0.3,
                maxLife: 0.8
            });
        }
    }

    function updateParticles(delta) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= delta;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.94;
            p.vy *= 0.94;
        }

        for (let i = teleportPortals.length - 1; i >= 0; i--) {
            teleportPortals[i].life -= delta;
            if (teleportPortals[i].life <= 0) {
                teleportPortals.splice(i, 1);
            }
        }
    }

    // RENDER ENGINE (HTML5 Canvas 2D Glowing Neon Graphics)
    function render() {
        if (!ctx || !canvas || canvas.width <= 0 || canvas.height <= 0 || cellSize <= 0) return;

        const themeIndex = (state.round - 1) % THEMES.length;
        const theme = THEMES[themeIndex] || THEMES[0];

        // Clear Canvas with Theme Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Glowing Subtle Grid Lines (Safe step guaranteed >= 10)
        const step = Math.max(cellSize, 10);
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();

        // Draw Screen Wrap Glowing Border / Tunnel Portal Rails
        ctx.save();
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = theme.border;
        ctx.shadowBlur = 10;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        ctx.restore();

        // Draw Teleport Warp Rings
        for (let tp of teleportPortals) {
            const alpha = tp.life / tp.maxLife;
            ctx.save();
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 15;
            const r = (1 - alpha) * cellSize * 1.5;
            ctx.beginPath();
            ctx.arc(tp.fromX * cellSize + cellSize / 2, tp.fromY * cellSize + cellSize / 2, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(tp.toX * cellSize + cellSize / 2, tp.toY * cellSize + cellSize / 2, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Draw Obstacles (Trees, Logs, Rocks)
        drawObstacles();

        // Draw Food (Apple, Banana, Cherry)
        drawFood();

        // Draw Special Diamond Item
        drawDiamond();

        // Draw Snake
        drawSnake();

        // Draw Particles
        drawParticles();
    }

    // Draw Obstacles
    function drawObstacles() {
        for (let obs of obstacles) {
            const cx = obs.x * cellSize + cellSize / 2;
            const cy = obs.y * cellSize + cellSize / 2;
            const r = cellSize * 0.42;

            ctx.save();
            if (obs.type === 'tree') {
                // Glowing Tree Canopy
                ctx.fillStyle = '#065f46';
                ctx.shadowColor = '#10b981';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.arc(cx - 2, cy - 2, r * 0.65, 0, Math.PI * 2);
                ctx.fill();

                // Tree Trunk Core
                ctx.fillStyle = '#78350f';
                ctx.fillRect(cx - 2.5, cy - 2.5, 5, 5);
            } else if (obs.type === 'log') {
                // Wooden Log with Glowing Rings
                ctx.fillStyle = '#78350f';
                ctx.shadowColor = '#b45309';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.roundRect(cx - r, cy - r * 0.6, r * 2, r * 1.2, 4);
                ctx.fill();

                ctx.strokeStyle = '#d97706';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(cx, cy, r * 0.6, r * 0.35, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // Chiseled Glowing Rock
                ctx.fillStyle = '#334155';
                ctx.shadowColor = '#94a3b8';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(cx, cy - r);
                ctx.lineTo(cx + r, cy - r * 0.3);
                ctx.lineTo(cx + r * 0.7, cy + r);
                ctx.lineTo(cx - r * 0.7, cy + r * 0.8);
                ctx.lineTo(cx - r, cy - r * 0.2);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    // Draw Food
    function drawFood() {
        if (!food) return;

        const cx = food.x * cellSize + cellSize / 2;
        const cy = food.y * cellSize + cellSize / 2;
        const pulse = 1.0 + Math.sin(Date.now() * 0.008) * 0.08;

        ctx.save();
        if (food.type === 'apple') {
            // Glowing Apple
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(cx, cy + 1, cellSize * 0.38 * pulse, 0, Math.PI * 2);
            ctx.fill();

            // Specular shine
            ctx.fillStyle = '#fca5a5';
            ctx.beginPath();
            ctx.arc(cx - 2.5, cy - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Leaf
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.ellipse(cx + 3, cy - cellSize * 0.35, 3.5, 1.8, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (food.type === 'banana') {
            // Glowing Banana
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 14;
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = cellSize * 0.28 * pulse;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(cx, cy - cellSize * 0.1, cellSize * 0.35, 0.2, Math.PI * 0.85);
            ctx.stroke();

            // Tips
            ctx.fillStyle = '#713f12';
            ctx.fillRect(cx - cellSize * 0.35, cy + 1, 2.5, 2.5);
        } else {
            // Twin Cherries
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 14;

            // Stems
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx - 3, cy + 2);
            ctx.quadraticCurveTo(cx - 1, cy - cellSize * 0.35, cx + 2, cy - cellSize * 0.35);
            ctx.moveTo(cx + 3, cy + 1);
            ctx.quadraticCurveTo(cx + 2, cy - cellSize * 0.35, cx + 2, cy - cellSize * 0.35);
            ctx.stroke();

            // Cherries
            ctx.fillStyle = '#be185d';
            ctx.beginPath();
            ctx.arc(cx - 3.5, cy + 2, cellSize * 0.25 * pulse, 0, Math.PI * 2);
            ctx.arc(cx + 3.5, cy + 1.5, cellSize * 0.25 * pulse, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // Draw Special Diamond
    function drawDiamond() {
        if (!diamondItem) return;

        const cx = diamondItem.x * cellSize + cellSize / 2;
        const cy = diamondItem.y * cellSize + cellSize / 2;
        const pulse = 1.0 + Math.sin(Date.now() * 0.012) * 0.14;
        const r = cellSize * 0.44 * pulse;

        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;

        // Diamond Hex/Facet Shape
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r * 0.8, cy - r * 0.3);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r * 0.8, cy - r * 0.3);
        ctx.closePath();
        ctx.fill();

        // Inner Bright Facets
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r * 0.5, cy - r * 0.3);
        ctx.lineTo(cx, cy + r * 0.5);
        ctx.lineTo(cx - r * 0.5, cy - r * 0.3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy - r * 0.3, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Draw Snake with Active Equipped Skin
    function drawSnake() {
        if (!snake || snake.length === 0) return;

        const skin = SKINS.find(s => s.id === state.equippedSkinId) || SKINS[0];
        const time = Date.now() * 0.005;

        // Draw Body Segments (from tail to neck)
        for (let i = snake.length - 1; i >= 1; i--) {
            const seg = snake[i];
            const cx = seg.x * cellSize + cellSize / 2;
            const cy = seg.y * cellSize + cellSize / 2;
            const radius = (cellSize * 0.44) * (1 - (i / snake.length) * 0.25);

            ctx.save();
            ctx.shadowColor = skin.glowColor;
            ctx.shadowBlur = 8;

            let segColor = i % 2 === 0 ? skin.bodyColor1 : skin.bodyColor2;
            if (skin.isRainbow) {
                const hue = (time * 60 + i * 20) % 360;
                segColor = `hsl(${hue}, 90%, 55%)`;
                ctx.shadowColor = segColor;
            } else if (skin.isCosmic) {
                const hue = (280 + Math.sin(time + i * 0.3) * 60) % 360;
                segColor = `hsl(${hue}, 85%, 60%)`;
                ctx.shadowColor = '#ec4899';
            }

            ctx.fillStyle = segColor;
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(radius, 4), 0, Math.PI * 2);
            ctx.fill();

            // Inner Neon Spine Accent
            ctx.fillStyle = skin.accent;
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(radius * 0.35, 1.5), 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Draw Snake Head
        const head = snake[0];
        const hx = head.x * cellSize + cellSize / 2;
        const hy = head.y * cellSize + cellSize / 2;
        const headR = cellSize * 0.48;

        ctx.save();
        ctx.shadowColor = skin.glowColor;
        ctx.shadowBlur = 18;

        let headColor = skin.headColor;
        if (skin.isRainbow) {
            headColor = `hsl(${(time * 60) % 360}, 95%, 60%)`;
            ctx.shadowColor = headColor;
        }

        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(hx, hy, headR, 0, Math.PI * 2);
        ctx.fill();

        // Snake Eyes
        const eyeOffset = headR * 0.55;
        let leftEyeX = hx, leftEyeY = hy;
        let rightEyeX = hx, rightEyeY = hy;

        if (currentDir.x === 1) { // Right
            leftEyeX = hx + eyeOffset * 0.4; leftEyeY = hy - eyeOffset;
            rightEyeX = hx + eyeOffset * 0.4; rightEyeY = hy + eyeOffset;
        } else if (currentDir.x === -1) { // Left
            leftEyeX = hx - eyeOffset * 0.4; leftEyeY = hy - eyeOffset;
            rightEyeX = hx - eyeOffset * 0.4; rightEyeY = hy + eyeOffset;
        } else if (currentDir.y === 1) { // Down
            leftEyeX = hx - eyeOffset; leftEyeY = hy + eyeOffset * 0.4;
            rightEyeX = hx + eyeOffset; rightEyeY = hy + eyeOffset * 0.4;
        } else { // Up
            leftEyeX = hx - eyeOffset; leftEyeY = hy - eyeOffset * 0.4;
            rightEyeX = hx + eyeOffset; rightEyeY = hy - eyeOffset * 0.4;
        }

        ctx.fillStyle = skin.eyeColor;
        ctx.shadowColor = skin.eyeColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, 2.5, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye Pupils (Slits)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, 1.2, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Cosmic Crown / Horn if Cosmic Overlord
        if (skin.isCosmic) {
            ctx.fillStyle = '#fde047';
            ctx.shadowColor = '#facc15';
            ctx.beginPath();
            ctx.moveTo(hx, hy - headR * 1.3);
            ctx.lineTo(hx + 3, hy - headR * 0.7);
            ctx.lineTo(hx - 3, hy - headR * 0.7);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    // Draw Particles
    function drawParticles() {
        for (let p of particles) {
            const alpha = p.life / p.maxLife;
            ctx.save();
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Animation Loop
    function gameLoop(time) {
        requestAnimationFrame(gameLoop);

        const delta = Math.min((time - (gameLoop.lastTime || time)) / 1000, 0.1);
        gameLoop.lastTime = time;

        if (state.isPlaying && !state.isPaused && !state.isGameOver) {
            if (time - state.lastTickTime >= state.speed) {
                tick();
                state.lastTickTime = time;
            }
        }

        updateParticles(delta);
        render();
    }

    // ==============================================================
    // SHOP SYSTEM (10 Unique Skins)
    // ==============================================================
    function initShopUI() {
        if (!dom.shopGrid) return;
        dom.shopGrid.innerHTML = '';

        SKINS.forEach(skin => {
            const isUnlocked = state.unlockedSkins.includes(skin.id);
            const isEquipped = state.equippedSkinId === skin.id;

            const card = document.createElement('div');
            card.className = `skin-card ${isEquipped ? 'equipped' : ''}`;
            card.id = `skin-card-${skin.id}`;

            card.innerHTML = `
                ${isEquipped ? '<span class="skin-badge-equipped">EQUIPPED</span>' : ''}
                <canvas class="skin-preview-canvas" id="canvas-preview-${skin.id}" width="72" height="72"></canvas>
                <div class="skin-name">${skin.name}</div>
                <div class="skin-theme-subtitle">${skin.theme}</div>
                <button class="skin-action-btn ${isEquipped ? 'skin-btn-equipped' : (isUnlocked ? 'skin-btn-equip' : 'skin-btn-unlock')}" id="btn-action-${skin.id}">
                    ${isEquipped ? 'EQUIPPED' : (isUnlocked ? 'EQUIP' : `💎 ${skin.cost}`)}
                </button>
            `;

            dom.shopGrid.appendChild(card);

            // Draw Live Mini Preview
            setTimeout(() => {
                drawSkinPreview(skin);
            }, 20);

            // Button Event
            const btn = card.querySelector(`#btn-action-${skin.id}`);
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleSkinAction(skin);
            });
        });
    }

    function drawSkinPreview(skin) {
        const previewCanvas = document.getElementById(`canvas-preview-${skin.id}`);
        if (!previewCanvas) return;
        const pctx = previewCanvas.getContext('2d');
        const pw = previewCanvas.width;
        const ph = previewCanvas.height;

        pctx.clearRect(0, 0, pw, ph);

        // Body segments
        const segs = [
            { x: pw * 0.28, y: ph * 0.68, r: 8, col: skin.bodyColor2 },
            { x: pw * 0.44, y: ph * 0.62, r: 10, col: skin.bodyColor1 },
            { x: pw * 0.58, y: ph * 0.48, r: 11, col: skin.bodyColor2 },
            { x: pw * 0.65, y: ph * 0.32, r: 13, col: skin.headColor }
        ];

        segs.forEach((s, idx) => {
            pctx.save();
            pctx.fillStyle = s.col;
            pctx.shadowColor = skin.glowColor;
            pctx.shadowBlur = 8;
            pctx.beginPath();
            pctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            pctx.fill();

            // Accent
            pctx.fillStyle = skin.accent;
            pctx.beginPath();
            pctx.arc(s.x, s.y, s.r * 0.35, 0, Math.PI * 2);
            pctx.fill();

            // Eyes on head
            if (idx === segs.length - 1) {
                pctx.fillStyle = skin.eyeColor;
                pctx.beginPath();
                pctx.arc(s.x - 3, s.y - 2, 2.5, 0, Math.PI * 2);
                pctx.arc(s.x + 3, s.y - 4, 2.5, 0, Math.PI * 2);
                pctx.fill();
            }
            pctx.restore();
        });
    }

    function handleSkinAction(skin) {
        if (window.soundController) window.soundController.playButtonTap();
        triggerHaptic('button');

        const isUnlocked = state.unlockedSkins.includes(skin.id);

        if (isUnlocked) {
            // Equip skin
            state.equippedSkinId = skin.id;
            saveSkins();
            initShopUI();
        } else {
            // Unlock with diamonds
            if (state.diamonds >= skin.cost) {
                state.diamonds -= skin.cost;
                state.unlockedSkins.push(skin.id);
                state.equippedSkinId = skin.id;
                try {
                    localStorage.setItem('bully_diamonds', state.diamonds);
                    if (window.AndroidBridge) window.AndroidBridge.saveDiamonds(state.diamonds);
                } catch (e) {}
                saveSkins();
                updateCurrencyDisplays();
                initShopUI();
                if (window.soundController) window.soundController.playEatDiamond();
                triggerHaptic('diamond');
            } else {
                alert(`Not enough diamonds! You have ${state.diamonds} 💎, but need ${skin.cost} 💎.`);
            }
        }
    }

    // ==============================================================
    // CONTROLS & LISTENERS
    // ==============================================================
    function initControls() {
        // Keyboard (Arrow Keys & WASD)
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    setDirection({ x: 1, y: 0 });
                    break;
                case ' ':
                    e.preventDefault();
                    togglePause();
                    break;
            }
        });

        // D-Pad Touch Listeners
        const dpadBtns = document.querySelectorAll('.dpad-btn');
        dpadBtns.forEach(btn => {
            const handleDir = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const dir = btn.getAttribute('data-dir');
                if (dir === 'up') setDirection({ x: 0, y: -1 });
                if (dir === 'down') setDirection({ x: 0, y: 1 });
                if (dir === 'left') setDirection({ x: -1, y: 0 });
                if (dir === 'right') setDirection({ x: 1, y: 0 });
                btn.classList.add('pressed');
            };
            const release = () => btn.classList.remove('pressed');

            btn.addEventListener('pointerdown', handleDir);
            btn.addEventListener('pointerup', release);
            btn.addEventListener('pointercancel', release);
            btn.addEventListener('pointerleave', release);
        });

        // Virtual Joystick Touch Handling
        let touchId = null;
        let joyCenter = { x: 0, y: 0 };
        const maxRadius = 40;

        const onJoyStart = (e) => {
            if (touchId !== null) return;
            const touch = e.changedTouches ? e.changedTouches[0] : e;
            touchId = touch.identifier !== undefined ? touch.identifier : 'mouse';

            const rect = dom.joystickZone.getBoundingClientRect();
            joyCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            onJoyMove(touch.clientX, touch.clientY);
        };

        const onJoyMove = (cx, cy) => {
            const dx = cx - joyCenter.x;
            const dy = cy - joyCenter.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const clamped = Math.min(dist, maxRadius);
            const angle = Math.atan2(dy, dx);
            const kx = Math.cos(angle) * clamped;
            const ky = Math.sin(angle) * clamped;

            if (dom.joystickKnob) {
                dom.joystickKnob.style.transform = `translate(${kx}px, ${ky}px)`;
            }

            if (dist > 12) {
                const deg = (angle * 180 / Math.PI + 360) % 360;
                if (deg >= 45 && deg < 135) setDirection({ x: 0, y: 1 }); // DOWN
                else if (deg >= 135 && deg < 225) setDirection({ x: -1, y: 0 }); // LEFT
                else if (deg >= 225 && deg < 315) setDirection({ x: 0, y: -1 }); // UP
                else setDirection({ x: 1, y: 0 }); // RIGHT
            }
        };

        const onTouchMove = (e) => {
            if (touchId === null) return;
            let touch = null;
            if (e.changedTouches) {
                for (let t of e.changedTouches) {
                    if (t.identifier === touchId) { touch = t; break; }
                }
            } else if (touchId === 'mouse') {
                touch = e;
            }
            if (touch) onJoyMove(touch.clientX, touch.clientY);
        };

        const onTouchEnd = () => {
            touchId = null;
            if (dom.joystickKnob) dom.joystickKnob.style.transform = 'translate(0px, 0px)';
        };

        if (dom.joystickZone) {
            dom.joystickZone.addEventListener('touchstart', onJoyStart, { passive: false });
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);
            window.addEventListener('touchcancel', onTouchEnd);

            dom.joystickZone.addEventListener('mousedown', onJoyStart);
            window.addEventListener('mousemove', onTouchMove);
            window.addEventListener('mouseup', onTouchEnd);
        }

        // Control Mode Toggle (Stick vs D-Pad)
        const ctrlBtns = document.querySelectorAll('.ctrl-btn');
        ctrlBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                ctrlBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.getAttribute('data-mode');
                state.controlMode = mode;

                if (mode === 'joystick') {
                    if (dom.joystickZone) dom.joystickZone.style.display = 'flex';
                    if (dom.dpadContainer) dom.dpadContainer.style.display = 'none';
                } else if (mode === 'dpad') {
                    if (dom.joystickZone) dom.joystickZone.style.display = 'none';
                    if (dom.dpadContainer) dom.dpadContainer.style.display = 'grid';
                } else {
                    if (dom.joystickZone) dom.joystickZone.style.display = 'flex';
                    if (dom.dpadContainer) dom.dpadContainer.style.display = 'grid';
                }
            });
        });

        // Swipe Detection on Canvas
        let swipeStartX = 0, swipeStartY = 0;
        if (canvas) {
            canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    swipeStartX = e.touches[0].clientX;
                    swipeStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            canvas.addEventListener('touchend', (e) => {
                if (e.changedTouches.length > 0) {
                    const dx = e.changedTouches[0].clientX - swipeStartX;
                    const dy = e.changedTouches[0].clientY - swipeStartY;
                    const absX = Math.abs(dx);
                    const absY = Math.abs(dy);

                    if (Math.max(absX, absY) > 25) {
                        if (absX > absY) setDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
                        else setDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
                    }
                }
            }, { passive: true });
        }

        // Navigation & Menu Buttons
        const btnPlay = document.getElementById('btn-play-game');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                triggerHaptic('button');
                startGame();
            });
        }

        const btnShop = document.getElementById('btn-open-shop');
        if (btnShop) {
            btnShop.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                triggerHaptic('button');
                if (dom.menuScreen) dom.menuScreen.classList.add('hidden');
                if (dom.shopScreen) dom.shopScreen.classList.remove('hidden');
                initShopUI();
            });
        }

        const btnShopBack = document.getElementById('btn-shop-back');
        if (btnShopBack) {
            btnShopBack.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                triggerHaptic('button');
                goToMainMenu();
            });
        }

        const btnSettings = document.getElementById('btn-open-settings');
        const btnMenuSettings = document.getElementById('btn-menu-settings');
        const openSettings = () => {
            if (window.soundController) window.soundController.playButtonTap();
            triggerHaptic('button');
            if (dom.settingsModal) dom.settingsModal.classList.remove('hidden');
        };
        if (btnSettings) btnSettings.addEventListener('click', openSettings);
        if (btnMenuSettings) btnMenuSettings.addEventListener('click', openSettings);

        const btnCloseSettings = document.getElementById('btn-close-settings');
        if (btnCloseSettings) {
            btnCloseSettings.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                triggerHaptic('button');
                if (dom.settingsModal) dom.settingsModal.classList.add('hidden');
            });
        }

        // In-game Pause & Action Buttons
        const btnPause = document.getElementById('btn-game-pause');
        if (btnPause) {
            btnPause.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                togglePause();
            });
        }

        const btnResume = document.getElementById('btn-resume-game');
        if (btnResume) {
            btnResume.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                togglePause();
            });
        }

        const btnQuit = document.getElementById('btn-quit-game');
        if (btnQuit) {
            btnQuit.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                state.isPlaying = false;
                goToMainMenu();
            });
        }

        // Game Over Buttons
        const btnRetry = document.getElementById('btn-gameover-retry');
        if (btnRetry) {
            btnRetry.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                triggerHaptic('button');
                startGame();
            });
        }

        const btnMenuFromOver = document.getElementById('btn-gameover-menu');
        if (btnMenuFromOver) {
            btnMenuFromOver.addEventListener('click', () => {
                if (window.soundController) window.soundController.playButtonTap();
                triggerHaptic('button');
                goToMainMenu();
            });
        }

        // Settings Sliders & Toggles
        if (dom.sliderBgm) {
            dom.sliderBgm.value = window.soundController ? window.soundController.bgmVolume : 0.6;
            dom.sliderBgm.addEventListener('input', (e) => {
                if (window.soundController) window.soundController.setBgmVolume(parseFloat(e.target.value));
            });
        }

        if (dom.sliderSfx) {
            dom.sliderSfx.value = window.soundController ? window.soundController.sfxVolume : 0.8;
            dom.sliderSfx.addEventListener('input', (e) => {
                if (window.soundController) window.soundController.setSfxVolume(parseFloat(e.target.value));
            });
        }

        if (dom.btnToggleBgm) {
            dom.btnToggleBgm.addEventListener('click', () => {
                if (window.soundController) {
                    const muted = window.soundController.toggleBgmMute();
                    dom.btnToggleBgm.textContent = muted ? 'MUTED' : 'ACTIVE';
                    dom.btnToggleBgm.style.color = muted ? '#f43f5e' : '#10b981';
                }
            });
        }

        if (dom.btnToggleSfx) {
            dom.btnToggleSfx.addEventListener('click', () => {
                if (window.soundController) {
                    const muted = window.soundController.toggleSfxMute();
                    dom.btnToggleSfx.textContent = muted ? 'MUTED' : 'ACTIVE';
                    dom.btnToggleSfx.style.color = muted ? '#f43f5e' : '#10b981';
                }
            });
        }
    }

    // Android Lifecycle Bridges
    window.onGamePause = function() {
        if (state.isPlaying && !state.isPaused && !state.isGameOver) {
            togglePause();
        }
    };
    window.onGameResume = function() {};

    // App Initialization
    window.addEventListener('DOMContentLoaded', () => {
        loadSavedData();
        initCanvas();
        initControls();
        initSplashSequence();
        requestAnimationFrame(gameLoop);
    });

})();
