import Mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

export interface ISuperhero {
  govermentName: string;
  superheroName: string;
  superpowers: string[];
  trait: string;
  city: string;
  friends: string[];
  password: string;
}

interface comparePasswordCallback {
  (error: any, result: boolean): any;
}

export interface SuperheroDocument extends ISuperhero, Mongoose.Document {
  comparePassword: (plainText: string, cb: comparePasswordCallback) => any;
}

const SuperHeroSchema = new Mongoose.Schema({
  govermentName: {
    type: String,
    trim: true,
  },
  superheroName: {
    unique: true,
    type: String,
    trim: true,
  },
  superpowers: {
    type: [String],
    required: true,
    trim: true,
  },
  trait: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  friends: {
    type: [String],
    default: [],
    trim: true,
  },
  password: String,
});

SuperHeroSchema.pre('save', function(next) {
  const superhero = <SuperheroDocument>this;

  if (!superhero.isModified('password')) return next();

  /**
   * Generate hash salt and store hashed password
   */
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(
      superhero.password,
      salt,
      () => null,
      (err: Error, hash: string) => {
        if (err) return next(err);
        superhero.password = hash;
        next();
      }
    );
  });
});

/**
 * Compares the given plain text against the hashed password of the superhero
 * @param {string} plainText - The plain text to be compared against the user password
 */
SuperHeroSchema.methods.comparePassword = function(
  plainText: string,
  cb: comparePasswordCallback
) {
  bcrypt.compare(plainText, this.password, (err, result) => {
    cb(err, result);
  });
};

export default Mongoose.model<SuperheroDocument>('Superhero', SuperHeroSchema);
