// ==UserScript==
// @name         skinsdbExt
// @namespace   http://skinsdb.xyz/
// @version      1.238
// @description  try to hard!
// @author       BJIAST
// @match       http://skinsdb.xyz/*
// @match       https://steamcommunity.com/tradeoffer/*
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
var skinsdbprices = [];
var buyCounter = 0;

include("https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js");

(function () {
    var opslink3 = site.split("https://opskins.com/");

    if (site == "https://opskins.com/" + opslink3[1]) {
        var myData = new FormData();
        myData.append("checkpay", true);
        GM_xmlhttpRequest({
            method: "POST",
            url: scriptUrl,
            data: myData,
            onload: function (result) {
                JSONdata = JSON.parse(result.responseText);
                if (JSONdata['error']) {
                    $(".navbar-nav").append("<li class='menu csmupd'>" + JSONdata['error'] + "</li>");
                }
                if (JSONdata['success']) {
                    opsbotload(site);
                    $.cookie("role", JSONdata['role']);
                }
            }
        })
    }
    if (site == "https://cs.money/" || site == "https://cs.money/#") {
        var myData = new FormData();
        myData.append("checkpay", true);
        GM_xmlhttpRequest({
            method: "POST",
            url: scriptUrl,
            data: myData,
            onload: function (result) {
                JSONdata = JSON.parse(result.responseText);
                if (JSONdata['error']) {
                    $(".navbar-brand").after("<span style='margin:24px 0 0 40px; font-size:15px; line-height: 56px; font-family: OpenSans-ExtraBold;'>" + JSONdata['error'] + "</span>");
                }
                if (JSONdata['success']) {
                    include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");
                    csmofunctions();
                    // csmoparser();
                }
            }
        })
    }
    if (site == "http://skinsdb.xyz/?opsSearch") {
        opsdiscforphp();
    }
    steamAccept();
}());

function opsbotload(site) {
    var opslink = site.split("?loc=shop_search");
    var opslink2 = site.split("?loc=good_deals");
    var opslink3 = site.split("https://opskins.com/");
    var opslink4 = site.split("?loc=shop_view_item");
    // var opslink5 = site.split("?loc=shop_browse");

    if (site == "https://opskins.com/" + opslink3[1]) {
        settingsMenu();
    }
    if (site == "https://opskins.com/?loc=shop_checkout") {
        autoBuyclick();
    }
    if (site == "https://opskins.com/?loc=shop_search" + opslink[1]) {
        fullpageparse();
    }
    if (site == "https://opskins.com/?loc=good_deals" + opslink2[1]) {
        fullpageparse();
        loadallprices(true);
    }
    if (site == "https://opskins.com/?loc=shop_browse") {
        fullpageparse();
        loadallprices();
        // csmoparser();
        mysteryInner();
    }
    if (site == "https://opskins.com/?loc=shop_browse&sort=n") {
        var getAutoInt;
        getautobuy();
        // csmoparser();
    }
    if (site == "https://opskins.com/?loc=shop_view_item" + opslink4[1]) {
        last20date();
        las20btn();
    }
    if (site == "https://opskins.com/?loc=shop_checkout") {
        fullpageparse();
        loadallprices(true);
    }
    if (site == "https://opskins.com/?loc=sell") {
        sellsinvChecker();
    }
    if (site == "https://opskins.com/?loc=store_account#manageSales") {
        realEarning();
    }
}
function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

// function csmoparser() {
//     getQuery();
//     setInterval(function(){
//         getQuery();
//     }, 120000);
//     function getQuery() {
//         var hash = Date.parse(new Date());
//         var url = "https://cs.money/load_all_bots_inventory?hash=" + hash;
//             GM_xmlhttpRequest({
//             method: "GET",
//             url: url,
//             onload: function (res) {
//                 var skins = JSON.stringify(res.responseText);
//                 if(skins.length < 500000){
//                     window.open("https://cs.money/");
//                 }
//                 var myData = new FormData();
//                 myData.append("csmoprices", skins);
//                 GM_xmlhttpRequest({
//                     method: "POST",
//                     url: "http://skinsdb.xyz/parsers/money.php",
//                     data: myData,
//                     onload: function (result) {
//                         console.log(result.responseText);
//                     }
//                 })
//             }
//         })
//         $.get(url).done(function (res) {
//
//
//         })
//     }
// }

function csmofunctions() {
    favskinsmo();
    csmomenu();
    setTimeout(function () {
        autoreloadcsm();
    }, 1000)
}
function favskinsmo() {
    $(".offer_container_main .col_lg_head .row").prepend("<div class='favSelectDiv form-group'><select class='form-control' name='FavSelector' id='FavSelector' style='width:92%; margin:0 auto;'></select></div>");

    var myData = new FormData();
    myData.append("favNames", true);
    GM_xmlhttpRequest({
        method: "POST",
        url: scriptUrl,
        data: myData,
        onload: function (result) {
            if (result.responseText === "null") {
                $(".favSelectDiv").hide();
            } else {
                $("#FavSelector").html(result.responseText);
            }
        }
    })
    $('#FavSelector').on('change', function () {
        $("#search_right").val(this.value);
        $("#search_right").focus();
    })
}
function autoreloadcsm() {
    $("#startInt").on("click", function () {
        var startint = setInterval(function () {
            $("#refresh_bots_inventory").click();
            setTimeout(function () {
                $(".bot_sort[type_sort='lowest']").click();
            }, 1000)
        }, 10000);
        $(this).attr("disabled", "disabled");
        $("#stopInt").on("click", function () {
            $("#startInt").attr("disabled", false);
            clearInterval(startint);
        })
    })
}

