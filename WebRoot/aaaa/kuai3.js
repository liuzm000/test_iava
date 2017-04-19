/**
 * 定义array删除元素方法
 * @param dx
 * @returns {Boolean}
 */
Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i]!=this[dx]) 
        { 
            this[n++]=this[i];
        } 
    } 
    this.length-=1;
};
////////////////////////////
var Lottery={
		TotalInvestNum:0,//总投注数
		TotalMoney:0,//总金额
		TotalMultiple: 1, //总倍数
        MaxAllowInvestMultiple: 999, //允许投注的最大倍数,默认999倍
        LotteryNumber: "", //投注号码
        Copies:1,//份数
		GuaranteeAmount:0,//保底金额
		SelectGroupHunting :"#pl_groupHunting",
		zhuiHaoTotal:0,//追号总金额
		PlayTypeID:0,//投注选号类型
		investNum:1,//每次投注数
		typeName:"单选",//具体玩法  如：单选，组三 ，组六
        /**
    	 * 单选--确认选号
    	 */
        danXuan:function (obj){
        		var danxuanType = $('input:radio[name=danxuan]:checked').val();//单选类型。： 普通或者单式上传
        		var baiWei=new Array();//百位选中的数字
        		var shiWei=new Array();//十位选中的数字
        		var geWei=new Array();//个位选中的数字
        		$pailie_choose_numwrap = $(obj).parent().parent().find(".pailie_choose_numwrap");
        		this.investNum = this.GetLotteryInvestNum($pailie_choose_numwrap,baiWei,shiWei,geWei);
        		var  lottery =  this.saveLotteryNumber($pailie_choose_numwrap,baiWei,shiWei,geWei);
        		console.log(this.PlayTypeID);
        		if(this.investNum==0){
        			toast("请投注号码");return false;
        		}
        		//清空已选号码
        		$pailie_choose_numwrap.children("li").find(".pailie_num_bit").find(">ol li").removeClass("curr");
        		var lotteryCount=0;//总金额
        		lotteryCount=this.investNum*2;
        		if(this.PlayTypeID!=0){//非和值选择
        			var lotteryHtml  ="<li title=\""+lottery+" ["+this.investNum+"注，"+lotteryCount+"元]\">	<span>" +
    				"<a class=\"touzhu-del\" href=\"javascript:;\" id=\"lotteryInfo\" lotteryType=\""+this.typeName+"\" rel=\""+lottery+"\"  name=\""+this.investNum+"\" dir=\""+lotteryCount+"\">删除</a></span>	" +
    						"<b>"+this.typeName+"&nbsp;&nbsp;</b><i>"+lottery+"</i>&nbsp;&nbsp;["+this.investNum+"注，"+lotteryCount+"元]  </li>";
        			$(".touzhu_conlist>ul").prepend(lotteryHtml);
        		}
        		
        		//总注数累加
        		Lottery.TotalInvestNum=Lottery.TotalInvestNum+this.investNum;
        		//总金额累加
        		Lottery.TotalMoney=Lottery.TotalMoney+lotteryCount;
        		
        		Lottery.deleteLottery();
        		Lottery.numberLottery();
        		CommonInit.inithemai();
				$(".zhuihaoyuan").text(Lottery.TotalMoney+".00");//追号 中的每期金额
				this.clearMunberLottery($(obj));
        		if("danshi"==danxuanType){//单选类型。：单式上传
        			
        		}
        	},
        	init:function(){//初始化选球点击效果
        		 //选球点击选中
        	    $(".pailie_num_bit").children("ol").children("li").bind('click', function () {
        	    	Lottery.initMunberLottery($(this).parent().parent().parent().parent().parent());
        	    });
        	    //绑定13种彩种的确认选号效果
        	    $(".confirm_but").on("click",function(){
        	    	Lottery.danXuan(this);
        	    });
        	},
        	deleteLottery:function(){//删除注数
        		$(".touzhu-del").unbind().on("click", function(){
        			var investNum = $(this).attr("name");
        			var lotteryCount = $(this).attr("dir");
        			//删除操作  总注数和总金额 相减
        			Lottery.TotalInvestNum=Lottery.TotalInvestNum-investNum;
        			Lottery.TotalMoney=Lottery.TotalMoney-lotteryCount;
        			$(this).parent().parent().remove();
        			Lottery.numberLottery();
        		});
        	},
        	initMunberLottery:function(obj){//初始化选中的注数和金额
        		var danxuan_show = obj.parent().parent().find(".info_confirm");
        		console.log(danxuan_show);
        		var investNum=1;//总投注数
//    	    	$(obj).find(".pailie_num_bit").each(function () {
//    	            investNum *= $(this).find("ol").find("li.curr").length;
//    	        });
        		investNum = this.GetLotteryInvestNum($(obj));
    	    	 danxuan_show.find("i:first").html(investNum);//展示总注数
 	            danxuan_show.find("i").eq(1).html(investNum*2);//展示总金额
        	},
        	clearMunberLottery:function(obj){//清空展示的注数和金额
        		var danxuan_show = obj.parent().parent().find(".info_confirm");
        		var investNum=0;
    	    	 danxuan_show.find("i:first").html(investNum);//展示总注数
 	            danxuan_show.find("i").eq(1).html(investNum*2);//展示总金额
        	},
        	numberLottery:function(){//计算已购注数
    			var $rnum1 = $(".lde-rnum1"),
    			$rnum2 = $(".lde-rnum2");
    			$rnum1.text(Lottery.TotalInvestNum);
    			$rnum2.text(Lottery.TotalMoney);
    			CommonInit.initZhuiHaoTotal();
    			
        	},
        	
        	inithemai:function(){//添加投注数字实时修改  购买方式--》发起合买--》我要认购和我要保底的金额
        		var totalMoney = Lottery.TotalMoney*Lottery.TotalMultiple; //投注总金额=总倍数*总金额
				var minTotalMoney=parseInt(totalMoney/10);//最少认购金额比例=投注总金额 10%
				$("#buyshare").val(minTotalMoney);
				$("#minTotalMoney").text(minTotalMoney);
				$("#minTotalAmount").text(minTotalMoney+".00");
				$("#maxAssureshare").text(totalMoney-minTotalMoney);//最多保底份数
				
				
        	},
        	GetSelectedBallCount: function (obj) { //取选中的个数
                return $(obj).find("ol").find("li.curr").length;
            },
            GetLotteryInvestNum: function (pailie_choose_numwrap) {//获取注数
                var investNum = 0;
                console.log("this.PlayTypeID"+this.PlayTypeID);
                switch (this.PlayTypeID) {
                    case 0: //和值
                    	investNum = this.getCurrLength(pailie_choose_numwrap);
                        break;
                    case 1: //三同号通选
                    	investNum = this.getCurrLength(pailie_choose_numwrap);
                    	break;
                    case 2: //三同号单选
                    	investNum = this.getCurrLength(pailie_choose_numwrap);
                    	break;
                    case 3://三不同号
                    	 var count = this.getCurrLength(pailie_choose_numwrap);
                        investNum = count > 2 ? this.Combination(count, 3) : 0;
                        break;
                    case 4://三连号通选
                    	investNum =this.getCurrLength(pailie_choose_numwrap);
                        break;
                    case 5://二同号复选
                    	investNum = this.getCurrLength(pailie_choose_numwrap);
                        break;
                    case 6://二同号单选
                    	var count  = pailie_choose_numwrap.children("li:eq(0)").find(".pailie_num_bit").find("ol").find("li.curr").length;
                    	var count2  = pailie_choose_numwrap.children("li:eq(1)").find(".pailie_num_bit").find("ol").find("li.curr").length;
                    	investNum = count * count2;
                    	break;
                    case 7://二不同号
                    	investNum = this.getCurrLength(pailie_choose_numwrap) > 1 ? this.Combination(this.getCurrLength(pailie_choose_numwrap), 2) : 0;
                         break;
                }
                return investNum;
            },
            Combination: function (m, n) { //算组合数，m中取n
                if (m == 0 || m < n) return 0;
                var investNum = 1;
                for (var i = m; i > n; i--) {
                    investNum *= i;
                }
                var f = 1;
                for (var i = m - n; i > 0; i--) {
                    f *= i;
                }

                return investNum /= f;
            },
            getCurrLength: function (pailie_choose_numwrap) { //获取选中的号码个数
            	return  pailie_choose_numwrap.children("li").find(".pailie_num_bit").find("ol").find("li.curr").length;
            },
            GetRandomNumber: function (startNum, endNum, count, splitStr, isSort) { //取随机数并按随机数的数量组合起来
                //startNum随机数开始
                //endNum随机数结束
                //count随机的数量
                //splitStr随机数之间分隔符
                //isSort是否需要排序
                var arrs = new Array(); //随机数集合
                var nums = "";

                //取随机不重复的号码
                while (arrs.length < count) {
                    var num = parseInt(Math.floor(Math.random() * endNum + startNum));
                    if (arrs.contains(num) == false) arrs.push(num);
                }

                //排序数字从小到大
                if (isSort == true) arrs.sort(function (a, b) { return a > b ? 1 : -1 });

                //把随机数按组合起来分隔符为splitStr
                for (var i = 0; i < arrs.length; i++) {
                    nums += arrs[i] + splitStr;
                }

                nums = nums.substring(0, nums.lastIndexOf(splitStr));
                return nums;
            },
            saveLotteryNumber:function(pailie_choose_numwrap,baiWei,shiWei,geWei){//保存选择的投注号码  用array存储
            	var  lottery="";
            	switch (this.PlayTypeID) {
                case 0: //和值
                		this.typeName="和值";
                		var lotteryHtml="";
                		var investNum="1";
                		var lotteryCount="2";
                		var typeName=this.typeName;
                		pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
        					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
        						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
        							var lottery = $(this).html();
        									 lotteryHtml +="<li title=\""+lottery+" ["+investNum+"注，"+lotteryCount+"元]\">	<span>" +
        				        				"<a class=\"touzhu-del\" href=\"javascript:;\" id=\"lotteryInfo\" lotteryType=\""+typeName+"\" rel=\""+lottery+"\"  name=\""+investNum+"\" dir=\""+lotteryCount+"\">删除</a></span>	" +
        				        						"<b>"+typeName+"&nbsp;&nbsp;</b><i>"+lottery+"</i>&nbsp;&nbsp;["+investNum+"注，"+lotteryCount+"元]  </li>";
        						});
        					});
                		});	
                		lottery= baiWei.join(Constant.g);//购买详细
                		
        		$(".touzhu_conlist>ul").prepend(lotteryHtml);
                    break;
                case 1: //三同号通选
                    pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    									baiWei.push($(this).text());
    						});
    					});
            		});	
                    	this.typeName="三同号通选";
                    	lottery= baiWei.join("");//购买详细
                    break;
                case 2:  //三同号单选
                	this.typeName="三同号单选";
                	pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    									baiWei.push($(this).text());
    						});
    					});
            		});	
                	lottery= baiWei.join(Constant.g);//购买详细
                    break;
                case 3://三不同号
                	this.typeName="三不同号复式";
                    pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    									baiWei.push($(this).text());
    						});
    					});
            		});	
                    	lottery= baiWei.join(Constant.g);//购买详细
                    break;
                case 4://三连号通选
                	this.typeName="三连号通选";
                	pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    									baiWei.push($(this).text());
    						});
    					});
            		});	
                	lottery= baiWei.join("");//购买详细
                    break;
                case 5://二同号复选
                	this.typeName="二同号复选";
                	pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    									baiWei.push($(this).text());
    						});
    					});
            		});	
                	lottery= baiWei.join(Constant.g);//购买详细
                	break;
                case 6:///二同号单选
                	this.typeName="二同号单选";
                	pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    								if(i==0){//百位
    									baiWei.push($(this).text());
    								}
    								if(i==1){//十位
    									shiWei.push($(this).text());
    								}
    						});
    					});
            		});	
                	lottery= baiWei.join(" ")+Constant.g+shiWei.join(" ");//购买详细
                    break;
                case 7://二不同号
                	this.typeName="二不同号复式";
                	pailie_choose_numwrap.children("li").each(function(i,item){//
    					$(this).find(".pailie_num_bit").each(function(){//
    						$(this).find("li.curr").each(function(){//
									baiWei.push($(this).text());
    						});
    					});
            		});	
                	lottery= baiWei.join("");//购买详细
                    break;
            	}
            	return lottery;
            },
            GetSelectedBallText: function (obj, splitChar) { //取选中球的号码
                if (splitChar == undefined)
                    return "Please enter the char for split the number";

                var temp = "";
                $(obj).find("li.curr").each(function () {
                    temp += $.trim($(this).text()) + splitChar; //按分割符合拼接号码
                });
                if (temp.substring(temp.length - 1, temp.length) == splitChar && splitChar != "")
                    temp = temp.substring(0, temp.length - 1);

                return $.trim(temp);
            }
};
/*组六胆拖返回注数
dan: 1 或1,5  注意胆只能为一个或2个
tuo:2,3,4 
*/
function getSXZLDTCount(dan, tuo) {
    if (dan.length != 1 && dan.length != 3)
        return 0;
    var CanonicalNumber = dan + "," + tuo;
    if (CanonicalNumber.length < 4)
        return 0;
    var strs = CanonicalNumber.split(",");
    var al = new Array();

    var dans = dan.split(",");

    var n = strs.length;
    for (var i = 0; i < n - 2; i++) {
        for (var j = i + 1; j < n - 1; j++) {
            for (var k = j + 1; k < n; k++) {
                if (dans.length > 1) {
                    var temps = strs[i].toString() + strs[j].toString() + strs[k].toString();
                    if ((temps.indexOf(dans[0]) > -1) && (temps.indexOf(dans[1]) > -1)) {
                        al.push(strs[i].toString() + strs[j].toString() + strs[k].toString());
                    }
                }
                else {
                    var temps = strs[i].toString() + strs[j].toString() + strs[k].toString();
                    if ((temps.indexOf(dans[0]) > -1)) {
                        al.push(strs[i].toString() + strs[j].toString() + strs[k].toString());
                    } 
                }
            }
        }
    }
    return al.length;
}
/*组三胆拖返回注数
dan: 1  注意胆只能为一个
tuo:2,3,4 
*/
function getSXZSDTCount(dan, tuo) {
    if (dan.length != 1)
        return 0;
    if (tuo.indexOf(dan) > -1)
        return 0;
    var CanonicalNumber = dan + "," + tuo;
    if (CanonicalNumber.length < 3)
        return 0;
    var strs = CanonicalNumber.split(",");
    var al = new Array();

    var n = strs.length;
    for (var i = 0; i < n - 1; i++)
        for (var j = i + 1; j < n; j++) {
            if ((strs[i].toString() + strs[i].toString() + strs[j].toString()).indexOf(dan) > -1) {
                al.push(strs[i].toString() + strs[i].toString() + strs[j].toString());
            }
            if ((strs[i].toString() + strs[j].toString() + strs[j].toString()).indexOf(dan) > -1) {
                al.push(strs[i].toString() + strs[j].toString() + strs[j].toString());
            }
        }
    return al.length;
}

