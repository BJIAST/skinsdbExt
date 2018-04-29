// ==UserScript==
// @name         skinsdbExt
// @namespace   https://skinsdb.online/
// @version      2.29
// @description  try to hard!
// @author       BJIAST
// @match       https://skinsdb.online/*
// @match       https://steamcommunity.com/tradeoffer/*
// @match       https://cs.money/*
// @match       http://cs.money/*
// @match       https://loot.farm/*
// @match       https://cstrade.gg/*
// @match       https://csgotrade.me/*
// @match       https://csoffer.me/*
// @match       https://trade-skins.com/*
// @match       https://tradeit.gg/*
// @match       https://opskins.com/*
// @match       https://steamcommunity.com/trade/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==


var scriptUrl = "https://skinsdb.online/scripts/opsinc.php";
var soundAccept = new Audio('https://raw.githubusercontent.com/BJIAST/SATC/master/sounds/done.mp3');
var soundFound = new Audio('https://skinsdb.online/assets/ready.mp3');
var site = location.href;
var mark = " | skinsdbExt";
var skinsLoaded = [];
var skinsdbprices = [];
var favSkins = [];


var version = 2.29;

(function () {
    var opslink3 = site.split("https://opskins.com/");

    if (site == "https://opskins.com/" + opslink3[1]) {
        include("https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js");
        include("https://code.jquery.com/jquery-3.2.1.min.js");

        include("https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js");

        if ($.cookie("pattern_check_cookie")) {
            pattern_check = true;
        } else {
            pattern_check = false;
        }
        if ($.cookie('user-auth')) {
            console.log("Loaded without server!");
            opsbotload(site);
        } else {
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
                        var userAuthLife = new Date();
                        userAuthLife.setTime(userAuthLife.getTime() + (600 * 1000));
                        console.log(JSONdata);
                        $.cookie('user-auth', true, {expires: userAuthLife});
                        $.cookie("role", JSONdata['role'], {expires: userAuthLife});
                        $.cookie("apikey", JSONdata['key'], {expires: userAuthLife});
                        $.cookie("changer", JSONdata['main-changer'], {expires: userAuthLife});
                        if (JSONdata['discount'] !== null) {
                            $.cookie("savedDisc", JSONdata['discount'], {expires: userAuthLife});
                        } else {
                            $.cookie("savedDisc", "Укажи дисконт в настройках!", {expires: userAuthLife});
                        }
                        versionChecker(JSONdata['user-version'], JSONdata['current-version']);
                        opsbotload(site);
                    }
                }
            })
        }
    }
    if (site === "https://loot.farm/") {
        include("https://code.jquery.com/jquery-3.2.1.min.js");
        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");

        setTimeout(function () {
            setInterval(function () {
                allAnotherGetLink("LootFarm");
            }, 2000);
        }, 400);
    }
    if (site === "https://csoffer.me/") {
        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");

        setTimeout(function () {
            setInterval(function () {
                allAnotherGetLink("CSOFFERme");
            }, 2000);
        }, 400);
    }
    if (site === "https://csgotrade.me/") {
        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");

        setTimeout(function () {
            setInterval(function () {
                allAnotherGetLink("TradeMe");
            }, 2000);
        }, 400);
    }
    if (site === "https://trade-skins.com/") {
        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");

        setTimeout(function () {
            setInterval(function () {
                allAnotherGetLink("TradeSkins");
            }, 2000);
        }, 400);
    }
    if (site === "https://cstrade.gg/") {
        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");

        setTimeout(function () {
            setInterval(function () {
                allAnotherGetLink("CSTrade");
            }, 2000);
        }, 400);
    }
    if (site === "https://tradeit.gg/") {
        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");

        setTimeout(function () {
            setInterval(function () {
                allAnotherGetLink("TradeIt");
            }, 2000);
        }, 400);
    }
    if (site == "https://cs.money/#" || site == "https://cs.money/" || site == "https://cs.money/ru" || site == "https://cs.money/ru#" || site == "https://cs.money/ru/") {
        include("https://code.jquery.com/jquery-3.2.1.min.js");


        setTimeout(function () {
            include("https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js");

            var myData = new FormData();
            myData.append("checkpay", true);
            GM_xmlhttpRequest({
                method: "POST",
                url: scriptUrl,
                data: myData,
                onload: function (result) {
                    JSONdata = JSON.parse(result.responseText);
                    if (JSONdata['error']) {
                        $(".header_menu").prepend("<li>" + JSONdata['error'] + "</li>");
                    }
                    if (JSONdata['success']) {
                        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");
                        versionChecker(JSONdata['user-version'], JSONdata['current-version']);
                        csmomenu();
                        // csmoparser();
                        favSkins = JSONdata['favskins'];
                    }
                }
            })
        }, 600)
    }
    if (site == "https://skinsdb.online/?doppler_search" || site == "https://skinsdb.online/?favsearch") {
        dopplerChecker();
    }
    steamAccept();
}());

function versionChecker(userdbV) {

    if (version > userdbV) {
        var myData = new FormData();
        myData.append("version_update", version);
        GM_xmlhttpRequest({
            method: "POST",
            url: scriptUrl,
            data: myData
        })
    }
}

function opsbotload(site) {
    var opslink = site.split("?loc=shop_search");
    var opslink2 = site.split("?loc=good_deals");
    var opslink3 = site.split("https://opskins.com/");
    var opslink4 = site.split("?loc=shop_view_item");
    var opslink5 = site.split("?app=730_2");
    var opslink6 = site.split("index.php?loc=game");
    if (site == "https://opskins.com/" + opslink3[1]) {
        settingsMenu();
    }

    if (site == "https://opskins.com/?loc=shop_checkout") {
        autoBuyclick();
    }
    if (site == "https://opskins.com/?loc=shop_search" + opslink[1] || site == "https://opskins.com/?app=730_2" + opslink5[1]) {
        fullpageparse();
        loadallprices();
        friendssells();
    }
    if (site == "https://opskins.com/?loc=good_deals" + opslink2[1]) {
        fullpageparse();
        loadallprices();
        // csmoparser();
        addFilterBtn();
    }
    if (site == "https://opskins.com/?loc=shop_browse") {
        fullpageparse();
        loadallprices();
        // csmoparser();
    }
    if (site == "https://opskins.com/?loc=shop_browse&sort=n") {
        var getAutoInt;
        // csmoparser();
        loadallprices();
    }
    if (site == "https://opskins.com/?loc=shop_view_item" + opslink4[1]) {
        last20date();
        las20btn();
        oneItemDiscount();
        buyerChecker();
    }
    if (site == "https://opskins.com/?loc=shop_checkout") {
        fullpageparse();
        loadallprices();
    }
    if (site == "https://opskins.com/?loc=sell") {
        sellsinvChecker();
    }
    if (site == "https://opskins.com/?loc=inventory") {
        autoWithdraw();
    }
    if (site == "https://opskins.com/?loc=store_account#manageSales") {
        realEarning();
    }
    if (site == "https://opskins.com/index.php?loc=game" + opslink6[1] || site == "https://opskins.com/?loc=game") {
        fullpageparse();
        loadallprices();
    }
}

// function csmoparser() {
//     var myData = new FormData();
//     myData.append("checkparse", true);
//     GM_xmlhttpRequest({
//         method: "POST",
//         url: scriptUrl,
//         data: myData,
//         onload: function (result) {
//             res = jQuery.parseJSON(result.responseText);
//             if (res['success']) {
//                 getQuery();
//                 setInterval(getQuery, 120000);
//                 showlogs("Парсер включен!");
//             }
//         }
//     })
//
//
//     function getQuery() {
//         var url_date = new Date().getTime() / 1000;
//         var url = "http://cs.money/load_bots_inventory?hash"+url_date;
//         console.log(url);
//         GM_xmlhttpRequest({
//             method: "GET",
//             url: url,
//             onload: function (res) {
//
//                 if (res.responseText[0] === "<" && site == "https://opskins.com/" + opslink3[1]) {
//                     window.open("http://cs.money/");
//                 } else {
//                     json = JSON.parse(res.responseText);
//                     // console.log(json);
//                     var skins = [];
//                     $.each(json, function (key, item) {
//                         var skinname = "";
//                         switch (item['e']) {
//                             case 'FN' :
//                                 skinname = item['m'] + " (Factory New)";
//                                 break;
//                             case 'MW' :
//                                 skinname = item['m'] + " (Minimal Wear)";
//                                 break;
//                             case 'FT' :
//                                 skinname = item['m'] + " (Field-Tested)";
//                                 break;
//                             case 'WW' :
//                                 skinname = item['m'] + " (Well-Worn)";
//                                 break;
//                             case 'BS' :
//                                 skinname = item['m'] + " (Battle-Scarred)";
//                                 break;
//                             default :
//                                 skinname = item['m'];
//                                 break;
//                         }
//                         var target = skinname;
//                         var result = $.grep(skins, function (e) {
//                             return e.skinname == target;
//                         });
//                         if (typeof result[0] == 'undefined' && typeof item['ar'] == 'undefined') {
//                             console.log(item['ar'] + " - "  + skinname);
//                             var thisskin = {};
//                             thisskin['skinname'] = skinname;
//                             thisskin['csmprice'] = item['p'];
//                             thisskin['counter'] = 1;
//                             skins.push(thisskin);
//                         } else if(typeof result[0] != 'undefined') {
//                             objIndex = skins.findIndex((obj => obj.skinname == skinname));
//                             skins[objIndex].counter = skins[objIndex].counter + 1;
//                         }
//                     });
//                     jsonReady = JSON.stringify(skins);
//                     var myData = new FormData();
//                     myData.append("csmoprices", jsonReady);
//                     GM_xmlhttpRequest({
//                         method: "POST",
//                         url: "https://skinsdb.online/parsers/money.php",
//                         data: myData,
//                         onload: function (result) {
//                             console.log(result.responseText);
//                         }
//                     })
//                 }
//             }
//         })
//     }
// }

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
    $(".scanned").each(function () {
        if ($(this).find(".priceBtn").length === 0) {
            $(this).prepend("<div style='position:absolute; text-align: right; top: 6px; right: 32px;z-index: 99;'><span class='label label-success priceBtn'>Price</span></div>");
            $(this).find(".priceBtn").attr("data-ext", "autoparse");
            parseprice($(this).find(".priceBtn"), opd);

            sugestedDiscount(this);
        }
    })
    $(document).ajaxComplete(function () {
        $(".scanned").each(function () {
            if ($(this).find(".priceBtn").length === 0) {
                $(this).prepend("<div style='position:absolute; text-align: right; top: 6px; right: 32px;z-index: 99;'><span class='label label-success priceBtn'>Price</span></div>");
                $(this).find(".priceBtn").attr("data-ext", "autoparse");
                parseprice($(this).find(".priceBtn"), opd);

                sugestedDiscount(this);
            }
        })
    })
}

function sugestedDiscount(element) {
    var disc = parseFloat($(element).find(".item-amount").text().replace("$", "").replace(",", "")) / parseFloat($(element).find(".suggested-price").text().replace("$", "").replace(",", "")) * 100 - 100;
    $(element).prepend('<span class="market-name" style="font-size: 18px;"><span class="glyphicon glyphicon-thumbs-up"></span> ' + Math.round(disc * 10) / 10 + '%</span><br>');
    $(element).find(".good-deal-discount-pct").remove();
};

function oneItemDiscount() {
    if (typeof $(".featured-item-large-video").html() !== 'undefined') {
        $(".featured-item-large-video").addClass('featured-item').addClass('scanned');
    } else {
        $(".featured-item-large").addClass('featured-item').addClass('scanned');
    }
    $(".scanned").closest(".view_item").parent().removeClass("col-lg-12").removeClass("col-md-12").addClass("col-lg-6").addClass("col-md-6");
    $(".scanned").prepend("<div class='priceBtn'>Price</div>");
    $(".priceBtn").css({
        "cursor": "pointer",
        "background-color": "#d21d25",
        "font-size": "110%",
        "float": "right",
        "padding": "6px",
        "border-radius": "10px",
        "margin-right": "30px",
        "z-index": 999
    });
    $(".scanned.featured-item").css("height", "auto");
    newgetprices(true);


    // setTimeout(newloadallprices, 600);
}

