$(document).ready(function() {
    $('#createChild').hide();
    $('#saver').hide();
    $('#committer').hide();
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
            $('#recipeHierarchy').append(hs+'<br><br>');
            $('.sideLink').first().css('background-color', 'yellow');
            $('#createChild').show();
            $('#saver').show();
            $('#committer').show();
        });
        $.getScript('javascripts/tabler.js');
        $.getScript('javascripts/linker.js');
    });

    $('#createChild').click(function() {
        var newName = prompt("Please enter the new recipe name!");

        var selected = $('.sideLink').filter(function() {
            return $(this).css('background-color') == 'rgb(255, 255, 0)';
        });

        $.post('/save', {'newname': newName, 'parentname': selected.html(), 'parentvers': selected.data('vers')}, function(data) {
            alert(data);
        });
    });
});
