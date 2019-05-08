document.addEventListener('keydown', e => {
    fetch(`/key?way=d&key=${e.key}`);
});
document.addEventListener('keyup', e => {
    fetch(`/key?way=u&key=${e.key}`);
});

let canvas = document.getElementById('joystick');

let isPressed = false;
let count = 0;

canvas.addEventListener('mousedown', e => {
    isPressed = true;
});

canvas.addEventListener('mouseup', e => {
    isPressed = false;
});

canvas.addEventListener('mousemove', e => {
    if (isPressed) {
        if (count++ > 50) {
            count = 0;
            let percent = {
                x: Math.floor(e.offsetX / 200 * 127),
                y: Math.floor(e.offsetY / 200 * 127)
            };
            console.log(percent);
            fetch(`/joystick?x=${percent.x}&y=${percent.y}`);
        }
    }
});

function auto() {
    fetch('/auto');
}

function manuel() {
    fetch('/manuel');
}