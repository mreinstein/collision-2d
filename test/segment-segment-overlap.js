import t      from './_assert.js'
import segseg from '../src/segment-segment-overlap.js'


const result = [ 0, 0 ]


/*
  Basic intersection

                (0, 5)
                   o
                   |
 (-10, 0) o--------+-------o  (10, 0)
                   |
                   o
                (0, -5)

*/

t.equal(segseg([-10, 0], [10, 0], [0, 5], [0, -5], result), true)
t.deepEqual(result, [0, 0])



/*
  Basic intersection

                (5, 5)
                   o------o (10, 5)
                   |
                   |
                   o
                (5, 0)

*/
t.equal(segseg([ 5, 5], [5, 0], [5, 5], [10, 5], result), true)
t.deepEqual(result, [5,5])


/*
  Colinear
             (-2, 0)    (2, 0)
  (-10, 0) o----o--------o-----o  (10, 0)

*/
t.equal(segseg([-10, 0], [10, 0], [-2, 0], [2, 0], result), false)


/*
  No intersection (parallel)

  (-10, 5) o-------------o (10, 5)

  (-10, 0) o-------------o (10, 0)

*/
t.equal(segseg([-10, 0], [10, 0], [-10, 5], [10, 5], result), false)


/*
  No intersection

      (-2, 5)  o
                 \
  (-10, 0) o----o  o (2, 0)
              (0, 0)

*/
t.equal(segseg([-10, 0], [0, 0], [-2, 5], [2, 0], result), false)


/*
  No intersection

      (-2, 5)  o
               |
               o (-2, 1)
  (-10, 0) o----o
              (0, 0)

*/
t.equal(segseg([ -10, 0], [0, 0], [-2, 5], [-2, 1], result), false)


/*
  No intersection

    (-5, 5) o
           /
          / (-10, 0)
         /o-----------o
        o            (0, 0)
    (-25, -5)

*/
t.equal(segseg([-10, 0], [0, 0], [-5, 5], [-25, -5], result), false)