function autoBuyclick() {
    $("#itemCount").after("<div class='btn btn-warning checkout-btn' id='stopAutoBuyclick' style='width: 61px;position:absolute;left: -72px;top: 13px;border-radius: 3px;'>Стоп</div>");
    $("#itemCount").after("<div class='btn btn-danger checkout-btn' id='autoBuyclick' style='width: 99px;position:absolute;left: -185px;top: 13px;border-radius: 3px;'>Автоклик</div>");
    var findthanks = setInterval(function () {
        if ($("#ajaxLoader").html() != "undefined" && $("#ajaxLoader").html() == "Thank You!") {
            clearInterval(findthanks);
        }
    }, 1000)
    $("#autoBuyclick").on("click", function () {
        var faild = "Your cart is empty. Someone may have purchased these items before you.";
        var clickInterval = setInterval(function () {
            if ($(".alert.alert-warning").text() === faild) {
                chromemes("Скинов больше нет!");
                clearInterval(clickInterval);
            }
            $("#site_inv_checkout").click();
        }, 600);
        $("#stopAutoBuyclick").on("click", function () {
            clearInterval(clickInterval);
        });
    });
}
function fullpageparse(opd = "not") {
    $(".label-success").each(function () {
        if ($(this).attr("data-ext") != "autoparse") {
            $(this).html("Price");
            $(this).attr("data-ext", "autoparse");
            parseprice($(this), opd);
        }
    })
    $(document).ajaxComplete(function () {
        $(".label-success").each(function () {
            if ($(this).attr("data-ext") != "autoparse") {
                $(this).html("Price");
                $(this).attr("data-ext", "autoparse");
                parseprice($(this), opd);
            }
        })
    })
}
function parseprice(red_btn, opd) {
    $(".good-deal-discount-pct").css({
        "top": "4px",
        "right": "40px"

    });
    $(".label-success").css({
        "cursor": "pointer",
        "background-color": "#d21d25",
    });
    $(red_btn).on("click", function () {
        $(this).html("Loading..");
        $(this).attr("data-loading", "opsMoney");
        $(this).attr("data-ext", "autoparse");
        $(this).closest(".scanned").prepend("<div class='skinDBupd' style='position: absolute;top: 21%;left: 3%; background: rgba(0, 0, 0, 0.37); padding: 3px 2px;color: #d9d9d9;' data-loading='moneyOps'></div>");
        if ($(this).parent().children(".divmoneyOps")) {
            $(this).parent().children(".divmoneyOps").remove();
        }
        $(this).before("<span class='label divmoneyOps'></span>");
        $(".divmoneyOps").css({
            "background-color": "#2D792D",
            "cursor": "pointer"
        });
        $(this).parent().children(".divmoneyOps").attr("data-loading", "moneyOps");
        var skinName = $(this).parent().parent().children(".market-link").html();
        var unavailable = $(this).parent().parent().children(".item-add");
        var skinPrice = $(this).parent().parent().find(".item-amount").text();
        // if (unavailable.html()) {
        //     if (opd === "not") {
        //         var skinPrice = unavailable.children(".item-amount").html();
        //     } else {
        //         var skinPrice = unavailable.children("div").children(".item-amount").html();
        //     }
        // } else {
        //     if (opd === "not") {
        //         var skinPrice = $(this).parent().parent().children(".item-add-wear").children(".item-amount").html();
        //     } else {
        //         var skinPrice = $(this).parent().parent().children(".item-add-wear").children("div").children(".item-amount").html();
        //     }
        // }
        if ($(this).parent().parent().children(".item-desc").children(".text-muted").html() != "") {
            var exterior = "(" + $(this).parent().parent().children(".item-desc").children(".text-muted").html() + ")";
            var phase = $(this).parent().parent().children(".item-desc").children(".text-muted").next().html().replace(/[/^\D+/()]/g, '');
            if (phase !== "") {
                skinName = skinName.trim() + " Phase " + phase + " " + exterior;
            } else {
                skinName = skinName.trim() + " " + exterior;
            }
        } else {
            skinName = skinName.trim();
        }
        if ($.cookie("savedDisc")) {
            savedDiscount = $.cookie("savedDisc");
        } else {
            savedDiscount = 25;
        }
        skinPrice = skinPrice.replace("$", "");
        skinPrice = skinPrice.replace(",", "");
        var myData = new FormData();
        myData.append("data", skinName);
        myData.append("price", skinPrice);
        GM_xmlhttpRequest({
            method: "POST",
            url: scriptUrl,
            data: myData,
            onload: function (result) {
                var res = jQuery.parseJSON(result.responseText);
                // console.log(res);
                if (res['opsMoney']) {
                    var dif = savedDiscount - res['opsMoney'];

                    if (res['opsMoney'] > savedDiscount) {
                        if (res['datestatus'] === 'fine') {
                            $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid green");
                        } else {
                            $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid orange");
                        }
                    } else {
                        if (dif > 0 && dif < 0.2) {
                            if (res['datestatus'] === 'fine') {
                                setTimeout(function () {
                                    $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid darkblue");
                                }, 500)
                            }
                        }
                    }

                    $("[data-loading='moneyOps']").html("<span class='realMoops'>" + res['moneyOps'] + "</span>" + "%");
                    $(".skinDBupd[data-loading='moneyOps']").html(res['dateupd']);
                    $("[data-loading='opsMoney']").html("<span class='realOpsmo'>" + res['opsMoney'] + "</span>" + "%");
                    $("[data-loading='moneyOps']").removeAttr("data-loading");
                    $("[data-loading='opsMoney']").removeAttr("data-loading");
                } else if (res['error']) {
                    $("[data-loading='opsMoney']").html("Not Found");
                    $("[data-loading='moneyOps']").removeAttr("data-loading");
                    $("[data-loading='opsMoney']").removeAttr("data-loading");
                } else {
                    $("[data-loading='opsMoney']").html("Error");
                    $("[data-loading='moneyOps']").removeAttr("data-loading");
                    $("[data-loading='opsMoney']").removeAttr("data-loading");
                }
                $(".divmoneyOps").on("click", function () {
                    var skinName = $(this).parent().parent().children(".market-link").html();
                    if ($(this).parent().parent().children(".item-desc").children(".text-muted").html() != "") {
                        var exterior = "(" + $(this).parent().parent().children(".item-desc").children(".text-muted").html() + ")";
                        var phase = $(this).parent().parent().children(".item-desc").children(".text-muted").next().html().replace(/[/^\D+/()]/g, '');
                        if (phase !== "") {
                            skinName = skinName.trim() + " Phase " + phase + " " + exterior;
                        } else {
                            skinName = skinName.trim() + " " + exterior;
                        }
                    } else {
                        skinName = skinName.trim();
                    }
                    var myData = new FormData();
                    myData.append("skindate", skinName);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: scriptUrl,
                        data: myData,
                        onload: function (result) {
                            alert(result.responseText);
                        }
                    })
                })
            },
            onerror: function (res) {
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
function las20btn(page = "item") {
    if (page !== "item") {
        var li = $("#skinsDbSales .modal-body .last20 .list-group-item");
        var datespan = $("#skinsDbSales .modal-body .last20 .list-group-item .pull-right");
    } else {
        var li = $(".last20 .list-group-item");
        var datespan = $(".last20 .list-group-item .pull-right");
    }
    datespan.css({
        "cursor": "pointer"
    })
    if (page === "item") {
        datespan.hover(function () {
            $(this).css("color", "yellow");
        }, function () {
            $(this).css("color", "white");
        })
    } else {
        datespan.hover(function () {
            $(this).css("color", "green");
        }, function () {
            $(this).css("color", "black");
        })
    }

    datespan.on("click", function () {
        var clickdate = $(this).html();
        if (page === "item") {
            var skinName = $(".market-link").html();
            var unavailable = $(".item-add");
            if ($(".item-desc").children(".text-muted").html() != "") {
                var exterior = "(" + $(".item-desc").children(".text-muted").html() + ")";
                var phase = $(".text-muted").next().html().replace(/[/^\D+/()]/g, '');
                if (phase !== "") {
                    skinName = skinName.trim() + " Phase " + phase + " " + exterior;
                } else {
                    skinName = skinName.trim() + " " + exterior;
                }
            } else {
                skinName = skinName.trim();
            }
        } else {
            var skinName = $("#modalSkinName").text();
        }
        var skinPrice = $(this).parent().children(".text-left").html();
        skinPrice = skinPrice.split("<small");
        skinPrice = skinPrice[0];
        skinPrice = skinPrice.replace("$", "");
        skinPrice = skinPrice.replace(",", "");
        console.log(skinName + " => " + skinPrice);
        if (!$(this).parent().children(".label-success").html()) {
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
            method: "POST",
            url: scriptUrl,
            data: myData,
            onload: function (result) {

                var res = jQuery.parseJSON(result.responseText);
                console.log(result.responseText);
                if (res['opsMoney']) {
                    $("[data-loading='opsMoney']").html(res['opsMoney'] + "%");
                    $("[data-loading='moneyOps']").html(res['moneyOps'] + "%");
                    $("[data-loading]").removeAttr("data-loading");

                } else if (res['error']) {
                    $("[data-loading='opsMoney']").html("Not Found");

                } else {
                    $("[data-loading='opsMoney']").html("Error");
                }
            },
            onerror: function (res) {
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
function last20date(page = 'item') {
    if (page === 'item') {
        var li = $(".last20 .list-group-item");
        var skinName = $(".market-link").html();
        var unavailable = $(".item-add");
        if ($(".item-desc").children(".text-muted").html() != "") {
            var exterior = "(" + $(".item-desc").children(".text-muted").html() + ")";
            skinName = skinName.trim() + " " + exterior;
        } else {
            skinName = skinName.trim();
        }
    } else {
        var li = $("#skinsDbSales .modal-body .last20 .list-group-item");
        var skinName = $("#modalSkinName").text();
    }
    var myData = new FormData();
    myData.append("shop_view_skinname", skinName);
    GM_xmlhttpRequest({
        method: "POST",
        url: scriptUrl,
        data: myData,
        onload: function (result) {
            li.parent().parent().parent().prepend("<div class='col-md-12 text-center'>" + result.responseText + "</div>");
        }
    })
}
function steamAccept() {
    var web = location.href,
        fromWeb = document.referrer,
        steamsite = location.href.split("/receipt"),
        sendoffer = location.href.split("/new/"),
        tradeoffer = location.href.split("tradeoffer/"),
        FromCut = document.referrer.split("tradeoffer/");

    if (web == tradeoffer[0] + "tradeoffer/" + tradeoffer[1] && web != sendoffer[0] + "/new/" + sendoffer[1] && !jQuery("#your_slot_0 .slot_inner").html()) {
        offerAccept();

    } else if (web == tradeoffer[0] + "tradeoffer/" + tradeoffer[1] && fromWeb == "https://opskins.com/?loc=sell" || web == tradeoffer[0] + "tradeoffer/" + tradeoffer[1] && fromWeb == "http://cs.money/") {
        if (jQuery('.error_page_content h3').html() == "О не-е-е-е-е-е-е-т!") {
            setTimeout(function () {
                window.close();
            }, 300);
            chromemes("Оффер не действителен!");
        } else if (fromWeb == "https://opskins.com/?loc=sell") {
            offerAccept();
        }
    } else if (web == steamsite[0] + "/receipt" && fromWeb == FromCut[0] + "tradeoffer/" + FromCut[1]) {
        soundAccept.play();
        setTimeout(function () {
            window.close();
        }, 3000);
        chromemes("Скин забрал!");
    }
}
function offerAccept() {
    setInterval(function () {
        if (jQuery('.newmodal_content>div').html() == "Для завершения обмена подтвердите его на странице подтверждений в мобильном приложении Steam.") {
            soundAccept.play();
            window.close();
        } else {
            jQuery(".newmodal").remove();
            ToggleReady(true);
            if (jQuery(".newmodal_buttons .btn_green_white_innerfade span")) {
                jQuery(".newmodal_buttons .btn_green_white_innerfade span").click();
            }
            ConfirmTradeOffer();
        }
    }, 3000);
}
function opsdiscforphp() {
    $("#startSearch").on("click", function () {
        $(".loader").html("<img src='/design/images/ajax-loader.gif'>");
        $(this).attr("disabled", "disabled");
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
                if ($(".status ul").html() == "") {
                    $("#startSearch").removeAttr("disabled");
                    $("#startSearch").click();
                    $("#comments").html("");
                }
            }, 5000)
        }, 8000 + skins.length * 1200)
    })
}
function doSetTimeout(i, array, dicount) {
    setTimeout(function () {
        requestforprice(array[i]['surl'], array[i]['sname'], array[i]['changer_price'], dicount, true);
    }, 3000);
}
function requestforprice(opsUrl, skinname, chprice, discount = false) {
    GM_xmlhttpRequest({
        method: "POST",
        url: opsUrl,
        onload: function (result) {
            var res = $(result.responseText).find(".item-amount").html();
            if (typeof res === "undefined") {
                // window.open(opsUrl);
                if (discount !== false) {
                    requestforprice(opsUrl, skinname, chprice, discount);
                } else {
                    if ($(result.responseText).find(".error#message").html().trim() === "To ensure you are not a bot, please wait while we check your browser.") {
                        var newWindow = window.open(opsUrl);
                        $("div[market_hash_name='" + skinname + "']").children(".opspricelink").html("Try again");
                    } else {
                        $("div[market_hash_name='" + skinname + "']").children(".opspricelink").html("Try again");
                    }
                }
            } else {
                res = res.replace("$", "");
                res = res.replace(",", "")
                if (discount !== false) {
                    res = 100 - (res * 100) / (chprice * 0.97);
                    res = Math.round(res * 100) / 100;
                    var date = new Date();
                    var log = "<span> Лучшее предложение для <a href='" + opsUrl + "' target='_blank'>" + skinname + "</a>: " + res + "%  -  " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds() + " Ищем: " + discount + "%+ </span><hr>"
                    var logs = $("#comments");
                    logs.html(logs.html() + log);
                    logs.animate({scrollTop: $(document).height()}, "slow");
                    if (res > discount) {
                        $(".status ul").append("<li data-ops='" + res + "%' data-changer='" + chprice + "'>" + skinname + "</li>");
                        soundFound.volume = 1;
                        soundFound.play();
                        chromemes("Найден скин " + skinname + " в " + res + "%");
                    }
                } else {
                    var opsmo = 100 - (res * 100) / (chprice * 0.97);
                    opsmo = Math.round(opsmo * 100) / 100;
                    var moops = 100 - res * 95 / chprice;
                    moops = Math.round(moops * 100) / 100;
                    if (moops > 0) {
                        moops = -moops;
                    } else if (moops < 0) {
                        moops = moops + moops * (-2);
                    }
                    var insideArr = [];
                    insideArr['skinname'] = skinname;
                    insideArr['opsmo'] = opsmo;
                    insideArr['moops'] = moops;
                    skinsLoaded.push(insideArr);
                    $("div[market_hash_name='" + skinname + "']").children(".opspricelink").css("width", "100%");
                    $("div[market_hash_name='" + skinname + "']").children(".opspricelink").html("<span class='moopsValue' style='background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;'><span class='moopsval'>" + moops + "</span>%</span><span class='opsmoValue' style='background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right; margin-right: 6px;'><span class='opsmoval'>" + opsmo + "</span>%</span>");
                }
            }
        }
    })
}

var getallprices = function (opd) {
    var skins = $(".scanned").map(function () {
        var route;
        if (opd === "opd") {
            route = $(this);
        } else {
            route = $(this).children("div");
        }
        if (route.children(".good-deal-discount-pct").children(".label-success").html() === 'Price' && typeof route.children(".skinDBupd").attr("skin-id") === 'undefined') {
            var skinName = route.children(".market-link").html();
            var unavailable = route.children(".item-add");
            if (unavailable.html()) {
                if (opd === "opd") {
                    var skinPrice = unavailable.children("div").children(".item-amount").html();
                    var skinId = route.children(".market-link").attr("href");
                    skinId = skinId.split("&item=");
                    skinId = skinId[1];
                } else {
                    var skinPrice = unavailable.children(".item-amount").html();
                    var skinId = unavailable.children(".item-amount").attr('onclick');
                    skinId = skinId.split("showGraphFromId(");
                    skinId = skinId[1];
                    skinId = skinId.replace(")", "");
                }
            } else {
                if (opd === "opd") {
                    var skinPrice = route.children(".item-add-wear").children("div").children(".item-amount").html();
                    var skinId = route.children(".market-link").attr("href");
                    skinId = skinId.split("&item=");
                    skinId = skinId[1];
                } else {
                    var skinPrice = route.children(".item-add-wear").children(".item-amount").html();
                    var skinId = route.children(".item-add-wear").children(".item-amount").attr('onclick');
                    skinId = skinId.split("showGraphFromId(");
                    skinId = skinId[1];
                    skinId = skinId.replace(")", "");
                }
            }
            if (route.children(".item-desc").children(".text-muted").html() != "") {
                var exterior = "(" + route.children(".item-desc").children(".text-muted").html() + ")";
                var phase = route.children(".item-desc").children(".text-muted").next().html().replace(/[/^\D+/()]/g, '');
                if (phase !== "") {
                    skinName = skinName.trim() + " Phase " + phase + " " + exterior;
                } else {
                    skinName = skinName.trim() + " " + exterior;
                }
            } else {
                skinName = skinName.trim();
            }
            skinPrice = skinPrice.replace("$", "");
            skinPrice = skinPrice.replace(",", "");
            row = {};
            row["skinName"] = skinName;
            row["skinPrice"] = skinPrice;
            row["skinId"] = skinId;
            return row;
        }
    }).get();
    if (skins.length > 0) {
        var jsonString = JSON.stringify(skins);
        var myData = new FormData();
        myData.append("skinarray", jsonString);
        GM_xmlhttpRequest({
            method: "POST",
            url: scriptUrl,
            data: myData,
            onload: function (result) {
                var res = jQuery.parseJSON(result.responseText);
                $('.featured-item.scanned').each(function () {
                    var route;
                    if (opd === "opd") {
                        route = $(this);
                    } else {
                        route = $(this).children("div");
                    }
                    if (route.children(".good-deal-discount-pct").children(".label-success").html() === 'Price' && typeof route.children(".good-skinDBupd-discount-pct").attr("skin-id") === 'undefined') {
                        var unavailable = route.children(".item-add");
                        if (unavailable.html()) {
                            if (opd === "opd") {
                                var skinId = route.children(".market-link").attr("href");
                                skinId = skinId.split("&item=");
                                skinId = skinId[1];
                            } else {
                                var skinId = unavailable.children(".item-amount").attr('onclick');
                                skinId = skinId.split("showGraphFromId(");
                                skinId = skinId[1];
                                skinId = skinId.replace(")", "");
                            }
                        } else {
                            if (opd === "opd") {
                                var skinId = route.children(".market-link").attr("href");
                                skinId = skinId.split("&item=");
                                skinId = skinId[1];
                            } else {
                                var skinId = route.children(".item-add-wear").children(".item-amount").attr('onclick');
                                skinId = skinId.split("showGraphFromId(");
                                skinId = skinId[1];
                                skinId = skinId.replace(")", "");
                            }
                        }
                        var loaded = $.grep(res, function (e) {
                            return e.id == skinId;
                        });
                        if (typeof loaded[0] !== 'undefined') {
                            if ($.cookie("savedDisc")) {
                                savedDiscount = $.cookie("savedDisc");
                            } else {
                                savedDiscount = 25;
                            }
                            var dif = savedDiscount - loaded[0].opsmo;
                            if (loaded[0].opsmo > savedDiscount) {
                                if (loaded[0].actual === 'fine') {
                                    var type = $(this).find(".text-muted").next().text();
                                    if (opd === "opd") {
                                        if (typeof $(this).find(".buyers-club-icon").html() === "undefined" && type !== "Base Grade Key") {
                                            $(this).attr("style", "border:10px solid green;");
                                            skin = [];
                                            skin['skinid'] = skinId;
                                            skin['skindisc'] = loaded[0].opsmo;
                                            skin['skinname'] = $(this).find(".market-link").text() + " (" + $(this).children(".item-desc").find(".text-muted").text() + ")";
                                            skin['skinprice'] = parseInt(parseFloat($(this).find(".item-amount").text().replace("$", "")) * 100);
                                            skinsLoaded.push(skin);
                                        }
                                    } else {
                                        if (type !== "Base Grade Key") {
                                            $(this).attr("style", "border:10px solid green;");
                                            $(this).attr('id', skinId);
                                            skin = [];
                                            skin['skinid'] = skinId;
                                            skin['skinlink'] = "#" + skinId;
                                            skin['skindisc'] = loaded[0].opsmo;
                                            skin['skinname'] = $(this).find(".market-link").text()
                                            skin['skinprice'] = parseInt(parseFloat($(this).find(".item-amount").text().replace("$", "")) * 100);
                                            skinsLoaded.push(skin);
                                            $("#ThatisDisc").show();
                                            $("#ThatisDisc").html(skinsLoaded.length);
                                            $("#ThatisDisc").attr("href", skinsLoaded[0]['skinlink']);
                                        }
                                    }
                                } else if (loaded[0].actual === 'bad') {
                                    $(this).attr("style", "border:10px solid orange;");
                                }
                            } else {
                                if (dif > 0 && dif <= 1.2) {
                                    if (loaded[0].actual === 'fine') {
                                        $(this).attr("style", "border:10px solid darkblue;");
                                    } else if (loaded[0].actual === 'bad') {
                                        $(this).attr("style", "border:10px solid red;");
                                    }
                                }
                            }
                            route.prepend("<div class='skinDBupd' style='position: absolute;top: 21%;left: 3%; background: rgba(0, 0, 0, 0.37); padding: 3px 2px;color: #d9d9d9;' skin-id='" + loaded[0].id + "'>" + loaded[0].dataupd + "</div>");
                            if (loaded[0].opsmo !== "Not Found") {
                                route.children(".good-deal-discount-pct").children(".label.label-success").html("<span class='realOpsmo'>" + loaded[0].opsmo + "</span>%");
                            } else {
                                route.children(".good-deal-discount-pct").children(".label.label-success").html("<span class='realOpsmo'>" + loaded[0].opsmo + "</span>");
                            }
                        } else {
                            $(this).children("div").children(".good-deal-discount-pct").children(".label.label-success").html("Not Found");
                        }
                    }
                })
            }
        })
    }
}

function newgetprices() {
    if (skinsdbprices.length > 0) {
        delete skinsdbprices;
        skinsdbprices = [];
    }
    var myData = new FormData();
    myData.append("newgetprices", true);
    GM_xmlhttpRequest({
        method: "POST",
        url: scriptUrl,
        data: myData,
        onload: function (result) {
            var res = jQuery.parseJSON(result.responseText);
            res = res[0];
            skinsdbprices.push(res);
            skinsdbprices = skinsdbprices[0];
        }
    })
}
function newloadallprices(opd) {
    if (skinsdbprices.length > 0) {
        $('.featured-item.scanned').each(function () {
            var route;
            if (opd === "opd") {
                route = $(this);
            } else {
                route = $(this).children("div");
            }
            if (route.children(".good-deal-discount-pct").children(".label-success").html() === 'Price' && typeof route.children(".good-skinDBupd-discount-pct").attr("skin-id") === 'undefined') {
                var skinName = route.children(".market-link").html();
                var skinPrice = route.find(".item-amount").html().replace("$", "");
                var unavailable = route.children(".item-add");
                if (unavailable.html()) {
                    if (opd === "opd") {
                        var skinId = route.children(".market-link").attr("href");
                        skinId = skinId.split("&item=");
                        skinId = skinId[1];
                    } else {
                        var skinId = unavailable.children(".item-amount").attr('onclick');
                        skinId = skinId.split("showGraphFromId(");
                        skinId = skinId[1];
                        skinId = skinId.replace(")", "");
                    }
                } else {
                    if (opd === "opd") {
                        var skinId = route.children(".market-link").attr("href");
                        skinId = skinId.split("&item=");
                        skinId = skinId[1];
                    } else {
                        var skinId = route.children(".item-add-wear").children(".item-amount").attr('onclick');
                        skinId = skinId.split("showGraphFromId(");
                        skinId = skinId[1];
                        skinId = skinId.replace(")", "");
                    }
                }
                if (route.children(".item-desc").children(".text-muted").html() != "") {
                    var exterior = "(" + route.children(".item-desc").children(".text-muted").html() + ")";
                    var phase = route.children(".item-desc").children(".text-muted").next().html().replace(/[/^\D+/()]/g, '');
                    if (phase !== "") {
                        skinName = skinName.trim() + " Phase " + phase + " " + exterior;
                    } else {
                        skinName = skinName.trim() + " " + exterior;
                    }
                } else {
                    skinName = skinName.trim();
                }
                var loaded = $.grep(skinsdbprices, function (e) {
                    return e.skinname == skinName;
                });
                if (typeof loaded[0] !== 'undefined') {
                    if ($.cookie("savedDisc")) {
                        savedDiscount = $.cookie("savedDisc");
                    } else {
                        savedDiscount = 25;
                    }
                    var resom = 100 - (skinPrice * 100) / (loaded[0].price * 0.97);
                    var res1 = Math.round(resom * 100) / 100;
                    var dif = savedDiscount - res1;
                    if (res1 > savedDiscount) {
                        if (loaded[0].actual === 'fine') {
                            var type = $(this).find(".text-muted").next().text();
                            if (opd === "opd") {
                                if (typeof $(this).find(".buyers-club-icon").html() === "undefined" && type !== "Base Grade Key") {
                                    $(this).attr("style", "border:10px solid green;");
                                    skin = [];
                                    skin['skinid'] = skinId;
                                    skin['skindisc'] = res1;
                                    skin['skinname'] = $(this).find(".market-link").text() + " (" + $(this).children(".item-desc").find(".text-muted").text() + ")";
                                    skin['skinprice'] = parseInt(parseFloat($(this).find(".item-amount").text().replace("$", "")) * 100);
                                    skinsLoaded.push(skin);
                                }
                            } else {
                                if (type !== "Base Grade Key") {
                                    $(this).attr("style", "border:10px solid green;");
                                    $(this).attr('id', skinId);
                                    skin = [];
                                    skin['skinid'] = skinId;
                                    skin['skinlink'] = "#" + skinId;
                                    skin['skindisc'] = res1;
                                    skin['skinname'] = $(this).find(".market-link").text()
                                    skin['skinprice'] = parseInt(parseFloat($(this).find(".item-amount").text().replace("$", "")) * 100);
                                    skinsLoaded.push(skin);
                                    $("#ThatisDisc").show();
                                    $("#ThatisDisc").html(skinsLoaded.length);
                                    $("#ThatisDisc").attr("href", skinsLoaded[0]['skinlink']);
                                }
                            }
                        } else if (loaded[0].actual === 'bad') {
                            $(this).attr("style", "border:10px solid orange;");
                        }
                    } else {
                        if (dif > 0 && dif <= 1.2) {
                            if (loaded[0].actual === 'fine') {
                                $(this).attr("style", "border:10px solid darkblue;");
                            }
                        }
                    }
                    route.prepend("<div class='skinDBupd' style='position: absolute;top: 21%;left: 3%; background: rgba(0, 0, 0, 0.37); padding: 3px 2px;color: #d9d9d9;' skin-id='" + skinId + "'>" + loaded[0].dataupd + "</div>");
                    if (isFinite(res1)) {
                        route.children(".good-deal-discount-pct").children(".label.label-success").html("<span class='realOpsmo'>" + res1 + "</span>%");
                    }
                } else {
                    route.children(".good-deal-discount-pct").children(".label.label-success").html("Not Found");
                }
            }
        })
    }
}

function loadallprices(fullprice = false) {
    if (fullprice === true || $.cookie("cpumode") === "on") {
        newgetprices();
        setInterval(function () {
            newgetprices();
            showlogs("Цены обновлены" + mark);
        }, 30000)
    }
    setTimeout(function () {
        newloadallprices();
    }, 800)
    $(document).ajaxComplete(function () {
        newloadallprices();
    });
    $("body").append("<a id='ThatisDisc' style='position:fixed; display: none; right: 6%; bottom: 6%; padding: 20px 26px; border: 3px solid transparent; background: green; border-radius:60%; font-size: 26px;z-index: 999999; color: #fff; cursor: pointer;'>" + skinsLoaded.length + "</a>");
    $("#ThatisDisc").on("click", function () {
        if ($(".mystery-item-inner .live-listings i").hasClass("fa-pause-circle")) {
            $(".mystery-item-inner .live-listings i").click();
        }
        // console.table(skinsLoaded);
        skinsLoaded.splice(0, 1);
        // console.table(skinsLoaded);
        $(this).html(skinsLoaded.length);
        if (skinsLoaded.length === 0) {
            $(this).hide();
        } else {
            $("#ThatisDisc").attr("href", skinsLoaded[0]['skinlink']);
        }
    })
}

function mysteryInner() {
    $(".navbar-nav").append("<li class='menu scrtimer'><a></a></li>");
    var display = $('.scrtimer a');
    var misteryBox = $(".mystery-item-inner .live-listings");
    if (misteryBox.children("i").hasClass("fa-pause-circle")) {
        if ($.cookie("cpumode") === "on") {
            if ($.cookie("role") === "superuser") {
                setInterval(function () {
                    fullpageparse("opd");
                }, 50);
                setInterval(function () {
                    newloadallprices("opd");
                }, 300);
                showlogs("Interval Started!");
                autobuy();
            } else if ($.cookie("role") === "admin") {
                setInterval(function () {
                    fullpageparse("opd");
                }, 50);
                setInterval(function () {
                    newloadallprices("opd");
                }, 100);
                showlogs("Interval Started!");
                autobuy();
            }
            reloadpage(display, 6);
        } else {
            if ($.cookie("role") === "superuser") {
                setInterval(function () {
                    fullpageparse("opd");
                }, 600);
                setInterval(function () {
                    getallprices("opd");
                }, 1500);
                showlogs("Interval Started!");
                autobuy();
            } else if ($.cookie("role") === "admin") {
                setInterval(function () {
                    fullpageparse("opd");
                }, 300);
                setInterval(function () {
                    getallprices("opd");
                }, 400);
                showlogs("Interval Started!");
                autobuy();
            }
            reloadpage(display, 10);
        }
    } else {
        showlogs("Interval NOT Started!");
    }
}

function settingsMenu() {
    if ($.cookie("silence") === "true") {
        setTimeout(function () {
            $("#silence").prop("checked", true);
        }, 600)
    }
    if ($.cookie("autobuy") === "true") {
        setTimeout(function () {
            $("#autobuy").prop("checked", true);
        })
    }
    if ($.cookie("cpumode") === "on") {
        setTimeout(function () {
            $("#cpumode").prop("checked", true);
        })
    }
    $(".nav.navbar-nav").append("<li class='menu'><a href='/?loc=shop_browse&sort=n'>Авто-бай</a></li>");

    $(".nav.navbar-nav").append("<li class='menu'><a href='#' class='skinsdbset' data-toggle='modal' data-target='#skinsDb'>Настройки" + mark + "</a></li>");
    // $(".user-info .sub-menu").children("a[href$='/?loc=store_account#manageSales']").after("<a href='http://skinsdb.xyz/?mySales' target='_blank'>Мои продажи"+mark+"</a>");

    if ($.cookie("savedDisc")) {
        savedDiscount = $.cookie("savedDisc");
    } else {
        savedDiscount = 25;
    }
    $(".nav.navbar-nav").append("<li class='menu'><a id='savDisc' to-hide='true' style='cursor: pointer;'>" + savedDiscount + "</a></li>");
    $("body").append('' +
        '<div id="skinsDb" class="modal fade" role="dialog">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '<h4 class="modal-title">Настройки' + mark + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div>' +
        '<label for="discValues">Искомый процент: </label>' +
        '<input type="number" name="discValues" id="discValues" class="form-control" min="1" max="99999" step="1" placeholder="" value="' + $.cookie("savedDisc") + '" style="width: 74px">' +
        '<input type="button" class="btn btn-primary" id="saveDisc" style="float:right; padding: 3px; height: 25px;" value="Сохранить">' +
        '</div>' +
        '<div style="float: right; font-size: 12px;">Только для дисконта!</div>' +
        '<div>' +
        '<label for="silence" style="cursor:pointer;">Тихий режим' +
        '<input type="checkbox" id="silence" name="silence" style="margin-left: 15px;"></label>' +
        '</div>' +
        '<div> ' +
        '<label for="cpumode" style="cursor:pointer;">CPU режим (Live)' +
        '<input type="checkbox" id="cpumode" name="cpumode" style="margin-left: 15px;"></label>' +
        '</div>' +
        '<div class="atbuy">' +
        '<label for="autobuy" style="cursor:pointer;">Авто-Бай (Live)' +
        '<input type="checkbox" id="autobuy" name="autobuy" style="margin-left: 15px;"></label>' +
        '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    )
    ;
    if ($.cookie("role") !== 'superuser' && $.cookie("role") !== 'admin') {
        $(".atbuy").hide();
    }

    $("#cpumode").on("change", function () {
        if (this.checked) {
            $.cookie("cpumode", "on");
        } else {
            $.removeCookie("cpumode");
        }
    })

    $("#autobuy").on("change", function () {
        if (this.checked) {
            $.cookie("autobuy", "true");
        } else {
            $.removeCookie("autobuy");
        }
    })

    $("#silence").on("change", function () {
        if (this.checked) {
            $.cookie("silence", "true");
        } else {
            $.removeCookie("silence");
        }
    })
    $("#discValues").keyup(function () {
        if (event.keyCode == 13) {
            $.cookie("savedDisc", $("#discValues").val());
            $("#savDisc").html($("#discValues").val());
            showlogs("Сохранено!");
            setTimeout(function () {
                $(".discAlert").remove();
            }, 2000)
        }
    })
    $("#saveDisc").on("click", function () {
        $.cookie("savedDisc", $("#discValues").val());
        $("#savDisc").html($("#discValues").val());
        showlogs("Сохранено!");
        setTimeout(function () {
            $(".discAlert").remove();
        }, 2000)
    })
    $("#savDisc").on("click", function () {

        sortUsingNestedText($("#scroll"), "div.scanned", "div .good-deal-discount-pct .label-success .realOpsmo");
        $("body").animate({
            scrollTop: 0
        }, 'fast');
    })
}

function csmobot() {
    csmocounters();
    $("#stopInt").after("<button id='scannerdb' class='btn btn-primary' style='float: right; margin-right: 32px;'>Сканнер " + mark + "</button></div>");
    $("#scannerdb").after("<button id='sortbyopsmo' class='btn btn-danger' style='float: right; margin-right: 32px;'>Opskins -> CS.Money</button></div>");
    $("#sortbyopsmo").after("<button id='sortbymoops' class='btn btn-success' style='float: right; margin-right: 32px;'>CS.Money -> Opskins</button></div>");
    setInterval(function () {
        csmopriceView();
    }, 2000)
    $("#sortbymoops").on("click", function () {
        sortUsingNestedText($('#inventory_bots'), "div", "div span.moopsValue .moopsval");
        $(".offer_container_inventory_steam").animate({
            scrollTop: 0
        }, 'fast');
    })
    $("#sortbyopsmo").on("click", function () {
        sortUsingNestedText($('#inventory_bots'), "div", "div span.opsmoValue .opsmoval");
        $(".offer_container_inventory_steam").animate({
            scrollTop: 0
        }, 'fast');
    })
    $("#scannerdb").on("click", function () {
        $(this).html("Загрузка...");
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://api.opskins.com/IPricing/GetAllLowestListPrices/v1/?appid=730",
            onload: function (result) {
                var res = jQuery.parseJSON(result.responseText);

                $("#scannerdb").html("Готово" + mark);
                res = res['response'];
                _.each(res, function (item, index) {
                    var skins = [];
                    skins['skinname'] = index;
                    var price = item['price'] / 100;
                    skins['skincost'] = price;
                    opsapiLoaded.push(skins);
                })
                // $("#refresh_bots_inventory").click();
                csmopriceView("scanner");
            },
            onerror: function (res) {
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

function csmopriceView(special) {
    var mother = $(".invertory_container");
    mother.children().each(function () {
        if (special === "scanner") {
            var skinname = $(this).attr("market_hash_name");
            var skinprice = $(this).attr("cost");
            var loaded;
            loaded = _.find(opsapiLoaded, function (item) {
                return item.skinname === skinname;
            })
            if (typeof loaded !== 'undefined') {
                $(this).attr("disc-status", 'done');
                var opsmo = 100 - (loaded['skincost'] * 100) / (skinprice * 0.97);
                opsmo = Math.round(opsmo * 100) / 100;
                var moops = 100 - loaded['skincost'] * 95 / skinprice;
                moops = Math.round(moops * 100) / 100;
                if (moops > 0) {
                    moops = -moops;
                } else if (moops < 0) {
                    moops = moops + moops * (-2);
                }
                $(this).children(".opspricelink").remove();
                $(this).prepend("<div style='position:absolute;left:7%; bottom: 25%;z-index: 999;width: 100%'><span class='moopsValue' style='background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;'><span class='moopsval'>" + moops + "</span>%</span><span class='opsmoValue' style='background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right; margin-right: 6px;'><span class='opsmoval'>" + opsmo + "</span>%</span></div>");
                $(this).prepend("<span style='position: absolute;top: 33%;left: 0;color: #ff8a37; font-size: 13px;z-index: 999; font-weight: bold;'>" + loaded['skincost'] + "$</span>");
            } else {
                $(this).prepend("<a class='opspricelink' style='position:absolute;left:3%; bottom: 25%;z-index: 999;width: 22px;'><img class='opsprice' src='http://skinsdb.xyz/design/images/opskins_logo.png' alt='opsprice' style='width: 100%; height: auto;'></a>");
            }
        }
        if (typeof $(this).children(".skindblink").html() === 'undefined') {
            var skinname = $(this).attr("market_hash_name");
            var skinprice = $(this).attr("cost");
            var opskinsUrl = "https://opskins.com/?loc=shop_search&sort=lh&app=730_2&search_item=" + skinname;
            var loaded;
            $(this).prepend("<a href='" + opskinsUrl + "' target='_blank' style='background:rgba(0, 0, 0, 0.32); position:absolute;z-index: 999; right: 0; top: 22%;padding: 1px 10px; color: #fff; font-size:14px; line-height: 20px; font-family: Helvetica;' class='skindblink'>Link</a>");
            if (opsapiLoaded.length <= 0) {
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
            } else {
                loaded = _.find(opsapiLoaded, function (item) {
                    return item.skinname === skinname;
                })
                if (typeof loaded !== 'undefined') {
                    $(this).attr("disc-status", 'done');
                    var opsmo = 100 - (loaded['skincost'] * 100) / (skinprice * 0.97);
                    opsmo = Math.round(opsmo * 100) / 100;
                    var moops = 100 - loaded['skincost'] * 95 / skinprice;
                    moops = Math.round(moops * 100) / 100;
                    if (moops > 0) {
                        moops = -moops;
                    } else if (moops < 0) {
                        moops = moops + moops * (-2);
                    }
                    $(this).prepend("<div style='position:absolute;left:7%; bottom: 25%;z-index: 999;width: 100%'><span class='moopsValue' style='background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;'><span class='moopsval'>" + moops + "</span>%</span><span class='opsmoValue' style='background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right; margin-right: 6px;'><span class='opsmoval'>" + opsmo + "</span>%</span></div>");
                    $(this).prepend("<span style='position: absolute;top: 33%;left: 0;color: #ff8a37; font-size: 13px;z-index: 999; font-weight: bold;'>" + loaded['skincost'] + "$</span>");
                } else {
                    $(this).prepend("<a class='opspricelink' style='position:absolute;left:3%; bottom: 25%;z-index: 999;width: 22px;'><img class='opsprice' src='http://skinsdb.xyz/design/images/opskins_logo.png' alt='opsprice' style='width: 100%; height: auto;'></a>");
                }
            }
        }
    })
    $(".skindblink").on("click", function () {
        var skinname = $(this).parent().attr("market_hash_name");
        var opskinsUrl = "https://opskins.com/?loc=shop_search&sort=lh&app=730_2&search_item=" + skinname;
        window.open(opskinsUrl);
        return false;

    })
    $(".skindblink").hover(function () {
        $(this).css("background", "rgba(0, 0, 0, 0.52)");
    }, function () {
        $(this).css("background", "rgba(0, 0, 0, 0.32)");
    })
    $(".opspricelink").on("click", function () {
        var skinname = $(this).parent().attr("market_hash_name");
        var skinprice = $(this).parent().attr("cost");
        var opskinsUrl = "https://opskins.com/?loc=shop_search&sort=lh&app=730_2&search_item=" + skinname;
        $("div[market_hash_name='" + skinname + "']").attr("disc-status", 'done');
        $("div[market_hash_name='" + skinname + "']").children(".opspricelink").html("<span style='font-size:14px; line-height: 20px; font-family: Helvetica;'>Загрузка..</span>");
        requestforprice(opskinsUrl, skinname, skinprice);
        return false;
    })
}

function csmomenu() {
    $(".favSelectDiv").after("<div style='margin-bottom: 12px;'><button id='startInt' class='btn btn-primary' style='margin-left: 34px;'>Старт</button>");
    $("#startInt").after("<button id='stopInt' class='btn btn-warning' style='margin-left: 2px;'>Стоп</button>");
    if ($.cookie("opsbot") === 'on') {
        csmobot();
        setTimeout(function () {
            $("#opsbot").prop("checked", true);
        }, 600)
    }
    $(".steam_order_spoiler").prepend("<a href='#' class='skinsdbset steam_spoiler_link' data-toggle='modal' data-target='#skinsDb'>НАСТРОЙКИ | SKINSDB</a>");
    $("body").append('' +
        '<div id="skinsDb" class="modal fade" role="dialog">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '<h4 class="modal-title">Настройки' + mark + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<label for="opsbot" style="cursor:pointer; width: 33%;">Отобразить кнопки Opskins?</label>' +
        '<input type="checkbox" id="opsbot" name="opsbot" style="display: inline-block;">' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');


    $("#opsbot").on("change", function () {
        if (this.checked) {
            $.cookie("opsbot", "on");
            csmobot();
        } else {
            $.removeCookie("opsbot");
            setTimeout(function () {
                location.reload();
            }, 2000)
        }
    })
}

function csmocounters() {
    $(".user_col_lg_head .row").append('<div class="offer_header" style="width: 100%; float: left; margin-left: 20px; font-size: 18px; padding: 0;"><span id="userinv">0.00</span>$</div>');
    $(".make_trade_button").before('<div class="market_text_head" style="margin-top: 0; margin-bottom: 20px"><span id="sum_dif">0.00</span>$</div>');
    var user_offer = $("#user_offer_sum").text().replace("$", "").trim();
    var bot_offer = $("#bots_offer_sum").text().replace("$", "").trim();
    setInterval(function () {
        var counts = 0;
        $("#inventory_user").children().each(function () {
            counts += Number($(this).attr("cost") * $(this).children(".invertory_title_container").children(".invertory_title_text_quantity").children(".count_in_stack").text());
            if (counts === 0) {
                $("#userinv").html("0.00");
            } else {
                $("#userinv").html(Math.round(counts * 100) / 100);
            }
        })
    }, 1600)
    setInterval(function () {
        if (user_offer !== $("#user_offer_sum").text().replace("$", "").trim() || bot_offer !== $("#bots_offer_sum").text().replace("$", "").trim()) {
            var sum_dif = Number($("#user_offer_sum").text().replace("$", "").trim() - $("#bots_offer_sum").text().replace("$", "").trim());
            $("#sum_dif").html(Math.round(sum_dif * 100) / 100);
            user_offer = $("#user_offer_sum").text().replace("$", "").trim();
            bot_offer = $("#bots_offer_sum").text().replace("$", "").trim();
        }
    }, 300)
}

function sellsinvChecker() {
    var check = setInterval(function () {
        if (typeof $("#inv-container").html() !== 'undefined') {
            clearInterval(check);
            setTimeout(salesInfo(), 500);
        }
    }, 800)
};
function salesInfo() {
    $("body").append('' +
        '<div id="skinsDbSales" class="modal fade" role="dialog">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '<h4 class="modal-title">Инфа про скин <span id="modalSkinName"></span>' + mark + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<span>Hi</span>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
    $("#skinsDbSales .modal-content").css({
        "width": "800px",
        "right": "10%"
    });
    showlogs("Загружено!" + mark);
    $(".sell-item").on("click", function sellitem() {
        $("#sell-selected-inspect-btn").attr("disabled", "disabled");
        $("#realLowestPrice").remove();
        var url,
            skinname;
        $("#sell-selected-inspect-btn").attr("href", "#");
        $("#sell-selected-inspect-btn").attr("data-toggle", "modal");
        $("#sell-selected-inspect-btn").attr("data-target", "#skinsDbSales");
        $("#sell-selected-inspect-btn").css("background", "green");
        $("#sell-selected-inspect-btn").text("Check Solds");
        $('#sell-selected-suggestedprice').children("strong").after("<strong id='realLowestPrice' style='color:red'><br>Загрузка..</strong>");
        url = $("#sell-selected-box").children(".sell-selected-btn").attr("href");
        skinname = url.split("&sort");
        skinname = skinname[0].split("&search_item=");
        skinname = decodeURI(skinname[1]);
        $("#modalSkinName").text(skinname);
        var loaded = $.grep(skinsLoaded, function (e) {
            return e.skinname == skinname;
        });
        if (typeof loaded[0] !== 'undefined') {
            console.table(skinsLoaded);
            $("#skinsDbSales .modal-body").html("Not Loaded!");
            $("#realLowestPrice").css("color", "green");
            $("#realLowestPrice").html("<br>Real Lowest Price: " + loaded[0].price + "<div style='position:absolute;right: 2%; top: -22%;'><span class='label label-success moneyOps'>" + loaded[0].moneyOps + "%</span>" +
                "<span class='label label-success opsMoney'style='background-color:#dc1010'>" + loaded[0].opsMoney + "%</span></div>");
            $("#sell-selected-inspect-btn").removeAttr("disabled");
            if (typeof loaded[0].sels !== 'undefined') {
                $("#skinsDbSales .modal-body").html(loaded[0].sels);
            } else {
                var index = -1;
                for (var i = 0, len = skinsLoaded.length; i < len; i++) {
                    if (skinsLoaded[i].skinnname === skinname) {
                        index = i;
                        break;
                    }
                }
                skinsLoaded.splice(index, 1);
                console.log("Index : " + index);
            }
            last20date("sell");
            las20btn("sell");
        } else {
            $.post(url).done(function (e) {
                var price = $(e).find(".item-amount").html();
                var link = $(e).find(".market-link").attr("href");
                if (typeof price !== 'undefined') {
                    price = price.replace("$", "") + " $";
                    $("#realLowestPrice").css("color", "green");
                    var myData = new FormData();
                    myData.append("data", skinname);
                    myData.append("price", price);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: scriptUrl,
                        data: myData,
                        onload: function (result) {
                            skin = [];
                            skin['skinname'] = skinname;
                            skin['price'] = price;
                            var res = jQuery.parseJSON(result.responseText);
                            if (res['opsMoney']) {
                                skin['moneyOps'] = res['moneyOps'];
                                skin['opsMoney'] = res['opsMoney'];
                            } else if (res['error']) {
                                skin['opsMoney'] = res['Not Found'];
                            } else {
                                skin['opsMoney'] = res['Error'];
                            }
                            var newLink = "https://opskins.com/" + link;
                            $.post(newLink).done(function (res) {
                                var sels = $(res).find(".widget.clearfix").html();
                                skin['sels'] = sels;
                                skinsLoaded.push(skin);
                            })
                            sellitem();
                        }
                    })
                } else {
                    $("#realLowestPrice").html("<br>Ошибка!");
                }
            })
        }
    })
}

function realEarning() {
    var balance = parseFloat($("#op-count").text().replace("$", ""));
    var op = parseFloat($("#op-credits-count span").text().replace("$", "").trim());
    var fullBal = Math.round((balance + op) * 100) / 100;
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings['url'] === 'ajax/shop_account.php?type=itrans&page=1&filter=2') {
            $("#collapseIS").append("<div id='infoLoader' style='width: 100%; heigth: 100%; text-align: center;'><h1>Загрузка..." + mark + "</h1></div>");
            $("#collapseIS .panel-body").css("display", "none");
            var myData = new FormData();
            var onSold = 0;
            var userdbupd = "http://skinsdb.xyz/scripts/usersales.php";
            myData.append("usersales", true);
            GM_xmlhttpRequest({
                method: "POST",
                url: userdbupd,
                data: myData,
                onload: function (result) {
                    $(".btn.btn-primary.pull-right:contains('Download History')").before("<a href='http://skinsdb.xyz/?mySales' class='btn btn-primary pull-right' target='_blank'>Мои продажи " + mark + "</a>");
                    $("#iTrans table thead th:contains('Your Cut')").after("<th style='text-align: center'>CS.Money (забрал)</th>");
                    $("#iTrans table thead th:contains('CS.Money (забрал)')").after("<th style='text-align: center'>CS.Money -> Opskins</th>");
                    $("#iTrans table tbody td:contains('On Sale')").before("<td class='skinDBcsmoops'>CSMOOPS (Loading.. / No info)</td>");
                    $("#iTrans table tbody td:contains('CSMOOPS (Loading.. / No info)')").before("<td class='skinDBcsmprice'>CSMOPRICE (Loading..  / No info)</td>");

                    var myData = new FormData();
                    var onSold = 0;

                    myData.append("usersales", true);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: scriptUrl,
                        data: myData,
                        onload: function (result) {
                            var res = jQuery.parseJSON(result.responseText);
                            res = res[0];
                            console.log(res);
                            for (var i = 0; i < res.length; i++) {
                                if (res[i]["actual"] === "0") {
                                    $("#iTrans table tbody td:contains('" + res[i]['id'] + "')").parent().children("td").children("a").css({
                                        "color": "red",
                                        "font-weight": "bold"
                                    });
                                }
                                $("#iTrans table tbody td:contains('" + res[i]['id'] + "')").parent().find(".skinDBcsmprice").text("$" + res[i]["csmoney"]);
                                $("#iTrans table tbody td:contains('" + res[i]['id'] + "')").parent().find(".skinDBcsmprice").css("text-align", "center");
                                var opsprice = parseFloat($("#iTrans table tbody td:contains('" + res[i]['id'] + "')").parent().find(".editable").text().replace("$", "").trim());
                                var resmo = 100 - opsprice * 95 / res[i]["csmoney"];
                                var res2 = Math.round(resmo * 100) / 100;
                                ;
                                if (res2 > 0) {
                                    res2 = -res2;
                                } else if (res2 < 0) {
                                    res2 = res2 + res2 * (-2);
                                }
                                $("#iTrans table tbody td:contains('" + res[i]['id'] + "')").parent().find(".skinDBcsmoops").text(res2 + "%");
                                $("#iTrans table tbody td:contains('" + res[i]['id'] + "')").parent().find(".skinDBcsmoops").css("text-align", "center");
                                // console.log(res[i]['id']);
                                $("#collapseIS .panel-body").css("display", "block");
                                $("#infoLoader").remove();
                            }
                        }
                    })

                    $("#iTrans table tbody tr td.editable").each(function () {
                        var price = parseFloat($(this).text().replace("$", "").trim());
                        onSold += price;
                    })
                    onSold = Math.round((onSold * 0.95) * 100) / 100;
                    realFullB = Math.round((fullBal + onSold) * 100) / 100;
                    $("span[id='sold-items-earned']")[1].innerHTML = "<span style='color:green; font-weight: bold;'>" + onSold + "$</span> + <span style='color:green; font-weight: bold;'>" + fullBal + "$</span> = " + realFullB + "$";

                }
            })
        }
    })
}
function autobuy() {
    if (skinsLoaded.length > 0) {
        delete skinsLoaded;
        skinsLoaded = [];
    }
    setTimeout(function () {
        if ($.cookie("autobuy") === "true" && $(".userSub").text() !== "" && $(".userSub").text() !== "Premium Member") {
            var autoBuyInt;

            autoBuyInt = setInterval(autoBuyFunc, 500);

            function autoBuyFunc() {
                if (skinsLoaded.length > 0) {
                    // console.table(skinsLoaded);
                    clearInterval(autoBuyInt);
                    var i;
                    for (i = 0; i < skinsLoaded.length; i++) {
                        setTimeout(getbuyQuery(i), i + 1 * randomInteger(600 - 3000));
                        function getbuyQuery(i) {
                            oneClickBuyScr(skinsLoaded[i]['skinid'], skinsLoaded[i]['skinprice'], skinsLoaded[i]['skinname'], skinsLoaded[i]['skindisc']);
                            skinsLoaded.splice(i, 1);
                        }
                    }
                    setTimeout(function () {
                        autoBuyInt = setInterval(autoBuyFunc, 500);
                    }, 2000)
                } else {
                    // console.log("Скинов еще нету.");
                }
            }
        }
    }, 4000)
}

function getautobuy() {
    $("#scroll div:first").prepend("<div class='scrtimer' style='margin-bottom: 40px'><span></span></div>")
    var main = $("#scroll");
    setTimeout(function () {
        if ($(".AllSkins").html() === "0" || $(".AllSkins").html() === "" || typeof $(".AllSkins").html() === "undefined") {
            location.reload();
        }
    }, 17000)
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings['url'] === "ajax/browse_scroll.php?page=1&appId=730&contextId=2") {
            var skinsforcheck = [];
            var display = $('.scrtimer span');
            main.html("<div style='text-align: center; margin: 2% auto; font-size: 21px; font-weight: bold;'><div>Пройдено: <span class='AllSkins'>0</span> скинов</div><div>Проверено: <span class='checkedSkins'>0</span></div><div>Куплено: <span class='buyedSkins'>0</span></div><div>Не куплено: <span class='notBuyedSkins'>0</span></div><div>Ошибок: <span class='errorsSkins'>0</span></div><div><table class='table table-bordered op-tx-table buyedSkinsTable' style='margin-top: 100px; display: none;'><thead><tr><th>Скин: </th><th>Цена: </th><th>Дисконт: </th><th>Время: </th></tr></thead><tbody></tbody></table></div></div>");
            reloadpage(display, 35);
            if ($.cookie("role") === "admin") {
                getAutoInt = setInterval(getFunction, randomInteger(4000, 12000));
            } else if ($.cookie("role") === "superuser") {
                getAutoInt = setInterval(getFunction, randomInteger(5000, 15000));
            }
            function getFunction() {
                var errors = $(".errorsSkins");
                var allskins = $(".AllSkins");
                var checkedskins = $(".checkedSkins");
                var buyedskins = $(".buyedSkins");
                $.get("https://opskins.com/ajax/browse_scroll.php?page=1&appId=730&contextId=2").done(function (res) {

                    var parsed = $.parseHTML(res);
                    var i;
                    allskins.html(parseInt(allskins.text()) + (parsed.length - 2));

                    for (i = 2; i < parsed.length; i++) {
                        var html = parsed[i].innerHTML;
                        var buyer = parsed[i].className.indexOf("buyers-club-item-sm") + 1;
                        var wear = $(html).find('.text-muted').html()
                        var grade = $(html).find('.text-muted').next().html();
                        var name = $(html).find(".market-name.market-link").html().trim();
                        if (wear !== "") {
                            var phase = $(html).find('.text-muted').next().html().replace(/[/^\D+/()]/g, '');
                            if (phase !== "") {
                                name = name + " Phase " + phase + " (" + wear + ")";
                            } else {
                                name = name + " (" + wear + ")";
                            }
                        }
                        var amount = $(html).find(".item-amount").html().replace("$", "");
                        var skinId = $(html).find(".market-link").attr("href");
                        skinId = skinId.split("&item=");
                        skinId = skinId[1];

                        if (buyer === 0 && grade !== "Base Grade Key") {
                            var skin = {};
                            skin['skinName'] = name;
                            skin['skinPrice'] = amount;
                            skin['skinId'] = skinId;
                            skinsforcheck.push(skin);
                        }
                    }

                    var jsonString = JSON.stringify(skinsforcheck);
                    var myData = new FormData();
                    myData.append("skinarray", jsonString);
                    myData.append("newautobuy", true);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: scriptUrl,
                        data: myData,
                        onload: function (result) {
                            var res = jQuery.parseJSON(result.responseText);
                            if (res['error']) {
                                errors.html(parseInt(errors.text()) + res.length);
                            } else {
                                checkedskins.html(parseInt(checkedskins.text()) + res.length);
                                var n;
                                if ($.cookie("savedDisc")) {
                                    savedDiscount = $.cookie("savedDisc");
                                } else {
                                    savedDiscount = 25;
                                }
                                for (n = 0; n < res.length; n++) {
                                    if (res[n]['actual'] === "fine" && res[n]['opsmo'] > savedDiscount) {

                                        setTimeout(oneClickBuyScr(res[n]["id"], res[n]['opsprice'] * 100, res[n]['skinname'], res[n]['opsmo']), (n + 1) * randomInteger(600, 2000));

                                        // console.log("Я бы купил: " + res[n]['skinname'] + " в " + res[n]['opsmo'] + " % за" + res[n]['opsprice'] + " $");

                                    }
                                }
                            }
                        }
                    })
                    skinsforcheck = [];
                }).fail(function (xhr, status, error) {
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                    errors.css("color", "red");
                    errors.html("Скоре всего у тебя бан IP.. Сори!");
                })
            }
        }
    })
}

