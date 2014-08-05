$(document).ready(function() {
    $('#createChild').hide();
    $('#loader').click(function() {
        window.recipeName = $('select.recn').val();
        window.recipeVersion = $('select.recv').val();
        $('#recipeList').empty();
        $.post('/hierarchy', {'recipename': recipeName, 'recipevers': recipeVersion}, function(data) {
            $.each(data, function(i, val) {
                $('#recipeList').append('<button class="sideLink" data-vers="'+val['tableversion']+'">'+val['tablename']+'</button><br>');
            });
            $('.sideLink').first().css('background-color', 'blue');
            $('#createChild').show();
        });
        $.getScript('javascripts/tabler.js');
        $.getScript('javascripts/linker.js');
    });

    $('#createChild').click(function() {
        alert('Adding Child!');
    });

    $('#childer').click(function() {
        alert('Childer Pressed');
    });
});
