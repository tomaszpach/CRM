let $stackedChart = document.getElementById("stacked-chart"),
    stackedChart = new Chart($stackedChart, {
        type: 'bar',
        data: {
            labels: ["Konrad D.", "Jacek R.", "Wioletta N.", "Radosław R.", "Małgorzata L.", "Izabela B.", "Piotr M."],
            datasets: [
                {
                    label: 'Email komunikator',
                    data: [219, 303, 238, 199, 230, 248, 138],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1
                },
                {
                    label: 'Telefon',
                    data: [220, 117, 84, 72, 66, 30, 45],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Spotkanie w biurze',
                    data: [45, 12, 57, 88, 59, 2, 2],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Wyjazd do klienta',
                    data: [65, 18, 10, 8, 22, 2, 1],
                    backgroundColor: 'rgba(90, 86, 255, 0.2)',
                    borderColor: 'rgba(90, 86, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Montaż',
                    data: [3, 4, 7, 5, 0, 1, 1],
                    backgroundColor: 'rgba(230, 86, 255, 0.2)',
                    borderColor: 'rgba(230, 86, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: false
                }],
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

let $lineChart = document.getElementById("line-chart"),
    lineChart = new Chart($lineChart, {
        type: 'line',
        data: {
            labels: ["Okno 1", "Okno 2", "Okno 3", "Okno 4", "Okno 5", "Okno 6", "Okno 7"],
            datasets: [
                {
                    label: 'NETTO',
                    data: [219, 303, 238, 199, 230, 248, 138],
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    lineTension: 0
                },
                {
                    label: 'NETTO po rabatach',
                    data: [199, 287, 221, 187, 218, 216, 111],
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    lineTension: 0
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: false
                }],
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

$("#mini-chart-balance2").sparkline([1, 4, 6, 2, 0, 5, 6, 4], {
    type: 'bar',
    height: '30px',
    barWidth: 6,
    barSpacing: 2,
    barColor: 'rgba(255,99,132,0.7)',
    negBarColor: '#0aa699'
});