/**
 * 
 */

class Compile {
  constructor(el, vm) {
    // 要遍历的宿主节点
    this.$el = document.querySelector(el);
    this.$vm = vm;

    if (this.$el) {
     // 转换内部内容为片段
    this.$fragment = this.node2Fragment(this.$el)
    //执行编译
    this.compile(this.$fragment)
    // 将编译完的html结果追加至$el
    this.$el.appendChild(this.$fragment)
    }
  }

  // 将宿主元素中的代码片段拿出来遍历
  node2Fragment(el) {
    const frag = document.createDocumentFragment()
    // 将el中的所有元素搬到frag中
    let child;
    while (child = el.firstChild) {
      frag.appendChild(child)
    }
    return frag
  }

  // 编译过程
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 类型判断
      if (this.isElment(node)) { // 元素
        // 查找 “v-”、“@”、“:”
        console.log(node.nodeName, '编译元素' + node.nodeName)
        const nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach(attr => {
          const attrName = attr.name  // 属性名
          const attrValue = attr.value  // 属性值
          if(this.isDirective(attrName)) {  // 指令v-
            const dir = attrName.substring(2)
            // 执行指令
            this[dir] && this[dir](node, this.$vm, attrValue)
          } else if (this.isEvent(attrName)) {  // 事件@
            const dir = attrName.substring(1)
            this.eventHandle(node, this.$vm, attrValue, dir)
          }
        })
        
      } else if (this.isInterpolation(node)) { // 文本
        // console.log(node.nodeName, '编译文本')
        this.compileText(node)
      }

      if ( node.childNodes && node.childNodes.length > 0 ){
        this.compile(node)
      }
    })
  }

  // 编译文本
  compileText(node) {
    //  console.log(RegExp.$1)
    //  node.textContent = this.$vm.$data[RegExp.$1]
    this.update(node, this.$vm, RegExp.$1, 'text')
  }

  update(node, vm, exp, dir) {
    const updaterFun = this[dir + 'Updater']
    // 初始化
    updaterFun && updaterFun(node, vm[exp])
    // 依赖收集
    new Watcher(vm, exp, function (value) {
      updaterFun && updaterFun(node, value)
    })
  }

  // 是否编译元素
  isElment(node) {
    return node.nodeType === 1
  }

  // 插值文本
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  // 指令判断(编译元素判断)
  isDirective(attr) {
    return attr.indexOf('v-') === 0
  }

  // 事件判断(编译元素判断)
  isEvent(attr) {
    return attr.indexOf('@') === 0
  }

  // v-text
  text(node, vm, exp) {
    this.update(node, vm, exp, 'text')
  }

  // v-html
  html(node, vm, exp) {
    this.update(node, vm, exp, 'html')
  }

  // v-model
  model(node, vm, exp) {
    // 指定input的value属性
    this.update(node, vm, exp, 'model')

    // 视图对模型的响应
    node.addEventListener('input', e => {
      vm[exp] = e.target.value
    })
  }

  // v-text方法
  textUpdater(node, value) {
    node.textContent = value
  }

  // v-html方法
  htmlUpdater(node, value) {
    node.innerHTML = value
  }

  // v-model方法
  modelUpdater(node, value) {
    node.value = value
  }

  // 事件处理器
  eventHandle(node, vm, exp, dir) {
    const fun = vm.$options.methods && vm.$options.methods[exp]
    if (dir && fun) { 
      node.addEventListener(dir, fun.bind(vm))
    }
  }
}