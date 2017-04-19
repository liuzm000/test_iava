
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
        		console.log(this.investNum);
        		if(this.investNum==0){
        			toast("请投注号码");return false;
        		}
        		//清空已选号码
        		$pailie_choose_numwrap.children("li").find(".pailie_num_bit").find(">ol li").removeClass("curr");
        		var lotteryCount=0;//总金额
        		lotteryCount=this.investNum*2;
        		var lotteryHtml  ="<li title=\""+lottery+" ["+this.investNum+"注，"+lotteryCount+"元]\">	<span>" +
        				"<a class=\"touzhu-del\" href=\"javascript:;\" id=\"lotteryInfo\" lotteryType=\""+this.typeName+"\" rel=\""+lottery+"\"  name=\""+this.investNum+"\" dir=\""+lotteryCount+"\">删除</a></span>	" +
        						"<b>"+this.typeName+"&nbsp;&nbsp;</b><i>"+lottery+"</i>&nbsp;&nbsp;["+this.investNum+"注，"+lotteryCount+"元]  </li>";
        		$(".touzhu_conlist>ul").prepend(lotteryHtml);
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
                    case 0: //三星直选
                    	investNum=1;
                    	var danxuanType=$("input[name='danxuan']:checked").val();
                    	if(danxuanType=="putong"){//三星直选--普通
                    		var $pailie_choose_numwrap = pailie_choose_numwrap.parent().parent().find(".lde-bet-div:first").find(".pailie_choose_numwrap");
                    		$pailie_choose_numwrap.children("li").find(".pailie_num_bit").each(function () {
                				var num = $(this).find("ol").find("li.curr").length;
                    					investNum *= num;
                        	});
                    	}
                    	if(danxuanType=="zuhe"){//三星直选--组合
                    		 var count = 0;
                    		 var $pailie_choose_numwrap = pailie_choose_numwrap.parent().parent().find(".lde-bet-div:last").find(".pailie_choose_numwrap");
                    		var nums = this.GetSelectedBallText($pailie_choose_numwrap.find(".pailie_num_bit"), ",").split(",");
                           console.log(nums);
                    		for (var i = 0; i < nums.length; i++) {
                                for (var j = 0; j < nums.length; j++) {
                                    for (var k = 0; k < nums.length; k++) {
                                        if (i != j && j != k && i != k) {
                                            count++;
                                        }
                                    }

                                }
                            }
                    		 investNum=count;
                    	}
                    	
                        break;
                    case 1: //三星组三
                    	var  count = pailie_choose_numwrap.children("li").find(".pailie_num_bit").find("ol").find("li.curr").length;
