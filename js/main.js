jQuery(document).ready(function() {
    let rootwizard = $('#rootwizard');
    rootwizard.find('.finish').click(function() {
        // todo do something on finish
        alert('Finished!, Starting over!');
        rootwizard.find("a[href*='tab1']").trigger('click');
    });

    rootwizard.bootstrapWizard({
        'tabClass': 'form-wizard',
        onTabShow: function(tab, navigation, index) {
            let $total = navigation.find('li').length,
            $current = index+1,
            $percent = ($current/$total) * 100;

            rootwizard.find('#bar .progress-bar').css({width:$percent+'%'});

            if ($percent === 100) {
                rootwizard.find('.pager .finish').css('display', 'inline-block');
            } else {
                rootwizard.find('.pager .finish').hide();
            }
        }
    });
});