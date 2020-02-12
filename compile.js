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
        console.log(node.nodeName, '编译元素')
      } else if (this.isInterpolation(node)) { // 文本
        console.log(node.nodeName, '编译文本')
      }

      if ( node.childNodes && node.childNodes.length > 0 ){
        this.compile(node)
      }
    })
   }

   // 
   isElment(node) {
    return node.nodeType === 1
   }

   // 插值文本
   isInterpolation(node) {
     return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
   }
 }