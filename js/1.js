
   setTimeout(()=>{
console.log("定时器开始执行");
})

new Promise(function(resolve){
    console.log("准备执行for循环了");
    for(var i=0;i<100;i++){
        i==22&&resolve();
    }
}).then(()=>console.log("执行then函数"));

console.log("代码执行完毕");
