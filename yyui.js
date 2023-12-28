//yyui3.0  2022.08.15 by zgy
$(function(){
	
	//去掉所有input的autocomplete, 显示指定的除外 
	$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
	
	
	//本文域上传控件美化
	$(".yyui-file").each(function(){
		var file_width = $(this).width(); //原文件域宽度
		var yangshi = $(this).attr('class').replace('yyui-file',''); //原文件域样式
		var placeholder = pnull($(this).attr("placeholder")); 	if(placeholder+''==''){placeholder = "请选择文件"; }  //原文件域placeholder
		$(this).hide(); //隐藏
		$(this).after("<input type=\"text\" class=\"yyui-file-show-part "+yangshi+" \" placeholder=\""+placeholder+"\" readonly=\"readonly\"  onclick=\"$(this).prev().click();\" style='width:"+file_width+"px'  />");
	});
	$(".yyui-file").change(function(){
		$(this).next().val(yyui_getFileName($(this).val()));
	});



});

//选项卡切换
//var a = yyui_tab('tab1'); //容器id
function yyui_tab(id) {
	//初始化
	var index=$("#"+id).children(':first').children('.current').index();//得到默认选中的选项卡
	//alert(index);
	if(index<0){index=0;} //如果没设置（-1），则指定index为0即第1个选项卡选中。
	$("#"+id).children(':last').children().eq(index).show().siblings().hide();	//相应内容显示，其余隐藏
	//点击某个选项卡
	var index=$("#"+id).children(':first').children().click(function(){ 
		index = $(this).index();
		$(this).attr('class','current').siblings().removeClass('current'); //本节点添加current其余节点去掉
		$(this).parent().next().children().eq(index).show().siblings().hide();	//相应内容显示，其余隐藏
	});
}


//文件上传
function yyui_upload(options) {
    options = options || {};  //调用函数时如果options没有指定，就给它赋值{},一个空的Object
    var data = options.data || {};    
    var exts = options.exts || "jpg,png,gif,bmp,jpeg,doc,docx,xls,xlsx,ppt,pptx,pdf,psd,zip,rar,7z";     //默认格式不限
	exts = exts.toLowerCase(); //转小写
	var exts_arr = exts.split(","); //转数组
	size = options.size || (50*1024); //单位kb，默认50M
	elem=options.elem; //选择器必填#btn_shangchuan
	field=options.field; //文件域必填#wenjian
	//初始化成员空函数，否则前端控制台报错（函数不存在）
	options.before = options.before || function(){}
	options.complete = options.complete || function(){}
	options.success = options.success || function(){}
	options.error = options.error || function(){}
 	//6位随机数
	var rand = parseInt(Math.random() * (999999 - 100000 + 1) + 100000); 
	//点击按钮
	$(elem).click(function(){ 
		//生成文件域
		$('body').append('<input style="display:none;" type="file" name="yyui-wenjian'+rand+'" id="yyui-wenjian'+rand+'">');
		//执行点击文件域弹出文件选择窗
		$("#yyui-wenjian"+rand).click();
		//用户选择了文件后执行检测与上传
		$("#yyui-wenjian"+rand).on("change",function(){
			//alert('a');
			//读取文件域的值数组
			var fileArray =  document.getElementById('yyui-wenjian'+rand).files[0];
			//alert(fileArray.name); //文件名    	//alert(fileArray.size/1024); //尺寸   	//alert(chunkzm(fileArray.name)); //扩展名
			var kzm = String(chunkzm(fileArray.name)); //扩展名
			kzm=kzm.toLowerCase(); //转小写
			if( $.inArray(kzm,exts_arr) == -1  ){ //后缀没有找到
				options.error('文件格式不正确'); return false;
			}else if((fileArray.size/1024) > size ){ 
				options.error('文件尺寸过大'); return false;
			}else{
				//alert('启动上传');
			}
			//初始化 FormData 对象 文件处理对象  序列化表单数据
			var formData = new FormData();
			//给对象中添加文件信息，没有对象或者没有文件信息后台是得不到的
			formData.append(field, fileArray); 
			//遍历其他数据data
			for (var i in data){ 
				formData.append(i,data[i]);
			}	
			$.ajax({
				url: options.url ,//传向后台服务器文件
				type: 'POST',    //传递方法 
				data:formData,  //要带的值，在这里只能带一个formdata ，不可以增加其他
				async:true, //true为异步模式，false同步模式
				cache: false,  //设置为false，上传文件不需要缓存。
				contentType: false,//设置为false,因为是构造的FormData对象,所以这里设置为false。
				processData: false,//设置为false,因为data值是FormData对象，不需要对数据做处理。
				beforeSend: function () { //上传前
					options.before(fileArray); //fileArray包含客户端文件信息
				},
				complete: function (data) { //请求成功或失败之后均调用
					options.complete(data);
				},
				success: function (data) { //成功
					options.success(data);
				},
				error:function(data){
					options.error(data);
				}
			});
		});		
	});	
}







