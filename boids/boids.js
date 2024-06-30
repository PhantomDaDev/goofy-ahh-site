let boids = [];
let isPlaying = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
    boids.push(new Boid());
  }

  const playButton = document.getElementById('playButton');
  const pauseButton = document.getElementById('pauseButton');
  const alignmentCheckbox = document.getElementById('alignmentCheckbox');
  const cohesionCheckbox = document.getElementById('cohesionCheckbox');
  const separationCheckbox = document.getElementById('separationCheckbox');

  playButton.addEventListener('click', () => {
    isPlaying = true;
    loop(); // p5.js function to start the draw loop
  });

  pauseButton.addEventListener('click', () => {
    isPlaying = false;
    noLoop(); // p5.js function to stop the draw loop
  });

  alignmentCheckbox.addEventListener('change', () => updateBehaviors());
  cohesionCheckbox.addEventListener('change', () => updateBehaviors());
  separationCheckbox.addEventListener('change', () => updateBehaviors());

  updateBehaviors();
}

let applyAlignment = true;
let applyCohesion = true;
let applySeparation = true;

function updateBehaviors() {
  applyAlignment = document.getElementById('alignmentCheckbox').checked;
  applyCohesion = document.getElementById('cohesionCheckbox').checked;
  applySeparation = document.getElementById('separationCheckbox').checked;
}

function draw() {
  if (isPlaying) {
    background(0);
    for (let boid of boids) {
      boid.edges();
      boid.flock(boids);
      boid.update();
      boid.show();
    }
  }
}

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = applyAlignment ? this.align(boids) : createVector(0, 0);
    let cohesion = applyCohesion ? this.cohesion(boids) : createVector(0, 0);
    let separation = applySeparation ? this.separation(boids) : createVector(0, 0);

    alignment.mult(1.0);
    cohesion.mult(1.0);
    separation.mult(1.5);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
