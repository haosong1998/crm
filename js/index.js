$(function(){
    init();
    let $plan = $.Callbacks();//实现发布订阅
    let $navBoxList=$(".navBox>a");
    let $itemBoxList=null;
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
        let str = "";
        if(power.includes("userhandle")){
            str +=
            `<div class="itemBox" text="员工管理">
                <h3>
                    <i classs = "iconfont icon-yuangong"></i>
                    员工管理
                </h3>
                <nav class="item">
                    <a href="page/userlist.html" target="iframeBox">员工列表</a>
                    <a href="page/useradd.html" target="iframeBox">新增员工</a>
                </nav>
            </div>`
        }
        if(power.includes("departhandle")){
            str +=
            `<div class="itemBox" text="部门管理">
                <h3>
                    <i classs = "iconfont icon-bumenguanli"></i>
                    部门管理
                </h3>
                <nav class="item">
                    <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
                    <a href="page/departmentadd.html" target="iframeBox">新增部门</a>
                </nav>
            </div>`
        }
        if(power.includes("jobhandle")){
            str +=
            `<div class="itemBox" text="职位管理">
                <h3>
                    <i classs = "iconfont icon-zhiwuguanli"></i>
                    职位管理
                </h3>
                <nav class="item">
                    <a href="page/joblist.html" target="iframeBox">职位列表</a>
                    <a href="page/jobadd.html" target="iframeBox">新增职位</a>
                </nav>
            </div>`
        }
        if(power.includes("customerall")){
            str +=
            `<div class="itemBox" text="客户管理">
                <h3>
                    <i classs = "iconfont icon-kehuguanli"></i>
                    客户管理
                </h3>
                <nav class="item">
                    <a href="page/customerlist.html?lx=my" target="iframeBox">我的客户</a>
                    <a href="page/customerlist.html?lx=all" target="iframeBox">全部客户</a>
                    <a href="page/customeradd.html" target="iframeBox">新增客户</a>
                </nav>
            </div>`
        }
        $(".menuBox").html(str);
        $itemBoxList = $(".menuBox").find(".itemBox");
        
        // console.log($itemBoxList)
    });
    function handGroup(index){
        // console.log($itemBoxList)
        let $group1=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr("text");
            // console.log(_,item);
            return text ==="客户管理"
        })
        // console.log($group1);
        let $group2=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr("text");
            return /^(员工管理|部门管理|职位管理)/.test(text);
        })
        // console.log($group2);
        if(index ===0){
            $group1.show();
            $group2.hide();
        }else if(index ===1){
            $group1.hide();
            $group2.show();
        }
    }
    $plan.add(power=>{
        let initIndex = power.includes("customer") ?0:1;
        $navBoxList.eq(initIndex).addClass("active").siblings().removeClass("active");
        handGroup(initIndex);
        $navBoxList.click(function(){
            let index = $(this).index();
            let text = $(this).html().trim();
            if((text === "客户管理") && !/customerall/.testy(power) || (text === "组织结构") && !/(userhandle|departhandle|jobhandle)/.test(power)){
                alert("没有权限访问！！！");
                return ;
            }
            $(this).addClass("active").siblings().removeClass("active");
            // console.log(index)
            handGroup(index);
        })
                
    })
    $plan.add(power=>{
        let url = "page/customerlist.html";
        if(power.includes("customerall")){
            $(".iframeBox").attr("src",url);
        }
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
        power.code === 0 ? power=power.power:null;
        $plan.fire(power,baseInfo);
        // console.log(gain)
        // console.log(power);
        // console.log(baseInfo);  
    }
})