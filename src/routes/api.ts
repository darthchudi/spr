import express from 'express';
import {
  createSuperHero,
  loginSuperhero,
  getSuperHero,
  getAllSuperheros,
  getSuperheroFriends,
} from '../controllers/superheroController';

import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
} from '../controllers/friendRequestsController';

import { authorizedRequest } from '../helpers';

const router = express.Router();

/* GET home page. */
router.post('/create', createSuperHero);

router.post('/login', loginSuperhero);

router.get('/superhero', getSuperHero);

router.get('/superheros', getAllSuperheros);

router.get('/superhero/friends/:id', getSuperheroFriends);

router.post('/requests/send', authorizedRequest(sendFriendRequest));

router.get('/requests/find/:criteria', authorizedRequest(getFriendRequests));

router.post('/requests/accept', authorizedRequest(acceptFriendRequest));

export default router;
