// ==UserScript==
// @name         skinsdbExt
// @namespace   http://skinsdb.netii.net/
// @version      1.0
// @description  try to hard!
// @author       BJIAST
// @match       https://csgopolygon.com/withdraw.php
// @match       https://skinsdb.000webhostapp.com/*
// @match       https://steamcommunity.com/tradeoffer/*
// @match       https://cs.money/*
// @match       https://csgosell.com/*
// @match       http://csgotrade.me/*
// @match       http://trade-skins.com/*
// @match       http://tradeskinsfast.com/*
// @match       https://cs.money/*
// @match       https://opskins.com/*
// @match        https://steamcommunity.com/tradeoffer/*
// @match        https://steamcommunity.com/trade/*
// @match        http://skinsdbrebuild/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var scriptUrl = "http://skinsdbrebuild/";
var site = location.href;
var mark = " | skinsdbExt";

(function () {

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
    }
    if(site == "https://opskins.com/?loc=shop_browse"){
        // fullpageparse();
        mainautoparse();
    }
    if(site == "https://opskins.com/"+opslink3[1]){
        fulldatemoney();
    }
    if(site == "https://opskins.com/?loc=shop_view_item"+opslink4[1]){
        last20date();
        las20btn();
    }
    if(site == "https://opskins.com/?loc=sell"){
        last20solds();
    }

}());

function autoBuyclick(){
    $("#itemCount").after("<div class='btn btn-warning checkout-btn' id='stopAutoBuyclick' style='width:50%; margin-bottom:20px'>Стоп</div>");
    $("#itemCount").after("<div class='btn btn-danger checkout-btn' id='autoBuyclick' style='width:50%; margin-bottom:20px'>Автоклик</div>");
    var findthanks = setInterval(function () {
        if($("#ajaxLoader").html() != "undefined"){
            $("#ajaxLoader").css("margin-top","70px");
        }
        if($("#ajaxLoader").html() == "Thank You!"){
            clearInterval(findthanks);
        }
    },1000)
    $("#autoBuyclick").on("click",function(){
        var clickInterval = setInterval(function(){
            $("#site_inv_checkout").click();
        },1000);
        $("#stopAutoBuyclick").on("click",function(){
            clearInterval(clickInterval);
        });
    });
}
function fulldatemoney(){
    var myData = new FormData();
    myData.append("fulldatachanger", true);
    GM_xmlhttpRequest({
        method:"POST",
        url:scriptUrl+"scripts/opsinc.php",
        data: myData,
        onload:function(result){
            JSONdata = JSON.parse(result.responseText);

            $(".navbar-nav").after("<div class='csmupd'>Последнее обновление базы " + JSONdata['changer'] + " : " + JSONdata['upd'] + "</div>");
            $(".csmupd").css({
                "position": "absolute",
                "right": "420px",
                "top": "26px"
            })
        }
    })
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
        skinPrice = skinPrice.replace("$","");
        var myData = new FormData();
        myData.append("data", skinName);
        myData.append("price", skinPrice);
        GM_xmlhttpRequest({
            method:"POST",
            url:scriptUrl+"scripts/opsinc.php",
            data: myData,
            onload:function(result){
                var res = jQuery.parseJSON(result.responseText);
                // console.log(res);
                if(res['opsMoney']){
                    $("[data-loading='moneyOps']").html(res['moneyOps']+"%");
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
                url:scriptUrl+"scripts/opsinc.php",
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
            url:scriptUrl+"scripts/opsinc.php",
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
        url:scriptUrl+"scripts/opsinc.php",
        data: myData,
        onload:function(result){
            li.parent().parent().parent().prepend("<div class='col-md-12 text-center'>"+result.responseText+"</div>");
        }
    })
}

function mainautoparse(){
    var skinid = 0;
    var skinsarr;
    console.log("function loaded"+mark);
    $(document).ajaxComplete(function(){
        // console.log("ajax started"+mark);
        $(".featured-item.scanned").each(function(){
           var thisDiscBtn = $(this).children(".skinsdbExtDiscount").html();
            if(typeof thisDiscBtn == "undefined"){
                var skinname = $(this).children("div").children(".market-link").html().trim();
                var skincost = $(this).children("div").children(".item-add").children(".item-amount").html();
                var skinwear = $(this).children("div").children(".item-desc").children(".text-muted").html();


                if(typeof skincost == "undefined"){
                    skincost = $(this).children("div").children(".item-add-wear").children(".item-amount").html();
                }
                if(skinwear != ""){
                    skinname = skinname+" ("+skinwear+")";
                }
                $(this).prepend("<span class='skinsdbExtDiscount' data-id='"+ skinid +"' style='float:right; margin-right: 20px;'>Загрузка..</span>");
                skinid++;
                skinsarr += JSON.stringify({skinid : skinid, skinnname : skinname.replace("'",""), skincost : skincost.replace("$","")});
            }
        });
        console.log("each finished"+mark);
        var myData = new FormData();
             myData.append("autoparse", skinsarr);
        GM_xmlhttpRequest({
            method:"POST",
            url:scriptUrl+"scripts/opsinc.php",
            data: myData,
            onload:function(result){
                // JSONdata = result.responseText;
                // $(".skinsdbExtDiscount[data-id$='"+JSONdata['skinid']+"']").html(JSONdata['skinprice']);
                console.log(result.responseText);
            }
        })
    })
}