//                      investNum = count < 2 ? 0 : this.Combination(count, 2);
                      investNum = count < 1 ? 0 : count * (count - 1);
                        break;
                    case 2: //组三胆拖
                    	var $pailie_choose_numwrap = pailie_choose_numwrap.parent().parent().find(".lde-bet-div").find(".pailie_choose_numwrap");
                    	var dans = this.GetSelectedBallText($pailie_choose_numwrap.find("li").eq(0), ",");
                        var tuos = this.GetSelectedBallText($pailie_choose_numwrap.children("li").eq(1), ",");
                        investNum = getSXZSDTCount(dans, tuos);
                        break;
                    case 3://三星组六
                    	 var count = 1;
                         pailie_choose_numwrap.children("li").find(".pailie_num_bit").each(function () {
             				var num = $(this).find("ol").find("li.curr").length;
             				if(num!=0&&!typeof(num) !=("undefined")){
             					count *= num;
             				}
                     	});
                        investNum = count < 3 ? 0 : this.Combination(count, 3);
                        break;
                    case 4://组六胆拖
                    	var $pailie_choose_numwrap = pailie_choose_numwrap.parent().parent().find(".lde-bet-div").find(".pailie_choose_numwrap");
                    	var dans = this.GetSelectedBallText($pailie_choose_numwrap.find("li").eq(0), ",");
                        var tuos = this.GetSelectedBallText($pailie_choose_numwrap.children("li").eq(1), ",");
                        investNum = getSXZLDTCount(dans, tuos);
                        break;
                    case 5://三星包胆
                    	var zuxuanType=$("input[name='zhixuan6']:checked").attr("id");
                    	if(zuxuanType=="bet_cqshishi_61"){//包一胆
                    		var count = 1;
                    		var $pailie_choose_numwrap = pailie_choose_numwrap.parent().parent().find(".lde-bet-div:first").find(".pailie_choose_numwrap");
                    		
                    		$pailie_choose_numwrap.children("li").find(".pailie_num_bit").each(function () {
                				var num = $(this).find("ol").find("li.curr").length;
                					count *= num;
                        	});
                            investNum = count < 1 ? 0 : count * 55;
                    	}
                    	
                    	 if(zuxuanType=="bet_cqshishi_62"){// 包二胆
                    		 var count = 0;
                    		 var $pailie_choose_numwrap = pailie_choose_numwrap.parent().parent().find(".lde-bet-div:last").find(".pailie_choose_numwrap");
                    		 $pailie_choose_numwrap.children("li").each(function () {
                 				var num = $(this).find("ol").find("li.curr").length;
                 				console.log(num);
                 					count += num;
                         	});
                    		
                             investNum = count < 2 ? 0 : count * 5;
                         }
                    	 
                        break;
                    case 6://三星包点
                    	var $pailie_choose_numwrap = pailie_choose_numwrap.parent().parent().find(".lde-bet-div").find(".pailie_choose_numwrap");
                    	console.log($pailie_choose_numwrap.html()); 
                    	var count = this.GetSelectedBallCount($pailie_choose_numwrap);
                    	 console.log(count);
                         var invest_number = this.GetSelectedBallText($pailie_choose_numwrap.find("li"), ",");
                         console.log(invest_number);
                         var investStrs = invest_number.split(",");
                         for (var i = 0; i < investStrs.length; i++) {
                             investNum = investNum + (count < 1 ? 0 : GetInvestmentCount.getInvestment(2815, parseInt(investStrs[i], 10)));
                         }
                    	break;
                    case 7://二星直选
                    	var count = 1;
                    	pailie_choose_numwrap.children("li").find(".pailie_num_bit").each(function () {
            				var num = $(this).find("ol").find("li.curr").length;
            				count *= num;
                    	});
                    	investNum = count;
                    	break;
                    case 8://一星
                    	pailie_choose_numwrap.children("li").find(".pailie_num_bit").each(function () {
            				var num = $(this).find("ol").find("li.curr").length;
                					investNum += num;
                    	});
                    	break;
                    case 9://大小单双
                    	var count = 1;
                    	pailie_choose_numwrap.children("li").find(".pailie_num_bit").each(function () {
            				var num = $(this).find("ol").find("li.curr").length;
            				count *= num;
                    	});
                    	investNum = count;
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
            saveLotteryNumber:function(pailie_choose_numwrap,baiWei,shiWei,geWei){//保存选择的投注号码  用array存储
            	var  lottery="";
            	switch (this.PlayTypeID) {
                case 0: //三星直选
                	
                	var danxuanType=$("input[name='danxuan']:checked").val();
                	if(danxuanType=="putong"){//三星直选--普通
                		this.typeName="三星直选";
                		pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
        					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
        						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
        								if(i==0){//百位
        									baiWei.push($(this).text());
        								}
        								if(i==1){//十位
        									shiWei.push($(this).text());
        								}
        								if(i==2){//个位
        									geWei.push($(this).text());
        								}
        						});
        					});
                		});	
                		lottery= baiWei.join("")+Constant.g+shiWei.join("")+Constant.g+geWei.join("");//购买详细
                	}
                	if(danxuanType=="zuhe"){//三星直选--组合
                		this.typeName="三星直选组合";
                		pailie_choose_numwrap.children("li").each(function(i,item){//
        					$(this).find(".pailie_num_bit").each(function(){//
        						$(this).find("li.curr").each(function(){//
        								if(i==3){//组合
        									baiWei.push($(this).text());
        								}
        						});
        					});
                		});	
                		lottery= baiWei.join(Constant.g);//购买详细
                	}
                	
                	
                    break;
                case 1: //三星组三
                    pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    								if(i==0){//百位
    									baiWei.push($(this).text());
    								}
    						});
    					});
            		});	
                    	this.typeName="三星组三";
                    	lottery= baiWei.join(Constant.g);//购买详细
                    break;
                case 2:  //组三胆拖
                	this.typeName="组三胆拖";
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
                	if(baiWei.length==0){
                		baiWei.push("*");
                	}
                	if(shiWei.length==0){
                		shiWei.push("*");
                	}
                	lottery= baiWei.join("")+Constant.g+shiWei.join("");//购买详细
                    break;
                case 3://三星组六
                	this.typeName="三星组六";
                    pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    								if(i==0){//百位
    									baiWei.push($(this).text());
    								}
    						});
    					});
            		});	
                    	lottery= baiWei.join(Constant.g);//购买详细
                    break;
                case 4://组六胆拖
                	this.typeName="组六胆拖";
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
                	lottery= baiWei.join("")+Constant.g+shiWei.join("");//购买详细
                    break;
                case 5://三星包胆
                	
                    pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    								if(i==0){//百位
    									baiWei.push($(this).text());
    								}
    								if(i==1){//十位
    									shiWei.push($(this).text());
    								}
    								if(i==2){//个位
    									geWei.push($(this).text());
    								}
    						});
    					});
            		});	
                    var zuxuanType=$("input[name='zhixuan6']:checked").attr("id");
                	if(zuxuanType=="bet_cqshishi_61"){//包一胆
                    	lottery= baiWei.join(Constant.g);//购买详细
                	}
                	 if(zuxuanType=="bet_cqshishi_62"){// 包二胆
                     	lottery= shiWei.join("")+Constant.g+geWei.join("");//购买详细
                     }
                	 this.typeName="三星包胆";
                	break;
                case 6:///三星包点
                	this.typeName="三星包点";
                	pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    								if(i==0){//百位
    									baiWei.push($(this).text());
    								}
    								if(i==1){//百位
    									baiWei.push($(this).text());
    								}
    						});
    					});
            		});	
                	lottery= baiWei.join(Constant.g);//购买详细
                    break;
                case 7://二星直选
                	this.typeName="二星直选";
                	pailie_choose_numwrap.children("li").each(function(i,item){//
    					$(this).find(".pailie_num_bit").each(function(){//
    						$(this).find("li.curr").each(function(){//
    							if(i==0){//百位
									baiWei.push($(this).text());
								}
								if(i==1){//十位
									shiWei.push($(this).text());
								}
    						});
    					});
            		});	
                	lottery= baiWei.join("")+Constant.g+shiWei.join("");//购买详细
                    break;
                case 8://一星
                    pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
    					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
    						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
    								if(i==0){//百位
    									baiWei.push($(this).text());
    								}
    						});
    					});
            		});	
                    this.typeName="一星直选";
                    lottery= baiWei.join(Constant.g);//购买详细
                	break;
                case 9://大小单双
                	this.typeName="大小单双";
                	 pailie_choose_numwrap.children("li").each(function(i,item){//百位、十位、个位  <li>
     					$(this).find(".pailie_num_bit").each(function(){//分别迭代到百位一行  十位一行  个位一行数字
     						$(this).find("li.curr").each(function(){//分别迭代到百位一行中的十个数字  十位一行的十个数字  个位一行的十个数字
     							var vHtml=$(this).text();
     							if(vHtml.indexOf("单")!=-1){
     								baiWei.push("单");
     							}
     							if(vHtml.indexOf("大")!=-1){
     								baiWei.push("大");
     							}
     							if(vHtml.indexOf("双")!=-1){
     								baiWei.push("双");
     							}
     							if(vHtml.indexOf("小")!=-1){
     								baiWei.push("小");
     							}
     						});
     					});
             		});	
                	 lottery= baiWei.join(Constant.g);//购买详细
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
            },
        	submitLottery:function(){
        		$("#fo-shade").css('z-index',"99999");
        		$("#fo-shade").show();
        		var schemeTile = $("#schemeTile").val();//方案标题
        		var schemedescription = $("#schemedescription").val();//方案描述
        		var buyshare = $("#buyshare").val();//认购
        		var assureshare = $("#assureshare").val();//保底
        		
        		var codeList = [];// 存放投注信息
        		

        		$("a[id='lotteryInfo']").each(function() {
        			var lotteryNumber = $(this).attr("rel");// 单个投注号码
        			var investNum = $(this).attr("name");// 单个投注注数
        			var lotteryCount = $(this).attr("dir");// 单个投注金额
        			var lotteryType = $(this).attr("lotteryType");// 单个投注类型
        			var object = new Object();
        			object.lotteryNumber = lotteryNumber;
        			object.investNum = investNum;
        			object.lotteryCount = lotteryCount;
        			object.lotteryType = lotteryType;
        			codeList.push(object);
        		});
        		var operate = $('input:radio[name=operate]:checked').val();// 购买方式 1代购 2发起合买 3追号
        		var zhuiHaoList = [];// 存放追号信息
        		if(operate=="2"){//追号
        			$("input[id='zhuihao']").each(function(){
        				if($(this).is(':checked')){
        				var  beizhu = $(this).parent().parent().next().find(".zhuihaoInput").val();//追号每期的倍数
        				var object = new Object();
            			object.number = $(this).val();//追号每期的id
            			object.multipleCount = beizhu;
            			zhuiHaoList.push(object);
        				}
        			});
        			
        		}
        		var securitySetting = $('input:radio[name=securitySetting]:checked')
        				.val();// 方案保密 1不保密 2跟单可见 3保密开奖 4 永久保密
        		var isSueNumber = $("#isSueNumber").text();// 期号
        		var tpyeId = $("#tpyeId").val();// 彩票类型id
        		// 表单提交
        		var buyLotteryVo = new Object();
        		buyLotteryVo.betCount = Lottery.TotalInvestNum;// 总投注数
        		buyLotteryVo.totalAmount = Lottery.TotalMoney*Lottery.TotalMultiple;// 总金额=金额*倍数
        		buyLotteryVo.multipleCount = Lottery.TotalMultiple;// 总倍数
        		buyLotteryVo.lotteryNumber = Lottery.LotteryNumber;// 投注号码
        		buyLotteryVo.copies = Lottery.Copies;// 份数
        		buyLotteryVo.guaranteeAmount = Lottery.GuaranteeAmount;// 保底金额
        		buyLotteryVo.buyCodeVos = codeList;// 投注号码详细信息
        		buyLotteryVo.operate = operate;
        		buyLotteryVo.securitySetting = securitySetting;
        		buyLotteryVo.issueNumber = isSueNumber;// 期号
        		buyLotteryVo.tpyeId = tpyeId;// 彩票类型id
        		buyLotteryVo.schemeTile = schemeTile;// 
        		buyLotteryVo.schemedescription = schemedescription;// 
        		buyLotteryVo.buyshare = buyshare;// 
        		buyLotteryVo.assureshare = assureshare;// 
        		buyLotteryVo.zhuiHaoVos = zhuiHaoList;// 
        		buyLotteryVo.zhuiHaoTotal = Lottery.zhuiHaoTotal;// 
        		buyLotteryVo.zhuiHaoBuyType = 0;// //追号购买方式  0=个人代购，1=多人合买
        		var json = JSON.stringify(buyLotteryVo);
        		console.log(json);
        		$.ajax({
        			type : "POST", // 提交方式
        			datatype : "json",
        			contentType : "application/json",
        			url : "submit",// 路径
        			data : json,// 数据，这里使用的是Json格式进行传输
        			success : function(data) {// 返回数据根据结果进行相应的处理
        				var msg="";
        				if (data.code == "-3") {
        					msg = " 余额不足";
        				}
        				if (data.code == "-2") {
        					msg = "当前购彩时间超过 实际投注截止时间";
        				}
        				if (data.code == "-1") {
        					msg = "数据解析错误";
        				}
        				if (data.code == "1") {// 提交成功
        					window.location.href = "cqshishi";
        				}
        				if(msg!=""){
        					toast(msg);
        					$("#bet-btn-close").hide();
        					$(".bet-window").hide();
        					}
        				$(".fo-shade").hide();
        				$("#fo-shade").hide();
        			}
        		
        		});
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
//	var json={"type":type};//重庆时时彩类型
//	$.ajax({
//		type : "POST",  //提交方式
//		datatype:"json",
//		url : "initLotteryInfo",//路径
//		data :json ,//数据，这里使用的是Json格式进行传输
//		success : function(data) {//返回数据根据结果进行相应的处理
//			var currentIsSueNumber = data.isSueNumber;//期号
//			displaySubmit(data.isOpen);
//			var downTime = data.downTime;//倒计时时间  "HH:mm:ss"
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