function parseprice(red_btn, opd) {
    $(".priceBtn").css({
        "cursor": "pointer",
        "background-color": "#d21d25",
        "font-size": "90%",
        "z-index": 99
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
            "cursor": "pointer",
            "font-size": "90%",
            "z-index": 999

        });
        $(this).parent().children(".divmoneyOps").attr("data-loading", "moneyOps");
        var skinName = $(this).parent().parent().find(".market-link").html();
        var unavailable = $(this).parent().parent().find(".item-add");
        var skinPrice = $(this).parent().parent().find(".item-amount").text();
        if ($(this).parent().parent().find(".text-muted").html() != "") {
            var exterior = "(" + $(this).parent().parent().find(".text-muted").html() + ")";
            var phase = $(this).parent().parent().find(".text-muted").next().html().replace(" StatTrak™", "");
            switch (phase) {
                case '★ Covert Knife (Ruby)' :
                    phase = " Ruby";
                    break;
                case '★ Covert Knife (Sapphire)' :
                    phase = " Sapphire";
                    break;
                case '★ Covert Knife (Black Pearl)' :
                    phase = " Black Pearl";
                    break;
                case '★ Covert Knife (Emerald)' :
                    phase = " Emerald";
                    break;
                default:
                    phase = phase.replace(/[/^\D+/()]/g, '');
                    break;
            }
            switch (phase) {
                case '1' :
                    phase = " Phase 1";
                    break;
                case '2' :
                    phase = " Phase 2";
                    break;
                case '3' :
                    phase = " Phase 3";
                    break;
                case '4' :
                    phase = " Phase 4";
                    break;
                case '' :
                    phase = "";
                    break;
            }
            if ($.cookie('changer') === "LOOT.Farm") {
                phase = "";
            }
            skinName = skinName.trim() + phase + " " + exterior;
        } else {
            skinName = skinName.trim();
        }
        if ($.cookie("savedDisc")) {
            savedDiscount = $.cookie("savedDisc");
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
                            if (typeof $(".skinDBupd[data-loading='moneyOps']").parent().find(".buyers-club-icon").html() === 'undefined' && dif > -1 && skinPrice > 5) {
                                $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid #8500ff");
                            } else if (typeof $(".skinDBupd[data-loading='moneyOps']").parent().find(".buyers-club-icon").html() !== 'undefined' && dif > -1 && skinPrice > 100) {
                                $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid darkred");
                            } else {
                                $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid green");
                            }
                        } else {
                            $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid orange");
                        }
                    } else {
                        if (dif > 0 && dif <= 1) {
                            if (res['datestatus'] === 'fine') {
                                setTimeout(function () {
                                    $(".skinDBupd[data-loading='moneyOps']").parent().css("border", "10px solid darkblue");
                                }, 500)
                            }
                        }
                    }

                    $("[data-loading='moneyOps']").html("<span class='realMoops'>" + res['moneyOps'] + "</span>" + "%");
                    $(".skinDBupd[data-loading='moneyOps']").html(res['dateupd'] + "<span style='color: #d69909; font-weight: bold;'> (" + res['price'] + "$)" + (res['counter'] ? " - " + res['counter'] + " шт." : "") + "</span>");
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
                var phase = $(".text-muted").next().html().replace(" StatTrak™", "");
                switch (phase) {
                    case '★ Covert Knife (Ruby)' :
                        phase = " Ruby";
                        break;
                    case '★ Covert Knife (Sapphire)' :
                        phase = " Sapphire";
                        break;
                    case '★ Covert Knife (Black Pearl)' :
                        phase = " Black Pearl";
                        break;
                    case '★ Covert Knife (Emerald)' :
                        phase = " Emerald";
                        break;
                    default:
                        phase = phase.replace(/[/^\D+/()]/g, '');
                }
                switch (phase) {
                    case '1' :
                        phase = " Phase 1";
                        break;
                    case '2' :
                        phase = " Phase 2";
                        break;
                    case '3' :
                        phase = " Phase 3";
                        break;
                    case '4' :
                        phase = " Phase 4";
                        break;
                    case '' :
                        phase = "";
                        break;
                }
                skinName = skinName.trim() + phase + " " + exterior;
            } else {
                skinName = skinName.trim();
            }
        } else {
            var skinName = $("#modalSkinName").text();
        }
        var skinPrice = $(this).parent().children(".text-left").text();
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
            var phase = $(".text-muted").next().html().replace(" StatTrak™", "");
            switch (phase) {
                case '★ Covert Knife (Ruby)' :
                    phase = " Ruby";
                    break;
                case '★ Covert Knife (Sapphire)' :
                    phase = " Sapphire";
                    break;
                case '★ Covert Knife (Black Pearl)' :
                    phase = " Black Pearl";
                    break;
                case '★ Covert Knife (Emerald)' :
                    phase = " Emerald";
                    break;
                default:
                    phase = phase.replace(/[/^\D+/()]/g, '');
            }
            switch (phase) {
                case '1' :
                    phase = " Phase 1";
                    break;
                case '2' :
                    phase = " Phase 2";
                    break;
                case '3' :
                    phase = " Phase 3";
                    break;
                case '4' :
                    phase = " Phase 4";
                    break;
                case '' :
                    phase = "";
                    break;
            }
            skinName = skinName.trim() + phase + " " + exterior;
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
        setTimeout(function () {
            window.close();
        }, 3000);
        chromemes("Скин забрал!");
    }
}