/* js自定义常用函数 *************************************************************************/
/* ***********************************************************************************/
//跳转回上一页或者指定页
//！只有在上一页不存在的情况下，跳转参数才有效果。
//写法一：yyui_back();    //回到上一页，如果回不去，回到首页
//写法一：yyui_back('index.php')，回到上一页，如果回不去，回到指定页
function yyui_back(){ 
	if(window.history.length>1){ //说明有上一页
		history.go(-1); return false; //return false为了兼容safari浏览器
	}else{ //没有上一页，跳到指定页
		var tiaozhuan = arguments[0] ? arguments[0] : './';
		window.location.href=tiaozhuan;
	}
}


function yyui_getFileName(o){ //从路径中获取文件名
	var pos=o.lastIndexOf("\\");
	return o.substring(pos+1);  
}

//获取文件名及扩展名、纯文件名、纯扩展名
//var file="/loac/asdf.sad/文件 名.docx";
function wjm_kzm(file){
	var filename=file.replace(/.*(\/|\\)/, ""); 
	return filename; //得到  文件 名.docx
}	
function chunwjm(file){
	var filename=file.replace(/.*(\/|\\)/, ""); 
    return filename.substring(0,filename.indexOf("."));  //得到  文件 名
}	
function chunkzm(file){
	var filename=file.replace(/.*(\/|\\)/, ""); 
	var fileExt=(/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
	return fileExt;  //得到  docx
}

//检测是否空字符串，定义数字0不属于空字符串，即只要“有内容”则认为不为空
function isnull(str) {
	if(str === 0 ){ //强制对比0
		return false;
	} 
	if(str == "null" || str == null || str == "" || str == "undefined" || str == undefined ) {
		return true;
	} else {
		return false;
	}
}
//处理空
function pnull(str,sn){ //处理空
	if( !str || str=="undefined" || str=="null"){
		if(sn=="n"){
			return 0;
		}else{
			return "";
		}
	}
	return str;
}

//随机数n位函数
//var suiji = yyui_rnd(4); //4位随机数
function yyui_rnd(n){
	var x = Math.pow(10,(n-1)) ;  //4位1000
	var y = Math.pow(10,n)-1 ;   //4位9999
	return Math.floor(Math.random()*(y-x+1)+x);
}

//是否自然数，自然数包括0
function is_ziranshu(value){
	if((/^(\+|-)?\d+$/.test( value )) && value >= 0){  
        return true;  
    }else{   
        return false;  
    }  
}
//是否正整数
function is_zzs(value){
	if((/^(\+|-)?\d+$/.test( value )) && value > 0){  
        return true;  
    }else{   
        return false;  
    }  
}

//验证电子邮件
function is_email(str) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str);
}

// 验证手机号
function is_sjh(phone) { 
    //var pattern = /^1[34578]\d{9}$/;
    //return pattern.test(phone);
	return /^1\d{10}$/i.test(phone);
}

//验证中文姓名
function is_xingming(name) {
    var pattern = /^[\u4E00-\u9FA5]{1,6}$/;
    return pattern.test(name);
}
  
// 验证身份证
function is_sfzh(card) {
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return pattern.test(card);
}

//是否包含字符串
//alert(is_baohan('abc','a'));
function is_baohan(str,char){
	if (str.indexOf(char) != -1 ){ return true; }else{	return false; }
}
 


//是否包含汉字
function is_baohan_hanzi(val){
	var reg = new RegExp("[\u4E00-\u9FFF]+","g");
	return reg.test(val);
}

//复选框组按名称ids[]计算选中个数
function checkbox_xz_num(checkbox_name){
	return $("input:checkbox[name='"+checkbox_name+"']:checked").length ;
}

//复选框组按名称ids[]计算选中 2,3,5
function checkbox_xz(checkbox_name){
	var s="";
	$("input:checkbox[name='"+checkbox_name+"']:checked").each(function(i){
		s=s+","+$(this).val();
	});
	if(s!=""){ s=s.substr(1); } //如果有选中，则去掉开头的逗号。
	return s;
}



