const EPSILON = 1e-8


export default function pointInSegment (p, t0, t1) { 
    const crossproduct = (p[1] - t0[1]) * (t1[0] - t0[0]) - (p[0] - t0[0]) * (t1[1] - t0[1])

    // compare versus epsilon for floating point values, or != 0 if using integers
    if (Math.abs(crossproduct) > EPSILON)
        return false

    const dotproduct = (p[0] - t0[0]) * (t1[0] - t0[0]) + (p[1] - t0[1])*(t1[1] - t0[1])
    if (dotproduct < 0)
        return false

    const squaredlengthba = (t1[0] - t0[0])*(t1[0] - t0[0]) + (t1[1] - t0[1])*(t1[1] - t0[1])
    if (dotproduct > squaredlengthba)
        return false

    return true
}
