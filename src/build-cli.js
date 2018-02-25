const randomWord = require('random-word');
const yargs = require('yargs');

module.exports = (): { domain: string, directory: string } => {
  yargs.example(
    'static ./build my-domain.com',
    'Deploy the build directory to my-domain.com',
  );
  const [directory, domain] = yargs.argv._;
  return {
    domain: domain || [randomWord(), randomWord(), Date.now()].join('-'),
    directory,
  };
};
