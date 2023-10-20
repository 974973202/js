import Command from '../command/index.js';
import { optType } from './type.js';
/**
 * cscs init
 */
declare class InitCommand extends Command {
    get command(): string;
    get description(): string;
    get options(): (string | boolean)[][];
    action([name, opts]: [string, optType]): Promise<void>;
}
declare function Init(instance: any): InitCommand;
export default Init;
