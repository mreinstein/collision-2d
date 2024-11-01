import { vec2 } from 'gl-matrix'


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

  this.t = 0  // time of collision from 0..1 when collision is true
  this.intersectPoint = vec2.create() // point on the triangle where the sphere collided

  this.tmp = vec2.create()
  this.tmpTri = [ vec2.create(), vec2.create() ]
  this.intersectTri = [ vec2.create(), vec2.create() ]

  this.tmpTriNorm = vec2.create()
  this.intersectTriNorm = vec2.create()
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
  vec2.copy(this.intersectTri[0], this.tmpTri[0])
  vec2.copy(this.intersectTri[1], this.tmpTri[1])
  vec2.copy(this.intersectTriNorm, this.tmpTriNorm)
  if (t < this.t) {
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
