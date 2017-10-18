console.log('utils.js loaded')
// Utils is short for Utilities.
// Basically, globally defined functions to be used whenever needed.
// You can also define constants and global variables here. But, make sure it is included before other scripts.

// Moment is a library object used to format dates.
// moment documentation: http://momentjs.com/
moment.locale('en-us');
const ISO_DATE_FORMAT = "YYYY-MM-DD"

// Converter is an object that contains methods to convert Markdown to HTML.
const converter = new showdown.Converter();
converter.setFlavor('github');

// This binds an input jquery element to an output jquery element
// so that `markdown` entered in input will produce HTML in output element
function markdownBind($inputElement, $outputElement) {
    let markdown = $inputElement.val() || $inputElement.text()
    let html = converter.makeHtml(markdown)
    $outputElement.html(html)
    $inputElement.on('input', () => {
        let markdown = $inputElement.val() || $inputElement.text()
        let html = converter.makeHtml(markdown)
        $outputElement.html(html)
    })
}

// This is just a simple text binding between an input field and an output element. No conversion happens.
function textBind($inputElement, $outputElement) {
    $outputElement.text($inputElement.val() || $inputElement.text())
    $inputElement.on('input', () => {
        $outputElement.text($inputElement.val() || $inputElement.text())
    })
}

function populateInputFields(dataObject, fieldsArray) {
    for(let i = 0; i < fieldsArray.length; ++i) {
        let fieldName = fieldsArray[i]
        try {
            $('#' + fieldName)
            $('#' + fieldName).val(dataObject[fieldName])
        } catch(e) { console.log(e) }
    }
}

function populateText(dataObject, fieldsArray) {
    for(let i = 0; i < fieldsArray.length; ++i) {
        let fieldName = fieldsArray[i]
        $('#' + fieldName).text(dataObject[fieldName])
    }
}

function getId(resourceName, url=location.pathname) {
    if (url.indexOf(resourceName) < 0) {
        return null;
    }
    let str = url.substring(url.indexOf(resourceName) + `${resourceName}/`.length)
    if (str.indexOf('/') !== -1) {
        return str.substring(0, str.indexOf('/'))
    } else {
        return str.replace(/#/gi, '')
    }
}

function commaSeparatedStringToArray(str) {
    // trim and filter blanks
    return str.split(",")
        .map(val => val.trim())
        .filter(val => (val.length > 0))
}

// This function has the effect of `cd ..` in the URL
function cdDotDot(dir) {
    if (typeof dir == 'undefined') {
        dir = location.pathname.substring(0, location.pathname.lastIndexOf('/'))
    } else {
        dir = dir.substring(0, dir.lastIndexOf('/'))
    }
    return dir
}

// This returns a JSON representation of a formData object.
// It is useful when submitting Forms.
function getJSON(formData) {
    let json = {}
    for (let [key, value] of formData.entries()) {
        json[key] = value;
    }
    return json;
}