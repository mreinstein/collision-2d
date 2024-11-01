// generate a bounding AABB from another primitive


// create an AABB containing all 2D points
export function fromPoints (points) {
    if (!points.length)
        throw new Error('no points specified')

    let minX, maxX, minY, maxY

    minX = maxX = points[0][0]
    minY = maxY = points[0][1]

    for (let i=1; i < points.length; i++) {
        minX = Math.min(minX, points[i][0])
        maxX = Math.max(maxX, points[i][0])
        minY = Math.min(minY, points[i][1])
        maxY = Math.max(maxY, points[i][1])
    }

    const width = maxX - minX
    const height = maxY - minY

    return {
        position: [ minX + (width / 2), minY + (height / 2)],
        width,
        height
    }
}


// create an AABB containing all line segments
export function fromSegments (segments, indices) {
    if (!segments.length)
        throw new Error('no segments specified')

    if (!indices.length)
        throw new Error('no indices specified')

    let minX, maxX, minY, maxY

    const seg = segments[indices[0]]
    minX = maxX = seg[0][0]
    minY = maxY = seg[0][1]

    for (const idx of indices) {
        const seg = segments[idx]
        minX = Math.min(minX, seg[0][0])
        minX = Math.min(minX, seg[1][0])

        maxX = Math.max(maxX, seg[0][0])
        maxX = Math.max(maxX, seg[1][0])

        minY = Math.min(minY, seg[0][1])
        minY = Math.min(minY, seg[1][1])

        maxY = Math.max(maxY, seg[0][1])
        maxY = Math.max(maxY, seg[1][1])
    }

    const width = maxX - minX
    const height = maxY - minY

    return {
        position: [ minX + (width / 2), minY + (height / 2)],
        width,
        height
    }
}


// create an AABB containing all triangle vertices
export function fromTriangle (p0, p1, p2) {
    const minX = Math.min(p0[0], p1[0], p2[0])
    const maxX = Math.max(p0[0], p1[0], p2[0])

    const minY = Math.min(p0[1], p1[1], p2[1])
    const maxY = Math.max(p0[1], p1[1], p2[1])

    const width = maxX - minX
    const height = maxY - minY

    return {
        position: [ minX + (width / 2), minY + (height / 2)],
        width,
        height
    }
}


// create an AABB containing a sphere
export function fromSphere (center, radius) {
    return {
        position: [ center[0], center[1] ],
        width: radius * 2,
        height: radius * 2
    }
}
