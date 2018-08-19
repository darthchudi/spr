import {Request, Response} from "express";
import jwt from "jsonwebtoken";

export function authorizedRequest(fn: Function){
  return (req: Request, res: Response) => {
    if(!req.headers.authorization){
      return res.status(401).json({
        message: 'Unauthorized action!',
      });
    }
    fn(req, res);
    return;
  }
}

export async function decodeToken(authorization: string){
  const [_, token] = authorization.split(' ');
  const superhero : any = await jwt.verify(token, <string>process.env.JWT_SECRET);
  return superhero.response;
}