function reloadpage(display, timetorealod) {
    startTimer(timetorealod * 60, display);
    setTimeout(function () {
        $(".mystery-item-inner .live-listings i.fa-play-circle").click();
        location.reload();
    }, timetorealod * 60000);
}

// Additional functions
function chromemes(mesbody) {
    var currentPermission;
    Notification.requestPermission(function (result) {
        currentPermission = result
    });
    mailNotification = new Notification("skinsdbExt", {
        body: mesbody,
        icon: "https://pp.vk.me/c7004/v7004148/23616/XwoiYEex0CQ.jpg"
    });
    setTimeout(mailNotification.close.bind(mailNotification), 3000);
}

function sortUsingNestedText(parent, childSelector, keySelector) {
    var items = parent.children(childSelector).sort(function (a, b) {
        var vA = $(keySelector, a).text();
        var vB = $(keySelector, b).text();
        return ((+vA) > (+vB)) ? -1 : ((+vA) < (+vB)) ? 1 : 0;
    });
    parent.append(items);
}


function showlogs(logmes) {
    $(".logmessage").remove();
    $("body").append("<div class='fa fa-check-circle logmessage'><span>" + " " + logmes + "</span></div>");
    $(".logmessage").css({
        "position": "fixed",
        "bottom": "20px",
        "z-index": "9999999",
        "right": "10px",
        "font-size": "16px",
        "padding": "10px 29px 8px 40px",
        "border": "1px solid #026194",
        "border-radius": "10px",
        "-moz-border-radius": "10px",
        "-webkit-border-radius": "10px",
        "box-shadow": "2px 2px 3px #bbb",
        "-moz-box-shadow": "2px 2px 3px #bbb",
        "-webkit-box-shadow": "2px 2px 3px #bbb",
        "background": "#fff",
        "text-align": "justify",
        "color": "#000"
    });
    $(".logmessage").fadeIn(300).delay(4500).fadeToggle(300);
}


