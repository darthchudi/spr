import express from "express";
import {createSuperHero, loginSuperhero, getSuperHero, getAllSuperheros, getSuperheroFriends, sendFriendRequest} from "../controllers/superheroController"
import { Response } from "express-serve-static-core";
const router = express.Router();

/* GET home page. */
router.post('/create', createSuperHero);

router.post('/login', loginSuperhero);

router.get('/superhero', getSuperHero);

router.get('/superheros', getAllSuperheros);

router.get('/superhero/friends/:id', getSuperheroFriends);

router.post('/requests/send', sendFriendRequest)

export default router;