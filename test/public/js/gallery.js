$(function(){
    var gallery = $('#gallery-div');

    gallery.css("height", $(window).height() - 50);
    $(window).resize(function () {
        gallery.css("height", $(window).height() - 50);
        galleryInit();
    });

    galleryInit();

    $('#gallery-div dl').mousedown(function(e){
        $('#gallery-div dl').css("z-index", "0");
        $(this).css("z-index","1");
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