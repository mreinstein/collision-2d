import { vec2 } from "wgpu-matrix";

export default function TraceInfo() {
  this.start = vec2.create();
  this.end = vec2.create();
  this.scaledStart = vec2.create();
  this.radius = 0;
  this.invRadius = 0;
  this.vel = vec2.create();
  this.scaledVel = vec2.create();
  this.velLength = 0;
  this.normVel = vec2.create();
  this.collision = false;

  this.t = 0; // time of collision from 0..1 when collision is true
  this.intersectPoint = vec2.create(); // point on the triangle where the circle collided

  this.tmp = vec2.create();
  this.tmpTri = [vec2.create(), vec2.create()];
  this.intersectTri = [vec2.create(), vec2.create()];

  this.tmpTriNorm = vec2.create();
  this.intersectTriNorm = vec2.create();
}

TraceInfo.prototype.resetTrace = function (start, end, radius) {
  this.invRadius = 1 / radius;
  this.radius = radius;

  vec2.copy(start, this.start);
  vec2.copy(end, this.end);
  vec2.subtract(end, start, this.vel);
  vec2.normalize(this.vel, this.normVel);

  vec2.scale(start, this.invRadius, this.scaledStart);
  vec2.scale(this.vel, this.invRadius, this.scaledVel);

  this.velLength = vec2.length(this.vel);

  this.collision = false;
  this.t = 1.0;
};

TraceInfo.prototype.setCollision = function (t, point) {
  this.collision = true;
  vec2.copy(this.tmpTri[0], this.intersectTri[0]);
  vec2.copy(this.tmpTri[1], this.intersectTri[1]);
  vec2.copy(this.tmpTriNorm, this.intersectTriNorm);
  if (t < this.t) {
    this.t = t;
    vec2.scale(point, this.radius, this.intersectPoint);
  }
};

// position of the circle when it collided with the closest triangle
TraceInfo.prototype.getTraceEndpoint = function (end) {
  vec2.scale(this.vel, this.t, this.tmp);
  vec2.add(this.start, this.tmp, end);
  return end;
};

TraceInfo.prototype.getTraceDistance = function () {
  vec2.scale(this.vel, this.t, this.tmp);
  return vec2.length(this.tmp);
};
