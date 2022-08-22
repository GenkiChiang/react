
//
// {
//     type         节点类型 (元素, 文本, 组件)(具体的类型)
//     props        节点属性
//     stateNode    节点 DOM 对象 | 组件实例对象
//     tag          节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)
//     effects      数组, 存储需要更改的 fiber 对象
//     effectTag    当前 Fiber 要被执行的操作 (新增, 删除, 修改)
//     parent       当前 Fiber 的父级 Fiber
//     child        当前 Fiber 的子级 Fiber
//     sibling      当前 Fiber 的下一个兄弟 Fiber
//     alternate    Fiber 备份 fiber 比对时使用
// }
