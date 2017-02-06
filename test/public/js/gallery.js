$(function(){
    var gallery = $('#gallery-div');

    gallery.css("height", $(window).height() - 50);
    $(window).resize(function () {
        gallery.css("height", $(window).height() - 50);
        galleryInit();
    });

    galleryInit();

    $('#gallery-div dl').mousedown(function(event) {
        $('#gallery-div dl').css("z-index", "0");
        $(this).css("z-index","1");
    });

    $('#gallery-carousel').carousel('pause');

    $("a.gallery-touch").click(function(event) {
        /* Act on the event */
    });
});

function galleryInit(){
    $('#gallery-div dl').each(function(){
        $(this).dragging({
            move : 'both',
            randomPosition : true,
            hander:'.hander'
        });
        var deg = 30 * Math.random() - 15;
        $(this).css("transform","rotate(" + deg + "deg)");
    });
}