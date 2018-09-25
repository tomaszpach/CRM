jQuery(document).ready(function () {
    let $rootWizard = $('#rootwizard'),
        $pager = $rootWizard.find('.pager'),
        $finish = $pager.find('.finish'),
        $next = $pager.find('.next');

    $rootWizard.find('.finish').click(function () {
        // todo do something on finish
        alert('Finished!, Starting over!');
        $rootWizard.find("a[href*='tab1']").trigger('click');
    });

    $rootWizard.bootstrapWizard({
        'tabClass': 'form-wizard',
        onTabShow: function (tab, navigation, index) {
            let $total = navigation.find('li').length,
                $current = index + 1,
                $percent = ($current / $total) * 100;

            $rootWizard.find('#bar .progress-bar').css({width: $percent + '%'});

            if ($percent === 100) {
                $finish.show();
                $next.hide();
            } else {
                $finish.hide();
                $next.show();
            }
        }
    });
});