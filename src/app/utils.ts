import {Product} from './model/product.model';
import Papa, {ParseResult} from 'papaparse';
import {Observable} from 'rxjs';
import {Chart} from './chart';
import moment, {Moment} from 'moment';
import {State} from './model/state.model';
import {Person} from './model/person.model';

const dateFormat = 'DD.MM.YYYY.';

export function returnFileSize(number: number): string {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    }
    return (number / 1048576).toFixed(1) + 'MB';
}

export function parse(file: File, state: State): Observable<Product[]> {
    return new Observable<Product[]>(
        subscriber => {
            Papa.parse(
                file,
                {
                    worker: true,
                    skipEmptyLines: true,
                    complete: results => {
                        subscriber.next(parseResult(results, state));
                        subscriber.complete();
                    }
                }
            )
        }
    );
}

function parseResult(result: ParseResult, state: State): Product[] {
    const productList: Array<Product> = new Array<Product>();
    result.data.reduce(
        (a: Array<Product>, row, index) => {
            if (index != 0) {
                const date = moment('02.' + row[1].substr(3), dateFormat);
                const name = row[2];

                if (!state.dateMin || !state.dateMax) {
                    state.dateMin = date;
                    state.dateMax = date;
                } else {
                    if (date.isBefore(state.dateMin)) {
                        state.dateMin = date;
                    }
                    if (date.isAfter(state.dateMax)) {
                        state.dateMax = date;
                    }
                }

                let i = a.findIndex((product: Product) => product.name === name);
                if (i === -1) {
                    a.push(new Product(name, 1));
                    a[a.length - 1].dates.set(date.format(dateFormat), 1);
                } else {
                    a[i].count++;
                    if (a[i].dates.has(date.format(dateFormat))) {
                        const currValue = a[i].dates.get(date.format(dateFormat));
                        if (currValue !== undefined) {
                            a[i].dates.set(date.format(dateFormat), currValue + 1);
                        }
                    } else {
                        a[i].dates.set(date.format(dateFormat), 1);
                    }
                }
            }
            return a;
        },
        productList
    );
    return productList;
}


// export function render(chart: Chart, state: State, search: string, sumAll: boolean) {
//     const series: ApexAxisChartSeries = [] as ApexAxisChartSeries;
// }

export function render(chart: Chart, state: State, search: string, sumAll: boolean) {
    const series: ApexAxisChartSeries = [] as ApexAxisChartSeries;

    if (!sumAll) {
        state.persons.forEach((person) => {
            if (person.active) {
                person.products.forEach((product, index) => {
                    if (product.active) {
                        if (search ? product.name.toLowerCase().includes(search.toLowerCase()) : true) {
                            const productData = [] as { x: Date, y: number }[];
                            if (state.dateMin && state.dateMax) {
                                for (let itDate: Moment = moment(state.dateMin); itDate.isSameOrBefore(state.dateMax, 'month'); itDate.add(1, 'month')) {
                                    const count: number | undefined = product.dates.get(itDate.format(dateFormat));
                                    productData.push(
                                        {
                                            x: itDate.toDate(),
                                            y: count ? count : 0
                                        }
                                    );
                                }
                            }
                            series.push({
                                name: product.name,
                                data: productData
                            });
                        }
                    }
                });
            }
        });
    } else {
        const allDates: Map<string, number> = new Map<string, number>();
        state.persons.forEach((person: Person) => {
            if (person.active) {
                person.products.forEach((product: Product) => {
                    if (product.active) {
                        if (search ? product.name.toLowerCase().includes(search.toLowerCase()) : true) {
                            product.dates.forEach((value, key) => {
                                if (allDates.has(key)) {
                                    const currValue = allDates.get(key);
                                    if (currValue !== undefined && value !== undefined) {
                                        allDates.set(key, currValue + value);
                                    }
                                } else {
                                    allDates.set(key, value);
                                }
                            });
                        }
                    }
                });
            }
        });
        const productData = [] as { x: Date, y: number }[];

        for (let itDate: Moment = moment(state.dateMin); itDate.isSameOrBefore(state.dateMax, 'month'); itDate.add(1, 'month')) {
            const count: number | undefined = allDates.get(itDate.format(dateFormat));
            productData.push(
                {
                    x: itDate.toDate(),
                    y: count ? count : 0
                }
            );
        }
        series.push({
            name: 'All',
            data: productData
        });
    }
    console.log(series);
    chart.updateSeries(series as []);
}
