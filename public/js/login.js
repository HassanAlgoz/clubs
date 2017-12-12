(function () {
    console.log("login.js loaded")
    
    $('#h-login').text(translate('Login'))
    $('#btn-login').text(translate('Login'))
    $('#signup').text(translate('Signup'))

    function getParamValue(key) {
        let params = location.search;
        if (params.indexOf(key) < 0) {
            return null;
        }
        let str = params.substring(params.indexOf(key) + `?${key}`.length)
        return str;
    }

    let redirect = getParamValue('redirect')
    if (redirect) {
        $('#signup').attr('href', `/auth/signup?redirect=${redirect}`)
    }

    console.log($('#login').text());
})()