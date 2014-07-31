$('#recTableHeader').empty();
$('#recipeForm').empty();
$('#recipeButtons').empty();


$.post('/tabler', {'recipename': recipeName, 'recipevers': recipeVersion}, function(data) {
    var tableName = data['recipeIdentifier'].split('-')[0];
    var tableVersion = data['recipeIdentifier'].split('-')[1].split('_').join('.');
    
    $('#recTableHeader').append('<h3>'+tableName+'</h3>');
    var recTable = '<table border="1" id="'+tableName+'-referencetable">';
    var recLabels = '<tr id="'+tableName+'-referencelabels"><th>Version</th>';
    var recValues = '<tr id="'+tableName+'-referencevalues"><td>'+tableVersion+'</td>';
    var newTableVersion = tableVersion.split('.');
    newTableVersion[2] = parseInt(newTableVersion[2])+1;
    var dyValues = '<tr id="'+tableName+'-dynamicvalues"><td>'+newTableVersion.join('.')+'</td>';
    
    
    $.each(Object.keys(data['recipeOptions']), function(i, val) {
        recLabels = recLabels + '<th>'+ val + '</th>';
        recValues = recValues + '<td>' + data['recipeOptions'][val] + '</td>';
        dyValues = dyValues + '<td><input type="text" name="' + val + '" val="" placeholder="' + data['recipeOptions'][val] + '"></td>';
    });
    recTable = recTable + recLabels + '</tr>' + recValues + '</tr>' + dyValues + '</tr></table>';
    
    
    $('#recipeForm').append(recTable+'<br><br>');
    $('#recipeForm').append('<button id="submitter" type="button"> Update </button><br><br>');
    
    $('#submitter').click(function() {
        var recName = $('#recTableHeader').children().html();
        var recVersion = 'UNDEFINED';
        var recOptions = {};

        var optionLabels = [];
        $('#'+recName+'-referencelabels').children().each(function(index) {
            if (index != 0) {
                optionLabels.push($(this).html());
            }
        });
    
        var edited = false;
        var optionValues = [];
        $('#'+recName+'-dynamicvalues').children().each(function(index) {
            if (index == 0) {
                recVersion = $(this).html();
            } else {
                if ($(this).children().val() != '') {
                    edited = true;
                    optionValues.push($(this).children().val());
                } else {
                    optionValues.push($(this).children().attr('placeholder'));
                }
            }
        });

        for (var i = 0; i < optionValues.length; i++) {
            recOptions[optionLabels[i]] = optionValues[i];
        }

        var topLevel = '';
        $('.sideLink').each(function(index) {
            if (index == 0) {
                topLevel = $(this).html()+'-'+$(this).data('vers').split('.').join('_');
            }
        });
     
        if (edited) {
            var newIdentifier = recName + '-' + recVersion.split('.').join('_');
            var newRecipe = {'recipeIdentifier': newIdentifier, 'recipeOptions': recOptions};
            $.post('/commit', {'newRecipe': newRecipe, 'topLevel': topLevel})
            //window.location.replace('/');
        } else {
            alert('Please edit recipe before updating!');
        }
    });
});
