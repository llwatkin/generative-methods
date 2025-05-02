// star.js - Constains Star and Ripple classes, as well as a glow function for effect
// Author: Lyle Watkins
// Date: 4/30/2025

// Glow function Kazuki Umeda, https://www.youtube.com/watch?v=iIWH3IUYHzM

function glow(glowColor, blurriness) {
    drawingContext.shadowColor = glowColor;
    drawingContext.shadowBlur = blurriness;
}

class Star {
    constructor([i, j]) {
        this.clicked = false;
        this.world_pos = [i, j];
        this.curr_size = 0;
        this.frames = 360;
        this.volume = 1;
        this.ripples = [];
        this.setType();
    }

    setType() {
        let size, hue;
        let sat = random(75, 100);

        // Supergiant star (~0.0001%)
        if (random() < SUPERGIANT_CHANCE) {
            size = random(25, 30);
            if (random() < 0.5) hue = random(60);
            else {
                sat = random(50);
                hue = random(180, 200);
            }

            // Set note
            this.note_url = random(XLO_NOTE_URLS);
        }
        // Giant star (~0.4%)
        else if (random() < GIANT_CHANCE) {
            size = random(20, 25);
            hue = random(60);

            // Set note
            this.note_url = random(LO_NOTE_URLS);
        }
        // White Dwarf star (~5%)
        else if (random() < WHITE_DWARF_CHANCE) {
            size = random(8, 12);
            sat = random(10);
            hue = random(180, 200);

            // Set note
            this.note_url = random(HI_NOTE_URLS);
        }
        // Main Sequence Star (~95%)
        else {
            let upperLimit = 12;
            if (random() < 0.01) upperLimit = 20; // 1% chance of blue and white stars
            size = random(10, upperLimit);

            if (size < 11) hue = random(10);
            else if (size < 12) hue = random(10, 60);
            else if (size < 13) {
                hue = random(180, 190);
                sat = random(50);
            } else hue = random(180, 210);

            // Set note
            this.note_url = random(MID_NOTE_URLS);
        }

        this.size = size;
        push();
        colorMode(HSB);
        this.star_color = color(hue, sat, 100);
        pop();
    }

    update() {
        if (this.frames == 360) this.play();
        this.frames += 3;
        if (this.frames > 360) this.frames = 0;
        this.updateVolume();

        // Update ripples
        for (let ripple of this.ripples) ripple.update();
    }

    play() {
        this.note = new Audio(this.note_url);
        this.note.volume = this.volume;
        this.note.play();

        // Add a ripple
        let ripple = new Ripple(this.size, this.star_color);
        this.ripples.push(ripple);
    }

    updateVolume() {
        let cam_coords = cameraTileCoordinates();
        let dist_to_cam = dist(cam_coords[0], cam_coords[1], this.world_pos[0], this.world_pos[1]);
        dist_to_cam = constrain(dist_to_cam, 0, MAX_DIST);
        this.volume = map(dist_to_cam, 0, MAX_DIST, 1, 0);
    }

    draw() {
        push();

        // Animation
        if (this.clicked) {
            let angle = this.frames % 360;
            this.curr_size = this.size + (this.size / 10) * cos(angle);
        } else {
            this.curr_size = this.size;
            this.frames = 360;
            // Update ripples when star is inactive
            for (let ripple of this.ripples) ripple.update();
        }

        // Draw star
        translate(0, -STAR_HEIGHT);
        fill(this.star_color);
        noStroke();
        glow(this.star_color, 20);
        ellipse(0, 0, this.curr_size);
        ellipse(0, 0, this.curr_size);
        glow(this.star_color, 5);
        ellipse(0, 0, this.curr_size);
        ellipse(0, 0, this.curr_size);

        // Remove dead ripples
        for (let ripple of this.ripples) {
            if (ripple.stroke_weight <= 0) { // If invisible
                let index = this.ripples.indexOf(ripple);
                this.ripples.splice(index, 1); // Remove
            }
        }

        // Draw ripples
        for (let ripple of this.ripples) ripple.draw();

        pop();
    }
}

class Ripple {
    constructor(size, star_color) {
        this.size = size;
        this.stroke_weight = size / 2.5;
        this.star_color = star_color;
    }

    update() {
        this.size += 1;
        this.stroke_weight -= 0.075;
        if (this.stroke_weight <= 0) this.stroke_weight = 0;
    }

    draw() {
        push();
        stroke(this.star_color);
        strokeWeight(this.stroke_weight);
        noFill();

        glow(this.star_color, 10);
        ellipse(0, 0, this.size / 2, this.size / 4);
        ellipse(0, 0, this.size / 2, this.size / 4);
        glow(this.star_color, 5);
        ellipse(0, 0, this.size / 2, this.size / 4);
        ellipse(0, 0, this.size / 2, this.size / 4);

        pop();
    }
}