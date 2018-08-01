export function resolveMongoDB(env? : string){
    const envObject = !!env ? env : process.env.NODE_ENV;

    return envObject === "development" ? "mongodb://localhost:27017/superhero" : "REMOTE MONGO URL";
}