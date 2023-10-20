import inquirer from 'inquirer';

function make({
                choices,
                defaultValue,
                message = '请选择',
                type = 'list',
                require = true,
                mask = '*',
                validate,
                pageSize,
                loop,
              }: any) {
  const options: any = {
    name: 'name',
    default: defaultValue,
    message,
    type,
    require,
    mask,
    validate,
    pageSize,
    loop,
  };
  if (type === 'list') {
    options.choices = choices;
  }
  return inquirer.prompt(options).then(answer => answer.name);
}

export function makeList(params: any) {
  return make({ ...params });
}

export function makeInput(params: any) {
  return make({
    type: 'input',
    ...params,
  });
}


export function InquirerListObj(params: any) {
  const questions: any = [{
    name: 'name',
    choices: [],
    ...params,
    type: 'list',
  }];
  return inquirer.prompt(questions).then(answer => {
    const selectedName = answer.name;
    const selectedOption = params?.choices?.find((choice: { value: any; }) => choice.value === selectedName);
    return selectedOption ?? {}
  });
}