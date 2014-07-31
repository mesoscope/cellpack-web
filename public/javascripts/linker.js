$('.sideLink').click(function() {
    alert('Clicked!');
    window.recipeName = $(this).html();
    window.recipeVersion = $(this).data('vers');
    $.getScript('javascripts/tabler.js');
});
