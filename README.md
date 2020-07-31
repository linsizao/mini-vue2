# littleVue

趁着 Vue 3.0 正式版还没发布来总结一下 Vue 2.x 的核心功能 —— 数据响应式
嘿嘿：

![效果图](https://linsizao.gitee.io/images/littleVue1.gif)


## 响应式原理

在 `new Vue()` 之后。Vue 会调用进行初始化，会初始化生命周期、事件、props、 methods、 data、computed与 watch 等。

vue 会遍历 data 选项的属性，利用 `Object.defineProperty` 为属性添加 `getter` 和 `setter` 对数据的读取进行劫持（`getter` 用来依赖收集，`setter` 用来派发更新），并且在内部追踪依赖，在属性被访问和修改时通知变化。

组件的 watcher 实例，会在组件渲染的过程中记录依赖的所有数据属性（进行依赖收集,还有 computed watcher，user watcher 实例）,之后依赖项被改动时，`setter` 方法会通知依赖与此 data 的 watcher 实例重新计算（派发更新）,从而使它关联的组件重新渲染。


## 实现流程

+ 实现一个数据监听器 Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
+ 实现一个订阅者 Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图
+ 实现一个指令解析器 Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数

上述流程如图所示：

![效果图](https://linsizao.gitee.io/images/littleVue2.jpg)