function offerAccept() {
    setInterval(function () {
        if (jQuery('.newmodal_content>div').html() == "Для завершения обмена подтвердите его на странице подтверждений в мобильном приложении Steam.") {
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

function dopplerChecker() {
    var dopplers_knife = [], checks, status = false;
    $(".check_stop").on("click", function () {
        status = false;
        $(".doppler_check").removeAttr("disabled");
        clearTimeout(checks);
        $(".loaderDoplers").html("Готов к работе");
        init_PNotify('Парсинг цен', 'Парсер остановлен!', 'info');
    })
    var statusChecker = (Cookies.get("cycle") ? "checked" : "");
    $(".check_stop").after('<label><input type="checkbox" class="js-switch" ' + statusChecker + '> Цикл</label>');

    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem);

    elem.onchange = function () {
        if (elem.checked === true) {
            Cookies.set("cycle", true);
        } else {
            Cookies.remove("cycle");
        }
        ;
    };
    $(".doppler_check").on("click", function () {
        status = true;
        $(".doppler_check").removeAttr("disabled");
        $(this).attr("disabled", "disabled");
        clearTimeout(checks);
        dopplers_knife = [];
        var full = 0;
        $(this).parent().find(".table tbody tr").each(function () {
            if ($(this).find(".discount").html() !== "") {
                full++;
            }
        })
        if (full === $(this).parent().find(".table tbody tr .discount").length) {
            $(this).parent().find(".table tbody tr .discount").html("");
        }
        $(this).parent().find(".table tbody tr").each(function () {
            if ($(this).find(".discount").html() === "") {
                var skin = {};
                skin['id'] = $(this).find(".id-counter").text();
                skin['skinname'] = $(this).find(".skinname a").text();
                skin['skinlink'] = $(this).find(".skinname a").attr("href");
                skin['changer_price'] = $(this).find(".changer_price").text();
                dopplers_knife.push(skin);
            }
        })
        dopplerPrice(0, this, false);
        // for(var elem = 0; elem < dopplers_knife.length; elem++){
        //     dopplerPrice(elem, this, true);
        // }
    })
    $(".doppler_check_full").on("click", function () {
        status = true;
        $(".doppler_check_full").removeAttr("disabled");
        $(this).attr("disabled", "disabled");
        clearTimeout(checks);
        dopplers_knife = [];
        var full = 0;
        $(this).parent().find(".table tbody tr").each(function () {
            if ($(this).find(".discount").html() !== "") {
                full++;
            }
        })
        if (full === $(this).parent().find(".table tbody tr .discount").length) {
            $(this).parent().find(".table tbody tr .discount").html("");
        }
        $(this).parent().find(".table tbody tr").each(function () {
            if ($(this).find(".discount").html() === "") {
                var skin = {};
                skin['id'] = $(this).find(".id-counter").text();
                skin['skinname'] = $(this).find(".skinname a").text();
                skin['skinlink'] = $(this).find(".skinname a").attr("href");
                skin['changer_price'] = $(this).find(".changer_price").text();
                dopplers_knife.push(skin);
            }
        })
        for (var elem = 0; elem < dopplers_knife.length; elem++) {
            dopplerPrice(elem, this, true);
        }
    })

    function dopplerPrice(n, btn, method = false) {
        var discount = $("#discount-value").val();
        if (n === dopplers_knife.length - 1) {
            newRequestForPrice(dopplers_knife[n]['skinlink'], dopplers_knife[n]['skinname'], dopplers_knife[n]['changer_price'], dopplers_knife[n]['id'], btn, n, "", dopplers_knife.length, discount, method);
        } else if (n < dopplers_knife.length) {
            newRequestForPrice(dopplers_knife[n]['skinlink'], dopplers_knife[n]['skinname'], dopplers_knife[n]['changer_price'], dopplers_knife[n]['id'], btn, n, dopplers_knife[n + 1]['skinname'], dopplers_knife.length, discount, method);
        }
    }

    function newRequestForPrice(opsUrl, skinname, chprice, id, btn, counter, next, length, discount, method) {
        GM_xmlhttpRequest({
            method: "POST",
            url: opsUrl,
            onload: function (result) {
                var txt = result.responseText;
                var cleanTxt = txt.replace(/<img[^>]*>/g, "");
                var res = $(cleanTxt).find(".item-amount").html();
                if ($(cleanTxt).find(".alert-danger").html()) {
                    console.log($(cleanTxt).find(".alert-danger").html());
                    if ($(cleanTxt).find(".alert-danger").html() === '<i class="fa fa-exclamation-triangle"></i> We couldn\'t find any items that matched your search criteria. Have a look at some of our featured items:') ;
                    $(btn).parent().find("#count-" + id).parent().find(".discount").html("Нету");
                    if (counter < length - 1 && status === true && method !== true) {
                        var timeer = randomInteger(600, 1600);

                        counter++;
                        $(".loaderDoplers").html(next + ' через ' + Math.round(timeer / 1000 * 100) / 100 + 'c. <i class="fa fa-spinner fa-spin" style="color:blue" aria-hidden="true"></i>');
                        checks = setTimeout(function () {
                            dopplerPrice(counter, btn);
                        }, timeer)
                    } else {
                        if (typeof Cookies.get("cycle") === "undefined") {
                            $(".doppler_check").removeAttr("disabled");
                            $(".loaderDoplers").html("Готов к работе");
                        } else {
                            counter = 0;
                            $(".loaderDoplers").html(next + ' через ' + Math.round(timeer / 1000 * 100) / 100 + 'c. <i class="fa fa-spinner fa-spin" style="color:blue" aria-hidden="true"></i>');
                            checks = setTimeout(function () {
                                dopplerPrice(counter, btn);
                            }, timeer)
                        }
                    }
                } else if ($(cleanTxt).find(".error#message").html()) {
                    var newWindow = window.open(opsUrl);
                    $(".doppler_check").removeAttr("disabled");
                } else if ($(cleanTxt).find("title").html() == "opskins.com | 504: Gateway time-out") {
                    newRequestForPrice(opsUrl, skinname, chprice, id, btn, counter, next, length, discount);
                } else if ($(cleanTxt).find("title").html() == "502 Bad Gateway") {
                    newRequestForPrice(opsUrl, skinname, chprice, id, btn, counter, next, length, discount);
                }
                else {
                    if (res) {
                        // console.log(result);
                        // console.log(result.responseText);
                        var float = $(cleanTxt).find(".wear-value .text-muted").html();
                        var currentFloat = parseFloat(float.replace("Wear: ", "").replace("%", ""));
                        var currentMaxFloat = parseFloat($(btn).parent().find("#count-" + id).parent().find(".maxFloat").text());
                        res = res.replace("$", "");
                        res = res.replace(",", "");
                        var price = res;
                        res = 100 - (res * 100) / (chprice * 0.97);
                        res = Math.round(res * 100) / 100;
                        var date = new Date();
                        $(btn).parent().find("#count-" + id).parent().find(".opskins").html(price + "$");
                        if (currentFloat < currentMaxFloat && res - discount > -4) {
                            $(btn).parent().find("#count-" + id).parent().find(".float").html("<span style='color: darkred; font-weight: bold'>" + float + "</span>");
                        } else if (currentFloat < currentMaxFloat) {
                            $(btn).parent().find("#count-" + id).parent().find(".float").html("<span style='color: darkblue; font-weight: bold'>" + float + "</span>");
                        } else {
                            $(btn).parent().find("#count-" + id).parent().find(".float").html(float);
                        }
                        $(btn).parent().find("#count-" + id).parent().find(".discount").html(res + "%");
                        $(btn).parent().find("#count-" + id).parent().find(".date").html(date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
                        if (res > discount) {
                            $(btn).parent().find("#count-" + id).parent().find(".discount").css({
                                "color": "green",
                                "font-weight": "bold"
                            });
                            window.open(opsUrl);
                            soundFound.volume = 1;
                            soundFound.play();
                            chromemes("Найден скин " + skinname + " в " + res + "%");
                        } else if (discount - res < 1) {
                            $(btn).parent().find("#count-" + id).parent().find(".discount").css({
                                "color": "blue",
                                "font-weight": "bold"
                            });
                        }
                        if (counter < length - 1 && status === true && method !== true) {
                            var timeer = randomInteger(600, 1600);

                            counter++;
                            $(".loaderDoplers").html(next + ' через ' + Math.round(timeer / 1000 * 100) / 100 + 'c. <i class="fa fa-spinner fa-spin" style="color:blue" aria-hidden="true"></i>');
                            checks = setTimeout(function () {
                                dopplerPrice(counter, btn);
                            }, timeer)
                        } else {
                            if (typeof Cookies.get("cycle") === "undefined") {
                                $(".doppler_check").removeAttr("disabled");
                                $(".loaderDoplers").html("Готов к работе");
                            } else {
                                if (method !== true) {
                                    counter = 0;
                                    $(".loaderDoplers").html(next + ' через ' + Math.round(timeer / 1000 * 100) / 100 + 'c. <i class="fa fa-spinner fa-spin" style="color:blue" aria-hidden="true"></i>');
                                    checks = setTimeout(function () {
                                        dopplerPrice(counter, btn);
                                    }, timeer)
                                }
                            }
                        }
                    } else {
                        newRequestForPrice(opsUrl, skinname, chprice, id, btn, counter, next, length, discount);
                    }
                }
            }
        })
    }
}

function newgetprices(start) {
    userStorage = window.localStorage;
    if (start && userStorage.getItem('skinsdbExt') !== null && $.cookie('storageTimer')) {
        console.log("loaded from storage");
        var res = jQuery.parseJSON(userStorage.getItem('skinsdbExt'));
        res = res[0];
        skinsdbprices.push(res);
        skinsdbprices = skinsdbprices[0];
        newloadallprices();
    } else {
        if (skinsdbprices.length > 0) {
            delete skinsdbprices;
            skinsdbprices = [];
        }
        userStorage.removeItem("skinsdbExt");
        var myData = new FormData();
        myData.append("newgetprices", true);
        GM_xmlhttpRequest({
            method: "POST",
            url: scriptUrl,
            data: myData,
            onload: function (result) {
                var res = jQuery.parseJSON(result.responseText);
                res = res[0];
                userStorage.setItem('skinsdbExt', result.responseText);
                var storageLife = new Date();
                storageLife.setTime(storageLife.getTime() + (60 * 1000));
                $.cookie('storageTimer', true, {expires: storageLife});
                skinsdbprices.push(res);
                skinsdbprices = skinsdbprices[0];
                if (start) {
                    newloadallprices();
                }
            }
        })
    }
}

function newloadallprices(opd) {
    if (skinsdbprices.length > 0) {
        patterns = [];
        $('.featured-item.scanned').each(function () {
            var route = $(this);
            stickersOnIt = false;
            if (route.find(".priceBtn").html() === 'Price') {
                var skinName = route.find(".market-link").html();
                var skinPrice = route.find(".item-amount").html().replace("$", "").replace(",", "");
                var unavailable = route.find(".item-add");
                if (unavailable.html()) {
                    if (opd === "opd") {
                        var skinId = route.find(".market-link").attr("href");
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
                        var skinId = route.find(".item-amount").attr('onclick');
                        skinId = skinId.split("showGraphFromId(");
                        skinId = skinId[1];
                        skinId = skinId.replace(")", "");
                    }
                }
                if (typeof route.find(".item-buttons > a").html() !== 'undefined') {
                    var inspectIdFull = route.find(".item-buttons > a").attr("href");
                    var inspectId = inspectIdFull.replace("steam://rungame/730/76561202255233023/+csgo_econ_action_preview%", "");
                }
                if (route.find(".text-muted").html() != "") {
                    var exterior = "(" + route.find(".text-muted").html() + ")";

                    var phase = route.find(".text-muted").next().html().replace(" StatTrak™", "");
                    switch (phase) {
                        case '★ Covert Knife (Ruby)' :
                            phase = " Ruby";
                            break;
                        case '★ Covert Knife (Sapphire)' :
                            phase = " Sapphire";
                            break;
                        case '★ Covert Knife (Black Pearl)' :
                            phase = " Black Pearl";
                            break;
                        case '★ Covert Knife (Emerald)' :
                            phase = " Emerald";
                            break;
                        default:
                            phase = phase.replace(/[/^\D+/()]/g, '');
                    }
                    switch (phase) {
                        case '1' :
                            phase = " Phase 1";
                            break;
                        case '2' :
                            phase = " Phase 2";
                            break;
                        case '3' :
                            phase = " Phase 3";
                            break;
                        case '4' :
                            phase = " Phase 4";
                            break;
                        case '' :
                            phase = "";
                            break;
                    }
                    if ($.cookie('changer') === "LOOT.Farm" || $.cookie('changer') === "TradeIt.gg") {
                        phase = "";
                    }
                    skinName = skinName.trim() + phase + " " + exterior;
                } else {
                    skinName = skinName.trim();
                }
                if (typeof route.find(".op-stickers-bottom").html() !== 'undefined') {
                    stickersOnIt = "op-stickers-bottom";
                } else if (typeof route.find(".op-stickers").html() !== 'undefined') {
                    stickersOnIt = "op-stickers";
                }
                // console.log(skinName);
                var loaded = $.grep(skinsdbprices, function (e) {
                    return e.skinname == skinName;
                });
                if (typeof loaded[0] !== 'undefined') {
                    if ($.cookie("savedDisc")) {
                        savedDiscount = $.cookie("savedDisc");
                    }
                    if ($.cookie("changer") === "Opskins AVG") {
                        var comission = 0.95;
                    } else {
                        var comission = 0.97;
                    }
                    var resom = 100 - (skinPrice * 100) / (loaded[0].price * comission);
                    var res1 = Math.round(resom * 100) / 100;
                    var dif = savedDiscount - res1;
                    var overpayThis = false;
                    var overpayVal = 0;
                    var currBoxWear = $(this).find(".wear-value small");
                    if (typeof currBoxWear.html() != 'undefined') {
                        var skinfloat = parseFloat(currBoxWear.html().replace("Wear: ", "").replace("%", ""));
                    }
                    if (loaded[0]['overpay'][0] !== "no" && typeof currBoxWear.html() !== 'undefined') {

                        var closestFloat = null;
                        var goal = parseFloat(currBoxWear.html().replace("Wear: ", "").replace("%", ""));
                        var currentFloat = goal;
                        var max = 0;
                        $.each(loaded[0].overpay, function (a, b) {
                            if (loaded[0]['overpay'][a]['reason'] === 'float') {
                                $.each(b, function (c, d) {
                                    if (c == "skinfloat") {
                                        if (d > max) {
                                            max = d;
                                        }
                                        if (closestFloat == null || Math.abs(d - goal) < Math.abs(closestFloat - goal)) {
                                            closestFloat = d;
                                            overpayByFloat = loaded[0]['overpay'][a]['overpay'];
                                            overpayCloseDate = loaded[0]['overpay'][a]['overpay_date'];
                                            overpayCloseFloat = loaded[0]['overpay'][a]['skinfloat'];
                                        }
                                    }
                                })
                            }
                        })

                        if (currentFloat < max) {
                            // route.prepend("<div style='position: absolute;top: 49%; left: 3%;background: rgba(0, 0, 0, 0.37); padding: 3px 2px;color: #d9d9d9;z-index: 99;'>Closest float: "+overpayCloseFloat+" from "+overpayCloseDate+"</div>")
                            overpayThis = true;
                            currBoxWear.css({
                                "color": "yellow",
                                "font-weight": "bold",
                                "font-size": "100%",
                                "cursor": "pointer"
                            });
                            var curChangerPrice = parseFloat(overpayByFloat) + parseFloat(loaded[0].price);
                            var overpayCounter = 100 - (skinPrice * 100) / (curChangerPrice * 0.97);
                            var overpayVal = Math.round(overpayCounter * 100) / 100;
                            $(this).css("border", "10px solid grey");
                            currBoxWear.attr("href", "#");
                            currBoxWear.attr("data-toggle", "modal");
                            currBoxWear.attr("data-target", "#skinsDbSales");
                            currBoxWear.attr("overpayByFloat", overpayByFloat);
                            currBoxWear.addClass("overpayByFloat");
                            currBoxWear.on("click", function () {
                                $("#skinsDbSales .modal-body").html("Подожди");
                                data = [loaded[0].overpay];
                                var opsPrice = skinPrice;
                                var moneyPrice = loaded[0].price;
                                makeTable($("#skinsDbSales .modal-body"), data, closestFloat, moneyPrice, opsPrice);
                                setTimeout(function () {
                                    var rowpos = $("#skinsDbSales .modal-body").find("tr.Selected").position();
                                    $("#skinsDbSales").scrollTop(rowpos.top);

                                    $(".calculateOverp").unbind().on("click", function () {
                                        var csm = $(this).attr("money-price");
                                        var ops = $(this).attr("ops-price");
                                        var currOverpay = $(this).closest("tr").find("td.overpay").text();
                                        var currentZaliv = Math.round((parseFloat(currOverpay) + parseFloat(csm)) * 0.97 * 100) / 100;
                                        console.log(currentZaliv);
                                        var result = Math.round((100 - ops * 100 / currentZaliv) * 100) / 100;
                                        alert("По текущим данным залив составит: " + result + "%. Цена залива: " + currentZaliv + "$");
                                    })
                                }, 1000);
                            })
                        }
                    }
                    if (res1 >= savedDiscount || overpayThis == true && overpayVal >= savedDiscount) {
                        if (loaded[0].actual === 'fine') {
                            if (typeof $(this).find(".buyers-club-icon").html() === 'undefined' && dif < -1 && skinPrice > 5) {
                                $(this).css("border", "10px solid #8500ff");
                            } else if (typeof $(this).find(".buyers-club-icon").html() !== 'undefined' && dif < -1 && skinPrice > 100) {
                                $(this).css("border", "10px solid darkred");
                            } else {
                                $(this).css("border", "10px solid green");
                            }
                            $(this).attr('id', skinId);
                            skin = [];
                            skin['skinid'] = skinId;
                            skin['skinlink'] = "#" + skinId;
                            skin['skindisc'] = res1;
                            skin['skinname'] = $(this).find(".market-link").text()
                            skin['skinprice'] = parseInt(Number($(this).find(".item-amount").text().replace("$", "").replace(",", "")) * 100);
                            skinsLoaded.push(skin);
                            $("#ThatisDisc").html(skinsLoaded.length);
                            $("#ThatisDisc").attr("href", skinsLoaded[0]['skinlink']);
                            if ($("#ThatisDisc").css('display') === 'none') {
                                $("#ThatisDisc").show();
                            }
                        } else if (loaded[0].actual === 'bad') {
                            $(this).css("border", "10px solid orange");
                        }
                    } else {
                        if (dif > 0 && dif <= 1) {
                            if (loaded[0].actual === 'fine') {
                                $(this).css("border", "10px solid darkblue");
                            }
                        }
                    }
                    if (stickersOnIt) {
                        route.find("." + stickersOnIt).attr("style", "top: -44px;");
                        route.find("." + stickersOnIt + " > div").attr("style", "display: inline;")
                        route.find("." + stickersOnIt + " > div").append("<ul class='stickerPrices' style='list-style-type: none; padding-left: 0px'></ul>");
                        route.find("." + stickersOnIt + " > div").children("img").each(function () {
                            var stickerName = "Sticker | " + $(this).attr("title");
                            stickerName = stickerName.substring(0, stickerName.indexOf('Wear')).trim();
                            var stickerInfo = $.grep(skinsdbprices, function (e) {
                                return e.skinname == stickerName;
                            });
                            if (typeof stickerInfo[0] !== 'undefined') {
                                $(this).siblings(".stickerPrices").append("<li style='display: inline-block; margin-left: 10px;'>" + stickerInfo[0].price + "$</li>")
                            }
                        })
                    }
                    if ($.cookie("changer") == "CS.Money") {
                        route.prepend(overstockChecker(skinName));
                    }
                    if (typeof route.find(".fa.fa-user").html() !== 'undefined') {
                        route.prepend(changeOpsPrice(skinId));
                    }
                    if (typeof route.find(".item-buttons > a").html() !== 'undefined') {
                        inspectExt(this, skinId, inspectId);
                        inspectPaternId(this, skinId, inspectIdFull);

                        if (pattern_check && typeof route.find(".ext_pattern").html() === 'undefined') {
                            route.find(".item-amount").after("<span class='ext_pattern' style='font-size: 0.85em'></span>");
                            var pattern_this = [];
                            pattern_this['item'] = this;
                            pattern_this['inspectId'] = inspectId;
                            pattern_this['skinName'] = skinName;
                            pattern_this['csmoney'] = loaded[0].price;
                            pattern_this['skinPrice'] = skinPrice;
                            pattern_this['skinfloat'] = skinfloat;

                            patterns.push(pattern_this);
                        }
                    }
                    // console.log(loaded[0]);
                    route.prepend("<div class='skinDBupd' style='position: absolute;top: 28%;left: 3%; background: rgba(0, 0, 0, 0.37); padding: 3px 2px;color: #d9d9d9;' skin-id='" + skinId + "'>" + loaded[0].dataupd + "<span class='changer_price' style='color: #d69909; font-weight: bold;'> (" + loaded[0].price + "$)" + (loaded[0].counter ? " - " + loaded[0].counter + " шт." : "") + "</span></div>");
                    if (isFinite(res1)) {
                        if (overpayThis) {
                            route.find(".priceBtn").html("<span class='realOpsmo'>" + overpayVal + "</span>% | " + res1 + "%");
                        } else {
                            route.find(".priceBtn").html("<span class='realOpsmo'>" + res1 + "</span>%");
                        }
                    }
                } else {
                    route.find(".priceBtn").html("Not Found");
                }
            }
        })
        if (pattern_check && patterns.length > 0) {
            ext_pattern(patterns, 0);
        }
    }

    function ext_pattern(array, counter) {

        var item = array[counter]['item'];
        var inspectId = array[counter]['inspectId'];
        var skin = array[counter]['skinName'];
        var money = array[counter]['csmoney'];
        var ops = array[counter]['skinPrice'];
        var float = array[counter]['skinfloat'];

        if ($(item).find(".ext_pattern").html() === '') {
            var inspectLink = "https://api.csgofloat.com:1738/?s="; //?m=563330426657599553&a=6710760926&d=9406593057029549017"
            var s = inspectId.substring(inspectId.indexOf('%20S') + 4);
            s = s.substring(0, s.indexOf('A'));
            var a = inspectId.substring(inspectId.indexOf('A') + 1);
            a = a.substring(0, a.indexOf("D"));
            var d = inspectId.substring(inspectId.indexOf('D') + 1);
            inspectLink += s + "&a=" + a + "&d=" + d;
            GM_xmlhttpRequest({
                method: 'GET',
                url: inspectLink,
                onload: function (result) {
                    var check = IsJsonString(result.responseText);
                    if (check) {
                        var info = JSON.parse(result.responseText);
                        if (info.iteminfo) {
                            $(item).find(".ext_pattern").text(" Pattern ID: " + info.iteminfo.paintseed);
                            var findSkin = $.grep(skinsdbprices, function (e) {
                                return e.skinname == skin;
                            });
                            if (findSkin[0]) {
                                var findPattern = $.grep(findSkin[0]['overpay'], function (e) {
                                    if (e.reason == 'pattern' && e.pattern_id == info.iteminfo.paintseed) {
                                        return e;
                                    }
                                })
                                if (findPattern.length > 0) {
                                    var closestFloat = null;
                                    var currentFloat = float;
                                    var max = 0;
                                    var itemInfo = findPattern.length - 1;

                                    $.each(findPattern, function (a, b) {
                                        $.each(b, function (c, d) {
                                            if (c == "skinfloat") {
                                                if (d > max) {
                                                    max = d;
                                                }
                                                if (closestFloat == null || Math.abs(d - currentFloat) < Math.abs(closestFloat - currentFloat)) {
                                                    closestFloat = d;
                                                    itemInfo = a;
                                                }
                                            }
                                        })
                                    })

                                    var itemOverpay = Number(findPattern[itemInfo]['overpay']);
                                    console.log(findPattern);
                                    if ($(item).find(".overpayByFloat").attr("overpayByFloat")) {
                                        itemOverpay += Number($(item).find(".overpayByFloat").attr("overpayByFloat"));
                                        itemOverpay = Math.round(itemOverpay * 100) / 100;
                                    }
                                    var onChange = (Number(money) + itemOverpay) * 0.97;
                                    onChange = Math.round(onChange * 100) / 100;
                                    var resom = 100 - (Number(ops) * 100) / onChange;
                                    var res1 = Math.round(resom * 100) / 100;
                                    var currentDisc = $(item).find(".priceBtn").text();
                                    $(item).find(".priceBtn").html("<span class='realOpsmo'>" + res1 + "</span>% | " + currentDisc);
                                    if (res1 >= savedDiscount) {
                                        var skinId = $(item).find(".skinDBupd").attr("skin-id");
                                        skin = [];
                                        skin['skinlink'] = "#" + skinId;
                                        skinsLoaded.push(skin);
                                        $("#ThatisDisc").html(skinsLoaded.length);
                                        $("#ThatisDisc").attr("href", skinsLoaded[0]['skinlink']);
                                        if ($("#ThatisDisc").css('display') === 'none') {
                                            $("#ThatisDisc").show();
                                        }
                                        $(item).find(".ext_pattern").closest(".scanned").css("border", "10px dashed green");
                                    } else {
                                        $(item).find(".ext_pattern").closest(".scanned").css("border", "10px dashed grey");
                                    }
                                    $(item).find(".ext_pattern").attr("pattern-overpay", findPattern[itemInfo]['overpay']);
                                    $(item).find(".ext_pattern").attr("pattern-overpays", JSON.stringify(findPattern));
                                    $(item).find(".ext_pattern").attr("full-overpay", itemOverpay);
                                    $(item).find(".ext_pattern").attr("money-price", money);
                                    $(item).find(".ext_pattern").attr("ops-price", ops);
                                    $(item).find(".ext_pattern").attr("overpay-upd", findPattern[itemInfo]['overpay_date']);
                                    $(item).find(".ext_pattern").attr("overpay-float", closestFloat);

                                    $(item).find(".ext_pattern").css({
                                        "cursor": "pointer",
                                        "color": "orange"
                                    });
                                    console.log(findPattern[itemInfo]);
                                }
                                counter++;
                                if (counter < array.length) {
                                    ext_pattern(array, counter);
                                } else {
                                    showlogs("Паттерны прогружены!");
                                }
                            } else {
                                ext_pattern(array, counter);
                            }
                        } else {
                            console.log(info);
                            if (counter < array.length) {
                                ext_pattern(array, counter);
                            }
                        }
                    }
                },
                onerror: function (res) {
                    sendAlert("danger", "Ошибка запроса");
                    console.log(res.responseText);
                }
            })
        }
    }

    function inspectExt(item, id, inspectId) {
        $(item).find(".item-buttons > a:first").addClass("oldInspect");
        $(item).find(".oldInspect").before("<button class='btn btn-primary inspectExt' skin-id='" + id + "' inspect-id='" + inspectId + "'>IS</button>");
        $(item).find(".oldInspect").remove();
    }

    function inspectPaternId(item, id, inspectId) {
        $(item).find(".inspectExt").after("<button class='btn btn-primary inspectPatternId' skin-id='" + id + "' inspect-id='" + inspectId + "'>PI</button>");
    }

    function makeTable(container, data, closestFloat, money, ops) {
        var table = $("<table border='1px' width='100%' style='font-size: 20px'></table>").addClass('CSSTableGenerator');
        table.append("<thead></thead>");
        table.find("thead").prepend("<tr><th>Переплата</th><th>Флоат</th><th>Дата</th><th>Причина</th><th>Патерн ID</th><th></th></tr>");
        $.each(data, function (a, b) {
            $.each(b, function (rowIndex, r) {
                var row = $("<tr id='" + rowIndex + "'></tr>");
                $.each(r, function (colIndex, c) {
                    if (c == closestFloat) {
                        row.css({
                            "color": "darkred",
                            "font-weight": "bold",
                            "font-size": "24px"
                        });
                        row.closest("tr").addClass("Selected");
                        // row.append($("<td style='color: darkred; font-weight: bold; font-size: 24px'>").text(c));
                    }
                    row.append($("<td class='" + colIndex + "'>").text(c));
                });
                row.append("<button class='btn btn-warning calculateOverp' style='width: 100%; margin: 4px 0;' money-price='" + money + "' ops-price='" + ops + "'>Посчитать</button>")
                table.append(row);
            });
        })
        tbody = table.find('tbody');

        tbody.find('tr').sort(function (a, b) {
            return $('td.skinfloat', a).text().localeCompare($('td.skinfloat', b).text());
        }).appendTo(tbody);
        return container.append(table);
    }

    function changeOpsPrice(saleid) {
        var htmlres = '<button class="changeOpsPrice" saleid="' + saleid + '" style="border:0;cursor: pointer; background-color: rgba(222, 4, 4, 0.62); font-size: 94%; z-index: 99;position:absolute;top: 127px;right: 13px;outline: none;">Изменить цену</button>';
        return htmlres;
    }

    function overstockChecker(skin) {

        var htmlres = '<button class="overstockChecker" skin="' + skin + '" style="border:0;cursor: pointer; background-color: rgba(24, 113, 206, 0.62); font-size: 94%; z-index: 99;position:absolute;top: 127px;left: 13px;outline: none;">Проверить</button>';
        return htmlres;
    }

    $(".inspectExt").unbind().on("click", function () {
        var url = "https://metjm.net/csgo/#" + $(this).attr("inspect-id");
        window.open(url);
    })
    $(".inspectPatternId").unbind().on("click", function () {
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://cs.money/inspect_skin?inspect_link=" + $(this).attr("inspect-id"),
            onload: function (result) {
                var check = IsJsonString(result.responseText);
                if (check) {
                    var info = JSON.parse(result.responseText);
                    console.log(result.responseText);
                    sendAlert("success", "Pattern Index: " + info.paintseed);
                } else if (check == false && result.responseText.indexOf("DDoS protection by Cloudflare") > -1) {
                    window.open("https://cs.money/");
                    sendAlert("warning", "Ошибка CloudFlare");
                } else {
                    sendAlert("warning", "Ошибка сайта");
                }
            },
            onerror: function (res) {
                sendAlert("danger", "Ошибка запроса");
                console.log(res.responseText);

            }
        })
    })
    $(".ext_pattern").unbind().on("click", function () {
        if ($(this).attr("pattern-overpay")) {
            var onChange = (Number($(this).attr("money-price")) + Number($(this).attr("full-overpay"))) * 0.97;
            onChange = Math.round(onChange * 100) / 100;
            var resom = 100 - (Number($(this).attr("ops-price")) * 100) / onChange;
            var res1 = Math.round(resom * 100) / 100;
            var outputOverpay = Number($(this).attr("full-overpay")) + "$ (" + Number($(this).attr("pattern-overpay")) + "$)";
            if (Number($(this).attr("full-overpay")) === Number($(this).attr("pattern-overpay"))) {
                outputOverpay = Number($(this).attr("full-overpay")) + "$";
            }
            sendAlert("success", "Оверпей: " + outputOverpay + " Залив: " + onChange + "$ Выгода: " + res1 + "% <small style='text-decoration: underline; cursor: pointer;' onclick='alert(" + JSON.stringify($(this).attr("pattern-overpays")) + ")'>[ Ближайший флоат:  " + $(this).attr("overpay-float") + " (" + $(this).attr("overpay-upd") + ")]</small>");
        }
    })
    $(".changeOpsPrice").unbind().on("click", function () {
        var saleid = $(this).attr('saleid');
        var apikey = $.cookie("apikey");
        var lowestPrice = Number($("body").find(".scanned .item-amount").html().replace("$", "").replace(",", ""));
        var myPrice = Number($(this).closest(".scanned").find(".item-amount").html().replace("$", "").replace(",", ""));
        myPrice = parseInt(Math.round(myPrice * 100))
        var myNewPrice = lowestPrice - 0.01;
        var answer = Number(prompt("Изменить цену?", Math.round(myNewPrice * 100) / 100).replace(",", "."));
        answer = parseInt(Math.round(answer * 100));
        var outputAnsw = answer / 100;
        var changedDif = 0;
        var accept = false;
        if (isNaN(answer) || answer == false) {
            sendAlert("warning", "Отмена!");
            return false;
        }
        changedDif = 100 - (answer * 100 / myPrice);
        if (changedDif > 5 || changedDif < -5) {
            sendAlert("warning", "Слишком большая разница. Я не буду этого делать!");
            return false;
        } else {
            accept = confirm("Изменить цену на " + outputAnsw + "$");
        }
        if (accept) {
            console.log(answer);
            $.post("https://api.opskins.com/ISales/EditPrice/v1/", {
                "saleid": saleid,
                "price": answer,
                "key": apikey
            }).done(function (res) {
                if (res['status'] === 1) {
                    sendAlert("success", "Изменено!" + mark);
                    setTimeout(function () {
                        location.reload();
                    }, 1500)
                } else {
                    sendAlert("danger", res['message'] + mark); // 2012 - no changeed
                }
            })
        } else {
            sendAlert("warning", "Отмена!" + mark);
        }
    })
    $("#socketChecker").unbind().on("click", function () {
        var socketExt = io.connect("http://212.8.247.201:3000");
        socketExt.emit("user-api-key", $.cookie("apikey"));
    })
    $(".overstockChecker").unbind().on("click", function () {
        var currentBtn = this;
        $(currentBtn).html("Проверка..");
        var skinname = $(currentBtn).attr("skin");
        console.log(skinname);
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://cs.money/check_skin_status?market_hash_name=" + encodeURI(skinname),
            onload: function (result) {
                $(currentBtn).css("background-color", "rgba(24, 113, 206, 0.62)");
                var check = IsJsonString(result.responseText);
                if (check) {
                    var res = jQuery.parseJSON(result.responseText);

                    if (res.type === "Overstock") {
                        $(currentBtn).css("background-color", "red");
                        $(currentBtn).html("Оверсток. Лимит: " + res.overstock_difference);
                    } else if (res.type === "Tradable") {
                        $(currentBtn).css("background-color", "green");
                        $(currentBtn).html("Рабочий. Лимит: " + res.overstock_difference);
                    } else {
                        $(currentBtn).css("background-color", "red");
                        $(currentBtn).html("Не рабочий!");
                    }
                } else if (check == false && result.responseText.indexOf("DDoS protection by Cloudflare") > -1) {
                    window.open("https://cs.money/");
                    $(currentBtn).html("Ошибка CloudFlare");
                } else {
                    $(currentBtn).html("Ошибка сайта");
                }
            },
            onerror: function (res) {
                $(currentBtn).html("Ошибка запроса");
                console.log(res.responseText);

                // var msg = "An error occurred."
                //     + "\nresponseText: " + res.responseText
                //     + "\nreadyState: " + res.readyState
                //     + "\nresponseHeaders: " + res.responseHeaders
                //     + "\nstatus: " + res.status
                //     + "\nstatusText: " + res.statusText
                //     + "\nfinalUrl: " + res.finalUrl;
                // alert(msg);
            }
        })
    })
}

