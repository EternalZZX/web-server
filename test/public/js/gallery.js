$(function(){
    var gallery = $('#gallery-div');

    gallery.css("height", $(window).height() - 50);
    $(window).resize(function () {
        gallery.css("height", $(window).height() - 50);
    });

    $('#gallery-div dl').each(function(){
        $(this).dragging({
            move : 'both',
            randomPosition : true ,
            hander:'.hander'
        });
    });
});