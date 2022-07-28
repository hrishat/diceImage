import './less/style.less'

import * as M from 'materialize-css';
import { toDiceFaces, drawDiceFace, DICE_SIDE } from './DiceTransformer';


document.addEventListener('DOMContentLoaded', (ev) => init());

/**
 * 
 * @param {CanvasRenderingContext2D} target 
 * @param {Array<number>} diceData 
 * @param {number} width 
 * @param {number} height 
 */
function drawDices(target, diceData, width) {
    let y = 0, x = 0, i = 0;
    for (; i < diceData.length; ++i) {
        for (x = 0; x < width; ++x) {
            ++i;
            drawDiceFace(target, x * DICE_SIDE, y, diceData[i]);
        }
        y += DICE_SIDE;
    }
}

function toRatio(width, height) {
    const side = document.getElementById('maxSize').value;
    if (width > height) {
        return width / side;
    }
    return height / side;

}

/**
 * 
 * @param {HTMLCanvasElement} canvas canvas
 */
function downloadImage() {
    let canvas = document.getElementById('downloadCanvas');
    let link = document.createElement('a');
    link.download = 'dices.png';
    canvas.toBlob(b => {
        link.href = URL.createObjectURL(b);
        link.click();
        requestAnimationFrame(() => {
            URL.revokeObjectURL(link.href);
        })
        link.removeAttribute('href');
    })
}

function init() {
    M.AutoInit();
    M.Range.init(document.querySelectorAll("input[type=range]"));
    let canvas = document.getElementById('baseCanvas');
    let target = document.getElementById('downloadCanvas');
    let ctx = canvas.getContext('2d');
    let spanWidth = document.getElementById('widthSpan');
    let spanHeight = document.getElementById('heightSpan');
    let totalDice = document.getElementById('totalDices');
    let btn = document.getElementById('downloadBtn');
    let range = document.getElementById('maxSize');
    let previewImg = document.getElementById('previewIMG');

    btn.addEventListener('click', () => {
        downloadImage();
    });



    document.getElementById("FileAttachment").addEventListener('change', function (ev) {
        document.getElementById("fileuploadurl").value = this.value.replace(/C:\\fakepath\\/i, '');
        let img = new Image;
        range.removeEventListener('change', redrawImage)
        range.addEventListener('change', redrawImage);

        function redrawImage() {
            let r = toRatio(img.width, img.height);
            let width = Math.round(img.width / r);
            let height = Math.round(img.height / r);
            spanHeight.innerText = height + '';
            spanWidth.innerText = width + '';
            totalDice.innerText = (width * height) + '';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            target.width = DICE_SIDE * (canvas.width = width);
            target.height = DICE_SIDE * (canvas.height = height);
            ctx.drawImage(img, 0, 0, width + 1, height);
            let data = ctx.getImageData(0, 0, width + 1, height);
            drawDices(target.getContext('2d'), toDiceFaces(data), width);
            previewImg.src = target.toDataURL('image/png');
            previewImg.width = width * 3;
            previewImg.height = height * 3;
        }

        img.addEventListener('load', function () {
            btn.removeAttribute('disabled');
            redrawImage();
        });

        img.src = URL.createObjectURL(ev.target.files[0]);
    });
}
