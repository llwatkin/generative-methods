class Pond {
    constructor() {
        this.seed = random(10000);
        this.pebbles = createGraphics(width, height);
        this.vignette = createGraphics(width, height);
        this.fish = [];
        this.lilypads = [];
        this.ripples = [];
        this.leaves = [];
        this.leafShadows = [];
    }

    fill() {
        randomSeed(this.seed);
        this.createPebbles();
        this.createVignette();
        this.createLilypads();
        this.createLeaves();
        this.addFish(MAX_FISH);
    }

    draw() {
        image(this.pebbles, 0, 0);
        this.drawLowerLilypadShadows();
        image(this.vignette, 0, 0);
        this.drawFish();
        this.drawUpperLilypadShadows();
        this.drawLeafReflections();
        this.drawRipples();
        this.drawLilypads();
        this.drawLeaves();
    }

    clear() {
        this.pebbles.clear();
        this.vignette.clear();
        this.fish = [];
        this.lilypads = [];
        this.ripples = [];
        this.leaves = [];
    }

    createPebbles() {
        let avgSize = (MIN_PEBBLE_SIZE + MAX_PEBBLE_SIZE) / 2;
        for (let x = avgSize / 2; x < width; x += avgSize) {
            for (let y = avgSize / 2; y < height; y += avgSize) {
                let pebble = new Pebble(x, y);
                pebble.drawTo(this.pebbles);
            }
        }
    }

    createVignette() {
        this.vignette.push();
        this.vignette.fill(19, 25, 13, 50);
        this.vignette.noStroke();

        // Draw vignette bands with decreasing width
        for (let i = 0; i < VIGNETTE_BANDS; i++) {
            let vignetteWidth = VIGNETTE_WIDTH - (i * VIGNETTE_WIDTH) / VIGNETTE_BANDS;
            this.vignette.beginShape();
            // Outer rectangle
            this.vignette.vertex(0, 0);
            this.vignette.vertex(width, 0);
            this.vignette.vertex(width, height);
            this.vignette.vertex(0, height);
            // end outer rectangle
            // Inner cutout
            this.vignette.beginContour();
            this.vignette.vertex(vignetteWidth, height - vignetteWidth);
            this.vignette.vertex(width - vignetteWidth, height - vignetteWidth);
            this.vignette.vertex(width - vignetteWidth, vignetteWidth);
            this.vignette.vertex(vignetteWidth, vignetteWidth);
            this.vignette.endContour();
            // end inner cutout
            this.vignette.endShape();
        }

        this.vignette.pop();
    }

    addFish() {
        for (let i = 0; i < random(MAX_FISH); i++) {
            let fish = new Fish(random(width), random(height));
            this.fish.push(fish);
        }
    }

    drawFish() {
        // Pass entire list of fish to each fish individually
        for (let fish of this.fish) fish.run(this.fish);
    }

    createLilypads() {
        for (let i = 0; i < random(MIN_LILYPADS, MAX_LILYPADS); i++) {
            let lilypad = new Lilypad(this, random(width), random(height));
            this.lilypads.push(lilypad);
        }
    }

    drawLilypads() {
        for (let lilypad of this.lilypads) lilypad.draw();
    }

    drawLowerLilypadShadows() {
        for (let lilypad of this.lilypads) lilypad.drawLowerShadow();
    }

    drawUpperLilypadShadows() {
        for (let lilypad of this.lilypads) lilypad.drawUpperShadow();
    }

    createRipple(x, y, size) {
        let ripple = new Ripple(x, y, size);
        this.ripples.push(ripple);
    }

    drawRipples() {
        for (let ripple of this.ripples) ripple.draw();
        this.clearDeadRipples();
    }

    clearDeadRipples() {
        // Check for ripples that are invisible and remove them
        for (let ripple of this.ripples) {
            if (ripple.strokeWeight <= 0) {
                let index = this.ripples.indexOf(ripple);
                this.ripples.splice(index, 1);
            }
        }
    }

    createLeaves() {
        let centerX = width / 2;
        let centerY = height / 2;
        let numLeaves = random(MIN_LEAVES, MAX_LEAVES);

        // Lower ring
        for (let i = 0; i < numLeaves; i++) {
            let angle = (2 * PI / numLeaves) * i;
            let x = centerX + width / 1.75 * cos(angle);
            let y = centerY + height / 1.75 * sin(angle);
            let leaf = new Leaf(x, y, atan2(centerY - y, centerX - x) - radians(95));
            this.leaves.push(leaf);
        }

        // Upper ring
        for (let i = 0; i < numLeaves; i++) {
            let angle = (2 * PI / numLeaves) * i;
            let x = centerX + width / 1.5 * cos(angle);
            let y = centerY + height / 1.5 * sin(angle);
            let leaf = new Leaf(x, y, atan2(centerY - y, centerX - x) - radians(95));
            this.leaves.push(leaf);
        }
    }

    drawLeaves() {
        for (let leaf of this.leaves) leaf.draw();
    }

    drawLeafReflections() {
        for (let leaf of this.leaves) leaf.drawReflection();
    }
}