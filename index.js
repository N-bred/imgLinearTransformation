const MAX_PIXEL_VAL = 255;
const MIN_PIXEL_VAL = 0;
const reverseArray = (arr) => [...arr].reverse();
const inverseVal = val => Math.floor(Math.abs((val / MAX_PIXEL_VAL) - 1) * MAX_PIXEL_VAL);
const inversePixel = pixel => pixel.map(inverseVal);
const inversePixelNoAlpha = pixel => {
    const [x, y, z] = pixel.map(inverseVal);
    return [x, y, z, pixel[3]];
};
const inverse2DArray = (arr) => [...arr].map(y => y.map(inversePixelNoAlpha))

const calculateValueAt = (a, b, n, i) => {
    let sign = 1;
    if (a > b) sign *= -1;
    const x = (Math.abs(a - b) / n) * sign;
    return Math.floor(a + (x * i));
};

const calculatePixels = (arr1, arr2, steps) => {
    if (arr1.length !== arr2.length) throw new Error("Images do not match in length");
    const video = [];

    for (let i = 0; i < steps + 1; ++i) {
        const frame = [];
        for (let y = 0; y < arr1.length; ++y) {
            const row = [];
            for (let x = 0; x < arr1[0].length; ++x) {
                const [x1, y1, z1, w1] = arr1[y][x];
                const [x2, y2, z2, w2] = arr2[y][x];
                const pixel = [calculateValueAt(x1, x2, steps, i), calculateValueAt(y1, y2, steps, i), calculateValueAt(z1, z2, steps, i), calculateValueAt(w1, w2, steps, i)];
                row.push(pixel);
            }
            frame.push(row);
        }
        video.push(frame);
    }

    return video;
}

const steps = 50;
const W = [255, 255, 255, 255]
const B = [0, 0, 0, 255];
const chessboard = [[B, W, B, W, B, W],
                    [W, B, W, B, W, B],
                    [B, W, B, W, B, W],
                    [W, B, W, B, W, B]];


// TESTING

const generateRandomPixel = () => [

        Math.floor(Math.random() * 256), // Red
        Math.floor(Math.random() * 256), // Green
        Math.floor(Math.random() * 256), // Blue
        255 // Alpha (fully opaque)
    ];


// Function to generate a random 2D array of RGBA pixels
const generateRandom2DArray = (width, height) => {
    const array = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push(generateRandomPixel());
        }
        array.push(row);
    }
    return array;
};

// Generate two random 2D arrays for testing
const randomArray1 = generateRandom2DArray(32, 32);
const randomArray2 = generateRandom2DArray(32, 32);

const frames = calculatePixels(randomArray1, randomArray2, steps);
// const frames = calculatePixels(chessboard, inverse2DArray(chessboard), steps);

// HTML IMPLEMENTATION


const canvas = document.querySelector('#canvas');
const rangeElement = document.querySelector('#range');
rangeElement.max = steps;
rangeElement.value = 0;


const canvasWidth = frames[0][0].length;
const canvasHeight = frames[0].length;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const ctx = canvas.getContext('2d');

rangeElement.addEventListener('input', (e) => {

    const value = parseInt(e.target.value);

    const imgData = ctx.createImageData(canvasWidth, canvasHeight);

    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const pixelIndex = (y * canvasWidth + x) * 4;
            const pixel = frames[value][y][x];
            imgData.data[pixelIndex] = pixel[0];     // Red
            imgData.data[pixelIndex + 1] = pixel[1]; // Green
            imgData.data[pixelIndex + 2] = pixel[2]; // Blue
            imgData.data[pixelIndex + 3] = pixel[3]; // Alpha
        }
    }

    ctx.putImageData(imgData, 0, 0);
});

// Trigger initial frame rendering
rangeElement.dispatchEvent(new Event('input'));