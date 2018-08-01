import express from "express";
import {createSuperHero} from "../controllers/superheroController"
const router = express.Router();

/* GET home page. */
router.post('/create', createSuperHero);


export default router;