// ==UserScript==
// @name         skinsdbExt
// @namespace   http://skinsdb.xyz/
// @version     1
// @description  try to hard!
// @author       BJIAST
// @match       http://skinsdb.xyz/*
// @match       https://steamcommunity.com/tradeoffer/*
// @match       https://cs.money/*
// @match       https://opskins.com/*
// @match       https://steamcommunity.com/trade/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
var skinsLoaded = [];
include("https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js");
startAll();

function startAll() {
    setInterval(getLink, 2000);

    $(".offer_container_main .col_lg_head .row").prepend("<div style='margin: 10px 0 20px;overflow: hidden;'><button id='scannerdb' class='btn btn-primary' style='float: right; margin-right: 32px;'>Сканнер</button></div>");
    $("#scannerdb").on("click", function () {
        $(this).html("Загрузка...");
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://api.opskins.com/IPricing/GetAllLowestListPrices/v1/?appid=730",
            onload: function (result) {
                var res = jQuery.parseJSON(result.responseText);

                $("#scannerdb").html("Готово");
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
                        $(".parse_button").remove();
                    }
                })
            },
            onerror: function (res) {
                $("#scannerdb").html("Ошибка");
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
    });

}

function getLink() {
    $(".invertory_container").children().each(function () {
        if (typeof $(this).children(".parse_button").html() === 'undefined') {
            var loaded;
            var skinname = $(this).attr("market_hash_name");
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
                $(this).prepend('<div class="parse_button parse_done" style="height: 17px; min-width: 40px; cursor: pointer; position: absolute; color: white; background-color: transparent; margin-top: 45px; font-size: 12px; margin-left: -8px; padding-left: 2px; padding-right: 2px; z-index: 999; width: 100%;"></div>');
                $(this).children(".parse_done").prepend('<div class="parse_indicator" title="CSMoney > OPSkins" style="width: 50%; background-color: rgb(45, 121, 45); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px; float: left;"><span class="moopsval">' + moops + '</span>%</div>');
                $(this).children(".parse_done").prepend('<div class="parse_indicator" title="OPSkins > CSMoney" style="width: 50%;background-color: rgb(210, 29, 37); white-space: nowrap; vertical-align: baseline; padding: 2px 1px;color: #fff;border-radius:3px; font-size: 12px;  float: right;"><span class="opsmoval">' + opsmo + '</span>%</div>');
            } else {
                var name, phase, ext, stat;
                var phase = "";
                var type = "";
                stat = (typeof $(this).children(".st").html() !== 'undefined') ? 1 : 0;
                ext = $(this).find(".invertory_title_container_marka").text();

                var sticker = $(this).attr("market_hash_name").indexOf("Sticker");
                if (sticker > -1) {
                    name = $(this).attr("market_hash_name").replace("Sticker | ", "");
                } else {
                    name = $(this).attr("market_hash_name").split("(");
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

                $(this).prepend('<a class="link_button" href="https://opskins.com/?loc=shop_search&amp;app=730_2&amp;search_item=' + encodeURI(name) + '&amp;sort=lh&amp;exterior=' + ext.toLowerCase() + '&amp;stat=' + stat + phase + type + '" target="_blank" style="height: 22px; min-width: 35px; cursor: pointer; position: absolute; color: white; background-color: rgba(52, 136, 52, 0.6); margin-top: 20px; font-size: 16px; margin-left: -50px; padding-left: 2px; padding-right: 2px; z-index: 10;">Link</a>');

                //cfdfsfs
                $(this).prepend('<div class="parse_button parse_event" style="height: 22px; min-width: 40px; cursor: pointer; position: absolute; color: white; background-color: rgba(52, 136, 52, 0.6); margin-top: 45px; font-size: 16px; margin-left: -8px; padding-left: 2px; padding-right: 2px; z-index: 999;">Price</div>');
            }
        }
        $(this).children(".link_button").unbind().on("click", function () {
            var link = $(this).attr("href");
            window.open(link);
            return false;
        });
        $(this).children(".parse_event").unbind().on("click", function () {
            var allThis = $("div[market_hash_name='" + $(this).parent().attr("market_hash_name") + "']");
            allThis.children(".parse_button").html("Load..");
            var nameToSave = $(this).parent().attr("market_hash_name");
            var link = $(this).parent().find(".link_button").attr("href");
            getPrice(nameToSave, link, allThis);
            return false;
        });
    });
}

function getPrice(fullName, opsUrl, BtnParent) {
    GM_xmlhttpRequest({
        method: "POST",
        url: opsUrl,
        onload: function (result) {
            if ($(result.responseText).find(".alert-danger").html()) {
                console.log($(result.responseText).find(".alert-danger").html());
                $("div[market_hash_name='" + fullName + "']").children(".parse_button").html("Not Found");
            } else if ($(result.responseText).find(".error#message").html()) {
                var newWindow = window.open(opsUrl);
                $("div[market_hash_name='" + fullName + "']").children(".parse_button").html("Try again");
            } else {
                var res = $(result.responseText).find(".item-amount").html().replace("$", "").replace(",", "");
                skin = {};
                skin['fullname'] = fullName;
                skin['opsprice'] = res;
                // skin['opsmo'] = opsmo;
                // skin['moops'] = moops;
                skinsLoaded.push(skin);
                console.table(skinsLoaded);
                $(".popover.fade.bottom.in").remove();
                $(BtnParent).children(".parse_button").remove();
                getLink();
            }
        }
    });
}

//sdwsfsddsfsd
function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
