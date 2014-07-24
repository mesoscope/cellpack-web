$('#recChilder').click(function() {
    // Fix this?
    $('#recChildrenFields').append('<br>', $('.recn').first().clone());
    $('#recChildrenFields').append('<select name="childversion" class="recv"></select>');
    $('.recn').last().change(function() {
        $.post('/versioner', {'recipename': $(this).val()}, function(data) {
            $('.recv').last().empty().append(function () {
                var output = '';
                $.each(data, function(versIndex) {
                    output += '<option>'+data[versIndex]+'</option>';
                })
                return output;
            });
        });
    }).change();
});
