class Ripple {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.strokeWeight = MAX_RIPPLE_SIZE;
    }

    draw() {
        push();
        colorMode(RGB);
        let fillColor = color(187, 193, 210, RIPPLE_INTENSITY);
        translate(this.x, this.y);
        noFill();
        stroke(fillColor);
        strokeWeight(this.strokeWeight);
        circle(0, 0, this.size);
        pop();

        this.size += 0.5;
        this.strokeWeight -= 0.1;
    }
}