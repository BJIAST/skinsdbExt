// ==UserScript==
// @name         skinsdbExt
// @namespace   http://skinsdb.xyz/
// @version      1.156
// @description  try to hard!
// @author       BJIAST
// @match       http://skinsdb.xyz/*
// @match       https://steamcommunity.com/tradeoffer/*
// @match       https://cs.money/*
// @match       https://csgosell.com/*
// @match       http://csgotrade.me/*
// @match       http://trade-skins.com/*
// @match       http://tradeskinsfast.com/*
// @match       https://cs.money/*
// @match       https://opskins.com/*
// @match       https://steamcommunity.com/trade/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var scriptUrl = "http://skinsdb.xyz/scripts/opsinc.php";
var soundAccept = new Audio('https://raw.githubusercontent.com/BJIAST/SATC/master/sounds/done.mp3');
var soundFound = new Audio('http://skinsdb.xyz/assets/ready.mp3');
var site = location.href;
var mark = " | skinsdbExt";
var payed = false;
var skinsLoaded = [];
var opsapiLoaded = [];

include("https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js");
include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");


(function () {
    var opslink3 = site.split("https://opskins.com/");

    if(site == "https://opskins.com/"+opslink3[1]){
        var myData = new FormData();
        myData.append("checkpay", true);
        GM_xmlhttpRequest({
            method:"POST",
            url:scriptUrl,
            data: myData,
            onload:function(result){
                JSONdata = JSON.parse(result.responseText);
                if(JSONdata['error']){
                    $(".navbar-nav").after("<div class='csmupd'>" + JSONdata['error'] + "</div>");
                    $(".csmupd").css({
                        "position": "absolute",
                        "right": "420px",
                        "top": "26px"
                    })
                }
                if (JSONdata['success']){
                    opsbotload(site);
                }
            }
        })
    }
    if(site == "https://cs.money/" || site == "https://cs.money/#"){
        var myData = new FormData();
        myData.append("checkpay", true);
        GM_xmlhttpRequest({
            method:"POST",
            url:scriptUrl,
            data: myData,
            onload:function(result){
                JSONdata = JSON.parse(result.responseText);
                if(JSONdata['error']){
                    $(".navbar-brand").after("<span style='margin:24px 0 0 40px; font-size:15px; line-height: 56px; font-family: OpenSans-ExtraBold;'>"+JSONdata['error']+"</span>");
                }
                if (JSONdata['success']){
                    csmofunctions();
                }
            }
        })
    }
    if(site == "http://skinsdb.xyz/?opsSearch"){
        opsdiscforphp();
    }
    steamAccept();
}());

function opsbotload(site){
    var opslink = site.split("?loc=shop_search");
    var opslink2 = site.split("?loc=good_deals");
    var opslink3 = site.split("https://opskins.com/");
    var opslink4 = site.split("?loc=shop_view_item");


    if (site == "https://opskins.com/?loc=shop_checkout") {
        autoBuyclick();
    }
    if(site == "https://opskins.com/?loc=shop_search"+opslink[1]){
        fullpageparse();
    }
    if(site == "https://opskins.com/?loc=good_deals"+opslink2[1]){
        fullpageparse();
        loadallprices(5);
    }
    if(site == "https://opskins.com/?loc=shop_browse"){
        fullpageparse();
        loadallprices(5);
    }
    if(site == "https://opskins.com/"+opslink3[1]){
        settingsMenu();
    }
    if(site == "https://opskins.com/?loc=shop_view_item"+opslink4[1]){
        last20date();
        las20btn();
    }
    if(site == "https://opskins.com/?loc=shop_checkout"){
        fullpageparse();
        loadallprices(5);
    }
}
function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
function csmofunctions(){
    favskinsmo();
    csmomenu();
    setTimeout(function () {
        autoreloadcsm();
    },1000)
}
function favskinsmo() {
    $(".offer_container_main .col_lg_head .row").prepend("<div class='favSelectDiv form-group'><select class='form-control' name='FavSelector' id='FavSelector' style='width:92%; margin:0 auto;'></select></div>");

    var myData = new FormData();
    myData.append("favNames", true);
    GM_xmlhttpRequest({
        method:"POST",
        url:scriptUrl,
        data: myData,
        onload:function(result){
            if (result.responseText === "null"){
                $(".favSelectDiv").hide();
            }else{
                $("#FavSelector").html(result.responseText);
            }
        }
    })
    $('#FavSelector').on('change', function() {
        $("#search_right").val(this.value);
        $("#search_right").focus();
    })
}
function autoreloadcsm() {
    $("#startInt").on("click",function () {
        var startint = setInterval(function(){
            $("#refresh_bots_inventory").click();
            setTimeout(function(){
                $(".bot_sort[type_sort='lowest']").click();
            },1000)
        },10000);
        $(this).attr("disabled","disabled");
        $("#stopInt").on("click",function(){
            $("#startInt").attr("disabled", false);
            clearInterval(startint);
        })
    })
}

