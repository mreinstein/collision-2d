import Canvas, { CanvasRenderingContext2D, dataURLtoFile } from 'https://deno.land/x/canvas@v1.4.2/mod.ts'


let m, c, o;

for (let i=0; i < Deno.args.length - 1; i++) {
    const a = Deno.args[i]
    if (a === '--module' || a === '-m')
        m = Deno.args[i+1]
    else if (a === '--count')
        c = parseInt(Deno.args[i+1], 10)
    else if (a === '--output')
        o = Deno.args[i+1]
}

if (!m) {
    console.error('module path not found, exiting')
    Deno.exit(1)
}

if (!c) {
    console.error('frame count not found, exiting')
    Deno.exit(1)
}

if (!o) {
    console.error('output not found, exiting')
    Deno.exit(1)
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 180

const canvas = Canvas.MakeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

ctx.translate(0.5, 0.5)


const figure = await import(`./${m}`)


const ex = figure.default.init(ctx, CANVAS_WIDTH, CANVAS_HEIGHT)

//const FPS = 60

// setting this to 1/ 60 causes the sphere/segment collision test to not work
// probably due to differences in rounding precision between deno and v8?
// hardcoding this to a very close approximation seems to solve the problem
const DT = 0.01666 //1 / FPS

const padLength = ('' + c).length

for (let i=0; i < c; i++) {
    figure.default.draw(ex, DT)
    const data = dataURLtoFile(canvas.toDataURL())
    const padded = ('' + i).padStart(padLength, '0')
    Deno.writeFileSync(`out_${padded}.png`, data)
}

await Deno.run({
    cmd: [ 'apngasm', '-o', o, 'out_*.png', '--delay=16', '--force' ]
}).status()


for (let i=0; i < c; i++) {
    const padded = ('' + i).padStart(padLength, '0')
    Deno.removeSync(`out_${padded}.png`)
}