function loadallprices() {
    $("body").append("<a id='ThatisDisc' style='position:fixed; display: none; right: 6%; bottom: 6%; padding: 20px 26px; border: 3px solid transparent; background: green; border-radius:60%; font-size: 26px;z-index: 999999; color: #fff; cursor: pointer;'>" + skinsLoaded.length + "</a>");
    if (pattern_check) {
        $("body").find(".weapon-nav .nav-pills").append("<li><a class='patterns_go' style='cursor: pointer; color: lightgreen;'>Pattern Index ON</a></li>")
    } else {
        $("body").find(".weapon-nav .nav-pills").append("<li><a class='patterns_go' style='cursor: pointer; color: lightblue;'>Pattern Index</a></li>")
    }
    newgetprices(true);
    setInterval(function () {
        newgetprices();
        showlogs("Цены обновлены" + mark);
    }, 60000)
    $(document).ajaxComplete(function () {
        newloadallprices();
    });
    $(".patterns_go").on("click", function () {
        var paternCheckerLife = new Date();
        paternCheckerLife.setTime(paternCheckerLife.getTime() + (60 * 1000));
        pattern_check = true;
        $.cookie("pattern_check_cookie", true, {expires: paternCheckerLife, path: location.href});
        $(this).css("color", "lightgreen");
        $(this).text("Pattern Index ON");
    })
    $("#ThatisDisc").on("click", function () {
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

function settingsMenu() {
    $(".nav.navbar-nav").append("<li class='menu'><a href='#' id='skinsdbfix'>Фикс цен/авторизации</a></li>");
    $(".nav.navbar-nav").append("<li class='menu'><a href='#' class='skinsdbset' data-toggle='modal' data-target='#skinsDb'>Настройки" + mark + "</a></li>");
    // $(".user-info .sub-menu").children("a[href$='/?loc=store_account#manageSales']").after("<a href='http://skinsdb.xyz/?mySales' target='_blank'>Мои продажи"+mark+"</a>");

    if ($.cookie("savedDisc")) {
        savedDiscount = $.cookie("savedDisc");
    } else {
        $.removeCookie("user-auth");
        sendAlert("danger", "Произошла ошибка авторизации расширения " + mark + ", перезагрузка!");
        setTimeout(function () {
            location.reload();
        }, 2000)
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
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
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
    $("#autobuy").on("change", function () {
        if (this.checked) {
            $.cookie("autobuy", "true");
        } else {
            $.removeCookie("autobuy");
        }
    })
    $("#discValues").keyup(function () {
        if (event.keyCode == 13) {
            saveDiscount($("#discValues").val());
        }
    })
    $("#saveDisc").on("click", function () {
        saveDiscount($("#discValues").val());
    })
    $("#skinsdbfix").on("click", function () {
        $.removeCookie("storageTimer");
        $.removeCookie("user-auth");
        location.reload();
    })
    $("#savDisc").on("click", function () {
        if (site.indexOf("https://opskins.com/index.php?loc=game&type=3&market_name=") > -1 || site.indexOf("https://opskins.com/?loc=game") > -1 ) {
            sortUsingNestedText($(".panel-body .row"), "div.scanned", ".priceBtn .realOpsmo");
        } else {
            sortUsingNestedText($("#scroll"), "div.scanned", ".priceBtn .realOpsmo");
        }
        $("html").animate({
            scrollTop: 0
        }, 'fast');
    })
    $(document).keypress(function (event) {
        // console.log(event.keyCode);
        if (event.keyCode == 115 || event.keyCode == 92 || event.keyCode == 1110 || event.keyCode == 1099) {  // S и ]
            if (site.indexOf("https://opskins.com/index.php?loc=game&type=3&market_name=") > -1) {
                sortUsingNestedText($(".panel-body .row"), "div.scanned", ".priceBtn .realOpsmo");
            } else if (site.indexOf("https://opskins.com/?loc=game") > -1){
                sortUsingNestedText($("body"), "div.scanned", ".priceBtn .realOpsmo");
            }else {
                sortUsingNestedText($("#scroll"), "div.scanned", ".priceBtn .realOpsmo");
                console.log("in sort function");
            }
            $("html").animate({
                scrollTop: 0
            }, 'fast');
        }
    })
}

function saveDiscount(discount) {
    var myData = new FormData();
    myData.append("user_discount", discount);
    GM_xmlhttpRequest({
        method: 'POST',
        url: scriptUrl,
        data: myData,
        onload: function (result) {
            var res = jQuery.parseJSON(result.responseText);
            if (res['succces']) {
                var userAuthLife = new Date();
                userAuthLife.setTime(userAuthLife.getTime() + (600 * 1000));
                $.cookie("savedDisc", discount, {expires: userAuthLife});
                $("#savDisc").html(discount);
                showlogs("Сохранено!");
            }
        }
    })
}

function autoWithdraw() {
    $(".btn-primary:contains('Select None')").after("<button class='btn btn-primary autowithdraw' style='margin-left: 10px;'>Авто-вывод" + mark + "</button>");

    $(".autowithdraw").on("click", function () {
        $(this).html("Сбор информации.." + mark);
        $.get("https://api.opskins.com/IInventory/GetInventory/v1/?key=" + $.cookie("apikey")).done(function (res) {
            if (res['status'] === 1) {
                $(".autowithdraw").html("Собираю офферы.." + mark);
                var skins = res['response']['items'];
                var skinForOut = [];
                var partsForOut = [];
                var i, n, z = 0, h, p;
                if (skins.length === 0) {
                    $(".autowithdraw").html("Скинов нет!" + mark);
                } else {

                    function openoffers(items, element, i) {

                        $.post("https://api.opskins.com/IInventory/Withdraw/v1/", {
                            key: $.cookie("apikey"),
                            items: items
                        }).done(function (res) {
                            if (typeof res['message'] !== "undefined") {
                                chromemes(res['message']);
                            }
                            var tradeoffers = res['response']['offers'];
                            $.each(tradeoffers, function (i, lvl) {
                                if (lvl['tradeoffer_id'] !== null) {
                                    var win = window.open("https://steamcommunity.com/tradeoffer/" + lvl['tradeoffer_id'] + "/", "_blank");
                                    self.focus();

                                }
                            })
                            $(element).html("Готово!" + mark);
                        }).fail(function (res) {
                            console.log(res);
                            $(element).html("Я обкакался, заберай сам(");
                            showlogs("Пачка " + i + " зафейлилась!");
                        })
                    }

                    for (i = 0; i < skins.length; i++) {
                        if (skins[i]['offer_id'] !== null) {
                            n++;
                        }
                        if (skins[i]['can_repair'] == null && skins[i]['offer_id'] == null) {
                            skinForOut.push(skins[i]['id']);
                            z++;
                        }
                    }
                    console.log(skinForOut);
                    if (n !== skins.length - 1 && z !== 0) {
                        var maxPart = 15;
                        var startMaxPart = maxPart;
                        var colParts = Math.ceil(skinForOut.length / maxPart);
                        if (skinForOut.length > maxPart) {
                            p = 0;
                            var part = [];
                            for (h = 0; h < skinForOut.length; h++) {
                                part.push(skinForOut[h]);
                                partsForOut[p] = part;
                                if (h === maxPart - 1) {
                                    p++;
                                    maxPart = maxPart + startMaxPart;
                                    part = [];
                                }
                            }
                            console.log(partsForOut);
                            $("body").prepend("<div style='z-index: 999; width: 100%;height: 100%;position:absolute;background-color: rgba(0, 0, 0, 0.74);text-align: center;'><ul class='btnslist' style='margin: 8% auto; list-style-type: none;'><h3>Вскрой каждого из нас!</h3></ul></div>");
                            for (i = 0; i < partsForOut.length; i++) {
                                $(".btnslist").append("<li><a class='btn btn-primary btn-lg offersBtn' items='" + partsForOut[i] + "' id='" + i + "'>Пачка №" + (i + 1) + "</a></li>");
                            }
                            $(".offersBtn").on("click", function () {
                                $(this).html("Готовлю офферы!");
                                openoffers($(this).attr("items"), this, $(this).attr("id"));
                            });
                        } else {
                            openoffers(skinForOut.join(), ".autowithdraw");
                        }
                    } else {
                        $(".autowithdraw").html("Ошибка!" + mark)
                    }
                }
            } else {
                $(".autowithdraw").html("Ошибка!" + mark);
            }
        })
    })
}


function csmobot() {
    setInterval(getLink, 2000);

    csmocounters();

    $(".block_items.hint_aim_4.hint_clickable .hint_aim_6").append("<div style='width: 100%; text-align: center;'><button class='btn' id='csmbtns' style='padding: 4px 8px; margin: 10px 0;border: 10x solid transparent;border-radius:20px;outline: none;'>Отобразить кнопки</button></div><div class='csmbtns hidden' style='margin: 10px 0 20px;overflow: hidden;width: 100%;border-top:2px dashed #ff010147;padding: 20px;'><button id='scannerdb' class='btn btn-primary' style='float: right; margin-right: 32px; padding: 8px 4px;'>Сканер " + mark + "</button></div>");
    // $("#scannerdb").before("<div class='btn btn-warning checkout-btn' id='favSkinView' style='margin-left: 32px; padding: 8px 4px;'>Избранные" + mark + "</div>");
    $("#scannerdb").after("<button id='sortbyopsmo' class='btn btn-danger' style='float: right; margin-right: 32px;padding: 8px 4px;'>Opskins -> CS.Money</button></div>");
    $("#sortbyopsmo").after("<button id='sortbymoops' class='btn btn-success' style='float: right; margin-right: 32px;padding: 8px 4px;'>CS.Money -> Opskins</button></div>");
    $(".block_bottom .block_header").css("flex-wrap", "wrap");
    $("#sortbymoops").on("click", function () {
        sortUsingNestedText($('#inventory_bot'), "div.item", "div.parse_done .moopsval");
        $(".offer_container_inventory_steam").animate({
            scrollTop: 0
        }, 'fast');
    })
    $("#sortbyopsmo").on("click", function () {
        sortUsingNestedText($('#inventory_bot'), "div.item", "div.parse_done .opsmoval");
        $(".offer_container_inventory_steam").animate({
            scrollTop: 0
        }, 'fast');
    })
    // $("#favSkinView").on("click", function () {
    //     if (favSkins.length > 0) {
    //         var favSkinsViewer = [];
    //         var hash = Date.parse(new Date());
    //         var url = "https://cs.money/load_bots_inventory?hash="+hash;
    //         $.get(url).done(function (result) {
    //             res = jQuery.parseJSON(result);
    //             var i;
    //             for (i = 0; i < favSkins.length; i++) {
    //                 $.each(res, function (items, value) {
    //                     var skinname = "";
    //                     switch (value['e']) {
    //                         case 'FN' :
    //                             skinname = value['m'] + " (Factory New)";
    //                             break;
    //                         case 'MW' :
    //                             skinname = value['m'] + " (Minimal Wear)";
    //                             break;
    //                         case 'FT' :
    //                             skinname = value['m'] + " (Field-Tested)";
    //                             break;
    //                         case 'WW' :
    //                             skinname = value['m'] + " (Well-Worn)";
    //                             break;
    //                         case 'BS' :
    //                             skinname = value['m'] + " (Battle-Scarred)";
    //                             break;
    //                         default :
    //                             skinname = value['m'];
    //                             break;
    //                     }
    //                     if(skinname === favSkins[i]){
    //                         favSkinsViewer.push(value);
    //                     }
    //                 })
    //             }
    //             console.log(favSkinsViewer);
    //             if (favSkinsViewer.length > 0) {
    //                 $("#inventory_bot").children(".item").remove();
    //                 var n;
    //                 for (n = 0; n < favSkinsViewer.length; n++) {
    //                     $("#inventory_bot").append('<div class="item"  hash="' + favSkinsViewer[n]['m'] + '" cost="' + favSkinsViewer[n]['p'] + '" id="' + favSkinsViewer[n]['id'] + '" style="position: relative">' +
    //                         '<div class="im" style="background-image: url(https://pic.money/'+favSkinsViewer[n]['u']+'_s.jpg?v=13)"></div>' +
    //                         '<div class="r">'+favSkinsViewer[n]['e']+'</div>' +
    //                         '<div class="f"><span>x</span>'+favSkinsViewer[n]['f'].length+'</div>' +
    //                         '<div class="p"><span>$ </span>'+favSkinsViewer[n]['p']+'</div>' +
    //                         '<div class="favourite-skin hidden"></div>' +
    //                         '<div class="ws"></div>'
    //                     );
    //                     if(favSkinsViewer[n]['f'].length > 1){
    //                         $(".item .ws").append('<div class="ws"><span class="cr">+</span></div>');
    //                     }
    //                     if (favSkinsViewer[n]['m'].indexOf("StatTrak™") > -1) {
    //                         $(".item").append('<img class="st" src="/images/stattrak-small.svg">');
    //                     }
    //                     $(".item").each(function () {
    //                         if (!$(this).children("favourite-skin")) {
    //                             $(this).remove();
    //                         }
    //                     })
    //                     $(".popover.fade.bottom.in").remove();
    //                 }
    //             } else {
    //                 $(this).html("Избранных cейчас нет!" + mark);
    //                 showlogs("Избранных cейчас нет!" + mark);
    //             }
    //         });
    //         // <div market_hash_name=" StatTrak™ Karambit | Gamma Doppler Emerald (Factory New)" cost="5278" id="1090937021476561198315968061" class="offer_container_invertory" bot_steamid="76561198315968061" assetid="10909370214" data-original-title="" title="" style="background-color: rgba(39, 179, 22, 0.35);"><div class="parse_button parse_event" style="position:absolute;left:3%; bottom: 29%;z-index: 999;width: 22px; color: #fff;"><img class="opsprice" src="https://skinsdb.xyz/design/images/opskins_logo.png" alt="opsprice" style="width: 100%; height: auto;"></div><div class="favourite rem_favourite" title="Удалить из избранного" style="cursor: pointer; position: absolute; color: rgba(255, 255, 255, 0.97); width: 18px; height: 16px; background-color: rgba(208, 22, 22, 0.6); margin-top: -14px; margin-left: -8px; z-index: 999; bottom: 2px;">X</div><a class="link_button" href="https://opskins.com/?loc=shop_search&amp;app=730_2&amp;search_item=%E2%98%85%20%20Karambit%20%7C%20Gamma%20Doppler&amp;sort=lh&amp;exterior=fn&amp;stat=1&amp;phase=ge" target="_blank" style="background:rgba(0, 0, 0, 0.32); position:absolute;z-index: 999; right: 0; top: 22%;padding: 1px 10px; color: #fff; font-size:14px; line-height: 20px; font-family: Helvetica;">Link</a><img src="img/st.png" class="st"><div class="invertory_container_links"> <a title="view on marketplace" href="https://steamcommunity.com/market/listings/730/ StatTrak™ Karambit | Gamma Doppler Emerald (Factory New)" class="invertory_link_view" target="_blank">VIEW</a> <a title="inspect in steam" href="steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198315968061A10909370214D4964839033136993975" class="invertory_link">INSPECT</a> </div><div class="offer_container_invertory_inactive"></div><div class="invertory_title_container"> <div class="invertory_title_text_quantity"> x<span class="count_in_stack">1</span> </div> <div class="invertory_title_container_marka">FN</div> </div> <img alt=" StatTrak™ Karambit | Gamma Doppler Emerald (Factory New)" src="https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20kvrxIbrdklRc6ddzhuzI74nxt1i9rBsofT-ld9LDJgVsY1nX-QLtlejqg5bu7Zydm3Q1uSVzsXmOmUe3ghFKauBxxavJdWR7Gog/96x72" class="offer_container_img"> <div class="price_animation"></div> <div class="price">5278$</div> </div>
    //     }
    //     else {
    //         $(this).html("Добавь хоть один скин!" + mark);
    //         showlogs("Добавь хоть один скин!" + mark);
    //     }
    // })
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
                    var loaded = _.find(skinsLoaded, function (i) {
                        return i.fullname === index;
                    });
                    if (typeof loaded === 'undefined') {
                        var skin = {};
                        skin['fullname'] = index;
                        var price = item['price'] / 100;
                        skin['opsprice'] = price;
                        skinsLoaded.push(skin);
                    }
                })
                $(".parse_button").remove();
                getLink();
            },
            onerror: function (res) {
                $("#scannerdb").html("Ошибка" + mark);
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

function getLink() {
    $(".items").children().each(function () {
        if (typeof $(this).children(".parse_button").html() === 'undefined' && $(this).hasClass("item")) {

            $(this).css("position", "relative");

            var name, phase, ext, stat;
            var phase = "";
            var type = "";
            stat = (typeof $(this).children(".st").html() !== 'undefined') ? 1 : 0;
            // ext = $(this).find(".r").text().trim();
            ext = $(this).find(".r").contents().filter(function () {
                return this.nodeType !== 1
            }).text().trim()
            var sticker = $(this).attr("hash").indexOf("Sticker");
            if (sticker > -1) {
                name = $(this).attr("hash").replace("Sticker | ", "");
            } else {
                name = $(this).attr("hash").split("(");
                var gd = name[0].split("Gamma Doppler ");
                var d = name[0].split("Doppler ");
                name = name[0].replace("StatTrak™", "").replace(d[1], "").replace(gd[1], "").trim();

                type = (name.indexOf("|") < 0) ? "&vanilla=1" : "";
                var checkd = d[1];
                var checkgd = gd[1];
                phase = "";
                if (typeof checkd !== 'undefined') {
                    var fixd = checkd.trim();
                    switch (fixd) {
                        case 'Phase 1' :
                            phase = '&phase=d1';
                            break;
                        case 'Phase 2' :
                            phase = '&phase=d2';
                            break;
                        case 'Phase 3' :
                            phase = '&phase=d3';
                            break;
                        case 'Phase 4' :
                            phase = '&phase=d4';
                            break;
                        case 'Ruby' :
                            phase = '&phase=dr';
                            break;
                        case 'Sapphire' :
                            phase = '&phase=ds';
                            break;
                        case 'Black Pearl' :
                            phase = '&phase=db';
                            break;
                    }
                }
                if (typeof checkgd !== 'undefined') {
                    var fixgd = checkgd.trim();
                    switch (fixgd) {
                        case 'Phase 1' :
                            phase = '&phase=g1';
                            break;
                        case 'Phase 2' :
                            phase = '&phase=g2';
                            break;
                        case 'Phase 3' :
                            phase = '&phase=g3';
                            break;
                        case 'Phase 4' :
                            phase = '&phase=g4';
                            break;
                        case 'Emerald' :
                            phase = '&phase=ge';
                            break;
                    }
                }
            }
            var skinname = $(this).attr("hash");

            if (typeof $(this).find(".link_button").html() === 'undefined') {
                $(this).prepend('<a class="link_button" href="https://opskins.com/?loc=shop_search&amp;app=730_2&amp;search_item=&quot;' + encodeURI(name) + '&quot;&amp;sort=lh&amp;exterior=' + ext.toLowerCase() + '&amp;stat=' + stat + phase + type + '" target="_blank" style="background:rgba(0, 0, 0, 0.32); position:absolute;z-index: 999; right: 0; top: 22%;padding: 1px 10px; color: #fff; font-size:14px; line-height: 18px; font-family: Helvetica;text-decoration: none;">Link</a>');

                if (favSkins.length > 0) {
                    var favs;
                    favs = _.find(favSkins, function (item) {
                        return item == skinname;
                    })
                    if (typeof favs !== 'undefined') {
                        Fav(this);
                    } else {
                        NotFav(this);
                    }
                } else {
                    NotFav(this);
                }
            }

            var loaded;
            loaded = _.find(skinsLoaded, function (item) {
                return item.fullname === skinname;
            });
            if (typeof loaded !== 'undefined') {
                var csmPrice = $(this).attr("cost");
                var opsmo = 100 - (loaded['opsprice'] * 100) / (csmPrice * 0.97);
                opsmo = Math.round(opsmo * 100) / 100;
                var moops = 100 - loaded['opsprice'] * 95 / csmPrice;
                moops = Math.round(moops * 100) / 100;
                if (moops > 0) {
                    moops = -moops;
                } else if (moops < 0) {
                    moops = moops + moops * (-2);
                }
                $(this).prepend('<div class="parse_button parse_done" data-ops="' + loaded['opsprice'] + '" style="height: 17px; min-width: 40px; cursor: pointer; position: absolute; color: #000; background-color: transparent; margin-top: 40px; font-size: 12px; margin-left: -8px; padding-left: 2px; padding-right: 2px; z-index: 999; width: 108%;text-align: center;"></div>');
                $(this).prepend("<span style='position: absolute;top: 61%;right: 0;font-size: 13px;z-index: 999; font-weight: bold; color: #000;background: #fff'>" + loaded['opsprice'] + "$</span>");
                $(this).children(".parse_done").prepend('<div class="parse_indicator" title="CSMoney > OPSkins" style="width: 50%; background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline;padding:2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;"><span class="moopsval">' + moops + '</span>%</div>');
                $(this).children(".parse_done").prepend('<div class="parse_indicator" title="OPSkins > CSMoney" style="width: 50%;background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline;padding:2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right;"><span class="opsmoval">' + opsmo + '</span>%</div>');

            } else {
                //cfdfsfs
                $(this).prepend('<div class="parse_button parse_event" style="position:absolute;left:3%; bottom: 42%;z-index: 999;width: 22px; color: #000;"><img class="opsprice" src="https://static-cdn.jtvnw.net/emoticons/v1/87/1.0" alt="opsprice" style="width: 100%; height: auto;"></div>');
            }
        }
        $(this).children(".link_button").unbind().on("click", function () {
            var link = $(this).attr("href");
            window.open(link);
            return false;
        });
        $(this).children(".parse_event").unbind().on("click", function () {
            var allThis = $('div[hash="' + $(this).parent().attr("hash") + '"]');
            allThis.children(".parse_button").html("Load..");
            var nameToSave = $(this).parent().attr("hash");
            var link = $(this).parent().find(".link_button").attr("href");
            getPrice(nameToSave, link, allThis, "hash", getLink);
            return false;
        });
        $(this).children(".parse_done").unbind().on("click", function () {
            alert($(this).attr("data-ops") + "$ на Opskins");
            return false;
        })
        if (typeof $(this).children(".add_favourite").html() !== 'undefined') {
            $(this).children(".add_favourite").unbind().on("click", function () {
                var skinname = $(this).parent().attr("hash");
                var skinurl = $(this).parent().children(".link_button").attr("href");
                var myData = new FormData();
                myData.append("add_fav", skinname);
                myData.append("add_fav_url", skinurl);
                var BtnParent = $(this).parent();
                GM_xmlhttpRequest({
                    method: "POST",
                    url: scriptUrl,
                    data: myData,
                    onload: function (result) {
                        var res = jQuery.parseJSON(result.responseText);
                        console.log(res);
                        if (res['success']) {
                            Fav(BtnParent, skinname);
                        } else {
                            showlogs("Предмет в избранных!");
                        }
                    }
                });
                return false;
            })
        } else {
            $(this).children(".rem_favourite").unbind().on("click", function () {
                var skinname = $(this).parent().attr("hash");
                var myData = new FormData();
                myData.append("rem_fav", skinname);
                var BtnParent = $(this).parent();
                GM_xmlhttpRequest({
                    method: "POST",
                    url: scriptUrl,
                    data: myData,
                    onload: function (result) {
                        var res = jQuery.parseJSON(result.responseText);
                        console.log(res);
                        if (res['succces']) {
                            NotFav(BtnParent, skinname);
                        } else {
                            showlogs("Ошибка удаления!");
                        }
                    }
                });
                return false;
            })
        }
    });

    function NotFav(elem, pack = "false") {
        if (pack === "false") {
            $(elem).find(".favourite").remove();
            $(elem).prepend('<div class="favourite add_favourite" title="Добавить в избранном" style="cursor: pointer; position: absolute; color: rgba(255, 255, 255, 0.97); width: 22px;text-align: center; height: 16px; background-color: rgba(52, 136, 52, 0.6); margin-top: -14px; margin-left: -8px; z-index: 999; top: 14px;right:0;">X</div>');
            $(elem).css("background-color", "");
        } else {
            $('div[hash="' + pack + '"]').find(".favourite").remove();
            $('div[hash="' + pack + '"]').prepend('<div class="favourite add_favourite" title="Добавить в избранном" style="cursor: pointer; position: absolute; color: rgba(255, 255, 255, 0.97); width: 22px;text-align: center; height: 16px; background-color: rgba(52, 136, 52, 0.6); margin-top: -14px; margin-left: -8px; z-index: 999; top: 14px;right:0;">X</div>');
            $('div[hash="' + pack + '"]').css("background-color", "");
            favSkins.splice(favSkins.indexOf(pack), 1);
        }
    }

    function Fav(elem, pack = "false") {
        if (pack === "false") {
            $(elem).find(".favourite").remove();
            $(elem).prepend('<div class="favourite rem_favourite" title="Удалить из избранного" style="cursor: pointer; position: absolute; color: rgba(255, 255, 255, 0.97); width: 22px;text-align: center; height: 16px; background-color: rgba(208, 22, 22, 0.6); margin-top: -14px; margin-left: -8px; z-index: 999; top: 14px;right:0;">X</div>');
            $(elem).css("background-color", "rgba(39, 179, 22, 0.35)");
        } else {
            $('div[hash="' + pack + '"]').find(".favourite").remove();
            $('div[hash="' + pack + '"]').prepend('<div class="favourite rem_favourite" title="Удалить из избранного" style="cursor: pointer; position: absolute; color: rgba(255, 255, 255, 0.97); width: 22px;text-align: center; height: 16px; background-color: rgba(208, 22, 22, 0.6); margin-top: -14px; margin-left: -8px; z-index: 999; top: 14px;right:0;">X</div>');
            $('div[hash="' + pack + '"]').css("background-color", "rgba(39, 179, 22, 0.35)");
            favSkins.push(pack);
        }
    }


}

function getPrice(fullName, opsUrl, BtnParent, blockName, func = "getLink") {
    GM_xmlhttpRequest({
        method: "POST",
        url: opsUrl,
        onload: function (result) {
            var txt = result.responseText;
            var resC = txt.replace(/<img[^>]*>/g, "");
            if ($(resC).find(".alert-danger").html()) {
                console.log($(resC).find(".alert-danger").html());
                $("div[" + blockName + "='" + fullName + "']").children(".parse_button").html("Not Found");
            } else if ($(resC).find(".error#message").html()) {
                var newWindow = window.open(opsUrl);
                $("div[" + blockName + "='" + fullName + "']").children(".parse_button").html("Try again");
            } else {
                var res = $(resC).find(".item-amount").html().replace("$", "").replace(",", "");
                skin = {};
                skin['fullname'] = fullName;
                skin['opsprice'] = res;

                skinsLoaded.push(skin);
                $(".popover.fade.bottom.in").remove();
                $(BtnParent).children(".parse_button").remove();
                if (func = "getLink") {
                    getLink();
                } else {
                    allAnotherGetLink(func);
                }
            }
        }
    });
}

function allAnotherGetLink(changer) {
    var items, name, phase, ext, stat;
    var phase = "";
    var type = "";
    switch (changer) {
        case 'CSOFFERme':
            statArg = ".st";
            extArg = ".invertory_title_container_marka";
            nameArg = "market_hash_name";
            currentItem = ".offer_container_invertory";
            priceArg = "cost";
            items = $(".invertory_container").children();
            zindex = "z-index: 10000;";

            break;
        case 'LootFarm' :
            statArg = ".it_st";
            extArg = ".it_ext";
            nameArg = "data-name";
            currentItem = ".itemblock";
            priceArg = "data-p";
            items = $(".oitems").find(currentItem);
            zindex = "";

            break;
        case 'TradeMe' :
            statArg = ".st";
            extArg = ".images_title_right";
            nameArg = "market_hash_name";
            currentItem = ".images.tooltip";
            priceArg = "cost";
            items = $("#bot_inventory").children();
            zindex = "z-index: 10000;";

            break;
        case 'TradeSkins' :
            statArg = ".st";
            extArg = ".invertory_title_container_marka";
            nameArg = "market_hash_name";
            currentItem = ".offer_container_invertory";
            priceArg = "cost";
            items = $(".invertory_container").children();
            zindex = "z-index: 10000;";

            break;
        case 'CSTrade' :
            statArg = ".stattrak-label";
            extArg = ".wear-name";
            nameArg = "data-name";
            currentItem = ".single-item";
            priceArg = ".item-price";
            items = $("#box-bot-inventory").children();
            zindex = "z-index: 10000;";

            break;
        case 'TradeIt' :
            statArg = ".stattrak";
            extArg = ".quality";
            nameArg = "data-original-title";
            currentItem = ".item";
            priceArg = "data-price";
            items = $(".sactive-game-inv").children();
            zindex = "z-index: 10000;";

            break;
    }
    items.each(function () {
        if (typeof $(this).find(".parse_button").html() === 'undefined') {

            // $(this).css("position", "relative");
            if (changer == "TradeIt") {
                $(this).css("position", "relative");
            }
            stat = (typeof $(this).find(statArg).html() !== 'undefined') ? 1 : 0;
            ext = $(this).find(extArg).text();
            var sticker = $(this).attr(nameArg).indexOf("Sticker");
            if (sticker > -1) {
                name = $(this).attr(nameArg).replace("Sticker | ", "");
            } else {
                name = $(this).attr(nameArg).split("(");
                var gd = name[0].split("Gamma Doppler ");
                var d = name[0].split("Doppler ");
                name = name[0].replace("StatTrak™", "").replace(d[1], "").replace(gd[1], "").trim();

                type = (name.indexOf("|") < 0) ? "&vanilla=1" : "";
                var checkd = d[1];
                var checkgd = gd[1];
                phase = "";
                if (typeof checkd !== 'undefined') {
                    var fixd = checkd.trim();
                    switch (fixd) {
                        case 'Phase 1' :
                            phase = '&phase=d1';
                            break;
                        case 'Phase 2' :
                            phase = '&phase=d2';
                            break;
                        case 'Phase 3' :
                            phase = '&phase=d3';
                            break;
                        case 'Phase 4' :
                            phase = '&phase=d4';
                            break;
                        case 'Ruby' :
                            phase = '&phase=dr';
                            break;
                        case 'Sapphire' :
                            phase = '&phase=ds';
                            break;
                        case 'Black Pearl' :
                            phase = '&phase=db';
                            break;
                    }
                }
                if (typeof checkgd !== 'undefined') {
                    var fixgd = checkgd.trim();
                    switch (fixgd) {
                        case 'Phase 1' :
                            phase = '&phase=g1';
                            break;
                        case 'Phase 2' :
                            phase = '&phase=g2';
                            break;
                        case 'Phase 3' :
                            phase = '&phase=g3';
                            break;
                        case 'Phase 4' :
                            phase = '&phase=g4';
                            break;
                        case 'Emerald' :
                            phase = '&phase=ge';
                            break;
                    }
                }
            }
            var skinname = $(this).attr(nameArg);
            if (typeof $(this).find(".link_button").html() === 'undefined') {
                if($("#bLoadGame").attr('data-game') == 578080){
                    $(this).prepend('<a class="link_button" href="https://opskins.com/?loc=shop_search&amp;app=578080_2&amp;search_item=&quot;' + encodeURI(skinname) + '&quot;&amp;sort=lh" target="_blank" style="background:rgba(0, 0, 0, 0.32); position:absolute; right: 0; top: 22%;padding: 1px 10px; color: #fff; font-size:14px; line-height: 18px; font-family: Helvetica;text-decoration: none;' + zindex + '">Link</a>');
                }else{
                    $(this).prepend('<a class="link_button" href="https://opskins.com/?loc=shop_search&amp;app=730_2&amp;search_item=' + encodeURI(name) + '&amp;sort=lh&amp;exterior=' + ext.toLowerCase() + '&amp;stat=' + stat + phase + type + '" target="_blank" style="background:rgba(0, 0, 0, 0.32); position:absolute; right: 0; top: 22%;padding: 1px 10px; color: #fff; font-size:14px; line-height: 18px; font-family: Helvetica;text-decoration: none;' + zindex + '">Link</a>');
                }
            }
            var loaded;
            loaded = _.find(skinsLoaded, function (item) {
                return item.fullname === skinname;
            });
            if (typeof loaded !== 'undefined') {
                if (changer === "LootFarm" || changer == "TradeIt") {
                    var changerPrice = $(this).attr(priceArg) / 100;
                } else if (changer === "CSTrade") {
                    var changerPrice = $(this).find(priceArg).html().replace("$", "");
                } else {
                    var changerPrice = $(this).attr(priceArg);
                }
                if (changer == "TradeIt") {
                    var comission = 0.981;
                } else {
                    var comission = 0.97;
                }
                var opsmo = 100 - (loaded['opsprice'] * 100) / (changerPrice * comission);
                opsmo = Math.round(opsmo * 100) / 100;
                var moops = 100 - loaded['opsprice'] * 95 / changerPrice;
                moops = Math.round(moops * 100) / 100;
                if (moops > 0) {
                    moops = -moops;
                } else if (moops < 0) {
                    moops = moops + moops * (-2);
                }
                $(this).prepend('<div class="parse_button parse_done" data-ops="' + loaded['opsprice'] + '" style="height: 17px; min-width: 40px;top:10%; cursor: pointer; position: absolute; color: #000; background-color: transparent; margin-top: 40px; font-size: 12px; margin-left: -8px; padding-left: 2px; padding-right: 2px; width: 108%;text-align: center;' + zindex + '"></div>');
                if (changer !== "LootFarm") {
                    $(this).prepend("<span style='position: absolute;top: 32%;left: 0;font-size: 13px; font-weight: bold; color: #000;background: #fff;" + zindex + "'>" + loaded['opsprice'] + "$</span>");
                } else {
                    $(this).prepend("<span style='position: absolute;top: 61%;right: 0;font-size: 13px; font-weight: bold; color: #000;background: #fff;" + zindex + "'>" + loaded['opsprice'] + "$</span>");
                }
                $(this).find(".parse_done").prepend('<div class="parse_indicator" title="CSMoney > OPSkins" style="width: 46%; background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline;padding:2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;"><span class="moopsval">' + moops + '</span>%</div>');
                $(this).find(".parse_done").prepend('<div class="parse_indicator" title="OPSkins > CSMoney" style="width: 46%;background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline;padding:2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right;"><span class="opsmoval">' + opsmo + '</span>%</div>');

            } else {
                //cfdfsfs
                if (changer === "CSTrade") {
                    $(this).prepend('<div class="parse_button parse_event" style="position:absolute;left:3%; top:10%;width: 22px; color: #000;' + zindex + '"><img class="opsprice" src="https://static-cdn.jtvnw.net/emoticons/v1/87/1.0" alt="opsprice" style="width: 100%; height: auto;"></div>');
                } else {
                    $(this).prepend('<div class="parse_button parse_event" style="position:absolute;left:3%; bottom: 42%;width: 22px; color: #000;' + zindex + '"><img class="opsprice" src="https://static-cdn.jtvnw.net/emoticons/v1/87/1.0" alt="opsprice" style="width: 100%; height: auto;"></div>');
                }
            }
        }
        $(this).find(".link_button").unbind().on("click", function () {
            var link = $(this).attr("href");
            window.open(link);
            return false;
        });
        $(this).find(".parse_event").unbind().on("click", function () {
            if (changer !== 'TradeIt') {
                var allThis = $('div[' + nameArg + '="' + $(this).parent().attr(nameArg) + '"]');
            } else {
                var allThis = $("li[" + nameArg + "='" + $(this).parent().attr(nameArg) + "']");
            }
            allThis.children(".parse_button").html("Load..");
            var nameToSave = $(this).parent().attr(nameArg);
            var link = $(this).parent().find(".link_button").attr("href");
            getPrice(nameToSave, link, allThis, nameArg, changer);
            return false;
        });
        $(this).children(".parse_done").unbind().on("click", function () {
            alert($(this).attr("data-ops") + "$ на Opskins");
            return false;
        });
    })
}

function csmomenu() {
    csmobot();
    $("#csmbtns").on("click", function () {
        $(".csmbtns").toggle('slow', function () {
            $(this).toggleClass("hidden");
            $("#csmbtns").val("Скрыть кнопки");
        })
    })
}

function csmocounters() {
    $(".column-2 .sidebar").css("height", "94%");
    $(".bonus").css("top", "89%");

    var user_offer = $("#user_offer_sum").text().replace("$", "").trim();
    var bot_offer = $("#bots_offer_sum").text().replace("$", "").trim();

    $("#total_value_user").after("<span id='fullB'></span>")
    setInterval(function () {
        var counts = 0;
        $("#inventory_user").children().each(function () {
            var ct = $(this).find(".ct").text().trim();
            if (ct.length === 0) {
                ct = 1;
            }
            counts += Number($(this).attr("cost") * ct);
            if (counts === 0) {
                $("#fullB").html(" / $ 0.00");
            } else {
                $("#fullB").html(" / $ " + Math.round(counts * 100) / 100);
            }
        })
    }, 1600)
}

function sellsinvChecker() {
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings['url'] == '/ajax/get_inventory.php?appid=730&contextid=2&osi=0') {
            setTimeout(salesInfo, 500);
        }
    })
};

