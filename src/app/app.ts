import {Chart} from './chart';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Person} from './model/person.model';
import * as utils from './utils';
import {returnFileSize} from './utils';
import {State} from './model/state.model';
import {Product} from './model/product.model';

export const run = () => {
    let chart: Chart;
    let inpSearch: HTMLInputElement | null;
    let chkSum: HTMLInputElement | null;
    let inpFile: HTMLInputElement | null;
    let divPersonList: HTMLElement | null;
    let state: State;

    chart = new Chart('#chart');
    chart.render();

    state = new State();

    inpSearch = document.querySelector('#inpSearch');
    chkSum = document.querySelector('#chkSum');
    inpFile = document.querySelector('#inpFile');
    divPersonList = document.querySelector('#div-person-list');
    if (inpSearch && chkSum && inpFile && divPersonList) {

        // TEXT INPUT AUTOFOCUS
        fromEvent(document, 'keydown')
            .subscribe(
                value => {
                    if (inpSearch) inpSearch.focus();
                }
            );

        // TEXT INPUT
        fromEvent(inpSearch, 'input')
            .pipe(
                map<Event, string>((event: Event) => {
                    return (event.target as HTMLInputElement).value;
                }),
                debounceTime(600),
                distinctUntilChanged()
            )
            .subscribe(
                value => {
                    render();
                }
            );

        // CHECKBOX INPUT
        fromEvent(chkSum, 'change')
            .pipe(
                map<Event, boolean>((event: Event) => {
                    return (event.target as HTMLInputElement).checked;
                })
            )
            .subscribe(
                value => {
                    render();
                }
            );

        // FILE INPUT
        fromEvent(inpFile, 'change')
            .pipe(
                map<Event, FileList>((event: Event) => {
                    return (event.target as HTMLInputElement).files as FileList;
                })
            )
            .subscribe(
                fileList => {
                    if (fileList.length > 0) {
                        Array.from(fileList).forEach(file => {
                            if (!state.persons.has(file.name)) {
                                utils.parse(file, state)
                                    .subscribe(
                                        products => {
                                            const person: Person = new Person(file.name, products, file.size, file.lastModified);
                                            products.forEach(p => {
                                                p.owner = person;
                                            });
                                            state.persons.set(file.name, person);

                                            const div = document.createElement('div');
                                            div.classList.add('div-person');
                                            div.id = 'div-person-' + person.name;

                                            const chk = document.createElement('input');
                                            chk.type = 'checkbox';
                                            chk.checked = person.active;
                                            fromEvent(chk, 'change')
                                                .pipe(
                                                    map<Event, boolean>((event: Event) => {
                                                        return (event.target as HTMLInputElement).checked;
                                                    })
                                                )
                                                .subscribe(
                                                    value => {
                                                        person.active = value;
                                                        render();
                                                    }
                                                );

                                            const span = document.createElement('span');
                                            span.classList.add('span-person-name');
                                            span.innerText = person.name;

                                            const spanSize = document.createElement('span');
                                            spanSize.innerText = '(' + returnFileSize(person.fileSize) + ')';

                                            const button = document.createElement('button');
                                            button.innerHTML = '&#x1F5D9';
                                            fromEvent(button, 'click')
                                                .subscribe(
                                                    value => {
                                                        div.parentElement?.removeChild(div);
                                                        state.persons.delete(person.name);
                                                        render();
                                                    }
                                                );
                                            div.appendChild(chk);
                                            div.appendChild(span);
                                            div.appendChild(spanSize);
                                            div.appendChild(button);
                                            divPersonList?.appendChild(div);
                                            render();
                                        }
                                    );
                            }
                        });
                        if (inpFile) inpFile.value = '';
                    }
                }
            );
    }

    function render() {
        if (inpSearch && chkSum) {
            if (inpSearch.value.length <= 2) {
                utils.render(chart, new State(), '', chkSum.checked, productStateChange);
            } else {
                utils.render(chart, state, inpSearch.value, chkSum.checked, productStateChange);
            }
        }
    }

    const productStateChange = (product: Product, checked: boolean) => {
        product.active = checked;
        render();
    };
};
