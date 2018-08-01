import {Request, Response} from 'express';
import {default as Superhero, ISuperhero} from '../models/Superhero';
import {validateSuperheroInput} from "../helpers/validator";

export function createSuperHero(req: Request, res: Response) : void{
    const validateInput = validateSuperheroInput(req.body);

    if(validateInput.error){
        res.status(401).json(validateInput.error);
        return;
    } 

    const newSuperhero = new Superhero()

    
}