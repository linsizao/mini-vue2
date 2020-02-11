// new Vue({data: {...}})

class Vue {
  constructor (options) {
    this.$options = options

    // 数据响应化
    this.$data = options.data
    this.observe(this.$data)

    // 模拟一下watch创建
    new Watcher();
    this.$data.test;
    new Watcher();
    this.$data.foo.bar

  }

  observe(data) {
    if (!data || typeof data !== 'object'){
      return;
    }

    // 遍历该对象
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
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
  constructor() {
    // 将当前watch实例指定待Dep静态属性target
    Dep.target = this;
  }

  update(){
    console.log('属性更新了')
  }
}