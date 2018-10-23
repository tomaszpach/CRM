/**
 * Init and reload buttons for animate numbers and progress bars
 */
const $pageContent = document.getElementById('page-content'),
    $tiles = $pageContent.getElementsByClassName('tiles'),
    $tileWrappers = $pageContent.getElementsByClassName('tile-wrapper'),
    $restoreAllTilesButton = document.getElementById('restore-all-tiles'),
    $popup = document.getElementById('removed-popup');

let $tileWrapper,
    popupButtonTimeout;

$restoreAllTilesButton.addEventListener('click', () => {
    for (let i = 0; i < $tileWrappers.length; i++) {
        const $tile = $tileWrappers[i];

        $tile.classList.remove('hide');
    }
});

/**
 * Init animate numbers on document ready
 * @param numbersClass - animate numbers class (default: animate-number)
 */
const initAnimateNumbers = (numbersClass = 'animate-number') => {
    const numbers = $pageContent.getElementsByClassName(numbersClass);
    Object.values(numbers).forEach(number => {
        const {value, animationDuration} = number.dataset;
        $(number).animateNumbers(value, true, parseInt(animationDuration, 10));
    });
};

/**
 * Init animate progress bar on document read
 * Add [data-animation-duration] to change animation duration time (default: 1000)
 * @param progressClass - progress bar class (default: animate-progress-bar)
 */
const initProgressBars = (progressClass = 'animate-progress-bar') => {
    const progress = $pageContent.getElementsByClassName(progressClass);
    Object.values(progress).forEach(bar => {
        const {percentage = "0", animationDuration = 1000} = bar.dataset;
        bar.style.transition = `all ${animationDuration}ms`;
        bar.style.width = percentage;
    });
};

const restoreRemovedElement = () => {
    const $animateNumber = $tileWrapper.getElementsByClassName('animate-number')[0],
        $progressBar = $tileWrapper.getElementsByClassName('progress-bar')[0],
        animateNumber_DataSet = $animateNumber ? $animateNumber.dataset : null,
        progressBar_DataSet = $progressBar ? $progressBar.dataset : null;

    $popup.addEventListener('click', function () {
        $tileWrapper.classList.remove('hide'); // show tile
        $popup.classList.add('hide'); // hide popup
    });

    // todo move this somewhere else because now it doesnt work as it should be
    // animation start on click on X
    reloadAnimateNumbers($animateNumber, animateNumber_DataSet);
    reloadAnimateProgressBar($progressBar, progressBar_DataSet)
};

/**
 * Add event listener to all tiles found and hook reload and remove functions to it
 */
for (let i = 0; i < $tiles.length; i++) {
    $tiles[i].addEventListener('click', (event) => {
        const $target = event.target,
            path = event.path || (event.composedPath && event.composedPath());

        reloadTile($target, path);
        hideTile($target, path);
    })
}

/**
 * Reload numbers and progress bar on click
 * @param $target - clicked element. Required to check if we clicked on .reload DOM element
 * @param path - path from clicked element to document
 */
const reloadTile = ($target, path) => {
    if ($target.matches('.reload')) {
        path.forEach(element => {
            if (element.classList && (element.classList.contains('tiles-body') || element.classList.contains('tiles-chart'))) {
                const $animateNumber = element.getElementsByClassName('animate-number')[0],
                    $progressBar = element.getElementsByClassName('progress-bar')[0],
                    animateNumber_DataSet = $animateNumber ? $animateNumber.dataset : null,
                    progressBar_DataSet = $progressBar ? $progressBar.dataset : null;

                $animateNumber ? reloadAnimateNumbers($animateNumber, animateNumber_DataSet) : null;
                $progressBar ? reloadAnimateProgressBar($progressBar, progressBar_DataSet) : null;
            }
        });
    }
};

/**
 * Remove whole tile with wrapper from DOM element.
 * !! Take a look how .remove() method works. It always remove one element above tile !!
 * @param $target - clicked element. Required to check if we clicked on .remove DOM element
 * @param path - path from clicked element to document
 */
const hideTile = ($target, path) => {
    if ($target.matches('.remove')) {
        window.clearTimeout(popupButtonTimeout); // Clear popupButtonTimeout. Fix issue when closing few tiles in a row and button disappear

        updateDomElement(path);
        $tileWrapper.classList.add('hide'); // go up one element and HIDE tile with wrapper.
        $popup.classList.remove('hide'); // show popup to restore hidden tile

        let tileTitle = $tileWrapper.getElementsByClassName("tiles-title")[0].innerText;
        $popup.innerText = `Przywróć ${tileTitle}`;
        popupButtonTimeout = setTimeout(() => {
            $popup.classList.add('hide')
        }, 3500);

        restoreRemovedElement()
    }
};

const updateDomElement = (path) => {
    let tilesPathIndex = null;

    path.forEach((element, index) => {
        if (element.classList && (element.classList.contains('tiles') || element.classList.contains('widget'))) {
            tilesPathIndex = index;
        }
    });
    $tileWrapper = path[tilesPathIndex + 1];
};

/**
 * Reload animate number function.
 * !! Remember to change [data-value-start] if you want to start from other value than 0 !!
 * Add [data-value-start] to change start value (default: 0)
 * Example: data-value-start="2137"
 * @param element - DOM element to animate (default: span with class .animate-number)
 * @param dataSet - data taken from element
 */
const reloadAnimateNumbers = (element, dataSet) => {
    const {valueStart = 0, value, animationDuration} = dataSet;

    element.innerText = valueStart;
    $(element).animateNumbers(value, true, parseInt(animationDuration, 10));
};

/**
 * Reload animate progress bar function.
 * Add [data-animation-duration] to change animation duration time (default: 1000)
 * @param element - DOM element to animate (default: span with class .animate-progress-bar)
 * @param dataSet - data taken from element
 */
const reloadAnimateProgressBar = (element, dataSet) => {
    const {percentage, animationDuration = 1000} = dataSet,
        time = 100;

    element.style.transition = `all ${time}ms`;
    element.style.width = "0%";

    setTimeout(() => {
        element.style.transition = `all ${animationDuration}ms`;
        element.style.width = percentage;
    }, time);
};


$(document).ready(function () {
    initAnimateNumbers();
    initProgressBars();
});