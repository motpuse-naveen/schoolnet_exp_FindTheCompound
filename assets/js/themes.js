$(document).ready(function () {
    const currentTheme = 'blue'; //localStorage.getItem('theme') ? localStorage.getItem('theme') : 'blue';
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        $('input[name=radioTheme][data-theme-id="' + currentTheme + '"]').prop('checked', true);
        $(".form-check.theme-row").removeClass("selected")
        $('input[name=radioTheme][data-theme-id="' + currentTheme + '"]').closest(".form-check.theme-row").addClass("selected")
    }
});
$(document).on("change", ".radioTheme", function (event) {
    if (event.target.checked) {
        var themeId = event.target.getAttribute("data-theme-id")
        document.documentElement.setAttribute('data-theme', themeId);
        $(".form-check.theme-row").removeClass("selected")
        $(event.target).closest(".form-check.theme-row").addClass("selected")
        try {
            localStorage.setItem('theme', themeId);
        }
        catch (err) {
            console.log("Issue in storing theme to local storage.")
        }
    }
});