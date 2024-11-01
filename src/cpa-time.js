import { vec2 } from 'gl-matrix'


const EPSILON = 0.00000001

const v1 = vec2.create()
const v2 = vec2.create()
const dv = vec2.create()
const w0 = vec2.create()

// compute the time of closest point of approach (CPA) for two tracks
// a track consists of a starting point and a delta vector
//
//    Input:  two tracks Tr1 and Tr2
//    Return: the time at which the two tracks are closest from 0..1
export default function cpaTime (Tr1, Tr2) {
    vec2.subtract(v1, Tr1[1], Tr1[0])
    vec2.subtract(v2, Tr2[1], Tr2[0])

    vec2.subtract(dv, v1, v2)

    const dv2 = vec2.dot(dv, dv)

    if (dv2 < EPSILON)      // the  tracks are almost parallel
        return 0.0;           // any time is ok.  Use time 0.

    vec2.subtract(w0, Tr1[0], Tr2[0])

    //Vector   w0 = Tr1.P0 - Tr2.P0;
    
    const cpatime = -vec2.dot(w0, dv) / dv2

    //float    cpatime = -dot(w0,dv) / dv2;

    return cpatime;             // time of CPA
}
