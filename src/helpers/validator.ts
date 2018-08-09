import joi, { Err } from "joi";
import {ISuperhero} from "../models/Superhero";

/**
 * Validates the JSON object containing the new superhero payload
 * @param {object} superhero
 * @returns {Object} Object containing an error object and the filtered/trimmed value
 */

 export function validateSuperheroInput(superhero: ISuperhero ) : {error: any, value: ISuperhero}{
    const schema = joi.object().keys({
        govermentName: joi.string().required().trim(),
        superheroName: joi.string().required().trim(),
        superpowers: joi.array().items(joi.string().required()).required(),
        trait: joi.string().required(),
        city: joi.string().required(),
        friends: joi.array().items(joi.string().required()).required(),
        password: joi.string().required().trim()
    });

    const options = {
        abortEarly: false,
        stripUnknown: true
    }

    return joi.validate(superhero, schema, options);
 }