function salesInfo() {
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
    var balance = parseFloat($(".op-count").html().replace(",", ""));
    var op = parseFloat($(".op-credits-count span").text().replace(",", "").trim());
    var fullBal = Math.round((balance + op) * 100) / 100;
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings['url'] === 'ajax/shop_account.php?type=itrans&page=1&filter=2') {
            $("#collapseIS").append("<div id='infoLoader' style='width: 100%; heigth: 100%; text-align: center;'><h1>Загрузка..." + mark + "</h1></div>");
            $("#collapseIS .panel-body").css("display", "none");
            var myData = new FormData();
            var onSold = 0;
            var userdbupd = "https://skinsdb.online/scripts/usersales.php";
            myData.append("usersales", true);
            GM_xmlhttpRequest({
                method: "POST",
                url: userdbupd,
                data: myData,
                onload: function (result) {
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

function addFilterBtn() {
    var balance = parseFloat($(".op-count").html().replace("$", "").replace(",", ""));
    var url = "https://opskins.com/?loc=good_deals&app=730_2&search_item=&min=&max=" + balance + "&sort=dhl&stat=&grade=&exterior=&souvenir=&wear_range_low=0&wear_range_high=&type=&phase=&want_stickers=&sticker_search=";
    $(".jumbotron").find(".btn-orange").before("<a href='" + url + "' class='btn btn-info' style='margin-right: 5px;'>Search " + mark + "</a>")
}

function friendssells() {

    var myData = new FormData();
    myData.append("friendssolds", true);
    GM_xmlhttpRequest({
        method: "POST",
        url: scriptUrl,
        data: myData,
        onload: function (result) {
            res = JSON.parse(result.responseText);
            console.log(res);
            check(res);
            $(document).ajaxComplete(function () {
                check(res);
            });
        }
    })

    function check(array) {
        // console.log("working");
        $("#scroll").children(".scanned").each(function () {
            if (typeof $(this).find(".friendsicon").html() === 'undefined') {
                var skinId = Number($(this).find(".market-name.market-link").attr("href").replace("?loc=shop_view_item&item=", ""));
                var loaded = $.grep(array, function (e) {
                    return e.skinid == skinId;
                });
                if (typeof loaded[0] !== 'undefined') {
                    $(this).find(".item-amount").before("<div class='buyers-club-icon friendsicon'><span><img src='" + loaded[0].sellerimg + "' alt='" + loaded[0].skinid + "' style='border-radius: 60px; border:3px solid green;width: 45px;' title='" + loaded[0].sellername + "'></span></div>")
                }
            }
        })

    }
}


function buyerChecker() {

    if (typeof $("#shopSellAmt").html() != "undefined") {
        $("#shopSellAmt").attr("autocomplete", "off");
    }

    if (typeof $(document).find(".buyers-club-icon span").html() !== 'undefined') {
        $(".item-amount").after("<span class='fa fa-spinner fa-spin'></span>")
        var timer = $(".item-amount").after("<div class='skinsdbTimer'></div>");
        var timetoupd = 3000;
        n = 60;

        var IntChecker = setInterval(function () {
            var currentBuyer = $(document).find(".buyers-club-icon span").attr("class");
            $.post(site).done(function (callback) {
                var updatedBuyer = $(callback).find(".buyers-club-icon span").attr("class");
                if (typeof $(callback).find(".buyers-club-icon").html() !== 'undefined') {
                    $(document).find(".buyers-club-icon").html($(callback).find(".buyers-club-icon").html());
                    if (currentBuyer !== updatedBuyer && updatedBuyer.indexOf("red") > -1 && $(".skinsdbTimer").html() === "") {
                        startTimer(60, $(".skinsdbTimer"));
                    }
                    if (currentBuyer.indexOf("red") > -1) {
                        n = n - 5;
                        if (n < 20) {
                            timetoupd = 1000;
                        }
                    }
                    console.log(n);
                    console.log(currentBuyer);
                } else {
                    clearInterval(IntChecker);
                    $(document).find(".buyers-club-icon").remove();
                    $(document).find(".skinsdbTimer").remove();
                    $(document).find(".fa-spin").remove();
                }
            });
        }, timetoupd)
    }
}

function botOpsChecker() {
    opsUrl = "https://opskins.com/?loc=shop_search&sort=lh&exterior=bs&app=730_2&search_item=%22Gut+Knife+%7C+Crimson+Web%22&search_internal=1";
    GM_xmlhttpRequest({
        method: "POST",
        url: opsUrl,
        onload: function (result) {
            if ($(result.responseText).find(".error#message").html()) {
                location.reload();
            } else {
                showlogs("Бото-проверка прошла успешно!");
            }
        }
    });
}

function reloadpage(display, timetorealod) {
    startTimer(timetorealod * 60, display);
    setTimeout(function () {
        // $(".mystery-item-inner .live-listings i.fa-play-circle").click();
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
    var items = parent.find(childSelector).sort(function (a, b) {
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

        display.text(minutes + ":" + seconds);

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

function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
