// await 是求值，对promise求值

//  
async function test() {
  await test1()
  console.log(2)
}

test()

function test1() {
  setTimeout(() => {
    console.log(1)
  }, 3000)
}

// 等待执行
// async function test() {
//   await test1()
//   console.log(2)
// }

// test()

// function test1() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(1)
//       resolve(1)
//     }, 3000)
//   })
// }