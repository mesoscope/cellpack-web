$('.sideLink').click(function() {
  window.recipeName = $(this).html();
  window.recipeVersion = $(this).data('vers');
  $.getScript('javascripts/tabler.js');
});
