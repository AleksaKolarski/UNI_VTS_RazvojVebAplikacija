import ApexCharts from "apexcharts";

export class Chart {

    chart: ApexCharts;
    defaultOptions: ApexCharts.ApexOptions;

    constructor(selector: string) {
        this.defaultOptions = {
            chart: {    // podesavanje chart-a
                height: 600,
                type: 'bar',
                stacked: true,
                width: '100%',
                animations: {
                    enabled: false
                },
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '80%',
                }
            },
            series: [   // lista proizvoda
                // {   // ovo ce biti proizvod
                //     name: '',   // ime proizvoda
                //     data: [
                //         {
                //             x: new Date(),  // datum u string obliku | timestamp u number obliku
                //             y: 0    // vrednost za ovaj proizvod na ovaj dan
                //         }
                //     ]
                // }
            ],
            dataLabels: {
                enabled: false
            },
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Vreme',
                    offsetY: 10
                },
                labels: {
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: 'MMM \'yy',
                        day: 'dd MMM',
                        hour: 'HH:mm'
                    },

                }
            },
            yaxis: {
                min: 0,
                max: 20,
                title: {
                    text: 'Porudzbine'
                }
            },
            grid: {
                borderColor: '#e7e7e7'
            },
            legend: {
                show: false
            },
            responsive: [
                {
                    breakpoint: 481,
                    options: {
                        chart: {
                            height: 450
                        }
                    }
                },
                {
                    breakpoint: 129,
                    options: {
                        chart: {
                            height: 170
                        }
                    }
                }
            ]
        };
        this.chart = new ApexCharts(document.querySelector(selector), this.defaultOptions);
    }

    public updateSeries(series: []) {
        this.chart.updateSeries(series);
    }

    public render() {
        this.chart.render();
    }
}
