export class Product {
    public name: string;
    public count: number;
    public dates: Map<string, number>;

    public active: boolean;

    constructor(name: string, count: number) {
        this.name = name;
        this.count = count;
        this.dates = new Map<string, number>();
        this.active = true;
    }
}
