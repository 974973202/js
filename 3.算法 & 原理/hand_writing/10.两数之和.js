// - 给定一个数组 nums 和一个目标值 target，在该数组中找出和为目标值的两个数
// - 输入：nums: [8, 2, 6, 5, 4, 1, 3] ；target:7
// - 输出：[2, 5]

// 时间复杂度O(n)、 空间复杂度O(n)
function twoNumAdd(nums, target) {
    var map = {};
    for (var i = 0; i < nums.length; i++) {
        var complement = target - nums[i];

        if (map.hasOwnProperty(complement)) { // 找 map里面有没有 加起来为 7 的值
            //   return [map[complement], i]; // 输出下标
            return [complement, nums[i]]; // 输出值
        }
        // 存值和数的下标
        map[nums[i]] = i;
    }

    return [];
}

function twoNumAdd1(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const n = nums[i];
        const n2 = target - n;
        if(map.has(n2)) {
            return [map.get(n2), i];
        } else {
            map.set(n, i);
        }
        
    }
}


console.log(twoNumAdd([8, 2, 6, 5, 4, 1, 3], 7))