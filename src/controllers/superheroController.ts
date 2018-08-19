import { Request, Response } from 'express';
import { default as Superhero, SuperheroDocument } from '../models/Superhero';
import {
  default as FriendRequest,
  FriendRequestDocument,
} from '../models/FriendRequests';
import { validateSuperheroInput } from '../helpers/validator';
import { valid } from 'joi';
import jwt from 'jsonwebtoken';

interface SuperheroResponse {
  govermentName: string;
  superheroName: string;
  superpowers: string[];
  trait: string;
  city: string;
  friends: string[];
}

export async function createSuperHero(req: Request, res: Response) {
  const {
    error: validationError,
    value: validatedInput,
  } = validateSuperheroInput(req.body);

  if (validationError) {
    res.status(401).json(validationError.details);
    return;
  }

  const existingHero = await Superhero.findOne({
    superheroName: validatedInput.superheroName,
  });

  if (existingHero) {
    res.status(401).json({
      message: 'Super hero name is taken already',
    });
    return;
  }

  const newSuperhero = new Superhero(validatedInput);
  newSuperhero.save((err, superhero) => {
    if (err) {
      res.status(500).json({
        message: 'Could not create superhero',
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
      if (err) return res.status(500).json({ message: 'An error occured' });

      if (!superhero)
        return res.status(404).json({ message: 'Superhero does not exist' });

      superhero.comparePassword(
        plainText,
        (err: any, isMatch: boolean): any => {
          if (err) return res.status(500).json({ message: 'An error occured' });

          if (!isMatch)
            return res.status(401).json({ message: 'Invalid Password' });

          const response = superhero.toObject();
          delete response.password;

          const token = jwt.sign({ response }, <string>process.env.JWT_SECRET, {
            expiresIn: '3h',
          });

          res.status(200).json({
            token,
          });
        }
      );
    }
  );
}

export function getSuperHero(req: Request, res: Response) {
  var token = req.headers.authorization;

  jwt.verify(
    <string>token,
    <string>process.env.JWT_SECRET,
    (err: any, superhero: any): void => {
      if (err) {
        res
          .status(401)
          .json({ message: 'Token has either expired or is invalid' });
        return;
      }

      res.status(200).json({ superhero });
    }
  );
}

export async function getAllSuperheros(_req: Request, res: Response) {
  try {
    const query = Superhero.find();
    query.select('-password');
    const response = await query.exec();
    return res.status(200).json({ response });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
}

export async function getSuperheroFriends(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const superhero = await Superhero.findById(id);
    if (superhero) {
      const { superheroName, friends } = superhero;
      return res.status(200).json({ id, superheroName, friends });
    } else {
      return res.status(404).json({ message: 'Superhero not found' });
    }
  } catch (e) {
    return res.status(500).json({ message: e });
  }
}

export async function sendFriendRequest(req: Request, res: Response) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Unauthorized action!',
    });
  }

  const authorization = <string>req.headers.authorization;
  const [_, token] = authorization.split(' ');
  const recieverId = req.body.reciever;
  const {
    response: { _id: senderId },
  }: any = await jwt.verify(token, <string>process.env.JWT_SECRET);

  Superhero.findById(recieverId, (err, reciever) => {
    if (err || !reciever)
      return res.status(500).json({
        message:
          'There was an error finding the reciever of the friend request',
      });

    const newFriendRequest = new FriendRequest({
      sender: senderId,
      reciever: reciever._id,
    });

    newFriendRequest.save((err, _sentRequest) => {
      if (err)
        return res.status(500).json({
          message: 'There was an error sending the friend request',
        });

      return res.status(200).json({
        message: `Friend request successfully sent to ${
          reciever.superheroName
        }`,
      });
    });
    return;
  });
  return;
}
