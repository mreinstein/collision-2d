import common from "./common.js";
import rayCircleOverlap from "../src/ray-circle-overlap.js";
import { vec2 } from "wgpu-matrix";

function init(context, width, height) {
    return {
        angle: 0,
        box: {
            position: [0, 0],
            width: 32,
            height: 32,
        },
        ...common.init(context, width, height),
    };
}

function draw(data, dt) {
    common.clear(data);

    data.angle += 0.3 * Math.PI * dt;

    const pos1 = [Math.cos(data.angle) * 64, Math.sin(data.angle) * 64];

    const pos2 = [Math.sin(data.angle) * 32, Math.cos(data.angle) * 32];

    const delta = vec2.subtract(pos2, pos1);
    //const delta = [ pos2[0] - pos1[0], pos2[1] - pos1[1] ]

    const circleCenter = [0, 0];
    const circleRadius = 22;
    const contact = { mu1: NaN, mu2: NaN };

    const hit = rayCircleOverlap(
        pos1,
        pos2,
        circleCenter,
        circleRadius,
        contact,
    );

    common.drawCircle(data, circleCenter, circleRadius, "#666");

    const normal = vec2.normalize(delta);
    const startP = vec2.addScaled(pos1, normal, -200);
    const endP = vec2.addScaled(pos1, normal, 200);

    if (hit) {
        common.drawSegment(data, startP, endP, "#f00", 1, true);
        common.drawSegment(data, pos1, pos2, "#f00", 1);

        const p1 = vec2.addScaled(pos1, delta, contact.mu1);
        const p2 = vec2.addScaled(pos1, delta, contact.mu2);

        common.drawPoint(data, p1, "yellow", "μ1", 2);
        common.drawPoint(data, p2, "yellow", "μ2", 2);
    } else {
        common.drawSegment(data, startP, endP, "#0f0", 1, true);
        common.drawSegment(data, pos1, pos2, "#0f0", 1);
    }
}

export default { init, draw };
