class Leaf {
    constructor(x, y, angle) {
        this.x = x + random(-LEAF_POS_MOD, LEAF_POS_MOD);
        this.y = y + random(-LEAF_POS_MOD, LEAF_POS_MOD);
        this.startAngle = angle;
        this.angle = this.startAngle + radians(random(MIN_LEAF_ANGLE, MAX_LEAF_ANGLE));
        this.moveRate = random(1800, 1900) / random(-1, 1);
        this.size = random(MIN_LEAF_SIZE, MAX_LEAF_SIZE);
        this.color = getColor(LEAF_COLOR, "variate", LEAF_COLOR_MOD);
        this.strokeColor = getStroke(this.color);
    }

    draw() {
        this.drawShadow();

        push(); // Save coordinate system
        translate(this.x, this.y); // Move to new leaf location
        rotate(this.angle); // Rotate
        fill(this.color);
        stroke(this.strokeColor);

        // Stem
        push();
        strokeWeight(MIDRIB_THICKNESS);
        rotate(noise(millis() / this.moveRate) / 3);
        line(0, 0, 0, -this.size * 3);
        pop();

        // Leaf body
        push();
        strokeWeight(1);
        rotate(noise(millis() / this.moveRate));
        bezier(0, this.size, -this.size, -this.size / 2, this.size, -this.size / 2, 0, this.size);
        // Midrib
        strokeWeight(MIDRIB_THICKNESS);
        line(0, -5, 0, this.size / 2);
        pop();

        pop(); // Restore coordinate system
    }

    drawShadow() {
        push();
        colorMode(RGB);
        translate(this.x + SUN_ANGLE_X, this.y + SUN_ANGLE_Y); // Move to new leaf location
        rotate(this.angle); // Rotate start angle
        fill(0, 0, 0, SHADOW_INTENSITY);
        noStroke();

        // Stem
        push();
        strokeWeight(MIDRIB_THICKNESS);
        rotate(noise(millis() / this.moveRate) / 3);
        line(0, 0, 0, -this.size * 2);
        pop();

        // Leaf body
        push();
        strokeWeight(1);
        rotate(noise(millis() / this.moveRate));
        bezier(0, this.size, -this.size, -this.size / 2, this.size, -this.size / 2, 0, this.size);
        pop();

        pop();
    }

    drawReflection() {
        push();
        colorMode(RGB);
        translate(this.x + SUN_ANGLE_X, this.y + SUN_ANGLE_Y); // Move to new leaf location
        rotate(this.angle); // Rotate start angle
        fill(163, 217, 152, SHADOW_INTENSITY);
        noStroke();

        // Stem
        push();
        strokeWeight(MIDRIB_THICKNESS);
        rotate(noise(millis() / this.moveRate) / 3);
        line(143, 191, 134, -this.size * 2);
        pop();

        // Leaf body
        push();
        strokeWeight(1);
        rotate(noise(millis() / this.moveRate));
        bezier(0, this.size, -this.size, -this.size / 2, this.size, -this.size / 2, 0, this.size);
        pop();

        pop();
    }
}