// new Vue({data: {...}})

class Vue {
  constructor (options) {
    this.$options = options

    // 数据响应化
    this.$data = options.data
    this.observe(this.$data)

    // 模拟一下watch创建
    // new Watcher();
    // this.$data.test;
    // new Watcher();
    // this.$data.foo.bar

    new Compile(options.el, this)

    // 执行 created
    if(options.created) {
      options.created.call(this)
    }

  }

  observe(data) {
    if (!data || typeof data !== 'object'){
      return;
    }

    // 遍历该对象
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      // 代理data中的属性到vue实例上
      this.proxyData(key)
    })
  }

  // 数据的相应化
  defineReactive(data, key, val) {

    this.observe(val) // 递归解决数据嵌套

    const dep = new Dep()

    // 数据劫持
    Object.defineProperty(data, key, {
      get(){
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set(newVal){
        if(newVal !== val){
          val = newVal
          // console.log(`${key}属性更新为：${val}`)
          dep.notify()
        }
      }
    })
  }

  // 代理data中的属性到vue实例上
  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(newVal) {
        this.$data[key] = newVal
      }
    })
  }

}


// Dep：用来管理 Watvher
class Dep {
  constructor() {
    // 这里存放若干依赖（watcher）
    this.deps = [];
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  // 通知所有依赖进行更新
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

// Watcher
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    // 将当前watch实例指定待Dep静态属性target
    Dep.target = this
    this.vm[this.key] // 触发getter，添加依赖
    Dep.target = null
  }

  update(){
    console.log('属性更新了')
    this.cb.call(this.vm, this.vm[this.key])
  }
}