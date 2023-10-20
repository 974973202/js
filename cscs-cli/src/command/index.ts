import type { Command } from 'commander';

class ExtendC {
  action() {
  }
  preAction() {
  }

  postAction() {
  }
}

class Cmd implements ExtendC {
  constructor(instance: Command) {
    if (!instance) {
      throw new Error('command instance must not be null!');
    }
    // this.program = instance;
    const cmd = instance.command(this.command);
    cmd.description(this.description);
    cmd.hook('preAction', () => {
      this.preAction();
    });
    cmd.hook('postAction', () => {
      this.postAction();
    });
    
    if (this.options?.length > 0) {
      // @ts-ignore
      this.options.forEach((option) => cmd.option(...option))
    }

    cmd.action((...params: any) => {
      this.action(params);
    });
  }

  get command(): string {
    throw new Error('command must be implements');
  }

  get description(): string {
    throw new Error('description must be implements');
  }


  get options(): (string | boolean)[][] {
    return [];
  }

  action(_data?: any) {
    throw new Error('action must be implements');
  }

  preAction() {
    // console.log('preAction');
    // empty
  }

  postAction() {
    // console.log('postAction');
    // empty
  }
}

export default Cmd;
