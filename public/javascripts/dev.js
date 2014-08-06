$(document).ready(function() {
    $('#createChild').hide();
    $('#loader').click(function() {
        window.recipeName = $('select.recn').val();
        window.recipeVersion = $('select.recv').val();
        $('#recipeHierarchy').empty();
        $.post('/hierarchy', {'recipename': recipeName, 'recipevers': recipeVersion}, function(data) {
            var hs = '';
            var makeHierarchy = function(hierarchArray) {
                if (hierarchArray instanceof Array) {
                    hs = hs + '<ul>';
                    for (var i = 0; i < hierarchArray.length; i++) {
                        makeHierarchy(hierarchArray[i]);
                    }
                    hs = hs + '</ul></li>';
                } else {
                    if (hs.substring(hs.length-9) == '</button>') {
                        hs = hs + '</li>';
                    }
                    hs = hs + '<li><button class="sideLink" data-vers="'+hierarchArray['tableversion']+'">'+hierarchArray['tablename']+'</button>';
                }
            }

            makeHierarchy(data);
            alert(hs);
            $('#recipeHierarchy').append(hs+'<br><br>');
            $('.sideLink').first().css('background-color', 'blue');
            $('#createChild').show();
        });
        $.getScript('javascripts/tabler.js');
        $.getScript('javascripts/linker.js');
    });

    $('#createChild').click(function() {
        var newName = prompt("Please enter the new recipe name!");

        var selected = $('.sideLink').filter(function() {
            return $(this).css('background-color') == 'rgb(0, 0, 255)';
        });

        $.post('/create', {'recipename': selected.html(), 'recipevers': selected.data('vers'), 'topLevel': $('.sideLink').first().html()}, function(data) {
            alert(data);
        });
    });

    $('#childer').click(function() {
        alert('Childer Pressed');
    });
});
