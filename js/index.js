$(function(){
    init();
    let $plan = $.Callbacks();//实现发布订阅
    $plan.add((_,baseInfo)=>{
        //渲染用户信息和实现退出登录
        // console.log("渲染用户信息和实现退出登录：",baseInfo);
        $(".baseBox>span").html(`你好，${baseInfo.name || ""}`)
        $(".baseBox>a").click(async function(){
            //退出登录
            let result = await axios.get("/user/signout");
            if(result.code ==0){
                window.location.href = "login.html";
                return;
            }
            alert("网络不给力，稍后再试")
        })
    })
    $plan.add(power=>{
        //根据权限渲染菜单
        // console.log("渲染菜单：",power);
        
        
    })

    async function init(){
        //判断当前用户有没有登录
        let result = await axios.get("/user/login");
        // console.log(result);
        if(result.code !=0){
            alert("你还没登录，请先登录...");
            window.location.href="login.html";
            return ;
        }
        //代码到这步，登陆成功
        //获取用户信息,获取用户权限
        //解构赋值
        let  [power,baseInfo]= await axios.all([
            axios.get("/user/power"),
            axios.get("/user/info")
        ]);
        baseInfo.code ===0 ? baseInfo=baseInfo.data : null;
        $plan.fire(power,baseInfo);
        // console.log(gain)
        // console.log(power);
        // console.log(baseInfo);
      
    }
})