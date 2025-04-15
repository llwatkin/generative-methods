class Pebble {
    constructor(x, y) {
        this.x = x + random(-PEBBLE_POS_MOD, PEBBLE_POS_MOD);
        this.y = y + random(-PEBBLE_POS_MOD, PEBBLE_POS_MOD);
        this.size = random(MIN_PEBBLE_SIZE, MAX_PEBBLE_SIZE);
        this.color = getColor(PEBBLE_COLOR, "variate", PEBBLE_COLOR_MOD);
        this.strokeColor = getStroke(this.color);
    }

    drawTo(layer) {
        layer.push(); // Save coordinate system
        layer.translate(this.x, this.y); // Move to new pebble location
        layer.fill(this.color);
        layer.stroke(this.strokeColor);
        layer.circle(0, 0, this.size); // Draw pebble
        layer.pop(); // Restore coordinate system
    }
}