/**
 * Created by lenovo on 2017/9/21.
 */
//定义一个名为Class的对象，该对象优惠一个create（）方法用于创建新的类，我们用闭包来维护内部函数
//避免公开暴露这些函数
"use strict" ;
var Class = (function () {
  //调用create()方法，他将根据一个对象直接来定义并返回一个新的“类”，该对象直接为这个类提供了各种公有属性和方法
  //一个名为initialize（）的方法将作为构造函数来执行。
  // 如果代表父类的可选参数 parentPrototype被传入，则新创建的类，将成为该父类的子类
  function create(classDefinition,parentPrototype) {
    //定义新“类”的构造函数，如果ClassDEfinition对象直接包含initialize()方法，则在构造函数中使用该方法
    var _newClass = function () {
      if(this.initialize && typeof this.initialize === 'function'){
       this.initialize.apply(this,arguments);
      }
    }, _name;
    //（在继承其他类是），如果传入一个parentprototype对象
    //则子类将继承parentPrototype的所有属性和方法
    if(parentPrototype){
     _newClass.prototype = new parentPrototype.constructor();
     for(_name in parentPrototype){
      if(parentPrototype.hasOwnProperty(_name)){
       _newClass.prototype[_name] = parentPrototype.prototype[_name];
      }
     }
    }
    //通过定义一个函数来创建闭包，然后在闭包中返回另外一饿函数来代替传入的函数
    //并传入的函数包装起来，并未当前兑现提供一个——parent()方法
    //以支持对父“类”中同名的方法，这样就实现了对多态的访问
    function polymorph(thisFunction,parentFunction) {
      return function () {
        var output;
        this._parent = parentFunction;
        output = thisFunction.apply(this,arguments);
        delete  this._parent;
        return output;
      };
    }
    //将作为参数传入‘类’定义应用在新创建的类上
    //覆盖parentPrototype中已经存在的类
    for(_name in classDefinition){
     if(classDefinition.hasOwnProperty(_name)){
      //如果利用多态，即创建和父类方法同名的新方法
       //我们都希望提供一种在子“类”方法中调用父“类”的同名的简单方式
       if(parentPrototype && parentPrototype[_name] && typeof classDefinition[_name] === 'function'){
        _newClass.prototype[_name] = polymorph(classDefinition[_name],parentPrototype[_name]);
       }else {
        _newClass.prototype[_name] = classDefinition[_name];
       }
     }
    }
    //确保构造函数属性设置正确，不管是否继承
    //以防止classDefinition对象直接包含名为constructor的属性和方法
    _newClass.prototype.constructor = _newClass;

    _newClass.extend = extend;
    return _newClass;
  }

  function extrend(classDefiniion) {
    return create(classDefiniion,this.prototype);
  }
  return{
   create : create
  };

}());
/**
* */