// Web Audio API Synthesizer for Bully Snake
// Supports BGM & SFX volume control, instant zero-latency playback

class SoundController {
    constructor() {
        this.ctx = null;
        this.bgmVolume = 0.6;
        this.sfxVolume = 0.8;
        this.bgmMuted = false;
        this.sfxMuted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.tempo = 124;
        this.currentNote = 0;
        this.loadSettings();
        this.initOnUserGesture();
    }

    loadSettings() {
        try {
            const savedBgm = localStorage.getItem('bully_bgm_vol');
            const savedSfx = localStorage.getItem('bully_sfx_vol');
            if (savedBgm !== null) this.bgmVolume = parseFloat(savedBgm);
            if (savedSfx !== null) this.sfxVolume = parseFloat(savedSfx);
            this.bgmMuted = localStorage.getItem('bully_bgm_muted') === 'true';
            this.sfxMuted = localStorage.getItem('bully_sfx_muted') === 'true';
        } catch (e) {}
    }

    saveSettings() {
        try {
            localStorage.setItem('bully_bgm_vol', this.bgmVolume);
            localStorage.setItem('bully_sfx_vol', this.sfxVolume);
            localStorage.setItem('bully_bgm_muted', this.bgmMuted);
            localStorage.setItem('bully_sfx_muted', this.sfxMuted);
        } catch (e) {}
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnUserGesture() {
        const unlock = () => {
            this.init();
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('pointerdown', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
    }

    setBgmVolume(val) {
        this.bgmVolume = Math.max(0, Math.min(1, val));
        this.saveSettings();
    }

    setSfxVolume(val) {
        this.sfxVolume = Math.max(0, Math.min(1, val));
        this.saveSettings();
    }

    toggleBgmMute() {
        this.bgmMuted = !this.bgmMuted;
        this.saveSettings();
        if (this.bgmMuted && this.bgmPlaying) {
            this.stopBgm();
        } else if (!this.bgmMuted && !this.bgmPlaying) {
            this.startBgm();
        }
        return this.bgmMuted;
    }

    toggleSfxMute() {
        this.sfxMuted = !this.sfxMuted;
        this.saveSettings();
        return this.sfxMuted;
    }

    playButtonTap() {
        if (this.sfxMuted || this.sfxVolume <= 0) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.04);

        const vol = 0.15 * this.sfxVolume;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    playEatFruit(type = 'apple') {
        if (this.sfxMuted || this.sfxVolume <= 0) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const vol = 0.25 * this.sfxVolume;

        if (type === 'apple') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.08); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.12); // C6
            gain.gain.setValueAtTime(vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.24);
        } else if (type === 'banana') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(739.99, now + 0.06); // F#5
            osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
            gain.gain.setValueAtTime(vol * 1.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.28);
        } else {
            // cherry
            [880, 1108.73, 1318.51].forEach((freq, idx) => {
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                o.type = 'sine';
                o.frequency.setValueAtTime(freq, now + idx * 0.04);
                g.gain.setValueAtTime(vol * 0.8, now + idx * 0.04);
                g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.18);
                o.connect(g);
                g.connect(this.ctx.destination);
                o.start(now + idx * 0.04);
                o.stop(now + idx * 0.04 + 0.2);
            });
        }
    }

    playEatDiamond() {
        if (this.sfxMuted || this.sfxVolume <= 0) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const vol = 0.3 * this.sfxVolume;

        // Sparkling crystal chime arpeggio
        const diamondNotes = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
        diamondNotes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(vol, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.32);
        });
    }

    playTurn() {
        if (this.sfxMuted || this.sfxVolume <= 0) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.035);

        const vol = 0.06 * this.sfxVolume;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playTeleport() {
        if (this.sfxMuted || this.sfxVolume <= 0) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);

        const vol = 0.12 * this.sfxVolume;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
    }

    playRoundClear() {
        if (this.sfxMuted || this.sfxVolume <= 0) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const vol = 0.25 * this.sfxVolume;
        const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(vol, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.45);
        });
    }

    playGameOver() {
        if (this.sfxMuted || this.sfxVolume <= 0) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const vol = 0.4 * this.sfxVolume;

        // White noise impact crash
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        // Low pitch dive
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sawtooth';
        sub.frequency.setValueAtTime(220, now);
        sub.frequency.exponentialRampToValueAtTime(45, now + 0.5);
        subGain.gain.setValueAtTime(vol * 0.8, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        sub.connect(subGain);
        subGain.connect(this.ctx.destination);

        noise.start(now);
        sub.start(now);
        sub.stop(now + 0.58);
    }

    startBgm() {
        if (this.bgmMuted || this.bgmVolume <= 0 || this.bgmPlaying) return;
        this.init();
        if (!this.ctx) return;
        this.bgmPlaying = true;
        this.scheduleBgmLoop();
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    scheduleBgmLoop() {
        if (!this.bgmPlaying || this.bgmMuted || this.bgmVolume <= 0 || !this.ctx) return;

        // Synthwave rhythmic bass line
        const notes = [
            110, 110, 130.81, 110, 146.83, 130.81, 123.47, 98,
            110, 110, 130.81, 164.81, 146.83, 130.81, 98, 123.47
        ];
        const stepTime = 60 / this.tempo / 2; // 16th notes
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[this.currentNote % notes.length], now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + stepTime * 0.8);

        const vol = 0.05 * this.bgmVolume;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + stepTime);

        this.currentNote++;
        this.bgmTimer = setTimeout(() => {
            this.scheduleBgmLoop();
        }, stepTime * 1000);
    }
}

window.soundController = new SoundController();