//从二维数组抽取一列转一维数组
//[
//    {
//        "x": "30422",
//        "曾用名称": "222",
//        "标准名称": "国家博物馆（中国国家博物馆）"
//    },
//    {
//        "x": "30421",
//        "曾用名称": "111",
//        "标准名称": "国家博物馆（中国国家博物馆）"
//    }
//]
//从二维数组arr2中抽取x列成一维数组
function arr2_to_1(arr2,xiang){
	if(Array.isArray(arr2)){
		arr1 =[];
		for(var i=0; i<arr2.length;i++){
			arr1.push(arr2[i][xiang]);  
		}
		return arr1;
	}else{
		return false;
	}
}

//从二维数组抽取一列或多列组成新二维数组
//多个项用逗号隔开 x,xingming,nianling
function arr2_to_new(arr2,xiang){
	if(Array.isArray(arr2)){
		arr1 =[];
		xiang_arr = xiang.split(",");
		for(var i=0; i<arr2.length;i++){
			arrr={};
			for(var n=0; n<xiang_arr.length;n++){
				//alert(  arr2[i][xiang_arr[n]] );
				arrr[xiang_arr[n]] = arr2[i][xiang_arr[n]];
			}
			arr1.push(arrr);  
		}
		return arr1;
	}else{
		return false;
	}
}


//btn_loading 函数，实现ajax执行loading
//用法
/*
function chenggong(data){ //执行成功后
	layer.alert('执行完毕。', function(index) {
		//data.aaa 
		window.location.href='?';
	});
}
$("#btn_tongbu").click(function(){ //点击button执行同步
	 var canshu={	
	 				"a" : "aa" ,
					"b" : "bb"
				};
	 btn_loading($(this),'确定执行同步吗？','http://demo.yuyun365.com/yyui/3.0/btn_loading_server.php',canshu,chenggong);
}); 
*/
function btn_loading(that,tishi,url,canshu,success_function ){
	var btn_html = that.html(); //保持初始按钮值
	var btn_class = that.attr('class'); //保持初始按钮样式
	if(is_baohan(btn_class,'btn-sm')){
		var xiaoanniu = " yyui-btn-sm "; 
	}else if(is_baohan(btn_class,'btn-xs')){
		var xiaoanniu = " yyui-btn-xs "; 
	}else{
		var xiaoanniu = "";
	}
	if(tishi==''){ //无提示，直接执行
			that.attr('class','yyui-btn yyui-btn-jinyong ' + xiaoanniu ).html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>&nbsp;正在执行，请耐心等待').attr('disabled','disabled');
	
			$.ajax({
				//本地的url
				url : url,
				dataType:"jsonp",
				//传递参数
				data:canshu,
				//数据传输类型
				type:"post",
				//回调函数
				jsonp:"callback",
				timeout: 50000000,
				success:function(data){
					that.attr('class',btn_class).html(btn_html).removeAttr('disabled');
					success_function(data);
				}
			});
		
	}else{ //有提示
		layer.confirm(tishi, {icon: 3, title:'提示'}, function(index) {
			if(index) { //确定后的动作 
				layer.close(index);
				that.attr('class','yyui-btn yyui-btn-jinyong ' + xiaoanniu ).html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>&nbsp;正在执行，请耐心等待').attr('disabled','disabled');
				$.ajax({
					//本地的url
					url : url,
					dataType:"jsonp",
					//传递参数
					data:canshu,
					//数据传输类型
					type:"post",
					//回调函数
					jsonp:"callback",
					timeout: 50000000,
					success:function(data){
						that.attr('class',btn_class).html(btn_html).removeAttr('disabled');
						success_function(data);
					}
				});
	
			}else{ //取消后的动作 
				layer.close(index); return false;
			}
		});
	}
}


