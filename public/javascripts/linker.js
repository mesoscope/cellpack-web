$('.sideLink').click(function() {
    window.recipeName = $(this).html();
    window.recipeVersion = $(this).data('vers');
    $('.sideLink').not($(this)).css('background-color', 'white');
    $(this).css('background-color', 'yellow');
    $.getScript('javascripts/tabler.js');
});
