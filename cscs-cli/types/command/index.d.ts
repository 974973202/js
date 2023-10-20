import { Command as C } from 'commander';
declare class Command {
    constructor(instance: C);
    get command(): string;
    get description(): string;
    get options(): (string | boolean)[][];
    action(_data?: any): void;
    preAction(): void;
    postAction(): void;
}
export default Command;
