// --- cookie ---
function setCookie(cname, cvalue, exdays) {
    var expiration_date = new Date();
    var cookie_string = '';
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
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


// --- fetch translations ---
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};
var _tr;
var downloadTr = function(lang) {
    getJSON('/xloc/'+lang.toLowerCase()+'.json', function(err, data) {
        
        if (err !== null) {
            console.log("loading xloc for " + lang + " failed")
            throw new Error(err)
        } else {
            console.log("loaded " + lang + " xloc")
            _tr = data;
        }
    })
}

// --- change language setting ---
function getCurrLang() { return getCookie('language'); }
function setCurrLang(lang) {
    console.log("Language: changing to " + lang)
    lang = lang || getCurrLang()
    // download translations
    downloadTr(lang)
    // set cookie
    setCookie('language', lang)
    // change language button
    document.querySelector(".setLang").text = lang
}
function changeLang(){
    let currLang = getCurrLang()
    console.log("Language: current " + currLang)
    // EN or default
    var nextLang = 'EN';
    // CZ
    if(currLang == 'EN') { nextLang = 'CZ' }
    setCurrLang(nextLang)
}

// --- get translation ---
function tr(key){
    return _tr[key]
}
