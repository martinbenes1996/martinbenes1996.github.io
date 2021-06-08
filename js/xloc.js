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
var getTr = function(lang) {
    getJSON('/tr/'+lang.toLowerCase()+'.json', function(err, data) {
        console.log("received tr for " + lang)
        if (err !== null) {
            throw new Exception(err)
        } else {
            _tr = data;
        }
    })
}

// --- change language setting ---
function getCurrLang() { return getCookie('language'); }
function setCurrLang(lang) {
    console.log("Language: changing to " + lang)
    lang = lang || getCurrLang()
    setCookie('language', lang)
    var $setLang = document.querySelector(".setLang");
    console.log("object " + $setLang)
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

getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20yahoo.finance.quotes%20WHERE%20symbol%3D%27WRC%27&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback',
function(err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    alert('Your query count: ' + data.query.count);
  }
});

// --- get translation ---
function tr(key){
    return _tr[key]
}
