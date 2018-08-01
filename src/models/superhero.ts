import Mongoose from "mongoose";

export interface ISuperhero{
    govermentName: string;
    superheroName: string;
    superpowers: string[];
    trait: string,
    city: string,
    friends: string[] 
}

interface SuperheroModel extends ISuperhero, Mongoose.Document{}

const SuperHeroSchema = new Mongoose.Schema({
    govermentName: {
        type: String,
        trim: true
    },
    superheroName: {
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
    friends: [String]
});

export default Mongoose.model<SuperheroModel>("Superhero", SuperHeroSchema);
