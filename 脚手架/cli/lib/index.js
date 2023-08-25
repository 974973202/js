import createInitCommand from '../init/index.js';
import createCLI from './createCLI.js';
import './exception.js';

export default function(args) {
  console.log(args, process.cwd());
  const program = createCLI();
  createInitCommand(program);
  program.parse(process.argv);
};
