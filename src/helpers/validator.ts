import joi from "joi";
import {ISuperhero} from "../models/Superhero";

/**
 * Validates the JSON object containing the new superhero payload
 * @param {object} superhero
 * @returns {Object} Object containing an error object and the filtered/trimmed value
 */

 export function validateSuperheroInput(superhero: ISuperhero ) : {error: any, value: ISuperhero}{
    const schema = joi.object().keys({
        govermentName: joi.string().required().trim().lowercase(),
        superheroName: joi.string().required().trim().lowercase(),
        superpowers: joi.array().items(joi.string().required().lowercase()).required(),
        trait: joi.string().required().lowercase(),
        city: joi.string().required().lowercase(),
        // friends: joi.array().items(joi.string().required()).required(),
        password: joi.string().required().trim()
    });

    const options = {
        abortEarly: false,
        stripUnknown: true
    }

    return joi.validate(superhero, schema, options);
 }