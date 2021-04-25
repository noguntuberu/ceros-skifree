/** */
export async function delay(seconds = 0) {
    return await new Promise((resolve, reject) => setTimeout(resolve, (seconds * 1000)));
}

export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function intersectTwoRects(rect1, rect2) {
    return !(rect2.left > rect1.right ||
        rect2.right < rect1.left ||
        rect2.top > rect1.bottom ||
        rect2.bottom < rect1.top);
}

export function createSplashScreen(isPause = false) {
    let documentBody = document.body;
    let veil = document.createElement('div');
    veil.classList.add('splash-veil');

    let wrapper = document.createElement('div');
    wrapper.classList.add("splash-wrapper");

    let splashHeader = document.createElement('h3');
    splashHeader.classList.add("splash-title");
    wrapper.appendChild(splashHeader);

    if (isPause) {
        splashHeader.textContent = "Game Paused";

        let pauseText = document.createElement('p');
        pauseText.textContent = "** Press Space to continue **";

        wrapper.appendChild(pauseText);
    } else {
        splashHeader.textContent = "GAME OVER";

        let retryButtom = document.createElement("button");
        retryButtom.textContent = "RESET GAME";
        retryButtom.classList.add("retry-btn");
        retryButtom.addEventListener('click', () => location.reload(), { once: true });

        wrapper.appendChild(retryButtom);
    }

    veil.appendChild(wrapper);
    documentBody.appendChild(veil);
}

export function hideSplashScreen() {
    let veil = document.querySelector(".splash-veil");
    veil.remove();
}

export class Rect {
    left = 0;
    top = 0;
    right = 0;
    bottom = 0;

    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}