$(function(){
    $('.loading').click(function(event) {
        openloading();
    });
});

function openloading(){
    $("#loader").addClass("loader loader-default is-active");
}

function closeloading(){
    $("#loader").removeClass("loader loader-default is-active");
}
