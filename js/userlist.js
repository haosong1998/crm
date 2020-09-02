$(function(){
    //定义一个变量，用来获取复选框按钮
    let checkList = null;
    //实现显示部门
    initDepartMent();
    async function initDepartMent(){
        let result = await queryDepart();
        if(result.code===0){
            let str=``;
            result.data.forEach(item=>{
                str +=`<option value="${item.id}">${item.name}</option>`;
            })
            $(".selectBox").html(str);
        }
    }
    showUserList();
    //展示员工列表
    async function showUserList(){
        //封装两个条件参数
        let params = {
            departmentId:$(".selectBox").val(),
            search:$(".searchInp").val().trim()
        }
        let result = await axios.get("/user/list",{params});
        // console.log(result);
        if(result.code !==0) return ;
        let str = ``;
        result.data.forEach(item=>{
            let {
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc
            }=item;
            str +=
            `<tr>
                <td class="w3"><input type="checkbox" userId="${id}"></td>
                <td class="w10">${name}</td>
                <td class="w5">${sex==0?'男':'女'}</td>
                <td class="w10">${department}</td>
                <td class="w10">${job}</td>
                <td class="w15">${email}</td>
                <td class="w15">${phone}</td>
                <td class="w20">${desc}</td>
                <td class="w12" userId="${id}">
                    <a href="javascript:;">编辑</a>
                    <a href="javascript:;">删除</a>
                    <a href="javascript:;">重置密码</a>
                </td>
            </tr>`;
        })
        $("tbody").html(str);
        checkList=$("tbody").find("input[type='checkbox']");
    }
    //根据条件显示员工列表
    searchHandle();
    function searchHandle(){
        $(".selectBox").change(showUserList);
        $(".searchInp").on("keydown",e=>{
            if(e.keyCode ===13){
                showUserList();
            }
        })
    }
    //操作员工信息
    optionsUser();
    function optionsUser(){
        $("tbody").on("click","a",async function(e){
            // console.log(e.target.tagName)
            // console.log(e.target.innerHTML)
            
            let userId =Number($(this).parent().attr("userid"))
            //删除用户信息
            if(e.target.tagName ==="A" && e.target.innerHTML==="删除"){           
                // console.log(typeof userId);
                // console.log(userId);
                let flag = confirm("你确定要删除此用户吗？");
                if(!flag) return;
                let result=await axios.get("/user/delete",{params:{userId}})
                // console.log(xxx);
                if(result.code ===0){
                    alert("删除成功~");

                    //调用接口，删除掉的是数据库中的数据，还需要把页面中的用户删除了
                    $(this).parent().parent().remove();
                    checkList = $("tbody").find("input[type='checkbox']");
                }
                return;
            };

            //修改用户信息
            if(e.target.tagName ==="A" && e.target.innerHTML==="编辑"){
                window.location.href=`useradd.html?id=${userId}`;
                return;
            }

            //重置密码
            if(e.target.tagName ==="A" && e.target.innerHTML==="重置密码"){
                //不是修改密码，将修改后的密码还原到初始值
                let flag = confirm("你确定要重置此用户的密码吗？");
                if(!flag) return;
                let result = await axios.post("/user/resetpassword",{userId});
                if(result.code === 0){
                    alert("重置密码成功，告知你的员工~");
                    return;
                }
                return;
            }
        })
    }

    //全选处理
    selectHandle();
    function selectHandle(){
        $("#checkAll").click(e=>{
            let checked = $("#checkAll").prop("checked");
            
            checkList.prop("checked",checked);
            // console.log(checkList)
        })
        $("tbody").on("click","input",e=>{
            if(e.target.tagName === "INPUT"){
                let flag = true;
                newCheckList = Array.from(checkList);
                newCheckList.forEach(item=>{
                    if(!$(item).prop("checked")){
                        //有小框框没有勾选
                        flag = false;
                    }
                })
                $("#checkAll").prop("checked",flag);

            }
        })
    }
    //实现批量删除
    $(".deleteAll").click(e=>{
        //找到所勾选的用户，把此用户的userId放到一个数组中
        let arr=[];
        [].forEach.call(checkList,item=>{
            if($(item).prop("checked")){
                // console.log($(item));
                arr.push($(item).attr("userid"));
            }
        });
        if(arr.length ===0){
            alert('你需要选中你所要删除的用户们');
            return;
        }
        let flag=confirm("你确定要删除这些用户吗？");
        if(!flag) return;
        let index = -1;
        async function deleteUser(){
            let userId = arr[++index];
            if(index >=arr.length){
                //递归的出口
                alert("已成功删除员工");
                
            }
            let result =await axios.get("/user/delete",{
                params:{
                    userId
                }
            })
            if(result.code !=0){
                //删除失败了
                return ;
            }
            console.dir($(`input[userid=${userId}]`).parent());
            $(`input[userid=${userId}]`).parent().parent().remove();
            deleteUser();
        }
        deleteUser();
    })

    
})