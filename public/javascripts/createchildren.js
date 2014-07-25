$('#recChilder').click(function() {
    $('#childrenHeader').show()
    var nameSelector = '<br><select name="childname" class="recn">'
    $.each(recNames, function(index, recn) {
        nameSelector = nameSelector + '<option>'+recn+'</option>';
    })
    nameSelector = nameSelector + '</select>';
    $('#recChildrenFields').append(nameSelector);
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
