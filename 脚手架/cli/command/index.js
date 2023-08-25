class Command {
  constructor(instance) {
    if (!instance) {
      throw new Error('command instance must not be null!');
    }
    this.program = instance;
    const cmd = this.program.command(this.command);
    cmd.description(this.description);
    cmd.hook('preAction', () => {
      this.preAction();
    });
    cmd.hook('postAction', () => {
      this.postAction();
    });
    if (this.options?.length > 0) {
      console.log(this.options, 'this.options');
      this.options.forEach(option => {
        cmd.option(...option);
      })
    }
    cmd.action((...params) => {
      this.action(params);
    });
  }

  get command() {
    throw new Error('command must be implements');
  }

  get description() {
    throw new Error('description must be implements');
  }

  get options() {
    return [];
  }

  get action() {
    throw new Error('action must be implements');
  }

  preAction() {
    console.log('preAction');
    // empty
  }

  postAction() {
    console.log('postAction');
    // empty
  }
}

export default Command;