/**
 * 初始化倒计时和期号信息等页面信息
 */
//function initLotteryInfo(){
//	
//	var type=$("#tpyeId").val();
//	var json={"type":type};//类型
//	$.ajax({
//		type : "POST",  //提交方式
//		datatype:"json",
//		url : "initLotteryInfo",//路径
//		data :json ,//数据，这里使用的是Json格式进行传输
//		success : function(data) {//返回数据根据结果进行相应的处理
//			var currentIsSueNumber = data.isSueNumber;//期号
//			var downTime = data.downTime;//倒计时时间  "HH:mm:ss"
//			displaySubmit(data.isOpen);
//			var lotteryIssueInfos = data.lotteryIssueInfos;//未开奖的所有期号。最大120期 LIST<LotteryIssueInfo>
//			var issueSize = data.issueSize;//追号的总期数
//			var startDate = data.startDate;//本期开奖时间
//			var endAcount = data.endAcount;//今天未开期数
//			var startAcount = data.startAcount;//今天已开期数 
//			$("#issueSize").text("(共"+issueSize+"期)");
//			var html = initIsSueNumberInfo(startDate,currentIsSueNumber,lotteryIssueInfos);
//			$(".zhuihaoBox_con").append(html);
//			/**
//			 * 初始化追号信息   事件绑定
//			 */
//			initZhuiHaoBind();
//			$("#isSueNumber").text(currentIsSueNumber);
//			$("#endAcount").text(endAcount);//今天未开期数
//			$("#startAcount").text(startAcount);//今天已开期数 
//			$("#isOpen").text(startAcount);//今天已开期数 
//			$("#isNotOpen").text(endAcount);//今天未开期数
//			//倒计时
//			timeDown($("#is-count-down"), downTime, function(){
//				//回调
//				console.log("00:00");
//			});
//		}
//    });
//	
//}
/**
 * 生成购买方式： 追号的未开奖期号DIV
 * @param currentIsSueNumber
 * @param lotteryIssueInfos
 * @param html
 */
