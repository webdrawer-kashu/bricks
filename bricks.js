/**
* bricks.js
* jQuery required.
*
* * Copyright 2014 (c) webdrawer-kashu
* * http://webdrawer.net/
* * Licensed Under the MIT.
*
*/

(function($){
    $.fn.bricks = function(options){

        var defaults = {
            space : 5,//コンテンツ間隔
            type: 'low',//line：行ごとに並べる low：高さが低い所から配置する
            time: 0,//0にするとアニメーションなし
            start: 'leftTop',//leftTop rightTop centerTop
            easing: 'swing'//イージング
        };

        var setting = $.extend(defaults,options);

        var wrap = $(this);
        var wrapWidth;
        var content = wrap.children('.cluster')
        var contentWidth;
        var wrapColumn;

        content.css({
            'position': 'absolute'
        });

        //アニメーションの開始位置
        if(setting.start == 'leftTop'){
            content.css({
                'top': 0,
                'left': 0
            });
        }else if(setting.start == 'rightTop') {
            content.css({
                'top': 0,
                'right': 0
            });
        }else if(setting.start == 'centerTop') {
            content.css({
                'top': 0,
                'left': (wrapWidth / 2) - (contentWidth / 2)
            });
        }

        function goMove(){

            wrapWidth = wrap.outerWidth();
            contentWidth = $(content).outerWidth() + (setting.space * 2);

            var contentNum = 0;//何番目 画面端まで来ると0に戻る
            var contentLine = 0;//何行目
            var contentCount = 1;//何番目
            var contentPos = [];//そのコンテンツの位置情報
            wrapColumn = Math.floor(wrapWidth / contentWidth);//横に何カラム並ぶか

            if (setting.type == 'line') {
                content.each(function() {
                    if( ($(this).outerWidth() + setting.space * 2) * (contentNum + 1) > wrapWidth){
                        contentNum = 0;
                        contentLine++;
                    }

                    if( contentLine == 0 ){
                        var topPos = 0 + (setting.space * contentLine);
                        var leftPos = (contentWidth * contentNum) + setting.space;
                        $(this).stop().animate({
                            'top' : topPos,
                            'left': leftPos
                        },setting.time,setting.easing);
                    }else {
                        var topPos = content.eq((contentCount - 1) - wrapColumn).offset().top + content.eq((contentCount - 1) - wrapColumn).outerHeight() + setting.space;
                        var leftPos = (contentWidth * contentNum) + setting.space
                        $(this).stop().animate({
                            'top' : topPos,
                            'left' : leftPos
                        },setting.time,setting.easing);
                    }

                    contentPos[contentCount - 1] = $(this).offset({top: topPos + setting.space ,left: leftPos});
                    contentNum++;
                    contentCount++;

                });
            }

            if(setting.type == 'low'){
                var contentHeight= new Array(wrapColumn);//コンテンツ列のそれぞれの合計高さ
                for (var c = 0; c < wrapColumn; c++) {
                    contentHeight[c] = 0;
                }
                var lowHeight;//一番小さい値
                var lowHeightNum;//一番小さい値が何番目にあるか

                content.each(function() {
                    if( ($(this).outerWidth() + (setting.space * 2)) * (contentNum + 1) > wrapWidth){
                        contentNum = 0;
                        contentLine++;
                    }

                    var thisHeight = $(this).outerHeight() + setting.space;

                    if( contentLine == 0 ){
                        $(this).animate({
                            'top' : 0 + (setting.space * contentLine),
                            'left': (contentWidth * contentNum) + setting.space
                        },setting.time,setting.easing);
                        contentHeight[contentNum] = contentHeight[contentNum] + thisHeight + setting.space;
                    }else {

                        lowHeight = Math.min.apply(null,contentHeight);
                        lowHeightNum = $.inArray(lowHeight,contentHeight)

                        $(this).animate({
                            'top': contentHeight[lowHeightNum],
                            'left': (contentWidth * lowHeightNum) + setting.space
                        },setting.time,setting.easing);

                        contentHeight[lowHeightNum] = contentHeight[lowHeightNum] + thisHeight + setting.space;
                    }

                    contentNum++;
                });
            }
        }
        goMove();

    //リサイズ処理
    var timer = false;
    $(window).resize(function() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            goMove();
        }, 500);
    });

    };
})(jQuery);