import express from "express";
import {createSuperHero, loginSuperhero, getSuperHero} from "../controllers/superheroController"
const router = express.Router();

/* GET home page. */
router.post('/create', createSuperHero);

router.post('/login', loginSuperhero);

router.get('/superhero', getSuperHero);

export default router;