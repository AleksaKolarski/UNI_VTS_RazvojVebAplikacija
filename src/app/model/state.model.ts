import {Person} from './person.model';
import {Moment} from 'moment';

export class State {
    public persons: Map<string, Person>;
    public dateMax?: Moment;
    public dateMin?: Moment;

    constructor() {
        this.persons = new Map<string, Person>();
    }
}
