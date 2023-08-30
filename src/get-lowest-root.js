// TODO: Don't like the duality of returning a null or float, probably doesn't optimize nicely
export default function getLowestRoot (a, b, c, maxR) {
    // check if a solution exists
    const det = b * b - 4.0 * a * c

    // if determinant is negative it means no solutions.
    if (det < 0)
        return null

    // calculate the two roots: (if determinant == 0 then
    // x1==x2 but let’s disregard that slight optimization)
    const sqrtDet = Math.sqrt(det)
    let r1 = (-b - sqrtDet) / (2.0*a)
    let r2 = (-b + sqrtDet) / (2.0*a)

    // sort so x1 <= x2
    if (r1 > r2) {
        const tmp = r2
        r2 = r1
        r1 = tmp
    }

    // get lowest root:
    if (r1 > 0 && r1 < maxR)
        return r1

    // it is possible that we want x2 - this can happen if x1 < 0
    if (r2 > 0 && r2 < maxR)
        return r2

    // No (valid) solutions
    return null
}
