class Lilypad {
    constructor(pond, x, y) {
        this.pond = pond;
        this.x = x;
        this.y = y;
        this.angle = random(360);
        this.size = random(MIN_LILYPAD_SIZE, MAX_LILYPAD_SIZE);
        this.currSize = random(this.size / 1.025, this.size * 1.025);
        this.openingSize = random(MIN_OPENING_SIZE, MAX_OPENING_SIZE);
        this.floatRate = random(0.005, 0.01);
        this.floatDirection = -1;
        let color = random(100) > 90 ? LILYPAD_COLORS[1] : LILYPAD_COLORS[0];
        this.color = getColor(color, "variate", LILYPAD_COLOR_MOD);
        this.strokeColor = getStroke(this.color);
    }

    draw() {
        push(); // Save coordinate system
        translate(this.x, this.y); // Move to new lily pad location
        rotate(this.angle); // Rotate random angle
        fill(this.strokeColor);
        stroke(this.strokeColor);

        // Animate floating
        if (this.currSize < this.size / 1.025 && this.floatDirection == -1) {
            this.floatDirection = 1;
            pond.createRipple(this.x, this.y, this.size, RIPPLE_INTENSITY);
        }
        if (this.currSize > this.size * 1.025 && this.floatDirection == 1)
            this.floatDirection = -1;
        this.currSize += this.floatRate * this.floatDirection;

        // Draw lily pad
        arc(0, 0, this.currSize, this.currSize, 0, PI * 2 - this.openingSize, PIE);
        fill(this.color);
        arc(0, 0, this.currSize / 1.05, this.currSize / 1.05, 0, PI * 2 - this.openingSize, PIE);
        pop();
    }

    drawLowerShadow() {
        push(); // Save coordinate system
        colorMode(RGB);
        translate(this.x + SUN_ANGLE_X, this.y + SUN_ANGLE_Y); // Move to new lily pad location
        rotate(this.angle); // Rotate random angle
        fill(0, 0, 0, SHADOW_INTENSITY);
        noStroke();

        // Animate floating
        this.currSize += this.floatRate * this.floatDirection;

        // Draw lily pad
        circle(0, 0, this.currSize / 1.25);
        pop();
    }

    drawUpperShadow() {
        push(); // Save coordinate system
        colorMode(RGB);
        translate(this.x + SUN_ANGLE_X, this.y + SUN_ANGLE_Y); // Move to new lily pad location
        rotate(this.angle); // Rotate random angle
        fill(0, 0, 0, SHADOW_INTENSITY);
        noStroke();

        // Animate floating
        this.currSize += this.floatRate * this.floatDirection;

        // Draw lily pad
        arc(0, 0, this.currSize, this.currSize, 0, PI * 2 - this.openingSize, PIE);
        pop();
    }
}