jQuery(document).ready(function () {
    var initAnimation = function(){
        $('[data-init="animate-number"], .animate-number').each(function () {
            var data = $(this).data();
            $(this).animateNumbers(data.value, true, parseInt(data.animationDuration, 10));
        });
        $('[data-init="animate-progress-bar"], .animate-progress-bar').each(function () {
            var data = $(this).data();
            $(this).css('width', data.percentage);
        });
    };

    initAnimation();
});
