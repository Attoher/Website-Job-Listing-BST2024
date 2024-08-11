window.onload = function() {
    var loader = document.getElementById('loader');
    setTimeout(function() {
        loader.style.display = 'none';
    }, 1000);
};

document.addEventListener('DOMContentLoaded', () => {
    adjustJoblistHeight();
    window.addEventListener('resize', adjustJoblistHeight);

    const observer = new MutationObserver(() => adjustJoblistHeight());
    observer.observe(document.body, { childList: true, subtree: true });
});

document.documentElement.style.overflowX = 'hidden';
document.body.style.overflowX = 'hidden';
document.documentElement.style.width = '100%';
document.body.style.width = '100%';
window.addEventListener('scroll', function() {
    if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
    }
});

function adjustJoblistHeight() {
    setTimeout(() => {
        const hill5 = document.getElementById('hill5');
        const joblist = document.querySelector('.joblist');
        if (hill5 && joblist) {
            joblist.style.height = hill5.clientHeight + 'px';
        }
    }, 1000);
}

let text = document.getElementById('text');
let leaf = document.getElementById('leaf');
let hill1 = document.getElementById('hill1');
let hill4 = document.getElementById('hill4');
let hill5 = document.getElementById('hill5');

let defaultValue = 90;
let currentValue = defaultValue;

function updateValue() {
    let windowWidth = window.innerWidth;
    let initialWidth = 1000;
    let percentageChange = ((initialWidth - windowWidth) / initialWidth) * 50000;
    let valueChange = Math.floor(percentageChange / 5);
    currentValue = defaultValue + valueChange;
    if (currentValue < 50) currentValue = 50;
    if (currentValue > 150) currentValue = 150;
}

window.addEventListener('resize', updateValue);
updateValue();

window.addEventListener('scroll', () => {
    let val = currentValue / 100;
    let value = val * window.scrollY;
    let maxScrollValue = window.innerHeight;
    value = value > maxScrollValue ? maxScrollValue : value;
    text.style.marginTop = value * 2.5 + 'px';
    leaf.style.top = value * -1.5 + 'px';
    leaf.style.left = value * 1.5 + 'px';
    hill5.style.left = value * 1.5 + 'px';
    hill4.style.left = value * -1.5 + 'px';
    hill1.style.top = value * 1 + 'px';
});

function startAutoScrollOnIdle(timeout = 5000, scrollSpeed = 1, intervalTime = 20, pauseDuration = 5000) {
    let scrollInterval;
    let idleTimeout;
    let activityTimeout;
    let scrollDirection = 1;
    let isPaused = false;
    let isActive = false;

    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            if (isPaused) return;

            let scrollTop = window.scrollY;
            let scrollHeight = document.documentElement.scrollHeight;
            let viewportHeight = window.innerHeight;

            if (scrollDirection === 1 && (scrollTop + viewportHeight >= scrollHeight)) {
                pauseScroll(pauseDuration);
                scrollDirection = -1;
            } else if (scrollDirection === -1 && scrollTop <= 0) {
                pauseScroll(pauseDuration);
                scrollDirection = 1;
            }

            window.scrollBy(0, scrollSpeed * scrollDirection);
        }, intervalTime);
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }

    function pauseScroll(duration) {
        isPaused = true;
        setTimeout(() => {
            isPaused = false;
        }, duration);
    }

    function resetTimer() {
        if (isActive) {
            clearTimeout(idleTimeout);
            clearTimeout(activityTimeout);

            stopAutoScroll();

            activityTimeout = setTimeout(() => {
                if (isActive) {
                    startAutoScroll();
                }
            }, timeout);
        }
    }

    function toggleAutoScroll() {
        isActive = document.getElementById('toggleSwitch').checked;
        if (!isActive) {
            stopAutoScroll();
            clearTimeout(idleTimeout);
            clearTimeout(activityTimeout);
        } else {
            resetTimer();
        }
    }

    document.getElementById('toggleSwitch').addEventListener('change', toggleAutoScroll);

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
}

startAutoScrollOnIdle();