class AudioManager {
    constructor() {
        this.synth = new Tone.Synth().toDestination();
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            await Tone.start();
            this.initialized = true;
        }
    }

    playShootSound() {
        this.synth.triggerAttackRelease("C5", "32n");
    }

    playHitSound() {
        this.synth.triggerAttackRelease("G4", "16n");
    }

    playDamageSound() {
        this.synth.triggerAttackRelease("A3", "8n");
    }
}

const audioManager = new AudioManager();
