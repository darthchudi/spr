import Mongoose from "mongoose";

export interface ISuperhero{
    govermentName: string;
    superheroName: string;
    superpowers: string[];
    trait: string,
    city: string,
    friends: string[]
    password: string
}

export interface SuperheroDocument extends ISuperhero, Mongoose.Document{
}

const SuperHeroSchema = new Mongoose.Schema({
    govermentName: {
        type: String,
        trim: true
    },
    superheroName: {
        unique: true,
        type: String,
        trim: true
    },
    superpowers: [String],
    trait: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    friends: [String],
    password: String
});

export default Mongoose.model<SuperheroDocument>("Superhero", SuperHeroSchema);
