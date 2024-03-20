// 1. 常规循环
function convertToArray(obj) {
    // let
    let result = [];
    result.push({ id: obj.id, name: obj.name });
    if (obj.children) {
        obj.children.forEach(child => {
            result = result.concat(convertToArray(child));
        });
    }
    return result;
}
// 2. 广度优先
// 我们使用一个队列来存储待处理的节点，从根节点开始将其加入队列中。
// 然后，我们从队列中取出第一个节点并将其转换为包含_id_、_name_和_depth_属性的新对象，
// 其中_depth_属性表示当前节点的深度。然后，我们将新对象添加到结果数组中。

// 接下来，我们检查该节点是否有_children_属性，如果有，则遍历每个_child_并将其添加到队列中，其中_depth_属性是当前节点的_depth_属性加1。

// 遍历完整个对象后，我们将结果数组返回。
const objToArray = (obj) => {
    const queue = [{ ...obj, depth: 0 }];
    const result = [];
    while (queue.length > 0) {
        const current = queue.shift();
        result.push({ id: current.id, name: current.name, depth: current.depth });
        if (current.children) {
            current.children.forEach(child => {
                queue.push({ ...child, depth: current.depth + 1 });
            });
        }
    }
    return result;
}

const obj = {
    id: 1,
    name: '部门A',
    children: [
        {
            id: 2,
            name: '部门B',
            children: [
                { id: 4, name: '部门D' },
                { id: 5, name: '部门E' }
            ]
        },
        {
            id: 3,
            name: '部门C',
            children: [{ id: 6, name: '部门F' }]
        }
    ]
}

const objArray = objToArray(obj);
console.log(objArray);
