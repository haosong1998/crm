<<<<<<< HEAD
$(function(){
    let userId=null;
    // console.dir(window.location.href);
    let params = window.location.href.queryURLParams();
    // console.log(params)
    //如果点击编辑进入此页面，在params中有id
    //如果点击添加员工进来params没有id
    if(params.hasOwnProperty("id")){
        userId=params.id;
        //根据id获取用户的信息，实现数据的回显
        getBaseInfo();
    }
    async function getBaseInfo(){
        let result = await axios.get("/user/info",{
            params:{userId}
        });
        if(result.code ===0){
            //给表单中塞如数据，实现数据的回显
            result = result.data
            $(".username").val(result.name);
            //判断关于性别的单选按钮的值
            result.sex==0?$("#man").prop("checked",true):$("#woman").prop("checked",true);
            $(".useremail").val(result.email);
            $(".userphone").val(result.phone);
            $(".userdepartment").val(result.departmentId);
            $(".userjob").val(result.jobId);
            $(".userdesc").val(result.desc);
            return;
        }
        alert("编辑部成功，可能是网络不给力......");
        userId = null;
    }
    //初始化部门和职位数据
    initDeptAndJob();
    async function initDeptAndJob(){
        let departmentData = await queryDepart();
        let jobData = await queryJob();
        // console.log(departmentData);
        // console.log(jobData);
        if(departmentData.code ===0){
            departmentData = departmentData.data;
            let str = "";
            departmentData.forEach(item=>{
                str +=`<option value="${item.id}">${item.name}</option>`;
            })
            $(".userdepartment").html(str);
        }
        if(jobData.code ===0){
            jobData = jobData.data;
            let str = "";
            jobData.forEach(item=>{
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userjob").html(str);
        }
    }

    //校验数据
    function checkname (){
        let val = $(".username").val().trim();
        if(val.length===0){
            $(".spanusername").html("此为必填项~");
            return false;
        }
        if(!/^[\u4e00-\u9fa5]{2,10}$/.test(val)){
            $(".spanusername").html("名字必须是2~10个汉字~");
            return false;
        }
        $(".spanusername").html("姓名格式验证OK");
        return true;
    }
    function checkemail(){
        let val = $(".useremail").val().trim();
        if(val.length ===0){
            $(".spanusermail").html("此为必填项~");
            return false;
        }
        if(!/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/.test(val)){
            $(".spanuseremail").html("请填写正确的邮箱~");
            return false;
        }
        $(".spanuseremail").html("邮箱格式验证OK");
        return true;
    }
    function checkphone(){
        let val = $(".userphone").val().trim();
        if(val.length===0){
            $(".spanuserphone").html("此为必填项~");
            return false;
        }
        if(!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)){
            $(".spanuserphone").html("请填写正确的邮箱~");
            return false;
        }
        $(".spanuserphone").html("");
        return true;
    }
    //失去焦点时，对数据进行校验
    $(".username").blur(checkname);
    $(".useremail").blur(checkemail);
    $(".userphone").blur(checkphone);
    
    
    $(".submit").click(async function(){
        if(!checkname()||!checkemail()||!checkphone()){
            alert("你填写的数据不合法");
            return;
        }
        //获取用户输入数据
        let params={
            name:$(".username").val().trim(),
            sex:$("#man").prop("checked")?0:1,
            email:$(".useremail").val().trim(),
            phone:$(".userphone").val().trim(),
            departmentId:$(".userdepartment").val(),
            jobId:$(".userjob").val(),
            desc:$(".userdesc").val().trim()
        };
        //判断是编辑还是新增
        if(userId){
            //编辑
            params.userId=userId;
            let result = await axios.post("/user/update",params)
            if(result.code ===0){
                alert("修改数据成功");
                window.location.href="userlist.html";
                return;
            }
            alert("网络不给力，稍后再试~")
            return;
        }
        //实现新增
        let result = await axios.post("/user/add",params);
        if(result.code ===0){
            alert("添加员工成功~");
            window.location.href="userlist.html"
            return ;
        }
        // console.log(result)
        alert("网络不给力，稍后再试~")


    })
})
=======


>>>>>>> f51356d872c01f3257de41465dd932629295476d