function initIsSueNumberInfo(startDate,currentIsSueNumber,lotteryIssueInfos){
	var html="";
	html+="<dd class=\"bg_f7f7f7 active\">"+//当前期号
	"<span class=\"serialNum\">1</span>"+
	"<span class=\"period\">"+
	"<label>"+
	  "<input type=\"checkbox\" id=\"zhuihao\" name=\"number\" value=\""+currentIsSueNumber+"\" checked=\"checked\"> 第"+currentIsSueNumber+"期"+
	"</label><em>(当前期)</em>"+
    "</span>"+
    "<span class=\"multiple\">"+
	  "<input class=\"zhuihaoInput\" name=\"number\" type=\"text\" autocomplete=\"off\" pid=\"106657\" value=\"1\"> 倍</span><span class=\"amount\"><b>¥</b><em class=\"zhuihaoyuan\">0</em>元"+
	"</span>"+
	"<span class=\"datetime\">"+startDate+"</span>"+
"</dd>";
	$(lotteryIssueInfos).each(function(i,item){
		var isSueNumber = this.isSueNumber;//未开奖的期号
		if(i==0){//下期
			html+="<dd class=\"active display\">"+
			  "<span class=\"serialNum\">2</span>"+
			  "<span class=\"period\">"+
			  "<label>"+
			    "<input type=\"checkbox\" id=\"zhuihao\"  name=\"number\" value=\""+isSueNumber+"\" checked=\"checked\"> 第"+isSueNumber+"期"+
			  "</label><em>(下期)</em>"+
			  "</span>"+
			  "<span class=\"multiple\">"+
			    "<input class=\"zhuihaoInput\" name=\"number\" type=\"text\" autocomplete=\"off\" pid=\"106658\" value=\"1\"> 倍"+
			  "</span>"+
			  "<span class=\"amount\"><b>¥</b><em class=\"zhuihaoyuan\">0</em>元</span>"+
			  "<span class=\"datetime\">"+this.startTime+"</span>"+
		    "</dd>";
		}else{
			html+="<dd class=\"bg_f7f7f7 active display\">"+
				"<span class=\"serialNum\">"+Number(i+2)+"</span>"+
				"<span class=\"period\">"+
				"<label>"+
				  "<input type=\"checkbox\" id=\"zhuihao\"  name=\"number\" value=\""+isSueNumber+"\" checked=\"checked\"> 第"+isSueNumber+"期"+
				"</label>"+
			    "</span>"+
			    "<span class=\"multiple\">"+
				  "<input class=\"zhuihaoInput\" name=\"number\" type=\"text\" autocomplete=\"off\" pid=\"106657\" value=\"1\"> 倍</span><span class=\"amount\"><b>¥</b><em class=\"zhuihaoyuan\">0</em>元"+
				"</span>"+
				"<span class=\"datetime\">"+this.startTime+"</span>"+
			"</dd>";
		}
	});
	return html;
}
$(function(){
	Lottery.init();
	initLotteryInfo();
	ValidateScheme.init();
	init_gonggao_li();
	init_winning_li();
	//初始化 今日开奖号码数据
	openLotteryInfoToday();
});

