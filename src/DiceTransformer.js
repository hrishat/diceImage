

/**
 * 
 * @param {ImageData} colorInput color pixels
 * @returns {Array<number>}
 */
export function toDiceFaces(colorInput) {
    let out = [];

    let size = colorInput.width * colorInput.height * 4;
    let data = colorInput.data;
    for (let i = 0; i < size; i += 4) {
        if (data[i + 3] > 0) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            let res = Math.floor((((255 - avg) / 256)) * 6 + 1);
            out.push(res);
        } else {
            out.push(1);
        }
    }
    return out;
}


export const DICE_SIDE = 30;
const DICE_MARGIN = 4;
const DICE_CALC_SIDE = DICE_SIDE - DICE_MARGIN * 2;
const DICE_UNIT = (DICE_CALC_SIDE / 3) / 2;
const CIRCLE_RADIUS = DICE_UNIT;
const FULL_RAD = 2 * Math.PI;

const FACES = [
    ,
    [4],
    [6, 2],
    [6, 4, 2],
    [0, 2, 6, 8],
    [0, 2, 6, 8, 4],
    [0, 3, 6, 2, 5, 8]
];

const DOTS = [
    [1, 1],
    [1, 3],
    [1, 5],
    [3, 1],
    [3, 3],
    [3, 5],
    [5, 1],
    [5, 3],
    [5, 5]
]
/**
 * 
 * @param {CanvasRenderingContext2D} ctxTarget targetContexte
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} face number of the face to draw
 */
export function drawDiceFace(ctxTarget, x, y, face) {
    ctxTarget.save();
    ctxTarget.beginPath();
    ctxTarget.roundRect(x, y, DICE_SIDE, DICE_SIDE, 5).stroke();

    ctxTarget.translate(DICE_MARGIN, DICE_MARGIN);
    let dots = FACES[face];
    for (let i of dots) {
        let arr = DOTS[i];
        ctxTarget.beginPath();
        ctxTarget.arc(x + arr[0] * DICE_UNIT, y + arr[1] * DICE_UNIT, CIRCLE_RADIUS, 0, FULL_RAD);
        ctxTarget.fill();
    }
    ctxTarget.restore();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}