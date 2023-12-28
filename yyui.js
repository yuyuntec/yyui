//18.06.12 by zgy
//需要调用js的效果有：选项卡、无限级下拉菜单


// 去掉所有input的autocomplete, 显示指定的除外 
$(function(){
	$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
});

//tab选项卡切换特效
$(function (){
　　$(".yyui_tab li").click(function (){
　　　　//获取点击的元素给其添加样式，讲其兄弟元素的样式移除
　　　　$(this).addClass("active").siblings().removeClass("active");
　　　　//获取选中元素的下标
　　　　var index = $(this).index();
　　　　$(this).parent().siblings().children().eq(index).addClass("active")
　　　　.siblings().removeClass("active");
　　});
});

//本文域上传控件美化
$(function () {
	$(".yyui_file").hide();
	$(".yyui_file").each(function(){
		var kuan = $(this).width();
		var icon = pnull($(this).attr("icon")); 	if(icon+''==''){icon = "default"; }
		var placeholder = pnull($(this).attr("placeholder")); 	if(placeholder+''==''){placeholder = "请选择文件"; }
		$(this).after("<input type=\"text\" style=\"width:"+kuan+"px; background: url('https://yuyun365.oss-cn-beijing.aliyuncs.com/yyui/v1.0/images/uploadfile_"+icon+".png') no-repeat scroll left center transparent; \"  class=\"yyui_file_show_part\" placeholder=\""+placeholder+"\" readonly=\"readonly\"  onclick=\"$(this).prev().click();\"  />");
	});
	$(".yyui_file").change(function(){
		$(this).next().val(yyui_getFileName($(this).val()));
	});
});




//导航菜单 
//第一步、运行函数；
//yyui_menu('.yyui_menu1');
//第二步、写css样式；
//<style type="text/css">
//.yyui_menu1 { height:35px; line-height:35px; font-size:15px; background-color:#f2f2f2; }
//.yyui_menu1 li { float:left; position:relative;} /*这一级是导航*/
//.yyui_menu1 li a { display:block; line-height:35px; text-decoration:none; padding:0px 20px; color:#333333;   }
//.yyui_menu1 li a:hover {  background:#EFEFEF; }
//.yyui_menu1 li a.more:after{content:" »";}
//.yyui_menu1 li ul { position:absolute; float:left; width:150px; border:1px solid #D2D2D2; display:none; background-color:#FFFfff; z-index:9999;} /*这是第二级菜单*/
//.yyui_menu1 li ul a { width:110px;text-decoration:none; color:#333333;}
//.yyui_menu1 li ul a:hover { background:#f2f2f2;}
// 
//.yyui_menu1 li ul ul{ top:0;left:150px;} /*从第三级菜单开始,所有的子级菜单都相对偏移*/
//</style>
function yyui_menu(ulclass){
	$(document).ready(function(){
		$(ulclass+' li').hover(function(){
			$(this).children("ul").show(); //mouseover
		},function(){
			$(this).children("ul").hide(); //mouseout
		});
	});
}



//yyui_popup 弹层特效
var yyui = new function() {
	this.width = $(window).width() * 0.5;
	this.height = 180;

	this.close = function() {
		$('.yyui_popup_area').hide();
		setTimeout(function() {
			$('.yyui_popup_area').remove();
		}, 100); //0.1秒消失
	};

	//**********************zgy自定义确认回车关闭，如果有错这段删除。2019.04.02
	$(document).keypress(function (e) {//捕获文档对象的按键弹起事件
		if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
			//此处用户敲回车后的代码
			if($(".yyui_popup_area").length > 0) { //仅弹层存在时执行
				yyui._close(true);
			}   
		}
	});
	/////*****************//////////////////////////////


	function messageBox(html,  message ,type) {
		var jq = $(html);
		if(type == "toast") {
			jq.find(".yyui_popup").width(message.length * 20).css("margin-left", -message.length * 20 / 2).css("margin-top", -yyui.height / 2);
		} else {
			jq.find(".yyui_popup").width(yyui.width).css("margin-left", -yyui.width / 2).css("margin-top", -yyui.height / 2 - 36);
		}

		jq.find(".content").html(message.replace('\r\n', '<br/>'));
		jq.appendTo('body').show();
	}

	this.confirm = function( message , selected) {
		this._close = function(flag) {
			selected(flag);
			if(flag) {
				$(".yyui_popup_area").remove();
			} else {
				this.close();
			};
		};

		var html = '<div class="yyui_popup_area"><div class="yyui_popup_mask_bg"></div><div class="yyui_popup"><div class="body-panel"><p class="content"></p><p class="btns"><button class="yyui_btnlan" onclick="yyui._close(true);">确定</button>&nbsp;&nbsp;&nbsp;<button class="yyui_btnbai" tabindex="1" onclick="yyui._close(false);">取消</button></p></div></div></div>';
		messageBox(html,  message);
	};

	this.alert = function( message , selected) {
		this._close = function(flag) {
			selected(flag);
			if(flag) {
				$(".yyui_popup_area").remove();
			} else {
				this.close();
			};
		};

		var html = '<div class="yyui_popup_area"><div class="yyui_popup_mask_bg"></div><div class="yyui_popup"><div class="body-panel"><p class="content"></p><p class="btns"><button class="yyui_btnlan" onclick="yyui._close(true);">确定</button></p></div></div></div>';
		messageBox(html,  message);
	};

	this.toast = function(message, time) {
		var html = '<div class="yyui_popup_area"><div class="yyui_popup"><div class="body-panel toast-panel"><p class="content toast-content"></p></div></div></div>';
		messageBox(html,  message, "toast");
		setTimeout(function() {
			yyui.close();
		}, time || 3000);
	}
};


