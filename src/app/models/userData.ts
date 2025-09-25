export class UserData {
    id?: string; // Added id property
    name: string;
    email: string;
    photoURL: string;
    phone?: string;


    constructor(name: string, email: string, photoURL: string, id?: string) { // Added id to constructor
        this.name = name;
        this.email = email;
        this.photoURL = photoURL;
        this.id = id; // Assign id
    }

    // New method to convert to Firestore-compatible object
    toFirestore() {
        const data: any = {
            name: this.name,
            email: this.email,
            photoURL: this.photoURL,
        };
        if (this.phone) {
            data.phone = this.phone;
        }
        // Do not include 'id' when writing to Firestore, as it's the document ID
        return data;
    }
}