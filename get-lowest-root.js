export default function getLowestRoot (a, b, c, maxR, root={}) {
    // Check if a solution exists
    const determinant = b*b - 4.0 * a * c

    // If determinant is negative it means no solutions.
    if (determinant < 0.0)
        return false

    // calculate the two roots: (if determinant == 0 then
    // x1==x2 but let’s disregard that slight optimization)
    const sqrtD = Math.sqrt(determinant)
    let r1 = (-b - sqrtD) / (2*a)
    let r2 = (-b + sqrtD) / (2*a)

    // Sort so x1 <= x2
    if (r1 > r2) {
        let temp = r2
        r2 = r1
        r1 = temp
    }

    // Get lowest root:
    if (r1 > 0 && r1 < maxR) {
        root.value = r1
        return true
    }

    // It is possible that we want x2 - this can happen
    // if x1 < 0
    if (r2 > 0 && r2 < maxR) {
        root.value = r2
        return true
    }

    // No (valid) solutions
    return false
}
