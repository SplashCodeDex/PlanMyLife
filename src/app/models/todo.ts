export class Todo {
    id: string;
    title: string;
    description?: string;
    isDone: boolean;
    longitude?: string
    latitude?: string
    address?: string;
    date?: any;


    constructor(name: string, description: string){
        this.title = name;
        this.description = description;
        this.isDone = false;
    }

    public getName(): string {
        return this.title;
    }

    public setName(name: string): void {
        this.title = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public isdone(): boolean {
        return this.isDone;
    }

    public setDone(isDone: boolean): void {
        this.isDone = isDone;
    }

    public getId(): string {
        return this.id;
    }

    // New method to convert to Firestore-compatible object
    toFirestore() {
        const data: any = {
            title: this.title,
            isDone: this.isDone,
        };
        if (this.description) {
            data.description = this.description;
        }
        if (this.longitude) {
            data.longitude = this.longitude;
        }
        if (this.latitude) {
            data.latitude = this.latitude;
        }
        if (this.address) {
            data.address = this.address;
        }
        if (this.date) {
            data.date = this.date;
        }
        // Do not include 'id' when writing to Firestore, as it's the document ID
        return data;
    }
}