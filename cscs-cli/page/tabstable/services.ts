import request from "umi-request";
import Mock from 'mockjs';
import { StandardResponseDataType } from "@cscs-fe/base-components";

// 模拟一个数据列表
// const data = Mock.mock({
//   'list|10': [{
//     'id|+1': 1,
//     'name': '@cname',
//     'age|18-60': 1,
//     'gender|1': ['男', '女'],
//     'email': '@email',
//     'phone': /^1[3456789]\d{9}$/,
//   }],
// });

let id: any;
let data: {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: number;
}[] = [];

export async function getList(params: any) {
  console.log(data, 'data');
  if (id !== params.id || id === undefined)  {
    id = params.id;
    data = Mock.mock({
      'list|5': [{
        'id|+1': 1,
        'name': '@cname',
        'age|18-60': 1,
        'gender|1': ['男', '女'],
        'email': '@email',
        'phone': /^1[3456789]\d{9}$/,
      }],
    }).list;
  }

  const d = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
  if (d) {
    return {
      success: true,
      data: JSON.parse(JSON.stringify(data)),
      total: data.length
    }
  } else {
    return {
      success: true,
      data: [],
      total: 0
    }
  }
}

export async function del(id: number): Promise<StandardResponseDataType<boolean>> {
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data.splice(index, 1);
  }
  console.log(data, 'data');
  return Promise.resolve(
    {
      data: true,
      errorCode: '',
      errorMessage: '删除成功',
      success: true,
      page: undefined
    }
  )
}

export async function _post(updatedData: any): Promise<StandardResponseDataType<boolean>> {
  const index = data.findIndex(item => item.id === updatedData.id);
  if (index !== -1) {
    data[index] = updatedData;
  }

  return {
    data: true,
    errorCode: '',
    errorMessage: '修改成功',
    success: true,
    page: undefined
  };
}

export async function add(params: any): Promise<StandardResponseDataType<boolean>> {
  const newData = params;
  newData.id = data.length + 1;
  data.push(newData);

  return {
    data: true,
    errorCode: '',
    errorMessage: '新增成功',
    success: true,
    page: undefined
  };
}
