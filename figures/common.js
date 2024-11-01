import { toRadians } from '@footgun/math-gap'


function drawAABB (data, box, color='#fff', thickness=1) {
    const { origin, context } = data

    const x1 = Math.floor(origin[0] + box.position[0] - box.width/2)
    const y1 = Math.floor(origin[1] + box.position[1] - box.height/2)
    const x2 = Math.floor(origin[0] + box.position[0] + box.width/2)
    const y2 = Math.floor(origin[1] + box.position[1] + box.height/2)
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y1)
    context.lineTo(x2, y2)
    context.lineTo(x1, y2)
    context.lineTo(x1, y1)
    context.closePath()
    context.lineWidth = thickness
    context.strokeStyle = color
    context.stroke()
}


function drawCircle (data, center, radius, color='#fff', thickness=1) {
    const { origin, context } = data

    const x = Math.floor(origin[0] + center[0])
    const y = Math.floor(origin[1] + center[1])
    context.beginPath()
    context.arc(x, y, radius, 0, 2 * Math.PI, true)
    context.closePath()
    context.lineWidth = thickness
    context.strokeStyle = color
    context.stroke()
}


function drawCone (data, conePosition, coneRotation, coneFieldOfView, minDistance, maxDistance) {
    const { origin, context } = data

    const x = Math.floor(origin[0] + conePosition[0])
    const y = Math.floor(origin[1] + conePosition[1])

    //console.log('max:', maxDistance, 'min:', minDistance)
    //console.log('fov:', coneFieldOfView, ' rot:', coneRotation)
    context.fillStyle = '#333'
    context.beginPath()
    context.moveTo(origin[0], origin[1])
    context.arc(x, y, maxDistance, coneRotation-toRadians(coneFieldOfView/2), coneRotation+toRadians(coneFieldOfView/2), false)
    context.fill()

    if (minDistance > 0) {
        context.fillStyle = '#202020'
        context.beginPath()
        context.arc(x, y, minDistance, 0, Math.PI*2, false)
        context.fill()
    }
}


function drawPoint (data, point, color='#fff', text='', thickness=1) {
    const { origin, context } = data

    const x = Math.floor(origin[0] + point[0] - thickness / 2)
    const y = Math.floor(origin[1] + point[1] - thickness / 2)
    context.lineWidth = thickness
    context.fillStyle = color
    context.strokeStyle = color
    context.fillRect(x, y, thickness, thickness)
    context.strokeRect(x, y, thickness, thickness)
    if (text)
        context.fillText(text, x + thickness * 4, y + thickness * 2)
}


function drawRay (data, pos, dir, length, color='#fff', arrow=true, thickness=1) {
    const { context } = data

    const pos2 = [
        pos[0] + dir[0] * length,
        pos[1] + dir[1] * length
    ]

    drawSegment(data, pos, pos2, color, thickness)

    if (arrow) {
        pos = [ pos2[0], pos2[1] ]
        pos2[0] = pos[0] - dir[0] * 4 + dir[1] * 4
        pos2[1] = pos[1] - dir[1] * 4 - dir[0] * 4
        drawSegment(data, pos, pos2, color, thickness)
        pos2[0] = pos[0] - dir[0] * 4 - dir[1] * 4
        pos2[1] = pos[1] - dir[1] * 4 + dir[0] * 4
        drawSegment(data, pos, pos2, color, thickness)
    }
}


function drawSegment (data, point1, point2, color='#fff', thickness=1, dashed=false) {
    const { origin, context } = data

    if (dashed)
        context.setLineDash([4, 6])

    const x1 = Math.floor(origin[0] + point1[0])
    const y1 = Math.floor(origin[1] + point1[1])
    const x2 = Math.floor(origin[0] + point2[0])
    const y2 = Math.floor(origin[1] + point2[1])
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)

    context.closePath()
    context.lineWidth = thickness
    context.strokeStyle = color
    context.stroke()

    if (dashed)
        context.setLineDash([])
}


function drawTriangle (data, point0, point1, point2, color='#fff', thickness=1, dashed=false) {
    drawSegment(data, point0, point1, color, thickness, dashed)
    drawSegment(data, point1, point2, color, thickness, dashed)
    drawSegment(data, point2, point0, color, thickness, dashed)
}


function init (context, width, height) {
    return {
        context,
        width,
        height,
        origin: [ width * 0.5, height * 0.5 ],
        infiniteLength: Math.sqrt(width * width + height * height)
    }
}


function clear (data) {
    const { context, width, height } = data
    context.fillStyle = '#202020'
    context.fillRect(0, 0, width, height)
}


export default { drawAABB, drawCircle, drawCone, drawPoint, drawRay, drawSegment, drawTriangle, init, clear }
