function setCookie(cname, cvalue, exdays) {
    var expiration_date = new Date();
    var cookie_string = '';
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    // Build the set-cookie string:
    cookie_string = cname+"="+cvalue+";path=/;expires="+expiration_date.toUTCString();
    console.log('cookie string: ' + cookie_string)
    document.cookie = cookie_string
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') { c = c.substring(1); }
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}

// get nodes
var $setLang = document.querySelector(".setLang");
function getCurrLang() { return getCookie('language'); }
function setCurrLang(lang) {
    console.log("Language: changing to " + lang)
    lang = lang || getCurrLang()
    setCookie('language', lang)
    $setLang.text = lang
}
function changeLang(){
    let currLang = getCurrLang()
    console.log("Language: current " + currLang)
    // CZ
    if(currLang == 'EN') { setCurrLang('CZ') }
    // EN or default
    else { setCurrLang('EN') }
}
