import {Product} from './product.model';

export class Person {
    name: string;
    products: Product[];
    fileSize: number;
    modified: number;
    active: boolean;

    constructor(name: string, products: Product[], fileSize: number, modified: number) {
        this.name = name;
        this.products = products;
        this.fileSize = fileSize;
        this.modified = modified;
        this.active = true;
    }
}
