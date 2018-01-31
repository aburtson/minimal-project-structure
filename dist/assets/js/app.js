'use strict';

$.fn.squares = function(settings) {
    new Squares(this, settings);
};

function Squares(element, settings){
    if (settings === undefined) {
        settings = {};
    }

    var object = this;

    object.container = $(element);
    object.squareList = $('.square__list');
    object.squares = this.squareList.find('.square');
    object.panelContainer = $('.square-panel__list');
    object.panels = this.panelContainer.find('.square-panel');
    object.delaySpeed = 150;
    object.squareCount = 0;

    object.columns = settings.columns;

    object.squares.each(function(i){
        object.squareCount += i * object.delaySpeed;
    });

    object.setColumns();
    object.numberSquares();
    object.setSquareHeight();
    object.revealPanels();

    $(window).on('resize', function(){
        object.setSquareHeight();
    });
}

Squares.prototype.numberSquares = function(){
    var object = this;
    var $squares = object.squares;
    var $panels = object.panels;

    $squares.each(function(i){
        var $square = $(this);
        $square.attr('data-square', 'square-' + i);
    });
    $panels.each(function(i){
        var $panel = $(this);
        $panel.attr('id', 'square-' + i);
    });
};

Squares.prototype.setSquareHeight = function(){
    var object = this;
    var $squares = object.squares;

    $squares.each(function(){
        var $square = $(this);
        var squareHeight = $square.width();
        var $squareContent = $square.find('.square-content');
        var squareContentHeight = $squareContent.outerHeight();
        $square.css('height', squareHeight);
        $squareContent.css('margin-top', (squareContentHeight / 2) * -1);
    });
};

Squares.prototype.revealPanels = function(){
    var object = this;
    var $container = object.container;
    var $squares = object.squares;
    var $panels = object.panels;
    var $panelContainer = object.panelContainer;
    var delaySpeed = object.delaySpeed;

    $squares.each(function(){
        var $square = $(this);

        $square.on('click', function(){
            var panelValue = $square.attr('data-square');

            $squares.removeClass('active');
            $square.addClass('active');

            if ($container.attr('data-panel') == 'closed') {
                $squares.each(function(i){
                    var $square = $(this);
                    var currentDelay;
                    currentDelay = i * delaySpeed;
                    setTimeout(function(){
                        $square.animate({ opacity: 0 }, delaySpeed);
                    }, currentDelay);
                });
                setTimeout(function(){
                    $container.animate({ opacity: 0 }, 0);
                }, 800);

                setTimeout(function(){
                    setActivePanel();
                    $container.attr('data-panel', 'open');
                    object.setSquareHeight();
                }, 800);

                setTimeout(function(){
                    $container.animate({ opacity: 1 }, 200);
                }, 1200);

                setTimeout(function(){
                    $squares.each(function(i){
                        var $square = $(this);
                        var currentDelay;
                        currentDelay = i * delaySpeed;
                        setTimeout(function(){
                            $square.animate({ opacity: 1 }, delaySpeed);
                        }, currentDelay);
                    });
                }, 1400);
            } else {
                setActivePanel();
            }

            function setActivePanel() {
                $panels.each(function(){
                    var $panel = $(this);
                    var panelId = $panel.attr('id');
                    var panelHeight = $panel.height();

                    if (panelId == panelValue) {
                        $panels.removeClass('active');
                        $panelContainer.css('height', panelHeight);
                        $panel.addClass('active');

                        $(window).on('resize', function(){
                            panelHeight = $panel.height();
                            if ($container.attr('data-panel') == 'open') {
                                $panelContainer.css('height', panelHeight);
                            } else {
                                $panelContainer.css('height', '0');
                            }
                        });
                    }
                });
            }
        });
    });

    $panels.each(function(){
        var $close = $('.square-panel__close');

        $close.on('click', function(){
            $container.animate({ opacity: 0 }, 200);

            setTimeout(function(){
                $panels.removeClass('active');
                $panelContainer.css('height', '0');
                $container.attr('data-panel', 'closed');
                object.setSquareHeight();
            }, 400);

            setTimeout(function(){
                $container.animate({ opacity: 1 }, 200);
            }, 800);
        });
    });
};

Squares.prototype.setColumns = function() {
    var object = this;
    var columns = object.columns;
    var $container = object.container;

    if (columns <= 0 || columns > 4) {
        columns = 4;
    }
    $container.addClass('col-' + columns);
};

$('.squares').squares({
    columns: 4
});
//# sourceMappingURL=app.js.map