/*!
http://mobiscroll.com
yyui_date 日历控件
 */
(function($){function Scroller(elem,settings){var m,hi,v,dw,ww,wh,rwh,mw,mh,anim,debounce,that=this,ms=$.mobiscroll,e=elem,elm=$(e),theme,lang,s=extend({},defaults),pres={},warr=[],iv={},pixels={},input=elm.is("input"),visible=false;function isReadOnly(wh){if($.isArray(s.readonly)){var i=$(".dwwl",dw).index(wh);return s.readonly[i]}return s.readonly}function generateWheelItems(i){var html='<div class="dw-bf">',l=1,j;for(j in warr[i]){if(l%20==0){html+='</div><div class="dw-bf">'}html+='<div class="dw-li dw-v" data-val="'+j+'" style="height:'+hi+"px;line-height:"+hi+'px;"><div class="dw-i">'+warr[i][j]+"</div></div>";l++}html+="</div>";return html}function setGlobals(t){min=$(".dw-li",t).index($(".dw-v",t).eq(0));max=$(".dw-li",t).index($(".dw-v",t).eq(-1));index=$(".dw-ul",dw).index(t);h=hi;inst=that}function formatHeader(v){var t=s.headerText;return t?(typeof t==="function"?t.call(e,v):t.replace(/\{value\}/i,v)):""}function read(){that.temp=((input&&that.val!==null&&that.val!=elm.val())||that.values===null)?s.parseValue(elm.val()||"",that):that.values.slice(0);that.setValue(true)}function scrollToPos(time,index,manual,dir,orig){if(event("validate",[dw,index,time])!==false){$(".dw-ul",dw).each(function(i){var t=$(this),cell=$('.dw-li[data-val="'+that.temp[i]+'"]',t),cells=$(".dw-li",t),v=cells.index(cell),l=cells.length,sc=i==index||index===undefined;if(!cell.hasClass("dw-v")){var cell1=cell,cell2=cell,dist1=0,dist2=0;while(v-dist1>=0&&!cell1.hasClass("dw-v")){dist1++;cell1=cells.eq(v-dist1)}while(v+dist2<l&&!cell2.hasClass("dw-v")){dist2++;cell2=cells.eq(v+dist2)}if(((dist2<dist1&&dist2&&dir!==2)||!dist1||(v-dist1<0)||dir==1)&&cell2.hasClass("dw-v")){cell=cell2;v=v+dist2}else{cell=cell1;v=v-dist1}}if(!(cell.hasClass("dw-sel"))||sc){that.temp[i]=cell.attr("data-val");$(".dw-sel",t).removeClass("dw-sel");cell.addClass("dw-sel");that.scroll(t,i,v,sc?time:0.1,sc?orig:undefined)}});that.change(manual)}}function position(check){if(s.display=="inline"||(ww===$(window).width()&&rwh===$(window).height()&&check)){return}var w,l,t,aw,ah,ap,at,al,arr,arrw,arrl,scroll,totalw=0,minw=0,st=$(window).scrollTop(),wr=$(".dwwr",dw),d=$(".dw",dw),css={},anchor=s.anchor===undefined?elm:s.anchor;ww=$(window).width();rwh=$(window).height();wh=window.innerHeight;wh=wh||rwh;if(/modal|bubble/.test(s.display)){$(".dwc",dw).each(function(){w=$(this).outerWidth(true);totalw+=w;minw=(w>minw)?w:minw});w=totalw>ww?minw:totalw;wr.width(w)}mw=d.outerWidth();mh=d.outerHeight(true);if(s.display=="modal"){l=(ww-mw)/2;t=st+(wh-mh)/2}else{if(s.display=="bubble"){scroll=true;arr=$(".dw-arrw-i",dw);ap=anchor.offset();at=ap.top;al=ap.left;aw=anchor.outerWidth();ah=anchor.outerHeight();l=al-(d.outerWidth(true)-aw)/2;l=l>(ww-mw)?(ww-(mw+20)):l;l=l>=0?l:20;t=at-mh;if((t<st)||(at>st+wh)){d.removeClass("dw-bubble-top").addClass("dw-bubble-bottom");t=at+ah}else{d.removeClass("dw-bubble-bottom").addClass("dw-bubble-top")}arrw=arr.outerWidth();arrl=al+aw/2-(l+(mw-arrw)/2);$(".dw-arr",dw).css({left:arrl>arrw?arrw:arrl})}else{css.width="100%";if(s.display=="top"){t=st}else{if(s.display=="bottom"){t=st+wh-mh}}}}css.top=t<0?0:t;css.left=l;d.css(css);$(".dw-persp",dw).height(0).height(t+mh>$(document).height()?t+mh:$(document).height());if(scroll&&((t+mh>st+wh)||(at>st+wh))){$(window).scrollTop(t+mh-wh)}}function testTouch(e){if(e.type==="touchstart"){touch=true;setTimeout(function(){touch=false},500)}else{if(touch){touch=false;return false}}return true}function event(name,args){var ret;args.push(that);$.each([theme.defaults,pres,settings],function(i,v){if(v[name]){ret=v[name].apply(e,args)}});return ret}function plus(t){var p=+t.data("pos"),val=p+1;calc(t,val>max?min:val,1,true)}function minus(t){var p=+t.data("pos"),val=p-1;calc(t,val<min?max:val,2,true)}that.enable=function(){s.disabled=false;if(input){elm.prop("disabled",false)}};that.disable=function(){s.disabled=true;if(input){elm.prop("disabled",true)}};that.scroll=function(t,index,val,time,orig){function getVal(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b}function ready(){clearInterval(iv[index]);delete iv[index];t.data("pos",val).closest(".dwwl").removeClass("dwa")}var px=(m-val)*hi,i;if(px==pixels[index]&&iv[index]){return}if(time&&px!=pixels[index]){event("onAnimStart",[dw,index,time])}pixels[index]=px;t.attr("style",(prefix+"-transition:all "+(time?time.toFixed(3):0)+"s ease-out;")+(has3d?(prefix+"-transform:translate3d(0,"+px+"px,0);"):("top:"+px+"px;")));if(iv[index]){ready()}if(time&&orig!==undefined){i=0;t.closest(".dwwl").addClass("dwa");iv[index]=setInterval(function(){i+=0.1;t.data("pos",Math.round(getVal(i,orig,val-orig,time)));if(i>=time){ready()}},100)}else{t.data("pos",val)}};that.setValue=function(sc,fill,time,temp){if(!$.isArray(that.temp)){that.temp=s.parseValue(that.temp+"",that)}if(visible&&sc){scrollToPos(time)}v=s.formatResult(that.temp);
if(!temp){that.values=that.temp.slice(0);that.val=v}if(fill){if(input){elm.val(v).trigger("change")}}};that.getValues=function(){var ret=[],i;for(i in that._selectedValues){ret.push(that._selectedValues[i])}return ret};that.validate=function(i,dir,time,orig){scrollToPos(time,i,true,dir,orig)};that.change=function(manual){v=s.formatResult(that.temp);if(s.display=="inline"){that.setValue(false,manual)}else{$(".dwv",dw).html(formatHeader(v))}if(manual){event("onChange",[v])}};that.changeWheel=function(idx,time){if(dw){var i=0,j,k,nr=idx.length;for(j in s.wheels){for(k in s.wheels[j]){if($.inArray(i,idx)>-1){warr[i]=s.wheels[j][k];$(".dw-ul",dw).eq(i).html(generateWheelItems(i));nr--;if(!nr){position();scrollToPos(time,undefined,true);return}}i++}}}};that.isVisible=function(){return visible};that.tap=function(el,handler){var startX,startY;if(s.tap){el.bind("touchstart",function(e){e.preventDefault();startX=getCoord(e,"X");startY=getCoord(e,"Y")}).bind("touchend",function(e){if(Math.abs(getCoord(e,"X")-startX)<20&&Math.abs(getCoord(e,"Y")-startY)<20){handler.call(this,e)}tap=true;setTimeout(function(){tap=false},300)})}el.bind("click",function(e){if(!tap){handler.call(this,e)}})};that.show=function(prevAnim){if(s.disabled||visible){return false}if(s.display=="top"){anim="slidedown"}if(s.display=="bottom"){anim="slideup"}read();event("onBeforeShow",[dw]);var l=0,i,label,mAnim="";if(anim&&!prevAnim){mAnim="dw-"+anim+" dw-in"}var html='<div class="dw-trans '+s.theme+" dw-"+s.display+'">'+(s.display=="inline"?'<div class="dw dwbg dwi"><div class="dwwr">':'<div class="dw-persp">'+'<div class="dwo"></div><div class="dw dwbg '+mAnim+'"><div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"></div></div></div><div class="dwwr">'+(s.headerText?'<div class="dwv"></div>':""));for(i=0;i<s.wheels.length;i++){html+='<div class="dwc'+(s.mode!="scroller"?" dwpm":" dwsc")+(s.showLabel?"":" dwhl")+'"><div class="dwwc dwrc"><table cellpadding="0" cellspacing="0"><tr>';for(label in s.wheels[i]){warr[l]=s.wheels[i][label];html+='<td><div class="dwwl dwrc dwwl'+l+'">'+(s.mode!="scroller"?'<div class="dwwb dwwbp" style="height:'+hi+"px;line-height:"+hi+'px;"><span>+</span></div><div class="dwwb dwwbm" style="height:'+hi+"px;line-height:"+hi+'px;"><span>&ndash;</span></div>':"")+'<div class="dwl">'+label+'</div><div class="dww" style="height:'+(s.rows*hi)+"px;min-width:"+s.width+'px;"><div class="dw-ul">';html+=generateWheelItems(l);html+='</div><div class="dwwo"></div></div><div class="dwwol"></div></div></td>';l++}html+="</tr></table></div></div>"}html+=(s.display!="inline"?'<div class="dwbc'+(s.button3?" dwbc-p":"")+'"><span class="dwbw dwb-s"><span class="dwb">'+s.setText+"</span></span>"+(s.button3?'<span class="dwbw dwb-n"><span class="dwb">'+s.button3Text+"</span></span>":"")+'<span class="dwbw dwb-c"><span class="dwb">'+s.cancelText+"</span></span></div></div>":'<div class="dwcc"></div>')+"</div></div></div>";dw=$(html);scrollToPos();event("onMarkupReady",[dw]);if(s.display!="inline"){dw.appendTo("body");setTimeout(function(){dw.removeClass("dw-trans").find(".dw").removeClass(mAnim)},350)}else{if(elm.is("div")){elm.html(dw)}else{dw.insertAfter(elm)}}event("onMarkupInserted",[dw]);visible=true;theme.init(dw,that);if(s.display!="inline"){that.tap($(".dwb-s span",dw),function(){if(that.hide(false,"set")!==false){that.setValue(false,true);event("onSelect",[that.val])}});that.tap($(".dwb-c span",dw),function(){that.cancel()});if(s.button3){that.tap($(".dwb-n span",dw),s.button3)}if(s.scrollLock){dw.bind("touchmove",function(e){if(mh<=wh&&mw<=ww){e.preventDefault()}})}$("input,select,button").each(function(){if(!$(this).prop("disabled")){$(this).addClass("dwtd").prop("disabled",true)}});position();$(window).bind("resize.dw",function(){clearTimeout(debounce);debounce=setTimeout(function(){position(true)},100)})}dw.delegate(".dwwl","DOMMouseScroll mousewheel",function(e){if(!isReadOnly(this)){e.preventDefault();e=e.originalEvent;var delta=e.wheelDelta?(e.wheelDelta/120):(e.detail?(-e.detail/3):0),t=$(".dw-ul",this),p=+t.data("pos"),val=Math.round(p-delta);setGlobals(t);calc(t,val,delta<0?1:2)}}).delegate(".dwb, .dwwb",START_EVENT,function(e){$(this).addClass("dwb-a")}).delegate(".dwwb",START_EVENT,function(e){e.stopPropagation();e.preventDefault();var w=$(this).closest(".dwwl");if(testTouch(e)&&!isReadOnly(w)&&!w.hasClass("dwa")){click=true;var t=w.find(".dw-ul"),func=$(this).hasClass("dwwbp")?plus:minus;setGlobals(t);clearInterval(timer);timer=setInterval(function(){func(t)},s.delay);func(t)}}).delegate(".dwwl",START_EVENT,function(e){e.preventDefault();if(testTouch(e)&&!move&&!isReadOnly(this)&&!click){move=true;$(document).bind(MOVE_EVENT,onMove);target=$(".dw-ul",this);scrollable=s.mode!="clickpick";pos=+target.data("pos");setGlobals(target);moved=iv[index]!==undefined;start=getCoord(e,"Y");startTime=new Date();stop=start;that.scroll(target,index,pos,0.001);if(scrollable){target.closest(".dwwl").addClass("dwa")}}});event("onShow",[dw,v])
};that.hide=function(prevAnim,btn){if(!visible||event("onClose",[v,btn])===false){return false}$(".dwtd").prop("disabled",false).removeClass("dwtd");elm.blur();if(dw){if(s.display!="inline"&&anim&&!prevAnim){dw.addClass("dw-trans").find(".dw").addClass("dw-"+anim+" dw-out");setTimeout(function(){dw.remove();dw=null},350)}else{dw.remove();dw=null}visible=false;pixels={};$(window).unbind(".dw")}};that.cancel=function(){if(that.hide(false,"cancel")!==false){event("onCancel",[that.val])}};that.init=function(ss){theme=extend({defaults:{},init:empty},ms.themes[ss.theme||s.theme]);lang=ms.i18n[ss.lang||s.lang];extend(settings,ss);extend(s,theme.defaults,lang,settings);that.settings=s;elm.unbind(".dw");var preset=ms.presets[s.preset];if(preset){pres=preset.call(e,that);extend(s,pres,settings);extend(methods,pres.methods)}m=Math.floor(s.rows/2);hi=s.height;anim=s.animate;if(elm.data("dwro")!==undefined){e.readOnly=bool(elm.data("dwro"))}if(visible){that.hide()}if(s.display=="inline"){that.show()}else{read();if(input&&s.showOnFocus){elm.data("dwro",e.readOnly);e.readOnly=true;elm.bind("focus.dw",function(){that.show()})}}};that.trigger=function(name,params){return event(name,params)};that.values=null;that.val=null;that.temp=null;that._selectedValues={};that.init(settings)}function testProps(props){var i;for(i in props){if(mod[props[i]]!==undefined){return true}}return false}function testPrefix(){var prefixes=["Webkit","Moz","O","ms"],p;for(p in prefixes){if(testProps([prefixes[p]+"Transform"])){return"-"+prefixes[p].toLowerCase()}}return""}function getInst(e){return scrollers[e.id]}function getCoord(e,c){var org=e.originalEvent,ct=e.changedTouches;return ct||(org&&org.changedTouches)?(org?org.changedTouches[0]["page"+c]:ct[0]["page"+c]):e["page"+c]}function bool(v){return(v===true||v=="true")}function constrain(val,min,max){val=val>max?max:val;val=val<min?min:val;return val}function calc(t,val,dir,anim,orig){val=constrain(val,min,max);var cell=$(".dw-li",t).eq(val),o=orig===undefined?val:orig,idx=index,time=anim?(val==o?0.1:Math.abs((val-o)*0.1)):0;inst.temp[idx]=cell.attr("data-val");inst.scroll(t,idx,val,time,orig);setTimeout(function(){inst.validate(idx,dir,time,orig)},10)}function init(that,method,args){if(methods[method]){return methods[method].apply(that,Array.prototype.slice.call(args,1))}if(typeof method==="object"){return methods.init.call(that,method)}return that}var scrollers={},timer,empty=function(){},h,min,max,inst,date=new Date(),uuid=date.getTime(),move,click,target,index,start,stop,startTime,pos,moved,scrollable,mod=document.createElement("modernizr").style,has3d=testProps(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]),prefix=testPrefix(),extend=$.extend,tap,touch,START_EVENT="touchstart mousedown",MOVE_EVENT="touchmove mousemove",END_EVENT="touchend mouseup",onMove=function(e){if(scrollable){e.preventDefault();stop=getCoord(e,"Y");inst.scroll(target,index,constrain(pos+(start-stop)/h,min-1,max+1))}moved=true},defaults={width:70,height:40,rows:3,delay:300,disabled:false,readonly:false,showOnFocus:true,showLabel:true,wheels:[],theme:"android-ics light",headerText:"{value}",display:"modal",mode:"scroller",preset:"",lang:"zh",setText:"Set",cancelText:"Cancel",scrollLock:true,tap:true,formatResult:function(d){return d.join(" ")},parseValue:function(value,inst){var w=inst.settings.wheels,val=value.split(" "),ret=[],j=0,i,l,v;for(i=0;i<w.length;i++){for(l in w[i]){if(w[i][l][val[j]]!==undefined){ret.push(val[j])}else{for(v in w[i][l]){ret.push(v);break}}j++}}return ret}},methods={init:function(options){if(options===undefined){options={}}return this.each(function(){if(!this.id){uuid+=1;this.id="scoller"+uuid}scrollers[this.id]=new Scroller(this,options)})},enable:function(){return this.each(function(){var inst=getInst(this);if(inst){inst.enable()}})},disable:function(){return this.each(function(){var inst=getInst(this);if(inst){inst.disable()}})},isDisabled:function(){var inst=getInst(this[0]);if(inst){return inst.settings.disabled}},isVisible:function(){var inst=getInst(this[0]);if(inst){return inst.isVisible()}},option:function(option,value){return this.each(function(){var inst=getInst(this);if(inst){var obj={};if(typeof option==="object"){obj=option}else{obj[option]=value}inst.init(obj)}})},setValue:function(d,fill,time,temp){return this.each(function(){var inst=getInst(this);if(inst){inst.temp=d;inst.setValue(true,fill,time,temp)}})},getInst:function(){return getInst(this[0])},getValue:function(){var inst=getInst(this[0]);if(inst){return inst.values}},getValues:function(){var inst=getInst(this[0]);if(inst){return inst.getValues()}},show:function(){var inst=getInst(this[0]);if(inst){return inst.show()}},hide:function(){return this.each(function(){var inst=getInst(this);if(inst){inst.hide()}})},destroy:function(){return this.each(function(){var inst=getInst(this);if(inst){inst.hide();$(this).unbind(".dw");delete scrollers[this.id];if($(this).is("input")){this.readOnly=bool($(this).data("dwro"))
}}})}};$(document).bind(END_EVENT,function(e){if(move){var time=new Date()-startTime,val=constrain(pos+(start-stop)/h,min-1,max+1),speed,dist,tindex,ttop=target.offset().top;if(time<300){speed=(stop-start)/time;dist=(speed*speed)/(2*0.0006);if(stop-start<0){dist=-dist}}else{dist=stop-start}tindex=Math.round(pos-dist/h);if(!dist&&!moved){var idx=Math.floor((stop-ttop)/h),li=$(".dw-li",target).eq(idx),hl=scrollable;if(inst.trigger("onValueTap",[li])!==false){tindex=idx}else{hl=true}if(hl){li.addClass("dw-hl");setTimeout(function(){li.removeClass("dw-hl")},200)}}if(scrollable){calc(target,tindex,0,true,Math.round(val))}move=false;target=null;$(document).unbind(MOVE_EVENT,onMove)}if(click){clearInterval(timer);click=false}$(".dwb-a").removeClass("dwb-a")}).bind("mouseover mouseup mousedown click",function(e){if(tap){e.stopPropagation();e.preventDefault();return false}});$.fn.mobiscroll=function(method){extend(this,$.mobiscroll.shorts);return init(this,method,arguments)};$.mobiscroll=$.mobiscroll||{setDefaults:function(o){extend(defaults,o)},presetShort:function(name){this.shorts[name]=function(method){return init(this,extend(method,{preset:name}),arguments)}},shorts:{},presets:{},themes:{},i18n:{}};$.scroller=$.scroller||$.mobiscroll;$.fn.scroller=$.fn.scroller||$.fn.mobiscroll;$.mobiscroll.i18n.zh=$.extend($.mobiscroll.i18n.zh,{dateFormat:"yy-mm-dd",dateOrder:"yymmdd",dayNames:["周日","周一;","周二;","周三","周四","周五","周六"],dayNamesShort:["日","一","二","三","四","五","六"],dayText:"日",hourText:"时",minuteText:"分",monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],monthNamesShort:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],monthText:"月",secText:"秒",timeFormat:"HH:ii:ss",timeWheels:"HHiiss",yearText:"年"});$.mobiscroll.i18n.zh=$.extend($.mobiscroll.i18n.zh,{setText:"确定",cancelText:"取消"});var theme={defaults:{dateOrder:"Mddyy",mode:"mixed",rows:5,width:70,height:36,showLabel:true,useShortLabels:true}};$.mobiscroll.themes["android-ics"]=theme;$.mobiscroll.themes["android-ics light"]=theme})(jQuery);(function($){var ms=$.mobiscroll,date=new Date(),defaults={dateFormat:"yy-mm-dd",dateOrder:"yymmdd",timeWheels:"HHiiss",timeFormat:"HH:ii:ss",startYear:date.getFullYear()-60,endYear:date.getFullYear()+10,monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortYearCutoff:"+10",monthText:"Month",dayText:"Day",yearText:"Year",hourText:"Hours",minuteText:"Minutes",secText:"Seconds",ampmText:"&nbsp;",nowText:"现在",showNow:true,stepHour:1,stepMinute:1,stepSecond:1,separator:" "},preset=function(inst){var that=$(this),html5def={},format;if(that.is("input")){switch(that.attr("type")){case"date":format="yy-mm-dd";break;case"datetime":format="yy-mm-ddTHH:ii:ssZ";break;case"datetime-local":format="yy-mm-ddTHH:ii:ss";break;case"month":format="yy-mm";html5def.dateOrder="mmyy";break;case"time":format="HH:ii:ss";break}var min=that.attr("min"),max=that.attr("max");if(min){html5def.minDate=ms.parseDate(format,min)}if(max){html5def.maxDate=ms.parseDate(format,max)}}var s=$.extend({},defaults,html5def,inst.settings),offset=0,wheels=[],ord=[],o={},i,k,f={y:"getFullYear",m:"getMonth",d:"getDate",h:getHour,i:getMinute,s:getSecond,a:getAmPm},p=s.preset,dord=s.dateOrder,tord=s.timeWheels,regen=dord.match(/D/),ampm=tord.match(/a/i),hampm=tord.match(/h/),hformat=p=="datetime"?s.dateFormat+s.separator+s.timeFormat:p=="time"?s.timeFormat:s.dateFormat,defd=new Date(),stepH=s.stepHour,stepM=s.stepMinute,stepS=s.stepSecond,mind=s.minDate||new Date(s.startYear,0,1),maxd=s.maxDate||new Date(s.endYear,11,31,23,59,59);inst.settings=s;format=format||hformat;if(p.match(/date/i)){$.each(["y","m","d"],function(j,v){i=dord.search(new RegExp(v,"i"));if(i>-1){ord.push({o:i,v:v})}});ord.sort(function(a,b){return a.o>b.o?1:-1});$.each(ord,function(i,v){o[v.v]=i});var w={};for(k=0;k<3;k++){if(k==o.y){offset++;w[s.yearText]={};var start=mind.getFullYear(),end=maxd.getFullYear();for(i=start;i<=end;i++){w[s.yearText][i]=dord.match(/yy/i)?i:(i+"").substr(2,2)}}else{if(k==o.m){offset++;w[s.monthText]={};for(i=0;i<12;i++){var str=dord.replace(/[dy]/gi,"").replace(/mm/,i<9?"0"+(i+1):i+1).replace(/m/,(i+1));w[s.monthText][i]=str.match(/MM/)?str.replace(/MM/,'<span class="dw-mon">'+s.monthNames[i]+"</span>"):str.replace(/M/,'<span class="dw-mon">'+s.monthNamesShort[i]+"</span>")}}else{if(k==o.d){offset++;w[s.dayText]={};for(i=1;i<32;i++){w[s.dayText][i]=dord.match(/dd/i)&&i<10?"0"+i:i}}}}}wheels.push(w)}if(p.match(/time/i)){ord=[];$.each(["h","i","s","a"],function(i,v){i=tord.search(new RegExp(v,"i"));if(i>-1){ord.push({o:i,v:v})}});ord.sort(function(a,b){return a.o>b.o?1:-1});$.each(ord,function(i,v){o[v.v]=offset+i});w={};for(k=offset;k<offset+4;k++){if(k==o.h){offset++;
w[s.hourText]={};for(i=0;i<(hampm?12:24);i+=stepH){w[s.hourText][i]=hampm&&i==0?12:tord.match(/hh/i)&&i<10?"0"+i:i}}else{if(k==o.i){offset++;w[s.minuteText]={};for(i=0;i<60;i+=stepM){w[s.minuteText][i]=tord.match(/ii/)&&i<10?"0"+i:i}}else{if(k==o.s){offset++;w[s.secText]={};for(i=0;i<60;i+=stepS){w[s.secText][i]=tord.match(/ss/)&&i<10?"0"+i:i}}else{if(k==o.a){offset++;var upper=tord.match(/A/);w[s.ampmText]={0:upper?"AM":"am",1:upper?"PM":"pm"}}}}}}wheels.push(w)}function get(d,i,def){if(o[i]!==undefined){return +d[o[i]]}if(def!==undefined){return def}return defd[f[i]]?defd[f[i]]():f[i](defd)}function step(v,st){return Math.floor(v/st)*st}function getHour(d){var hour=d.getHours();hour=hampm&&hour>=12?hour-12:hour;return step(hour,stepH)}function getMinute(d){return step(d.getMinutes(),stepM)}function getSecond(d){return step(d.getSeconds(),stepS)}function getAmPm(d){return ampm&&d.getHours()>11?1:0}function getDate(d){var hour=get(d,"h",0);return new Date(get(d,"y"),get(d,"m"),get(d,"d",1),get(d,"a")?hour+12:hour,get(d,"i",0),get(d,"s",0))}inst.setDate=function(d,fill,time,temp){var i;for(i in o){this.temp[o[i]]=d[f[i]]?d[f[i]]():f[i](d)}this.setValue(true,fill,time,temp)};inst.getDate=function(d){return getDate(d)};return{button3Text:s.showNow?s.nowText:undefined,button3:s.showNow?function(){inst.setDate(new Date(),false,0.3,true)}:undefined,wheels:wheels,headerText:function(v){return ms.formatDate(hformat,getDate(inst.temp),s)},formatResult:function(d){return ms.formatDate(format,getDate(d),s)},parseValue:function(val){var d=new Date(),i,result=[];try{d=ms.parseDate(format,val,s)}catch(e){}for(i in o){result[o[i]]=d[f[i]]?d[f[i]]():f[i](d)}return result},validate:function(dw,i){var temp=inst.temp,mins={y:mind.getFullYear(),m:0,d:1,h:0,i:0,s:0,a:0},maxs={y:maxd.getFullYear(),m:11,d:31,h:step(hampm?11:23,stepH),i:step(59,stepM),s:step(59,stepS),a:1},minprop=true,maxprop=true;$.each(["y","m","d","a","h","i","s"],function(x,i){if(o[i]!==undefined){var min=mins[i],max=maxs[i],maxdays=31,val=get(temp,i),t=$(".dw-ul",dw).eq(o[i]),y,m;if(i=="d"){y=get(temp,"y");m=get(temp,"m");maxdays=32-new Date(y,m,32).getDate();max=maxdays;if(regen){$(".dw-li",t).each(function(){var that=$(this),d=that.data("val"),w=new Date(y,m,d).getDay(),str=dord.replace(/[my]/gi,"").replace(/dd/,d<10?"0"+d:d).replace(/d/,d);$(".dw-i",that).html(str.match(/DD/)?str.replace(/DD/,'<span class="dw-day">'+s.dayNames[w]+"</span>"):str.replace(/D/,'<span class="dw-day">'+s.dayNamesShort[w]+"</span>"))})}}if(minprop&&mind){min=mind[f[i]]?mind[f[i]]():f[i](mind)}if(maxprop&&maxd){max=maxd[f[i]]?maxd[f[i]]():f[i](maxd)}if(i!="y"){var i1=$(".dw-li",t).index($('.dw-li[data-val="'+min+'"]',t)),i2=$(".dw-li",t).index($('.dw-li[data-val="'+max+'"]',t));$(".dw-li",t).removeClass("dw-v").slice(i1,i2+1).addClass("dw-v");if(i=="d"){$(".dw-li",t).removeClass("dw-h").slice(maxdays).addClass("dw-h")}}if(val<min){val=min}if(val>max){val=max}if(minprop){minprop=val==min}if(maxprop){maxprop=val==max}if(s.invalid&&i=="d"){var idx=[];if(s.invalid.dates){$.each(s.invalid.dates,function(i,v){if(v.getFullYear()==y&&v.getMonth()==m){idx.push(v.getDate()-1)}})}if(s.invalid.daysOfWeek){var first=new Date(y,m,1).getDay(),j;$.each(s.invalid.daysOfWeek,function(i,v){for(j=v-first;j<maxdays;j+=7){if(j>=0){idx.push(j)}}})}if(s.invalid.daysOfMonth){$.each(s.invalid.daysOfMonth,function(i,v){v=(v+"").split("/");if(v[1]){if(v[0]-1==m){idx.push(v[1]-1)}}else{idx.push(v[0]-1)}})}$.each(idx,function(i,v){$(".dw-li",t).eq(v).removeClass("dw-v")})}temp[o[i]]=val}})},methods:{getDate:function(temp){var inst=$(this).mobiscroll("getInst");if(inst){return inst.getDate(temp?inst.temp:inst.values)}},setDate:function(d,fill,time,temp){if(fill==undefined){fill=false}return this.each(function(){var inst=$(this).mobiscroll("getInst");if(inst){inst.setDate(d,fill,time,temp)}})}}}};$.each(["date","time","datetime"],function(i,v){ms.presets[v]=preset;ms.presetShort(v)});ms.formatDate=function(format,date,settings){if(!date){return null}var s=$.extend({},defaults,settings),look=function(m){var n=0;while(i+1<format.length&&format.charAt(i+1)==m){n++;i++}return n},f1=function(m,val,len){var n=""+val;if(look(m)){while(n.length<len){n="0"+n}}return n},f2=function(m,val,s,l){return(look(m)?l[val]:s[val])},i,output="",literal=false;for(i=0;i<format.length;i++){if(literal){if(format.charAt(i)=="'"&&!look("'")){literal=false}else{output+=format.charAt(i)}}else{switch(format.charAt(i)){case"d":output+=f1("d",date.getDate(),2);break;case"D":output+=f2("D",date.getDay(),s.dayNamesShort,s.dayNames);break;case"o":output+=f1("o",(date.getTime()-new Date(date.getFullYear(),0,0).getTime())/86400000,3);break;case"m":output+=f1("m",date.getMonth()+1,2);break;case"M":output+=f2("M",date.getMonth(),s.monthNamesShort,s.monthNames);break;case"y":output+=(look("y")?date.getFullYear():(date.getYear()%100<10?"0":"")+date.getYear()%100);break;case"h":var h=date.getHours();output+=f1("h",(h>12?(h-12):(h==0?12:h)),2);break;case"H":output+=f1("H",date.getHours(),2);
break;case"i":output+=f1("i",date.getMinutes(),2);break;case"s":output+=f1("s",date.getSeconds(),2);break;case"a":output+=date.getHours()>11?"pm":"am";break;case"A":output+=date.getHours()>11?"PM":"AM";break;case"'":if(look("'")){output+="'"}else{literal=true}break;default:output+=format.charAt(i)}}}return output};ms.parseDate=function(format,value,settings){var def=new Date();if(!format||!value){return def}value=(typeof value=="object"?value.toString():value+"");var s=$.extend({},defaults,settings),shortYearCutoff=s.shortYearCutoff,year=def.getFullYear(),month=def.getMonth()+1,day=def.getDate(),doy=-1,hours=def.getHours(),minutes=def.getMinutes(),seconds=0,ampm=-1,literal=false,lookAhead=function(match){var matches=(iFormat+1<format.length&&format.charAt(iFormat+1)==match);if(matches){iFormat++}return matches},getNumber=function(match){lookAhead(match);var size=(match=="@"?14:(match=="!"?20:(match=="y"?4:(match=="o"?3:2)))),digits=new RegExp("^\\d{1,"+size+"}"),num=value.substr(iValue).match(digits);if(!num){return 0}iValue+=num[0].length;return parseInt(num[0],10)},getName=function(match,s,l){var names=(lookAhead(match)?l:s),i;for(i=0;i<names.length;i++){if(value.substr(iValue,names[i].length).toLowerCase()==names[i].toLowerCase()){iValue+=names[i].length;return i+1}}return 0},checkLiteral=function(){iValue++},iValue=0,iFormat;for(iFormat=0;iFormat<format.length;iFormat++){if(literal){if(format.charAt(iFormat)=="'"&&!lookAhead("'")){literal=false}else{checkLiteral()}}else{switch(format.charAt(iFormat)){case"d":day=getNumber("d");break;case"D":getName("D",s.dayNamesShort,s.dayNames);break;case"o":doy=getNumber("o");break;case"m":month=getNumber("m");break;case"M":month=getName("M",s.monthNamesShort,s.monthNames);break;case"y":year=getNumber("y");break;case"H":hours=getNumber("H");break;case"h":hours=getNumber("h");break;case"i":minutes=getNumber("i");break;case"s":seconds=getNumber("s");break;case"a":ampm=getName("a",["am","pm"],["am","pm"])-1;break;case"A":ampm=getName("A",["am","pm"],["am","pm"])-1;break;case"'":if(lookAhead("'")){checkLiteral()}else{literal=true}break;default:checkLiteral()}}}if(year<100){year+=new Date().getFullYear()-new Date().getFullYear()%100+(year<=(typeof shortYearCutoff!="string"?shortYearCutoff:new Date().getFullYear()%100+parseInt(shortYearCutoff,10))?0:-100)}if(doy>-1){month=1;day=doy;do{var dim=32-new Date(year,month-1,32).getDate();if(day<=dim){break}month++;day-=dim}while(true)}hours=(ampm==-1)?hours:((ampm&&hours<12)?(hours+12):(!ampm&&hours==12?0:hours));var date=new Date(year,month-1,day,hours,minutes,seconds);if(date.getFullYear()!=year||date.getMonth()+1!=month||date.getDate()!=day){throw"Invalid date"}return date}})(jQuery);

