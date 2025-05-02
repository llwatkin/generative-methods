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
        // Choose a star type based on rarity
        let star_type = random(star_types); // Choose a random one initially just in case no type is chosen in the loop
        for (let type of star_types) {
            if (random() < type.rarity) {
                star_type = type;
                break;
            }
        }

        this.size = random(star_type.min_size, star_type.max_size);
        let hue = random(star_type.min_hue, star_type.max_hue);
        let sat = random(star_type.min_sat, star_type.max_sat);
        push();
        colorMode(HSB);
        this.star_color = color(hue, sat, 100);
        pop();
        this.note_url = random(star_type.note_pitch);
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
        translate(0, -5);
        fill(this.star_color);
        noStroke();
        glow(this.star_color, 15);
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

class StarType {
    constructor() {
        this.rarity = random(0.000000001, 0.9999999999);
        // Determine hue limits
        this.min_hue = random(0, 360);
        this.max_hue = random(this.min_hue, 360);
        // Determin saturation limits
        this.min_sat = random(0, 100);
        this.max_sat = random(this.min_sat, 100);
        // Determine size limits
        this.min_size = random(5, 30);
        this.max_size = random(this.min_size, 30);
        // Determine sound pitch
        this.note_pitch = random(NOTE_PITCHES);
    }
}

class Ripple {
    constructor(size, star_color) {
        this.x_size = size / 2;
        this.y_size = size / 4;
        this.stroke_weight = size / 3;
        this.stroke_speed = size / 200;
        this.star_color = star_color;
    }

    update() {
        this.x_size += 1;
        this.y_size += 0.5;
        this.stroke_weight -= this.stroke_speed;
        if (this.stroke_weight <= 0) this.stroke_weight = 0;
    }

    draw() {
        push();
        stroke(this.star_color);
        strokeWeight(this.stroke_weight);
        noFill();

        glow(this.star_color, 10);
        ellipse(0, 0, this.x_size, this.y_size);
        ellipse(0, 0, this.x_size, this.y_size);
        glow(this.star_color, 5);
        ellipse(0, 0, this.x_size, this.y_size);
        ellipse(0, 0, this.x_size, this.y_size);

        pop();
    }
}