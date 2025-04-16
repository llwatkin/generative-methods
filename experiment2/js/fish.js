class Fish {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.position = createVector(x, y);
        this.size = random(MIN_FISH_SIZE, MAX_FISH_SIZE);
        this.tailAngle = this.size / 4;
        this.tailDirection = -1;

        // Maximum speed
        this.maxSpeed = MAX_FISH_SPEED;

        this.maxForce = 0.005; // Maximum steering force

        // Get colors
        this.color = getColor(random(FISH_COLORS), "variate", FISH_COLOR_MOD);
        this.strokeColor = getStroke(this.color);
    }

    run(fish) {
        this.school(fish);
        this.update();
        this.borders();
        this.render();
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    // We accumulate a new acceleration each time based on three rules
    school(fish) {
        let separation = this.separate(fish);
        let alignment = this.align(fish);
        let cohesion = this.cohesion(fish);

        // Arbitrarily weight these forces
        separation.mult(1.5);
        alignment.mult(1.0);
        cohesion.mult(1.0);

        // Add the force vectors to acceleration
        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);
    }

    // Method to update location
    update() {
        // Update velocity
        this.velocity.add(this.acceleration);

        // Limit speed
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        // A vector pointing from the location to the target
        let desired = p5.Vector.sub(target, this.position);

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxSpeed);

        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);

        // Limit to maximum steering force
        steer.limit(this.maxForce);
        return steer;
    }

    render() {
        this.drawShadow();

        let theta = this.velocity.heading() + radians(90);
        push();
        fill(this.color);
        stroke(this.strokeColor);
        translate(this.position.x, this.position.y);
        rotate(theta);

        // Fins
        push();
        fill(this.strokeColor);
        rotate(radians(90));
        bezier(
            -this.size / 4,
            0,
            -this.size / 2,
            -this.size / 2,
            this.size / 2,
            -this.size / 2,
            -this.size / 4,
            0
        );
        rotate(radians(180));
        bezier(
            this.size / 4,
            0,
            -this.size / 2,
            -this.size / 2,
            this.size / 2,
            -this.size / 2,
            this.size / 4,
            0
        );
        ellipse(-this.size / 3, -this.size / 8, this.size / 4, this.size / 4);
        ellipse(-this.size / 3, this.size / 8, this.size / 4, this.size / 4);
        pop();

        // Animate tail fin
        if (this.tailAngle < -this.size / 4 && this.tailDirection == -1)
            this.tailDirection = 1;
        if (this.tailAngle > this.size / 4 && this.tailDirection == 1)
            this.tailDirection = -1;
        this.tailAngle += 0.25 * this.tailDirection * abs(this.velocity.mag() * 3);
        fill(this.strokeColor);
        triangle(0, this.size / 2, this.tailAngle, this.size, 0, this.size / 1.25);

        // Body
        fill(this.color);
        bezier(0, this.size / 1.25, -this.size, -this.size, this.size, -this.size, 0, this.size / 1.25);

        // Dorsal fin (animated like the tail fin)
        fill(this.strokeColor);
        triangle(0, -this.size / 8, this.tailAngle / 3, this.size / 6, 0, this.size / 2);

        // Eyes
        noStroke();
        ellipse(this.size / 4, -this.size / 4, this.size / 8, this.size / 4);
        ellipse(-this.size / 4, -this.size / 4, this.size / 8, this.size / 4);
        fill(0);
        ellipse(this.size / 4, -this.size / 4, this.size / 12, this.size / 8);
        ellipse(-this.size / 4, -this.size / 4, this.size / 12, this.size / 8);
        pop();
    }

    drawShadow() {
        // Draw a triangle rotated in the direction of velocity
        let theta = this.velocity.heading() + radians(90);
        push();
        colorMode(RGB);
        fill(0, 0, 0, SHADOW_INTENSITY);
        noStroke();
        translate(this.position.x + SUN_ANGLE_X, this.position.y + SUN_ANGLE_Y);
        rotate(theta);

        let shadowSize = this.size / 1.25;

        // Body
        bezier(0, shadowSize / 1.25, -shadowSize, -shadowSize, shadowSize, -shadowSize, 0, shadowSize / 1.25);
        // Tail fin
        triangle(0, shadowSize / 2, this.tailAngle, shadowSize, 0, shadowSize / 1.25);

        pop();
    }

    // Wraparound //TODO: REDIRECT THEM TO THE CENTER
    borders() {
        if (this.position.x < -this.size) {
            let n = createVector(1, 0);
            this.velocity.reflect(n);
        }

        if (this.position.y < -this.size) {
            let n = createVector(0, 1);
            this.velocity.reflect(n);
        }

        if (this.position.x > width + this.size) {
            let n = createVector(-1, 0);
            this.velocity.reflect(n);
        }

        if (this.position.y > height + this.size) {
            let n = createVector(0, -1);
            this.velocity.reflect(n);
        }
    }

    // Separation
    // Method checks for nearby fish and steers away
    separate(fish) {
        let desiredSeparation = 30;
        let steer = createVector(0, 0);
        let count = 0;

        // For every fish in the system, check if it's too close
        for (let f of fish) {
            let distanceToNeighbor = p5.Vector.dist(this.position, f.position);

            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if (distanceToNeighbor > 0 && distanceToNeighbor < desiredSeparation) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, f.position);
                diff.normalize();

                // Scale by distance
                diff.div(distanceToNeighbor);
                steer.add(diff);

                // Keep track of how many
                count++;
            }
        }

        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    // Alignment
    // For every nearby fish in the system, calculate the average velocity
    align(fish) {
        let neighborDistance = 50;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < fish.length; i++) {
            let d = p5.Vector.dist(this.position, fish[i].position);
            if (d > 0 && d < neighborDistance) {
                sum.add(fish[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    // Cohesion
    // For the average location (i.e., center) of all nearby fish, calculate steering vector towards that location
    cohesion(fish) {
        let neighborDistance = 50;
        let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < fish.length; i++) {
            let d = p5.Vector.dist(this.position, fish[i].position);
            if (d > 0 && d < neighborDistance) {
                sum.add(fish[i].position); // Add location
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum); // Steer towards the location
        } else {
            return createVector(0, 0);
        }
    }
}
