$('#recipeList').empty();
$.post('/hierarchy', {'recipename': recipeName, 'recipevers': recipeVersion}, function(data) {
  $.each(data, function(i, val) {
    $('#recipeList').append('<li class="sideLink" data-vers="'+val['tableversion']+'">'+val['tablename']+'</li>');
  });
});
