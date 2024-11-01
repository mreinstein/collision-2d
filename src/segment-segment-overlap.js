import segseg from 'segseg'


export default function segmentSegmentOverlap (pos1, pos2, pos3, pos4, intersection) {
    return segseg(intersection, pos1, pos2, pos3, pos4) === 1
}
