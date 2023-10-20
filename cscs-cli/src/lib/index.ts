import createInitCommand from '../init/index.js';
import createImportCommand from '../import/index.js'
import create from './create.js';
import './exception.js';

export default function() {
  const program = create();
  createInitCommand(program);
  createImportCommand(program);
  program.parse(process.argv);
};