//初始化执行，如果需要单独设置，从mobiscroll_date.js中剪切出来放到需要的页面执行。
$(function () {
	$(".yyui_date").mobiscroll($.extend( {preset : 'date'} , {startYear:1960,endYear:2030}  ));
	$(".yyui_datetime").mobiscroll($.extend( {preset : 'datetime'} , {startYear:1960,endYear:2030}  ));
});




/* oldjs常用函数 *************************************************************************/
/* ***********************************************************************************/
function yyui_getFileName(o){ //获取文件名
	var pos=o.lastIndexOf("\\");
	return o.substring(pos+1);  
}

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

function valempty(str) { //检测是否空字符串
	if(str == "null" || str == null || str == "" || str == "undefined" || str == undefined || str == 0) {
		return true;
	} else {
		return false;
	}
}



/* js常用函数 *************************************************************************/
/* ***********************************************************************************/
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

//导出多sheet到excel  by zgy2020年9月20日
//用法，引入xlsx.core.min.js
//<button class="yyui_btnbai" onClick="export_xls('table1','表1','只有表1');">导出excel</button>
//<button class="yyui_btnbai" onClick="export_xls('table1,table2','表1,表2','文件名');">导出2excel</button>
function export_xls(table_id,sheet_name,wjm) {
	var wb = XLSX.utils.book_new();
	table_arr=table_id.split(","); //表id数组 
	sheet_arr=sheet_name.split(","); //选项卡名字数组 
	for (i=0;i<table_arr.length ;i++ ){
		if(table_arr[i]+''!=''){
			XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet( document.querySelector("#"+table_arr[i]) ,{raw:true})  , sheet_arr[i]);
		}
	} 
	const workbookBlob = workbook2blob(wb);
	openDownloadDialog(workbookBlob, wjm+'.xlsx');
}
// 将workbook装化成blob对象
function workbook2blob(workbook) {
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
function openDownloadDialog(blob, fileName) {
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
//导出excel结束////////////////////////////////////////////////////////////////