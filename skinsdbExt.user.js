// ==UserScript==
// @name         skinsdbExt
// @namespace   http://skinsdb.online/
// @version      3.02
// @description  try to hard!
// @author       BJIAST
// @match       http://skinsdb.online/*
// @match       https://steamcommunity.com/tradeoffer/*
// @match       https://opskins.com/*
// @match       https://steamcommunity.com/trade/*
// @match       https://trade.vgounbox.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==


var scriptUrl = "http://skinsdb.online/scripts/opsinc.php";
var soundAccept = new Audio('https://raw.githubusercontent.com/BJIAST/SATC/master/sounds/done.mp3');
var soundFound = new Audio('http://skinsdb.online/assets/ready.mp3');
var site = location.href;
var mark = " | skinsdbExt";
var skinsLoaded = [];
var skinsdbprices = [];
var favSkins = [];


var version = 3.02;

(function () {
    var opslink3 = site.split("https://opskins.com/");

    if (site == "https://opskins.com/" + opslink3[1]) {
        include("https://code.jquery.com/jquery-3.2.1.min.js");

        include("https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js");

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
    if (site == "https://trade.vgounbox.com/" || site == "https://trade.vgounbox.com/trade") {
        include("https://code.jquery.com/jquery-3.2.1.min.js");
        include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");

        setTimeout(function () {
            setInterval(function () {
                allAnotherGetLink("vgounbox");
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
                        favSkins = JSONdata['favskins'];
                    }
                }
            })
        }, 600)
    }
    if (site == "http://skinsdb.online/?doppler_search" || site == "http://skinsdb.online/?favsearch") {
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
    var opslink5 = site.split("?app=1912_1");
    var opslink6 = site.split("index.php?loc=game");
    if (site == "https://opskins.com/" + opslink3[1]) {
        settingsMenu();
    }

    if (site == "https://opskins.com/?loc=shop_checkout") {
        autoBuyclick();
    }
    if (site == "https://opskins.com/?loc=shop_search" + opslink[1] || site == "https://opskins.com/?app=1912_1" + opslink5[1]) {
        fullpageparse();
        loadallprices();
        friendssells();
    }
    if (site == "https://opskins.com/?loc=good_deals" + opslink2[1]) {
        fullpageparse();
        loadallprices();
        // csmoparser();
    }
    if (site == "https://opskins.com/?loc=shop_browse" || site == "https://opskins.com/?loc=shop_browse&app=1912_1" || site == "https://opskins.com/?loc=shop_browse&app=730_2") {
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
    if (site == "https://opskins.com/?loc=store_account#manageSales") {
        realEarning();
    }
    if (site == "https://opskins.com/index.php?loc=game" + opslink6[1] || site == "https://opskins.com/?loc=game") {
        fullpageparse();
        loadallprices();
    }
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
        console.log(skinName);
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
                console.log(res);
                if (res['status']) {
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
                        res = 100 - (res * 100) / (chprice * 0.95);
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
                   if($.cookie('changer') == "VGOUNBOX"){
                       var comission = 0.905;
                   }else if($.cookie('changer') == "Skinsjar") {
                       var comission = 0.98;
                   }else if($.cookie('changer') == "VGOTrading") {
                       var comission = 0.925;
                   }else{
                       var comission = 1;
                   }


                    var changerPrice = loaded[0].price * comission;
                    if($.cookie('changer') == "VGOUNBOX"){ if(skinName.indexOf('Key') > -1) {
                        changerPrice = 2.5;
                        console.log(skinName);
                    }}
                    var resom = 100 - (skinPrice * 100) / changerPrice;
                    var res1 = Math.round(resom * 100) / 100;
                    var dif = savedDiscount - res1;
                    var overpayThis = false;
                    var overpayVal = 0;
                    var currBoxWear = $(this).find(".wear-value small");
                    if (typeof currBoxWear.html() != 'undefined') {
                        var skinfloat = parseFloat(currBoxWear.html().replace("Wear: ", "").replace("%", ""));
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

        var htmlres = '<button class="overstockChecker" skin="' + skin + '" style="border:0;cursor: pointer; background-color: rgba(24, 113, 206, 0.62); font-size: 94%; z-index: 99;position:absolute;top: 155px;left: 13px;outline: none;">Проверить</button>';
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
            var onChange = (Number($(this).attr("money-price")) + Number($(this).attr("full-overpay"))) * 0.95;
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

    newgetprices(true);
    setInterval(function () {
        newgetprices();
        showlogs("Цены обновлены" + mark);
    }, 60000)
    $(document).ajaxComplete(function () {
        newloadallprices();
    });

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
        if (site.indexOf("https://opskins.com/index.php?loc=game&type=3&market_name=") > -1 || site.indexOf("https://opskins.com/?loc=game") > -1) {
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
            } else if (site.indexOf("https://opskins.com/?loc=game") > -1) {
                sortUsingNestedText($("body"), "div.scanned", ".priceBtn .realOpsmo");
            } else {
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

function getPrice(fullName, opsUrl, BtnParent, blockName, func = "getLink") {
    GM_xmlhttpRequest({
        method: "POST",
        url: opsUrl,
        onload: function (result) {
            var txt = result.responseText;
            var resC = txt.replace(/<img[^>]*>/g, "");
            if ($(resC).find(".alert-danger").html()) {
                console.log($(resC).find(".alert-danger").html());
                $("div[" + blockName + "='" + fullName + "']").find(".parse_button").html("Not Found");
            } else if ($(resC).find(".error#message").html()) {
                var newWindow = window.open(opsUrl);
                $("div[" + blockName + "='" + fullName + "']").find(".parse_button").html("Try again");
            } else {
                var res = $(resC).find(".item-amount").html().replace("$", "").replace(",", "");
                skin = {};
                skin['fullname'] = fullName;
                skin['opsprice'] = res;

                skinsLoaded.push(skin);
                $(".popover.fade.bottom.in").remove();
                $(BtnParent).children(".parse_button").remove();
                allAnotherGetLink(func);
            }
        }
    });
}

function allAnotherGetLink(changer) {
    var items, name, phase, ext, stat;
    var phase = "";
    var type = "";
    switch (changer) {
        case 'vgounbox' :
            extArg = ".wearShort_VXf8i_75b73";
            nameArg = [".name_N6hUO_4568b", ".type_3eJEV_9f1a3"];
            currentItem = ".skin_1lCCa_0bb97";
            priceArg = ".wearShort_VXf8i_75b73";
            items = $(".skinsContainer_pOZGQ_44c57").children();
            zindex = "z-index: 1000;";

            break;
    }
    items.each(function () {
        if (typeof $(this).find(".parse_button").html() === 'undefined') {

            ext = $(this).find(extArg).text();

            switch (ext) {
                case 'FN' :
                ext =  " (Factory New)";
                    break;
                case 'MW' :
                ext = " (Minimal Wear)";
                    break;
                case 'FT' :
                ext = " (Field-Tested)";
                    break;
                case 'WW' :
                ext =" (Well-Worn)";
                    break;
                case 'BS' :
                ext = " (Battle-Scarred)";
                    break;
            }
            price = +$(this).find(priceArg).next().text().replace("$", "").replace(",","");
            // console.log(price);
            name = $(this).find(nameArg[0]).html().trim() + " | " + $(this).find(nameArg[1]).text().trim() + ext;
            $(this).closest(".skin_1lCCa_0bb97").attr("data-name", name);
            // console.log(name);
            var skinname = name;
            if (typeof $(this).find(".link_button").html() === 'undefined') {
                $(this).prepend('<a class="link_button" href="https://opskins.com/?loc=shop_search&amp;app=1912_1&amp;search_item=&quot;' + encodeURI(skinname) + '&quot;&amp;sort=lh" target="_blank" style="background:rgba(0, 0, 0, 0.32); position:absolute; right: 0; top: 22%;padding: 1px 10px; color: #fff; font-size:14px; line-height: 18px; font-family: Helvetica;text-decoration: none;' + zindex + '" data-name="'+name+'">Link</a>');
            }

            var loaded;
            loaded = _.find(skinsLoaded, function (item) {
                return item.fullname === skinname;
            });
            if (typeof loaded !== 'undefined') {

                if(changer == "vgounbox"){
                    var comission = 0.905;
                }else if(changer == "skinsjar") {
                    var comission = 0.98;
                }else if(changer == "vgotrading") {
                    var comission = 0.925;
                }
                var changerPrice = price * comission;
                if(changer == "vgounbox"){ if(skinname.indexOf('Key') > -1) {
                    changerPrice = 2.5;
                }}
                var opsmo = 100 - (loaded['opsprice'] * 100) / changerPrice;
                opsmo = Math.round(opsmo * 100) / 100;
                var moops = 100 - loaded['opsprice'] * 100 / price;
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
            var allThis = $('a[data-name="' + $(this).parent().find('.link_button').attr('data-name') + '"]').closest('.skin_1lCCa_0bb97');

            allThis.children(".parse_button").html("Load..");
            var nameToSave = $(this).parent().find('.link_button').attr('data-name');
            var link = $(this).parent().find(".link_button").attr("href");
            getPrice(nameToSave, link, allThis, "data-name", changer);
            return false;
        });
        $(this).children(".parse_done").unbind().on("click", function () {
            alert($(this).attr("data-ops") + "$ на Opskins");
            return false;
        });
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
            var userdbupd = "http://skinsdb.online/scripts/usersales.php";
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
                                var resmo = 100 - opsprice * 100 / res[i]["csmoney"];
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

// function botOpsChecker() {
//     opsUrl = "https://opskins.com/?loc=shop_search&sort=lh&exterior=bs&app=730_2&search_item=%22Gut+Knife+%7C+Crimson+Web%22&search_internal=1";
//     GM_xmlhttpRequest({
//         method: "POST",
//         url: opsUrl,
//         onload: function (result) {
//             if ($(result.responseText).find(".error#message").html()) {
//                 location.reload();
//             } else {
//                 showlogs("Бото-проверка прошла успешно!");
//             }
//         }
//     });
// }

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