/**
 * 初始化开奖公告
 */
function init_gonggao_li(){
	var type=$("#tpyeId").val();
	var html="<li><span>期次</span><span>开奖号码</span</li>";
	var html2="";
	var thisNumber = "";
	$.ajax({
		type : "POST",  //提交方式
		datatype:"json",
		url : "openlotteryInfo",//路径
		data : {"type":type},//数据，这里使用的是Json格式进行传输
		success : function(result) {//返回数据根据结果进行相应的处理
			console.log(result);
			$(result).each(function(i,item){
				if(i==0){
					thisNumber=this.issueNumber;
					  var arrayNumber = this.number;
					  //组装中奖号码
					  if(arrayNumber!=null){
						  var array = arrayNumber.split(Constant.g);
						  for(var i=0;i<array.length;i++){
							  html2+="<li>"+array[i]+"</li>";
						  }
					  }
					  
				}
					html+="<li  class=\"curr\"><span>"+this.issueNumber+"</span>"+
				      "<span class=\"lde-ol-num\">";
					  var arrayNumber = this.number;
					  //组装中奖号码
					  if(arrayNumber!=null){
						  var array = arrayNumber.split(Constant.g);
						  for(var i=0;i<array.length;i++){
							  html+=" "+array[i]+" ";
						  }
					  }
					  html+="</span>"+
						"</li>";
				
				
			});
			$(".comm-lottery-01").html(html2);
			$("#openLotteryList").html(html);
			$("#thisNumber").text(thisNumber);
		}
    });
}
///**
// * 初始化最新中奖
// */
//function init_winning_li(){
//	var type=$("#tpyeId").val();
//	var html="";
//	$.ajax({
//		type : "POST",  //提交方式
//		datatype:"json",
//		url : "winningLottery",//路径
//		data : {"type":type},//数据，这里使用的是Json格式进行传输
//		success : function(result) {//返回数据根据结果进行相应的处理
//			$(result).each(function(i,item){
//				/**
//				 * <li class="fn-clear">
//								 <p class="fn-left my-table-title lde-rlabel">huanghseifhaskdfj</p>
//								 <p class="lde-rvalue fn-left">喜中<span>3000000.00</span>元</p>
//							 </li>
//				 */
//				var winningAmount = this.winningAmount;
//				if(winningAmount=="null")winningAmount="0.00";
//				html+="<li class=\"fn-clear\">"+
//				 "<p class=\"fn-left my-table-title lde-rlabel\">"+this.userName+"</p>"+
//				 "<p class=\"lde-rvalue fn-left\">喜中<span>"+winningAmount+"</span>元</p>"+
//			 "</li>";
//			});
//			$(".index-newprize").html(html);
//		}
//    });
//}
/********号码-注数 键值对********/
var GetInvestmentCount = {
    getInvestment: function (playType_id, number) { //playType_id 玩法id、number 所选的号码
        if (isNaN(number))
            number = parseInt(number, 10);
        switch (playType_id) {
            case 2815:
                switch (number) {
                    case 0: return 1;
                    case 1: return 1;
                    case 2: return 2;
                    case 3: return 3;
                    case 4: return 4;
                    case 5: return 5;
                    case 6: return 7;
                    case 7: return 8;
                    case 8: return 10;
                    case 9: return 12;
                    case 10: return 13;
                    case 11: return 14;
                    case 12: return 15;
                    case 13: return 15;
                    case 14: return 15;
                    case 15: return 15;
                    case 16: return 14;
                    case 17: return 13;
                    case 18: return 12;
                    case 19: return 10;
                    case 20: return 8;
                    case 21: return 7;
                    case 22: return 5;
                    case 23: return 4;
                    case 24: return 3;
                    case 25: return 2;
                    case 26: return 1;
                    case 27: return 1;
                    default: return 0;
                }
                break;
        }
    }
};