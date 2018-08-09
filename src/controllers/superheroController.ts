import { Request, Response } from "express";
import { default as Superhero, ISuperhero } from "../models/Superhero";
import { validateSuperheroInput } from "../helpers/validator";
import { valid } from "joi";
import jwt from "jsonwebtoken";

export async function createSuperHero(req: Request, res: Response) {
  const {
    error: validationError,
    value: validatedInput
  } = validateSuperheroInput(req.body);

  if (validationError) {
    res.status(401).json(validationError.details);
    return;
  }

  const existingHero = await Superhero.findOne({
    superheroName: validatedInput.superheroName
  });

  if (existingHero) {
    res.status(401).json({
      message: "Super hero name is taken already"
    });
    return;
  }

  const newSuperhero = new Superhero(validatedInput);
  newSuperhero.save((err, superhero) => {
    if (err) {
      res.status(500).json({
        message: "Could not create superhero"
      });
      return;
    }

    var response = superhero.toObject();
    delete response.password;

    res.status(200).json(response);
    return;
  });
}

export function loginSuperhero(req: Request, res: Response) {
  const superheroName = req.body.superheroName;
  const plainText = req.body.password;
  const loginSuperhero = Superhero.findOne(
    { superheroName },
    (err, superhero): any => {
      if (err) return res.status(500).json({ message: "An error occured" });

      if (!superhero)
        return res.status(404).json({ message: "Superhero does not exist" });

      superhero.comparePassword(
        plainText,
        (err: any, isMatch: boolean): any => {
          if (err) return res.status(500).json({ message: "An error occured" });

          if (!isMatch)
            return res.status(401).json({ message: "Invalid Password" });

          const token = jwt.sign({ superhero }, <string>process.env.JWT_SECRET, {expiresIn: '3h'});

          res.status(200).json({
            token
          });
        }
      );
    }
  );
}

export function getSuperHero(req: Request, res: Response){
    var token = req.headers.authorization;

    console.log(token);

    jwt.verify(<string>token, <string>process.env.JWT_SECRET, (err, data) => {
        if(err) return res.status(401).json({message: "Token has either expired or is invalid"});

        res.status(200).json({data});
    } )
}
