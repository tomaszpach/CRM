const setupEasyPieChart = (DOMElement, config) => {
    const $element = document.getElementById(DOMElement),
        $pieTextWrapper = $element.getElementsByClassName('easy-pie-percent')[0],
        $pieTextSpan = $pieTextWrapper.getElementsByTagName('span'),
        dataSet = $element.dataset,
        $DOMElement = jQuery('#' + DOMElement);

    const {start, end, barcolor = 'blue', trackcolor = '#e5e9ec', firstRow, secondRow} = dataSet;

    // Oblicz procenty z poczatkowej i koncowej wartosci
    const calculatePercent = parseInt(start, 10) / parseInt(end, 10);
    let fixedPercent = (calculatePercent.toFixed(3)) * 100;

    // todo tylko jeden wykres ma byc zmniejszony o 100%
    fixedPercent > 100 ? fixedPercent = (fixedPercent - 100).toFixed(1) : fixedPercent;
    console.log(fixedPercent);

    // Ustaw procenty w spanie
    const getSpanText = `${start} / ${end}`;

    // Ustaw tekst wewnątrz wykresu.
    // Domyślnie bierze % z [data-start] i [data-end]
    // Można również ustawić własne poprzez [data-first-row] i [data-second-row]
    if (firstRow) {
        $pieTextSpan[0].classList.add('remove-percent');
    }
    firstRow ? $pieTextSpan[0].innerText = firstRow : $pieTextSpan[0].innerText = fixedPercent; // first row in chart
    secondRow ? $pieTextSpan[1].innerText = secondRow : $pieTextSpan[1].innerText = getSpanText; // second row in chart

    config = {...config, barColor: barcolor, trackColor: trackcolor};

    $DOMElement.easyPieChart(config);
    $DOMElement.data('easyPieChart').update(fixedPercent);
};

const defaultConfig = {
    lineCap: 'round',
    rotate: 180,
    lineWidth: 9,
    scaleColor: false
};

// setupEasyPieChart('aktywne-konta', defaultConfig);
setupEasyPieChart('konwersja-leadow', defaultConfig);
setupEasyPieChart('konwersja-ofert', defaultConfig);
setupEasyPieChart('nieskontraktowane', defaultConfig);
setupEasyPieChart('utracone', defaultConfig);
