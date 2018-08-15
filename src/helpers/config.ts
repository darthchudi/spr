export function resolveMongoDB(env? : string){
    if(process.env.NODE_ENV === "staging"){
        return process.env.MONGODB_URL;
    }

    const envObject = !!env ? env : process.env.NODE_ENV;

    return envObject === "development" ? "mongodb://localhost:27017/superhero" : "REMOTE MONGO URL";
}