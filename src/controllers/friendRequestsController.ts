import { Request, Response } from 'express';
import { default as Superhero } from '../models/Superhero';
import {
  default as FriendRequest
} from '../models/FriendRequest';
import { decodeToken } from '../helpers';
import jwt from 'jsonwebtoken';

export async function sendFriendRequest(req: Request, res: Response) {
  const recieverId = req.body.reciever;
  let senderId: string = "";
  try {
    senderId = (await decodeToken(<string>req.headers.authorization))._id;
  } catch (e) {
    return res.status(401).json({ message: 'Token has expired' });
  }

  //We check if the user has already sent a friend request to this reciever before or if they are already friends
  try {
    const friendRequestExists = await FriendRequest.findOne({
      sender: {
        $in: [senderId, recieverId],
      },
      reciever: {
        $in: [senderId, recieverId],
      },
    });
    if (friendRequestExists)
      return res.status(401).json({
        message:
          'You have already sent a pending friend request to this person',
      });

    const usersAreFriends = await Superhero.findOne({
      _id: senderId,
      friends: recieverId,
    });
    if (usersAreFriends)
      return res.status(401).json({
        message:
          'You are already friends with this superhero',
      });
  } catch (e) {
    return res
      .status(500)
      .json({ messge: 'An error occured while sending the friend request' });
  }

  //Ensure that the reciever exists in the DB
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

export async function getFriendRequests(
  req: Request,
  res: Response
): Promise<any> {
  let superheroId: string = "";
  try {
    superheroId = (await decodeToken(<string>req.headers.authorization))._id;
  } catch (e) {
    return res.status(401).json({ message: 'Token has expired' });
  }

  const criteria = req.params.criteria;
  switch (criteria) {
    case 'sent':
      FriendRequest.find(
        { sender: superheroId, accepted: false },
        (err, allSentFriendRequests) => {
          if (err)
            return res.status(500).json({
              message: 'an error occured while fetching friend requests',
            });
          res.status(200).json({ friendRequests: allSentFriendRequests });
          return;
        }
      );
      break;
    case 'recieved':
      FriendRequest.find(
        { reciever: superheroId, accepted: false },
        (err, allRecievedFriendRequests) => {
          if (err)
            return res.status(500).json({
              message: 'an error occured while fetching friend requests',
            });
          res.status(200).json({ friendRequests: allRecievedFriendRequests });
          return;
        }
      );
      break;
    default:
      return;
  }
}

export async function acceptFriendRequest(req: Request, res: Response) {
  const friendRequestId = req.body.friendRequestId;
  let recieverId : string = "";
  try {
    recieverId = (await decodeToken(<string>req.headers.authorization))._id;
  } catch (e) {
    res.status(401).json({ message: 'Token has expired' });
  }

  FriendRequest.findOneAndUpdate(
    { _id: friendRequestId, reciever: recieverId },
    { accepted: true },
    (err, acceptedFriendRequest) => {
      if (err)
        return res
          .status(200)
          .json({
            message: 'An error occcured while accepting friend request',
          });
      
      if(!acceptedFriendRequest) return res.status(404).json({message: "Friend request does not exist"})

      return res
        .status(200)
        .json({ message: 'Successfully accepted friend request' });
    }
  );
}
