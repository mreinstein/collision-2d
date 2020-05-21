import * as vec2 from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'
import pool      from './pool-vec2.js'


const SMALL_NUM = 0.00000001


// compute the time of closest point of approach (CPA) for two tracks
// a track consists of a starting point and a delta vector
//
//    Input:  two tracks Tr1 and Tr2
//    Return: the time at which the two tracks are closest from 0..1
export default function cpa_time (Tr1, Tr2) {
    const v1 = vec2.subtract(pool.malloc(), Tr1[1], Tr1[0])
    const v2 = vec2.subtract(pool.malloc(), Tr2[1], Tr2[0])

    const dv = vec2.subtract(pool.malloc(), v1, v2)

    const dv2 = vec2.dot(dv, dv)
    //float    dv2 = dot(dv,dv);

    if (dv2 < SMALL_NUM)      // the  tracks are almost parallel
        return 0.0;             // any time is ok.  Use time 0.

    const w0 = vec2.subtract(pool.malloc(), Tr1[0], Tr2[0])

    //Vector   w0 = Tr1.P0 - Tr2.P0;
    
    const cpatime = -vec2.dot(w0, dv) / dv2

    //float    cpatime = -dot(w0,dv) / dv2;

    pool.free(v1)
    pool.free(v2)
    pool.free(dv)
    pool.free(w0)

    return cpatime;             // time of CPA
}
