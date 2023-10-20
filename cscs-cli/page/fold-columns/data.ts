<%_ if(data.leftType === 'treeData'){ _%>
export const treeData = [
  {
    title: 'parent 1',
    key: '1',
    switch: true,
    type: 'parant',
    children: [
      {
        title: 'parent 1-0',
        key: '2',
        switch: false,
        disabled: true,
        type: 'parant',
        children: [
          {
            title: 'leaf',
            key: '3',
            type: 'child',
            switch: false,
          },
          {
            title: 'leaf',
            key: '4',
            type: 'child',
            switch: true,
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '5',
        type: 'parant',
        isLeaf: true,
        switch: true,
        children: [{ title: 'ssss', key: '6', type: 'child', switch: true }],
      },
    ],
  },
  {
    title: 'parent 11',
    key: '11',
    type: 'parant',
    switch: false,
  },
];
<%_ } else { _%>
export const listData = [
  {
    title: 'parent 1',
    key: '1',
    switch: true,
    type: 'parant',
  },
  {
    title: 'parent 11',
    key: '11',
    type: 'parant',
    switch: false,
  },
];
<%_ } _%>