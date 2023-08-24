/**
 * 将两个对象的键值对转换为数组的形式
 * 如果原始对象中没有某个键值对，那么就会使用默认对象中的键值对
 * @param {Object} originObj - 原始对象
 * @param {Object} defaultObj - 默认对象，默认值为 { order: 'asc' }
 * @return {Array} 返回一个包含键值对的数组
 * (将两个对象的键值对转换为数组形式，如果原始对象中没有某个键值对，那么就会使用默认对象中的键值对。返回一个包含键值对的数组)
 */
export function transformObjToArr(originObj, defaultObj = { order: 'asc' }) {
  // 创建一个 Set 来存储两个对象的所有键
  // (创建一个 Set 来存储两个对象的所有键)
  const uniqueKeys = new Set([
    ...Object.keys(originObj),
    ...Object.keys(defaultObj),
  ]);

  // 将每个键转换为一个对象，并将这些对象放入一个数组中
  // 如果原始对象中没有某个键，那么就使用默认对象中的值
  // (将每个键转换为一个对象，并将这些对象放入一个数组中，如果原始对象中没有某个键，那么就使用默认对象中的值)
  const arr = Array.from(uniqueKeys).map((key) => {
    const val = originObj[key] !== undefined ? originObj[key] : defaultObj[key];
    return {
      [key]: val,
    };
  });

  return arr;
}
