import express from "express";
import {createSuperHero, loginSuperhero, getSuperHero, getAllSuperheros, getSuperheroFriends} from "../controllers/superheroController"
const router = express.Router();

/* GET home page. */
router.post('/create', createSuperHero);

router.post('/login', loginSuperhero);

router.get('/superhero', getSuperHero);

router.get('/superheros', getAllSuperheros);

router.get('/superhero/friends/:id', getSuperheroFriends);

router.get('/send-friend-request')

export default router;