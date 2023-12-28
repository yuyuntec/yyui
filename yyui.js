//yyui2.0  2022.08.09 by zgy

// 去掉所有input的autocomplete, 显示指定的除外 
$(function(){
	$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
});

//yyui本文域上传控件美化
$(function () {
	$(".yyui_file").hide();
	$(".yyui_file").each(function(){
		var kuan = $(this).width();
		var icon = pnull($(this).attr("icon"),"s"); 	if(icon+''==''){icon = "default"; }
		var placeholder = pnull($(this).attr("placeholder"),"s"); 	if(placeholder+''==''){placeholder = "请选择文件"; }
		$(this).after("<input type=\"text\" style=\"width:"+kuan+"px; background: url('https://yuyun365.oss-cn-beijing.aliyuncs.com/yyui/v1.0/images/uploadfile_"+icon+".png') no-repeat scroll left center transparent; \"  class=\"yyui_file_show\" placeholder=\""+placeholder+"\" readonly=\"readonly\"  onclick=\"$(this).prev().click();\"  />");
	});
	$(".yyui_file").change(function(){
		$(this).next().val(yyui_getFileName($(this).val()));
	});
	
	$(".yyui_file_sm").hide();
	$(".yyui_file_sm").each(function(){
		var kuan = $(this).width();
		var icon = pnull($(this).attr("icon"),"s"); 	if(icon+''==''){icon = "default"; }
		var placeholder = pnull($(this).attr("placeholder"),"s"); 	if(placeholder+''==''){placeholder = "请选择文件"; }
		$(this).after("<input type=\"text\" style=\"width:"+kuan+"px; background: url('https://yuyun365.oss-cn-beijing.aliyuncs.com/yyui/v1.0/images/uploadfile_"+icon+".png') no-repeat scroll left center transparent; \"  class=\"yyui_file_show_sm\" placeholder=\""+placeholder+"\" readonly=\"readonly\"  onclick=\"$(this).prev().click();\"  />");
	});
	$(".yyui_file_sm").change(function(){
		$(this).next().val(yyui_getFileName($(this).val()));
	});
});

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
		$('body').append('<input style="display:none;" type="file" name="yyui_wenjian'+rand+'" id="yyui_wenjian'+rand+'">');
		//执行点击文件域弹出文件选择窗
		$("#yyui_wenjian"+rand).click();
		//用户选择了文件后执行检测与上传
		$("#yyui_wenjian"+rand).on("change",function(){
			//读取文件域的值数组
			var fileArray =  document.getElementById('yyui_wenjian'+rand).files[0];
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


//表格美化，适合超多列内容横向滚动
function yyui_table(options) {
    options = options || {};  //调用函数时如果options没有指定，就给它赋值{},一个空的Object
	var elem = $.trim(options.elem); //选择器必填 #table1
    var height = options.height || "full";  
	var show_height;
	if(typeof height == 'number'){ //数字，直接指定像素高度
		show_height = height + 'px';
	}else if(height=='100%' || height=='full' ){ //字符型，全高就是可视屏幕高度
		show_height = $(window).height() + 'px';
	}else{ //字符型，full-250
		show_height = ($(window).height() - height.replaceAll(" ","").replaceAll("full-","")) + 'px';
	}
 	//alert(show_height);return;
	//为表格包裹div容器框以支持横向滚动条，默认100%宽，高度一般100% - 50
	$(elem).wrap('<div style="width:100%; overflow:auto;   height:'+show_height+'; "></div>');
//	$(elem).wrap('<div style="width:100%; box-sizing:border-box; border:1px solid #eeeeee; overflow:auto; height:'+show_height+';"></div>');

	//设置整体表格fixed
	//$(elem).css({"table-layout":"fixed","margin-top":"-1px","margin-left":"-1px" });
	$(elem).css({"table-layout":"fixed"  });
	//设置td或th单元格不换行，溢出省略号
	$(elem+' td, '+elem+' th').css({"white-space":"nowrap","overflow":"hidden","text-overflow":"ellipsis" });
	//为首行td（表头）单元格添加拖拽
	$(elem+' thead tr td ,'+elem+' thead tr th').prepend("<div class='yyui_table_lie_tuozhuai'></div>");
	
	$(elem+" thead tr td .yyui_table_lie_tuozhuai ,"+elem+" thead tr th .yyui_table_lie_tuozhuai ").mousedown(function (evt) {
		//1、找最近的td或th
		let dragTh = $(this).parent('td,th'); //所在td或th
		//2、记录按下时的鼠标位置
		var shubiao1 = evt.clientX;
		var shubiao2 = shubiao1;
		//3、获取当前鼠标按下时的表头的宽度
		var liekuan1 = dragTh.width();
		var liekuan2 = liekuan1;
		//4、移动鼠标获取位置
		$(document).mousemove(function(event){
			//$("span").text(event.pageX + ", " + event.pageY);
			shubiao2 = event.pageX;
			liekuan2 = liekuan1 + shubiao2 - shubiao1;
			if(liekuan2>20){  //极限列宽须大于20像素
				dragTh.width(liekuan2);
			}else{ //否则中断操作
				$(document).off("mousemove");//这里是解绑函数，使用off函数，
			}
		});
	}).mouseup(function (evt) {
		//5、鼠标弹起，拖拽完成，列宽留在那里
		$(document).off("mousemove");	//这里是解绑函数，使用off函数，
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
	if(!str || str=="undefined" || str=="null"){
		if(sn=="n"){
			return 0;
		}else{
			return "";
		}
	}
	return str;
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


// 验证手机号
function is_sjh(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
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

//复选框组按名称ids[]计算选中个数
function checkbox_xz_num(checkbox_name){
	return $("input:checkbox[name='"+checkbox_name+"']:checked").length ;
}


//btn_loading 函数，实现ajax执行loading
//dom节点，提示语，提交地址，提交参数{"miaoshu" : "学校主题-机构" ,"biaoming":"zf_bumen"}
function btn_loading(that,tishi,url,canshu){
	layer.confirm(tishi, {icon: 3, title:'提示'}, function(index) {
		if(index) { //确定后的动作 
			layer.close(index);
			var btn_html = that.html(); //保持初始按钮值
			var btn_class = that.attr('class'); //保持初始按钮样式
			that.attr('class','layui-btn layui-btn-disabled  layui-btn-sm');
			that.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>&nbsp;正在执行，请耐心等待');
			that.attr('disabled','disabled');
	
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
					that.attr('class',btn_class);
					that.html(btn_html);
					that.removeAttr('disabled');
					layer.alert('执行完毕', function(index) {
						//确定后 
						window.location.href='?';
					});
				}
			});

		}else{ //取消后的动作 
			layer.close(index); return false;
		}
	});
}


//导出多sheet到excel  by zgy2022年5月5日
//用法，引入xlsx.core.min.js 
//<script src="https://cdn.staticfile.org/xlsx/0.18.5/xlsx.core.min.js"><//script> 
//表格第一行的td如果设置export_hidden，那么导出隐藏该列
//<button class="yyui_btnbai" onClick="yyui_export_xls('table1','表1','文件名');">导出excel</button>
//<button class="yyui_btnbai" onClick="yyui_export_xls('table1,table2,table3','表1,表2,表3','文件名');">导出2excel</button>
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
			console.log(ws);
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
