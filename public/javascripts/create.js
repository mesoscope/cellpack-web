$(document).ready(function() {
    $('#childrenHeader').hide();
    $('#recOptioner').click(function() {
        $('#recOptionFields').append('<br><input type="text" class="optionLabs" name="optionLab"><input type="text" class="optionVals" name="optionVal">');
    });
    $.getScript('javascripts/createchildren.js');
});
