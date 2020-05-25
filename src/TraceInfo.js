import * as vec2 from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'


export default function TraceInfo() {
  this.start = vec2.create()
  this.end = vec2.create()
  this.scaledStart = vec2.create()
  this.radius = 0
  this.invRadius = 0
  this.vel = vec2.create()
  this.scaledVel = vec2.create()
  this.velLength = 0
  this.normVel = vec2.create()
  this.collision = false
  this.t = 0

  // the point on the triangle where the sphere collided
  this.intersectPoint = vec2.create()
  this.tmp = vec2.create()
  this.tmpTri = []
  this.intersectTri = []

  this.tmpTriNorm = []
  this.intersectTriNorm = []
}

TraceInfo.prototype.resetTrace = function(start, end, radius) {
  this.invRadius = 1/radius
  this.radius = radius

  vec2.copy(this.start, start)
  vec2.copy(this.end, end)
  vec2.subtract(this.vel, end, start)
  vec2.normalize(this.normVel, this.vel)

  vec2.scale(this.scaledStart, start, this.invRadius)
  vec2.scale(this.scaledVel, this.vel, this.invRadius)

  this.velLength = vec2.length(this.vel)

  this.collision = false
  this.t = 1.0
}

TraceInfo.prototype.setCollision = function(t, point) {
  this.collision = true
  this.intersectTri = this.tmpTri.slice(0)
  this.intersectTriNorm = this.tmpTriNorm.slice(0)
  if(t < this.t) {
    this.t = t
    vec2.scale(this.intersectPoint, point, this.radius)
  }
}

// position of the sphere when it collided with the closest triangle
TraceInfo.prototype.getTraceEndpoint = function(end) {
  vec2.scale(this.tmp, this.vel, this.t)
  vec2.add(end, this.start, this.tmp)
  return end
}

TraceInfo.prototype.getTraceDistance = function() {
  vec2.scale(this.tmp, this.vel, this.t)
  return vec2.length(this.tmp)
}