//导出多sheet到excel  by zgy2022年5月5日
//用法，提醒！
//引入xlsx.core.min.js 
//<script src="https://cdn.staticfile.org/xlsx/0.18.5/xlsx.core.min.js"><//script> 
//表格第一行的td如果设置 class=export_hidden，那么导出隐藏该列
//<button class="yyui-btnbai" onClick="yyui_export_xls('table1','表1','文件名');">导出excel</button>
//<button class="yyui-btnbai" onClick="yyui_export_xls('table1,table2,table3','表1,表2,表3','文件名');">导出2excel</button>
function yyui_export_xls(table_id,sheet_name,wjm) {
	
	var wb = XLSX.utils.book_new(); //excel这本书book
	table_arr=table_id.split(","); //表id数组 
	sheet_arr=sheet_name.split(","); //选项卡名字数组 
	for (i=0;i<table_arr.length ;i++ ){
		if(table_arr[i]+''!=''){
			
			var ws = XLSX.utils.table_to_sheet( document.querySelector("#"+table_arr[i]) ,{raw:true}) ;
			//ws['!cols'] =[{'wch': 50},{'wch': 20}];  //值10约等于75px，设置了第1、第二列
			
			//根据export_hidden构造删除列
			var yincanglie=""; //删除列 0,2表示删除第1列第3列
			$('#'+table_arr[i]+' tr:first').children().each(function (index, domEle) { //遍历table的第一行tr的各个td
				if($(this).hasClass('export_hidden')){ //查找各个td中如果含有export_hidden类，说明要隐藏
					//alert(index);
					yincanglie = yincanglie + ',' + index; //构造删除列
				}else{ //不隐藏(显示)的列设置列宽度
					if(  isnull($(this).attr('export_width'))  ){ //设置默认宽度12
						ws['!cols'].push({'wch': 12});
					}else{
						ws['!cols'].push({'wch': parseInt($(this).attr('export_width'))   });
					}		
				}
			});
			//console.log(ws);
			//alert(yincanglie);return;
 
			var yincanglie_arr = yincanglie.split(",");  //读取删除列
			yincanglie_arr.reverse(); //数组倒序，这里注意！必须数组倒序遍历，因为每删除一列，后面的列向前补齐，列索引不变；如果正序删除，例如删了第0列，再删第1列其实删了第2列。
			for (let i = 0, len = yincanglie_arr.length; i < len; i++) { 
				if(pnull(yincanglie_arr[i],"s")!=''){
					//alert(yincanglie_arr[i]);
					ws = deleteCol(ws,parseInt(yincanglie_arr[i])) ; //执行删除列，每次循环执行删除1列
				}
			}
			//ws = deleteCol(ws,1) ;  //删除index为1即删除第2列
			//ws = deleteCol(ws,0) ;  //删除index为0即删除第1列
			//console.log(ws);return; 
			XLSX.utils.book_append_sheet(wb, ws , sheet_arr[i]);
		}
	} 
	const workbookBlob = yyui_workbook2blob(wb);
	yyui_openDownloadDialog(workbookBlob, wjm+'.xlsx');
}
// 将workbook装化成blob对象
function yyui_workbook2blob(workbook) {
    // 生成excel的配置项
    var wopts = {
        // 要生成的文件类型
        bookType: "xlsx",
        // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        bookSST: false,
        type: "binary"
    };
    var wbout = XLSX.write(workbook, wopts);
    // 将字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    }
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    });
    return blob;
}
// 将blob对象创建bloburl，然后用a标签实现弹出下载框
function yyui_openDownloadDialog(blob, fileName) {
    if (typeof blob == "object" && blob instanceof Blob) {
        blob = URL.createObjectURL(blob); // 创建blob地址
    }
    var aLink = document.createElement("a");
    aLink.href = blob;
    // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
    aLink.download = fileName || "";
    var event;
    if (window.MouseEvent) event = new MouseEvent("click");
    //   移动端
    else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent( "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
    }
    aLink.dispatchEvent(event);
}

//编码
function encodeCell(r, c) {
    return XLSX.utils.encode_cell({ r, c });
}
//删除某行，未验证
function deleteRow(ws, index) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let row = index; row < range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            ws[encodeCell(row, col)] = ws[encodeCell(row + 1, col)];
        }
    }
    range.e.r--;
    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e);
}
//删除某列
function deleteCol(ws, index) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let col = index; col < range.e.c; col++) {
        for (let row = range.s.r; row <= range.e.r; row++) {
            ws[encodeCell(row, col)] = ws[encodeCell(row, col + 1)];  //每个单元格的值等于下一个单元格
			//delete ws.E1;
			delete ws[encodeCell(row, col + 1)];  //删除最后一列（删除数组元素）
        }
    }
	range.e.c--;
    ws['!fullref'] = XLSX.utils.encode_range(range.s, range.e);
    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e);
	return ws;
}
//导出excel结束////////////////////////////////////////////////////////////////

//密码强度：数字字母特殊字符4  数字字母3  仅字母或特殊字符2  仅位数合格1   
//alert(mima_qiangdu('aas#223asdf',8));
//if(mima_qiangdu('123456',8)>=3){alert('合格');}     参数：密码字符串；要求密码位数
function mima_qiangdu(password,weishu) {
	password = password.trim();
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;
    //const str = `密码:[${password}]是一个`
    if (hasNumber && hasLetter && hasSpecialChar && length >= weishu) {
        return 4;
    } else if (hasNumber && hasLetter && length >= weishu) {
        return 3;
    } else if (hasLetter && length >= weishu) {
        return 2;
    } else if (hasSpecialChar && length >= weishu) {
        return 2;
    } else if (length >= weishu) {
        return 1;
    } else {
        return 0;
    }
}

