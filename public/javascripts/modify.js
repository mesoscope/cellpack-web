$(document).ready(function() {
    $('#loader').click(function() {
        window.recipeName = $('select.recn').val();
        window.recipeVersion = $('select.recv').val();
        $.getScript('javascripts/hierarchy.js');
        $.getScript('javascripts/tabler.js');
        $.getScript('javascripts/linker.js');
    });
});
