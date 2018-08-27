export function resolveMongoDB() {
  switch (process.env.NODE_ENV) {
    case 'staging':
      return process.env.MONGODB_STAGING_URL;
      break;
    case 'test':
      return process.env.MONGODB_TESTING_URL;
      break;
    default:
      return 'mongodb://localhost:27017/superhero';
  }
}
