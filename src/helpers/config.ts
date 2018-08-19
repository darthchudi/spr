export function resolveMongoDB(){
    if(process.env.NODE_ENV === "staging"){
        return process.env.MONGODB_URL;
    }

    return "mongodb://localhost:27017/superhero"
}