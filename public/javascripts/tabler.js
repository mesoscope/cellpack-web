$('#recTableHeader').empty();
$('#recipeForm').empty();
$('#recipeButtons').empty();


$.post('/tabler', {'recipename': recipeName, 'recipevers': recipeVersion}, function(data) {
    var tableName = data['recipeIdentifier'].split('-')[0];
    var tableVersion = data['recipeIdentifier'].split('-')[1].split('_').join('.');
    
    $('#recTableHeader').append('<h3>'+tableName+'</h3>');

    var newTableVersion = tableVersion.split('.');
    newTableVersion[2] = 'X';
    var recTable = '<table border="1" id="'+tableName+'-referencetable"><tr id="'+tableName+'-versionrow"><th>Version</th><th>'+tableVersion+'</th><th class="'+tableName+'-tableVals">'+newTableVersion.join('.')+'</th></tr>';


    
    $.each(Object.keys(data['recipeOptions']), function(i, val) {
        recTable = recTable + '<tr><th class="'+tableName+'-tableLabels">'+val+'</th><td>'+data['recipeOptions'][val]+'</td><td><input type="text" name="'+val+'" class="'+tableName+'-tableVals" val="" placeholder="'+data['recipeOptions'][val]+'"></td><tr>';
    });
    recTable = recTable + '</table><br><br>';
    
    
    $('#recipeForm').append(recTable);
    $('#recipeForm').append('<button id="submitter" type="button"> Update </button><br><br>');
    
    $('#submitter').click(function() {
        var recName = $('#recTableHeader').children().html();
        var recVersion = 'UNDEFINED';
        var recOptions = {};

        var optionLabels = [];
        $('.'+recName+'-tableLabels').each(function(index) {
            optionLabels.push($(this).html());
        });

        var edited = false;
        var optionValues = [];
        $('.'+recName+'-tableVals').each(function(index) {
            if (index == 0) {
                recVersion = $(this).html();
            } else {
                if ($(this).val() != '') {
                    edited = true;
                    optionValues.push($(this).val());
                } else {
                    optionValues.push($(this).attr('placeholder'));
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
            $.post('/commit', {'newRecipe': newRecipe, 'derivedIdentifier': data['recipeIdentifier'],'topLevel': topLevel}, function(data) {
                location.reload();
            });
        } else {
            alert('Please edit recipe before updating!');
        }
    });
});