function autoBuyclick(){
    $("#itemCount").after("<div class='btn btn-warning checkout-btn' id='stopAutoBuyclick' style='width: 61px;position:absolute;left: -72px;top: 13px;border-radius: 3px;'>Стоп</div>");
    $("#itemCount").after("<div class='btn btn-danger checkout-btn' id='autoBuyclick' style='width: 99px;position:absolute;left: -185px;top: 13px;border-radius: 3px;'>Автоклик</div>");
    var findthanks = setInterval(function () {
        if($("#ajaxLoader").html() != "undefined" && $("#ajaxLoader").html() == "Thank You!"){
            clearInterval(findthanks);
        }
    },1000)
    $("#autoBuyclick").on("click",function(){
        var clickInterval = setInterval(function(){
            $("#site_inv_checkout").click();
        },600);
        $("#stopAutoBuyclick").on("click",function(){
            clearInterval(clickInterval);
        });
    });
}
function fullpageparse() {
    $(".label-success").each(function(){
        if($(this).attr("data-ext") != "autoparse"){
            $(this).html("Price");
            $(this).attr("data-ext","autoparse");
            parseprice($(this));
        }
    })
    $( document ).ajaxComplete(function(){
        $(".label-success").each(function(){
            if($(this).attr("data-ext") != "autoparse"){
                $(this).html("Price");
                $(this).attr("data-ext","autoparse");
                parseprice($(this));
            }
        })
    })
}
function parseprice(red_btn) {
    $(".good-deal-discount-pct").css({
        "top": "4px",
        "right":"40px"

    });
    $(".label-success").css({
        "cursor": "pointer",
        "background-color": "#d21d25",
    });
    $(red_btn).on("click", function(){
        $(this).html("Loading..");
        $(this).attr("data-loading","opsMoney");
        $(this).attr("data-ext","autoparse");
        $(this).closest(".scanned").prepend("<div class='skinDBupd' style='position: absolute;top: 21%;left: 3%; background: rgba(0, 0, 0, 0.37); padding: 3px 2px;color: #d9d9d9;' data-loading='moneyOps'></div>");
        if($(this).parent().children(".divmoneyOps")){
            $(this).parent().children(".divmoneyOps").remove();
        }
        $(this).before("<span class='label divmoneyOps'></span>");
        $(".divmoneyOps").css({
            "background-color": "#2D792D",
            "cursor" : "pointer"
        });
        $(this).parent().children(".divmoneyOps").attr("data-loading","moneyOps");
        var skinName = $(this).parent().parent().children(".market-link").html();
        var unavailable = $(this).parent().parent().children(".item-add");
        if(unavailable.html()){
            var skinPrice = unavailable.children(".item-amount").html();
        }else{
            var skinPrice = $(this).parent().parent().children(".item-add-wear").children(".item-amount").html();
        }
        if($(this).parent().parent().children(".item-desc").children(".text-muted").html() != ""){
            var exterior = "("+$(this).parent().parent().children(".item-desc").children(".text-muted").html()+")";
            skinName = skinName.trim()+" "+exterior;
        }else{
            skinName = skinName.trim();
        }
        if ($.cookie("savedDisc")){
            savedDiscount = $.cookie("savedDisc");
        }else{
            savedDiscount = 23;
        }
        skinPrice = skinPrice.replace("$","");
        skinPrice = skinPrice.replace(",","");
        var myData = new FormData();
        myData.append("data", skinName);
        myData.append("price", skinPrice);
        GM_xmlhttpRequest({
            method:"POST",
            url:scriptUrl,
            data: myData,
            onload:function(result){
                var res = jQuery.parseJSON(result.responseText);
                // console.log(res);
                if(res['opsMoney']){
                    var dif = savedDiscount - res['opsMoney'];

                    if(res['opsMoney'] > savedDiscount){
                        if(res['datestatus'] === 'fine'){
                            $(".skinDBupd[data-loading='moneyOps']").parent().css("border","10px solid green");
                        }else{
                            $(".skinDBupd[data-loading='moneyOps']").parent().css("border","10px solid orange");
                        }
                    }else{
                        if(dif > 0 && dif < 0.2){
                            if(res['datestatus'] === 'fine'){
                                setTimeout(function () {
                                    $(".skinDBupd[data-loading='moneyOps']").parent().css("border","10px solid darkblue");
                                },500)
                            }
                        }
                    }

                    $("[data-loading='moneyOps']").html(res['moneyOps']+"%");
                    $(".skinDBupd[data-loading='moneyOps']").html(res['dateupd']);
                    $("[data-loading='opsMoney']").html(res['opsMoney']+"%");
                    $("[data-loading='moneyOps']").removeAttr("data-loading");
                    $("[data-loading='opsMoney']").removeAttr("data-loading");
                }else if(res['error']){
                    $("[data-loading='opsMoney']").html("Not Found");
                    $("[data-loading='moneyOps']").removeAttr("data-loading");
                    $("[data-loading='opsMoney']").removeAttr("data-loading");
                } else{
                    $("[data-loading='opsMoney']").html("Error");
                    $("[data-loading='moneyOps']").removeAttr("data-loading");
                    $("[data-loading='opsMoney']").removeAttr("data-loading");
                }
            },
            onerror: function(res) {
                var msg = "An error occurred."
                    + "\nresponseText: " + res.responseText
                    + "\nreadyState: " + res.readyState
                    + "\nresponseHeaders: " + res.responseHeaders
                    + "\nstatus: " + res.status
                    + "\nstatusText: " + res.statusText
                    + "\nfinalUrl: " + res.finalUrl;
                alert(msg);
            }
        })
        $(".divmoneyOps").on("click", function () {
            var skinName = $(this).parent().parent().children(".market-link").html();
            if($(this).parent().parent().children(".item-desc").children(".text-muted").html() != ""){
                var exterior = "("+$(this).parent().parent().children(".item-desc").children(".text-muted").html()+")";
                skinName = skinName.trim()+" "+exterior;
            }else{
                skinName = skinName.trim();
            }
            var myData = new FormData();
            myData.append("skindate", skinName);
            console.log(skinName);
            GM_xmlhttpRequest({
                method:"POST",
                url:scriptUrl,
                data: myData,
                onload:function(result){
                    alert(result.responseText);
                }
            })
        })
    })
}
function las20btn(){

    var li = $(".last20 .list-group-item");
    var datespan = $(".last20 .list-group-item .pull-right");
    datespan.css({
        "cursor" : "pointer"
    })
    datespan.hover(function () {
        $(this).css("color","yellow");
    }, function () {
        $(this).css("color","white");
    })

    datespan.on("click",function(){
        var clickdate = $(this).html();
        var skinName = $(".market-link").html();
        var unavailable = $(".item-add");
        if($(".item-desc").children(".text-muted").html() != ""){
            var exterior = "("+$(".item-desc").children(".text-muted").html()+")";
            skinName = skinName.trim()+" "+exterior;
        }else{
            skinName = skinName.trim();
        }
        var skinPrice = $(this).parent().children(".text-left").html();
        skinPrice = skinPrice.split("<small");
        skinPrice = skinPrice[0];
        skinPrice = skinPrice.replace("$","");
        skinPrice = skinPrice.replace(",","");

        if(!$(this).parent().children(".label-success").html()){
            $(this).parent().append(

                "<span class='label label-success moneyOps' data-loading='moneyOps'>load</span>"
                + "<span class='label label-success opsMoney'style='background-color:#dc1010' data-loading='opsMoney'>ing...</span>"
            )
        }



        var myData = new FormData();
        myData.append("data", skinName);
        myData.append("price", skinPrice);
        myData.append("shop_view", true);

        GM_xmlhttpRequest({
            method:"POST",
            url:scriptUrl,
            data: myData,
            onload:function(result){

                var res = jQuery.parseJSON(result.responseText);
                console.log(result.responseText);
                if(res['opsMoney']){
                    $("[data-loading='opsMoney']").html(res['opsMoney']+"%");
                    $("[data-loading='moneyOps']").html(res['moneyOps']+"%");
                    $("[data-loading]").removeAttr("data-loading");

                }else if(res['error']){
                    $("[data-loading='opsMoney']").html("Not Found");

                } else{
                    $("[data-loading='opsMoney']").html("Error");
                }
            },
            onerror: function(res) {
                var msg = "An error occurred."
                    + "\nresponseText: " + res.responseText
                    + "\nreadyState: " + res.readyState
                    + "\nresponseHeaders: " + res.responseHeaders
                    + "\nstatus: " + res.status
                    + "\nstatusText: " + res.statusText
                    + "\nfinalUrl: " + res.finalUrl;
                alert(msg);
            }
        })
    })
}
function last20date() {
    var li = $(".last20 .list-group-item");
    var skinName = $(".market-link").html();
    var unavailable = $(".item-add");
    if($(".item-desc").children(".text-muted").html() != ""){
        var exterior = "("+$(".item-desc").children(".text-muted").html()+")";
        skinName = skinName.trim()+" "+exterior;
    }else{
        skinName = skinName.trim();
    }
    var myData = new FormData();
    myData.append("shop_view_skinname", skinName);
    GM_xmlhttpRequest({
        method:"POST",
        url:scriptUrl,
        data: myData,
        onload:function(result){
            li.parent().parent().parent().prepend("<div class='col-md-12 text-center'>"+result.responseText+"</div>");
        }
    })
}
function steamAccept() {
    var        web = location.href,
        fromWeb = document.referrer,
        steamsite = location.href.split("/receipt"),
        sendoffer = location.href.split("/new/"),
        tradeoffer = location.href.split("tradeoffer/"),
        FromCut = document.referrer.split("tradeoffer/");

    if (web == tradeoffer[0] + "tradeoffer/" + tradeoffer[1] && web != sendoffer[0] + "/new/" + sendoffer[1] && !jQuery("#your_slot_0 .slot_inner").html()){
        offerAccept();

    }else if (web == tradeoffer[0] + "tradeoffer/" + tradeoffer[1] && fromWeb == "https://opskins.com/?loc=sell" || web == tradeoffer[0] + "tradeoffer/" + tradeoffer[1] && fromWeb == "http://cs.money/"){
        if (jQuery('.error_page_content h3').html() == "О не-е-е-е-е-е-е-т!"){
            setTimeout(function(){
                window.close();
            }, 300);
            chromemes("Оффер не действителен!");
        }else if(fromWeb == "https://opskins.com/?loc=sell"){
            offerAccept();
        }
    }else if(web == steamsite[0] + "/receipt" && fromWeb == FromCut[0] + "tradeoffer/" + FromCut[1]){
        soundAccept.play();
        setTimeout(function(){
            window.close();
        }, 3000);
        chromemes("Скин забрал!");
    }
}
function offerAccept(){
    setInterval(function(){
        if (jQuery('.newmodal_content>div').html() == "Для завершения обмена подтвердите его на странице подтверждений в мобильном приложении Steam."){
            soundAccept.play();
            window.close();
        }else{
            jQuery(".newmodal").remove();
            ToggleReady(true);
            if(jQuery(".newmodal_buttons .btn_green_white_innerfade span")){
                jQuery(".newmodal_buttons .btn_green_white_innerfade span").click();
            }
            ConfirmTradeOffer();
        }
    },3000);
}
function opsdiscforphp(){
    $("#startSearch").on("click",function () {
        $(".loader").html("<img src='/design/images/ajax-loader.gif'>");
        $(this).attr("disabled","disabled");
        var skins = $(".rounded-list").children().map(function () {
            row = {};
            row['surl'] = $(this).children(".skin-info").attr("title");
            row['sname'] = $(this).children(".skin-info").html();
            row['changer_price'] = $(this).children(".changer_price").val();
            return row;
        }).get();
        var dicount = $("#discValues").val();
        for (var i = 0; i < skins.length; i++) {
            doSetTimeout(i, skins, dicount);
        }
        setTimeout(function () {
            setTimeout(function () {
                console.log("started");
                if ($(".status ul").html() == ""){
                    $("#startSearch").removeAttr("disabled");
                    $("#startSearch").click();
                    $("#comments").html("");
                }
            },5000)
        },8000+skins.length*1200)
    })
}
function doSetTimeout(i,array,dicount) {
    setTimeout(function() {
        requestforprice(array[i]['surl'], array[i]['sname'],array[i]['changer_price'],dicount,true);
    }, 3000);
}
function requestforprice(opsUrl,skinname,chprice,discount = false) {
    GM_xmlhttpRequest({
        method:"POST",
        url:opsUrl,
        onload:function(result){
            var res = $(result.responseText).find(".item-amount").html();
            if(typeof res === "undefined"){
                // window.open(opsUrl);
                if(discount !== false){
                    requestforprice(opsUrl,skinname,chprice,discount);
                }else{
                    if($(result.responseText).find(".error#message").html().trim() === "To ensure you are not a bot, please wait while we check your browser."){
                        var newWindow = window.open(opsUrl);
                        $("div[market_hash_name$='"+skinname+"']").children(".opspricelink").html("Try again");
                    }else{
                        $("div[market_hash_name$='"+skinname+"']").children(".opspricelink").html("Try again");
                    }
                }
            }else{
                res = res.replace("$","");
                res = res.replace(",","")
                if(discount !== false){
                    res = 100 - (res * 100) / (chprice * 0.97);
                    res = Math.round(res*100)/100;
                    var date = new Date();
                    var log = "<span> Лучшее предложение для <a href='"+opsUrl+"' target='_blank'>" + skinname + "</a>: " + res + "%  -  " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" +  (date.getSeconds()<10?'0':'') + date.getSeconds() + " Ищем: " + discount + "%+ </span><hr>"
                    var logs = $("#comments");
                    logs.html(logs.html() + log);
                    logs.animate({ scrollTop: $(document).height() }, "slow");
                    if (res > discount){
                        $(".status ul").append("<li data-ops='"+res+"%' data-changer='"+chprice+"'>" + skinname + "</li>");
                        soundFound.volume = 1;
                        soundFound.play();
                        chromemes("Найден скин " + skinname + " в " + res + "%");
                    }
                }else{
                    var opsmo = 100 - (res * 100) / (chprice * 0.97);
                    opsmo = Math.round(opsmo*100)/100;
                    var moops = 100 - res*95/chprice;
                    moops = Math.round(moops*100)/100;
                    if(moops > 0){
                        moops = -moops;
                    }else if(moops < 0){
                        moops = moops + moops*(-2);
                    }
                    var insideArr = [];
                    insideArr['skinname'] = skinname;
                    insideArr['opsmo'] = opsmo;
                    insideArr['moops'] = moops;
                    skinsLoaded.push(insideArr);
                    $("div[market_hash_name$='"+skinname+"']").children(".opspricelink").css("width","100%");
                    $("div[market_hash_name$='"+skinname+"']").children(".opspricelink").html("<span class='moopsValue' style='background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;'><span class='moopsval'>"+moops+"</span>%</span><span class='opsmoValue' style='background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right; margin-right: 6px;'><span class='opsmoval'>"+opsmo+"</span>%</span>");
                }
            }
        }
    })
}
function chromemes(mesbody){
    var currentPermission;
    Notification.requestPermission( function(result) { currentPermission = result } );
    mailNotification = new Notification("skinsdbExt", {
        body : mesbody,
        icon : "https://pp.vk.me/c7004/v7004148/23616/XwoiYEex0CQ.jpg"
    });
}
var getallprices = function (important){
    var  skins = $(".scanned").map(function(){
        if($(this).children("div").children(".good-deal-discount-pct").children(".label-success").html() === 'Price' && typeof $(this).children("div").children(".skinDBupd").attr("skin-id") === 'undefined') {
            var skinName = $(this).children("div").children(".market-link").html();
            var unavailable = $(this).children("div").children(".item-add");
            if(unavailable.html()){
                var skinPrice = unavailable.children(".item-amount").html();
                var skinId = unavailable.children(".item-amount").attr('onclick');
                skinId = skinId.split("showGraphFromId(");
                skinId = skinId[1];
                skinId = skinId.replace(")","");
            }else{
                var skinPrice = $(this).children("div").children(".item-add-wear").children(".item-amount").html();
                var skinId = $(this).children("div").children(".item-add-wear").children(".item-amount").attr('onclick');
                skinId = skinId.split("showGraphFromId(");
                skinId = skinId[1];
                skinId = skinId.replace(")", "");
            }
            if($(this).children("div").children(".item-desc").children(".text-muted").html() != ""){
                var exterior = "("+$(this).children("div").children(".item-desc").children(".text-muted").html()+")";
                skinName = skinName.trim()+" "+exterior;
            }else{
                skinName = skinName.trim();
            }
            skinPrice = skinPrice.replace("$","");
            skinPrice = skinPrice.replace(",","");
            row = {};
            row["skinName"] = skinName;
            row["skinPrice"] = skinPrice;
            row["skinId"] = skinId;
            return  row;
        }
    }).get();
    var jsonString = JSON.stringify(skins);
    var myData = new FormData();
    myData.append("skinarray", jsonString);
    GM_xmlhttpRequest({
        method:"POST",
        url:scriptUrl,
        data: myData,
        onload:function(result){
            var res = jQuery.parseJSON(result.responseText);
           $('.featured-item.scanned').each(function () {
               if($(this).children("div").children(".good-deal-discount-pct").children(".label-success").html() === 'Price' && typeof $(this).children("div").children(".good-skinDBupd-discount-pct").attr("skin-id") === 'undefined') {
                   var unavailable = $(this).children("div").children(".item-add");
                   if (unavailable.html()) {
                       var skinId = unavailable.children(".item-amount").attr('onclick');
                       skinId = skinId.split("showGraphFromId(");
                       skinId = skinId[1];
                       skinId = skinId.replace(")", "");
                   } else {
                       var skinId = $(this).children("div").children(".item-add-wear").children(".item-amount").attr('onclick');
                       skinId = skinId.split("showGraphFromId(");
                       skinId = skinId[1];
                       skinId = skinId.replace(")", "");
                   }
                   var loaded = $.grep(res, function (e) {
                       return e.id == skinId;
                   });
                   if (typeof loaded[0] !== 'undefined') {
                       if ($.cookie("savedDisc")){
                           savedDiscount = $.cookie("savedDisc");
                       }else{
                           savedDiscount = 23;
                       }
                       var dif = savedDiscount - loaded[0].opsmo;
                       if(loaded[0].opsmo > savedDiscount){
                           if(loaded[0].actual === 'fine'){
                               setTimeout($(this).css("border","10px solid green"),800);
                           }else if (loaded[0].actual === 'bad'){
                               setTimeout($(this).css("border","10px solid orange"),800);
                           }
                       }else{
                           if(dif > 0 && dif <= 0.2 ) {
                               if(loaded[0].actual === 'fine'){
                                   setTimeout($(this).css("border","10px solid darkblue"),800);
                               }
                           }
                       }
                       $(this).children("div").prepend("<div class='skinDBupd' style='position: absolute;top: 21%;left: 3%; background: rgba(0, 0, 0, 0.37); padding: 3px 2px;color: #d9d9d9;' skin-id='" + loaded[0].id + "'>" + loaded[0].dataupd + "</div>");
                       $(this).children("div").children(".good-deal-discount-pct").children(".label.label-success").html(loaded[0].opsmo);
                   } else {
                       $(this).children("div").children(".good-deal-discount-pct").children(".label.label-success").html("Not Found");
                   }
               }
           })
        }
    })
}
function loadallprices(ajaxSeconds) {
    if($.cookie('allprices') !== "true"){
        setTimeout(function () {
            getallprices();
        },800)
        $.cookie('allprices',true,{expires: 0.0001736111});
    }
    $(document).ajaxComplete(function () {
        ajaxDay = ajaxSeconds / 86400;
        if($.cookie('allpricesAjax') !== "true"){
        setTimeout(function () {
            getallprices();
        },600)
            $.cookie('allpricesAjax',true,{expires: ajaxDay})
        }
    });
}
function settingsMenu(){
    var btnText = "Buy this item immediately without using a shopping cart.";
    if($.cookie("buynow") === "hide") {
        $(".btn.btn-success[title='"+btnText+"']").hide();
        setTimeout(function(){
            $("#buynow").prop("checked", true);
        },600)
    }
    $(document).ajaxComplete(function () {
        if($.cookie("buynow") === "hide") {
            $(".btn.btn-success[title='" + btnText + "']").hide();
        }
    })
    $(".nav.navbar-nav").append("<li class='menu'><a href='#' class='skinsdbset' data-toggle='modal' data-target='#skinsDb'>Настройки"+mark+"</a></li>");
    $(".user-info .sub-menu").children("a[href$='/?loc=store_account#manageSales']").after("<a href='http://skinsdb.xyz/?mySales' target='_blank'>Мои продажи"+mark+"</a>");

    if ($.cookie("savedDisc")){
        savedDiscount = $.cookie("savedDisc");
    }else{
        savedDiscount = 23;
    }
    $(".nav.navbar-nav").append("<li class='menu'><a id='savDisc'>"+savedDiscount+"</a></li>");
    $("body").append('' +
        '<div id="skinsDb" class="modal fade" role="dialog">'+
        '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '<h4 class="modal-title">Настройки'+mark+'</h4>'+
        '</div>'+
        '<div class="modal-body">'+
        '<div>'+
        '<label for="discValues">Искомый процент: </label>'+
        '&nbsp;<select name="discValues" id="discValues">'+
        '<option value="20">20+</option>'+
        '<option value="21">21+</option>'+
        '<option value="22">22+</option>'+
        '<option value="23">23+</option>'+
        '<option value="24">24+</option>'+
        '<option value="25">25+</option>'+
        '<option value="26">26+</option>'+
        // '<option value="27">27+</option>'+
        // '<option value="28">28+</option>'+
        // '<option value="29">29+</option>'+
        '</select>'+
        '<input type="button" class="btn btn-primary" id="saveDisc" style="float:right; padding: 3px; height: 25px;" value="Сохранить">'+
        '</div>'+
        '<div style="float: right; font-size: 12px;">Только для селектора!</div>'+
        '<div>'+
        '<label for="buynow" style="cursor:pointer;">Скрыть Buy Now?'+
        '<input type="checkbox" id="buynow" name="buynow" style="margin-left: 15px;"></label>'+
        '</div>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>');

    $("#buynow").on("change",function(){
        if(this.checked) {
            $.cookie("buynow","hide");
            $(".btn.btn-success[title='"+btnText+"']").hide();
        }else{
            $.removeCookie("buynow");
            $(".btn.btn-success[title='"+btnText+"']").show();
        }
    })
    $("#saveDisc").on("click",function () {
        $.cookie("savedDisc",$("#discValues").val());
        $("#savDisc").html($("#discValues").val());
        $("#saveDisc").after("<span class='discAlert' style='float: right; margin:2px 6px 0 0;'>Сохранено!</span>");
        setTimeout(function () {
            $(".discAlert").remove();
        },2000)
    })
}
function csmobot() {
    csmocounters();
    $("#stopInt").after("<button id='scannerdb' class='btn btn-primary' style='float: right; margin-right: 32px;'>Сканнер "+mark+"</button></div>");
    $("#scannerdb").after("<button id='sortbyopsmo' class='btn btn-danger' style='float: right; margin-right: 32px;'>Opskins -> CS.Money</button></div>");
    $("#sortbyopsmo").after("<button id='sortbymoops' class='btn btn-success' style='float: right; margin-right: 32px;'>CS.Money -> Opskins</button></div>");
    setInterval(function () {
        csmopriceView();
    },2000)
    $("#sortbymoops").on("click",function () {
        sortUsingNestedText($('#inventory_bots'), "div", "div span.moopsValue .moopsval");
        $(".offer_container_inventory_steam").animate({
            scrollTop:0
        },'fast');
    })
    $("#sortbyopsmo").on("click",function () {
        sortUsingNestedText($('#inventory_bots'), "div", "div span.opsmoValue .opsmoval");
        $(".offer_container_inventory_steam").animate({
            scrollTop:0
        },'fast');
    })
    $("#scannerdb").on("click",function () {
        $(this).html("Загрузка...");
        GM_xmlhttpRequest({
            method:'GET',
            url:"https://api.opskins.com/IPricing/GetAllLowestListPrices/v1/?appid=730",
            onload:function(result){
                var res = jQuery.parseJSON(result.responseText);

                // var date = new Date(res['time']*1000);
                // var hours = date.getHours();
                // var minutes = "0" + date.getMinutes();
                // var seconds = "0" + date.getSeconds();
                // var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                $("#scannerdb").html("Готово"+mark);
                res = res['response'];
                _.each(res,function (item,index) {
                    var skins = [];
                    skins['skinname'] = index;
                    var price = item['price']/100;
                    skins['skincost'] = price;
                    opsapiLoaded.push(skins);
                })
                console.table(opsapiLoaded);
                $("#refresh_bots_inventory").click();
            },
            onerror: function(res) {
                var msg = "An error occurred."
                    + "\nresponseText: " + res.responseText
                    + "\nreadyState: " + res.readyState
                    + "\nresponseHeaders: " + res.responseHeaders
                    + "\nstatus: " + res.status
                    + "\nstatusText: " + res.statusText
                    + "\nfinalUrl: " + res.finalUrl;
                alert(msg);
            }
        })
    })
}
function csmopriceView() {
    var mother = $(".invertory_container");
    mother.children().each(function () {
        if(typeof $(this).children(".skindblink").html() === 'undefined'){
            var skinname = $(this).attr("market_hash_name");
            var skinprice = $(this).attr("cost");
            var opskinsUrl = "https://opskins.com/?loc=shop_search&sort=lh&app=730_2&search_item="+skinname;
            var loaded;
            $(this).prepend("<a href='"+opskinsUrl+"' target='_blank' style='background:rgba(0, 0, 0, 0.32); position:absolute;z-index: 999; right: 0; top: 22%;padding: 1px 10px; color: #fff; font-size:14px; line-height: 20px; font-family: Helvetica;' class='skindblink'>Link</a>");
            if(opsapiLoaded.length <= 0) {
                if (skinsLoaded.length > 0) {
                    loaded = _.find(skinsLoaded, function (item) {
                        return item.skinname === skinname;
                    });
                }
                if (typeof loaded !== 'undefined') {
                    $(this).attr("disc-status", 'done');
                    $(this).prepend("<div style='position:absolute;left:7%; bottom: 25%;z-index: 999;width: 100%'><span class='moopsValue' style='background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;'><span class='moopsval'>" + loaded['moops'] + "</span>%</span><span class='opsmoValue' style='background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right; margin-right: 6px;'><span class='opsmoval'>" + loaded['opsmo'] + "</span>%</span></div>");
                } else {
                    $(this).prepend("<a class='opspricelink' target='_blank' style='position:absolute;left:3%; bottom: 25%;z-index: 999;width: 22px;'><img class='opsprice' src='http://skinsdb.xyz/design/images/opskins_logo.png' alt='opsprice' style='width: 100%; height: auto;'></a>");
                }
            }else{
              loaded = _.find(opsapiLoaded,function (item) {
                    return item.skinname === skinname;
                })
                if (typeof loaded !== 'undefined') {
                    $(this).attr("disc-status", 'done');
                    var opsmo = 100 - (loaded['skincost'] * 100) / (skinprice * 0.97);
                    opsmo = Math.round(opsmo*100)/100;
                    var moops = 100 - loaded['skincost']*95/skinprice;
                    moops = Math.round(moops*100)/100;
                    if(moops > 0){
                        moops = -moops;
                    }else if(moops < 0){
                        moops = moops + moops*(-2);
                    }
                    $(this).prepend("<div style='position:absolute;left:7%; bottom: 25%;z-index: 999;width: 100%'><span class='moopsValue' style='background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;'><span class='moopsval'>" + moops + "</span>%</span><span class='opsmoValue' style='background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right; margin-right: 6px;'><span class='opsmoval'>" + opsmo + "</span>%</span></div>");
                    $(this).prepend("<span style='position: absolute;top: 33%;left: 0;color: #ff8a37; font-size: 13px;z-index: 999; font-weight: bold;'>"+loaded['skincost']+"$</span>");
                } else {
                    $(this).prepend("<a class='opspricelink' style='position:absolute;left:3%; bottom: 25%;z-index: 999;width: 22px;'><img class='opsprice' src='http://skinsdb.xyz/design/images/opskins_logo.png' alt='opsprice' style='width: 100%; height: auto;'></a>");
                }
            }
        }
    })
    $(".skindblink").on("click",function () {
        var skinname = $(this).parent().attr("market_hash_name");
        var opskinsUrl = "https://opskins.com/?loc=shop_search&sort=lh&app=730_2&search_item="+skinname;
        var newWindow = window.open(opskinsUrl);
        return false;

    })
    $(".skindblink").hover(function () {
        $(this).css("background","rgba(0, 0, 0, 0.52)");
    },function () {
        $(this).css("background","rgba(0, 0, 0, 0.32)");
    })
    $(".opspricelink").on("click",function () {
        var skinname = $(this).parent().attr("market_hash_name");
        var skinprice = $(this).parent().attr("cost");
        var opskinsUrl = "https://opskins.com/?loc=shop_search&sort=lh&app=730_2&search_item="+skinname;
        $("div[market_hash_name$='"+skinname+"']").attr("disc-status",'done');
        $("div[market_hash_name$='"+skinname+"']").children(".opspricelink").html("<span style='font-size:14px; line-height: 20px; font-family: Helvetica;'>Загрузка..</span>");
        requestforprice(opskinsUrl,skinname,skinprice);
        return false;
    })
}
function csmomenu() {
    $(".favSelectDiv").after("<div style='margin-bottom: 12px;'><button id='startInt' class='btn btn-primary' style='margin-left: 34px;'>Старт</button>");
    $("#startInt").after("<button id='stopInt' class='btn btn-warning' style='margin-left: 2px;'>Стоп</button>");
    if($.cookie("opsbot") === 'on'){
        csmobot();
        setTimeout(function(){
            $("#opsbot").prop("checked", true);
        },600)
    }
    $(".steam_order_spoiler").prepend("<a href='#' class='skinsdbset steam_spoiler_link' data-toggle='modal' data-target='#skinsDb'>НАСТРОЙКИ | SKINSDB</a>");
    $("body").append('' +
        '<div id="skinsDb" class="modal fade" role="dialog">'+
        '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '<h4 class="modal-title">Настройки'+mark+'</h4>'+
        '</div>'+
        '<div class="modal-body">'+
        '<label for="opsbot" style="cursor:pointer; width: 33%;">Отобразить кнопки Opskins?</label>'+
        '<input type="checkbox" id="opsbot" name="opsbot" style="display: inline-block;">'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>');

    $("#opsbot").on("change",function(){
        if(this.checked) {
            $.cookie("opsbot","on");
            csmobot();
        }else{
            $.removeCookie("opsbot");
            setTimeout(function () {
                location.reload();
            },2000)
        }
    })
}
function csmocounters(){
    $(".user_col_lg_head .row").append('<div class="offer_header" style="width: 100%; float: left; margin-left: 20px; font-size: 18px; padding: 0;"><span id="userinv">0.00</span>$</div>');
   $(".make_trade_button").before('<div class="market_text_head" style="margin-top: 0; margin-bottom: 20px"><span id="sum_dif">0.00</span>$</div>');
    var user_offer = $("#user_offer_sum").text().replace("$","").trim();
    var bot_offer = $("#bots_offer_sum").text().replace("$","").trim();
    setInterval(function () {
        var counts = 0;
        $("#inventory_user").children().each(function () {
            counts += Number($(this).attr("cost")*$(this).children(".invertory_title_container").children(".invertory_title_text_quantity").children(".count_in_stack").text());
            if(counts === 0){
               $("#userinv").html("0.00");
           }else{
               $("#userinv").html(Math.round(counts*100)/100);
           }
       })
    },1600)
    setInterval(function () {
        if(user_offer !== $("#user_offer_sum").text().replace("$","").trim() || bot_offer !== $("#bots_offer_sum").text().replace("$","").trim()){
            var sum_dif = Number($("#user_offer_sum").text().replace("$","").trim() - $("#bots_offer_sum").text().replace("$","").trim());
            $("#sum_dif").html(Math.round(sum_dif*100)/100);
            user_offer = $("#user_offer_sum").text().replace("$","").trim();
            bot_offer = $("#bots_offer_sum").text().replace("$","").trim();
        }
    },300)
}

function sortUsingNestedText(parent, childSelector, keySelector) {
    var items = parent.children(childSelector).sort(function(a, b) {
        var vA = $(keySelector, a).text();
        var vB = $(keySelector, b).text();
        return ((+vA) > (+vB)) ? -1 : ((+vA) < (+vB)) ? 1 : 0;
    });
    parent.append(items);
}
