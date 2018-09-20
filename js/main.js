// todo optimize scripts!
jQuery(document).ready(function() {
    $('#rootwizard .finish').click(function() {
        alert('Finished!, Starting over!');
        $('#rootwizard').find("a[href*='tab1']").trigger('click');
    });

    $('#rootwizard').bootstrapWizard({
        'tabClass': 'form-wizard',
        onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;
            var $percent = ($current/$total) * 100;
            console.clear();
            console.log('total: ', $total);
            console.log('current:', $current);
            console.log('percent', $percent + '%');

            $('#rootwizard').find('#bar .progress-bar').css({width:$percent+'%'});
            // console.log($('#rootwizard').find('#bar .progress-bar'));

            if ($percent === 100) {
                $('#rootwizard').find('.pager .finish').css('display', 'inline-block');
            } else {
                $('#rootwizard').find('.pager .finish').hide();
            }
        }
    });
});