function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text("Перезагрузка через " + minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}


function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}


// Default OPS Functions

function oneClickBuyScr(saleid, price, skin, skinDisc) {
    var loc = getURLParameter('loc');
    if (loc === null) {
        loc = 'home';
    }
    var internal_search = getURLParameter('search_internal');
    $.post("/ajax/shop_buy_item.php", {
        "action": "buy",
        "total": price,
        "accept_tos": 1,
        "type": 2,
        "buy_now_saleid": saleid,
        "location": loc,
        "internal_search": internal_search
    }).done(function (res) {
        var parsed = $.parseHTML(res);
        // console.log(parsed);
        if (parsed.length > 1) {
            if (site === "https://opskins.com/?loc=shop_browse&sort=n") {
                $(".buyedSkins").html(parseInt($(".buyedSkins").text()) + 1);
                var now = new Date();
                if ($.cookie("nav-updater") !== "on") {
                    var date = new Date();
                    date.setTime(date.getTime() + (60 * 1000));
                    updateOsiCount(true);
                    updateBalance(true);
                    $.cookie("nav-updater", "on", {expires: date});
                }
                if ($(".buyedSkinsTable").css("display") === "none") {
                    $(".buyedSkinsTable").css("display", "table");
                }
                $(".buyedSkinsTable tbody").append("<tr><td>" + skin + "</td><td>" + price / 100 + "$</td><td>" + skinDisc + "%</td><td>" + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds() + "." + now.getMilliseconds() + "</td></tr>");
                if ($(".buyedSkinsTable").css("display") === "none") {
                    $(".buyedSkinsTable").css("display", "table");
                }
            }else{
                updateOsiCount(true);
                updateBalance(true);
            }
            if (parsed[1].innerText === "Your purchase was successful. Your new item is now stored in your OPSkins inventory." && $.cookie("silence") !== "true") {
                soundAccept.play();
                chromemes("Купил " + skin + " за " + price / 100 + "$ в " + skinDisc + "%");
            }
        } else if (parsed.length === 1) {
            if (parsed[0].innerHTML === "You cannot buy any items until your previous action completes.") {
                setTimeout(oneClickBuyScr(saleid, price, skin, skinDisc), randomInteger(800, 3200))
            } else {
                if (site === "https://opskins.com/?loc=shop_browse&sort=n") {
                    $(".notBuyedSkins").html(parseInt($(".notBuyedSkins").text()) + 1);
                }
                // console.log("Хотел купить " + skin + " за " + price / 100 + "$ в " + skinDisc + "%");
                // console.log("https://opskins.com/?loc=shop_view_item&item="+saleid);
                // console.log(parsed[0].innerText)
            }
        }
    });
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


function updateOsiCount(master) {
    if (!g_UID) {
        return;
    }
    $.get("/ajax/ui_updates.php", {
        "type": "osi_count",
        "master": master ? 1 : 0
    }, function (count) {
        $('#top-nav-bar').find('a[href*="loc=inventory"] .badge').text(count)[count == 0 ? 'hide' : 'show']();
    });
}
// Default OPS Functions
