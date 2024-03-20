function layerSum(root) {
  if (root.children) {
    for (const item of root.children) {
      layerSum(item)
      root.value += item.value
    }
    return root.value
  }
  return root.value

}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] }
  ]
});

console.log(res);