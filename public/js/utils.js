console.log('utils.js loaded')
// Utils is short for Utilities.
// Basically, globally defined functions to be used whenever needed.
// You can also define constants and global variables here. But, make sure it is included before other scripts.

// Moment is a library object used to format dates.
// moment documentation: http://momentjs.com/
let locale = 'ar';
moment.locale('ar-sa');
const ISO_DATE_FORMAT = "YYYY-MM-DD"

function translate(str) {
    if (typeof str === 'object') {
        let array = [];
        for(let i = 0; i < str.length; i++) {
            array.push(translate(str[i]));
        }
        return array;
    }
    s = str.toLowerCase();
    if (locale == 'ar') {
        switch (s) {
            case "members only": return "للأعضاء فقط";
            case "open for all": return "للجميع";
            case "members": return "أعضاء";
            case "people": return "أشخاص";
            case "attending": return "سيحضروا";
            case "attended": return "حضروا";
            case "attendance": return "الحضور";
            case "closed": return "مغلق";
            case "seats reserved": return "المقاعد المحجوزة";
            case "seats": return "المقاعد";
            case "you promised to attend this event": return "قد وعدْت بحضور الفعالية";
            case "this event is for members only": return "هذه الفعالية للأعضاء فقط";
            case "count me in": return "عدّني من الحاضرين";
            case "am": return "ص";
            case "pm": return "م";
            case "published": return "نُشِر";
            case "username": return "اسم المستخدم";
            case "major": return "التخصص";
            case "enrollment": return "الدفعة";
            case "update attendance": return "تحديث جدول الحضور";
            case "submit edit": return "اعتماد التعديل";
            case "delete": return "حذف";
            case "edit event": return "تعديل الفعالية";
            case "reopen event": return "افتح الفعالية";
            case "event opened": return "افتتحت الفعالية";
            case "close event": return "أغلق الفعالية";
            case "event closed": return "أغلقت الفعالية";
            case "posts": return "المنشورات";
            case "events": return "الفعاليات";
            case "manage users": return "إدارة المستخدمين";
            case "manage posts": return "إدارة المنشورات";
            case "manage events": return "إدارة الفعاليات";
            case "manage clubs": return "إدارة الأندية";
            case "new post": return "إنشاء منشورة";
            case "new event": return "إنشاء فعالية";
            case "create new club": return "إنشاء نادي جديد";
            case "edit club": return "تعديل النادي";
            case "login": return "تسجيل دخول";
            case "logout": return "تسجيل خروج";
            case "signup": return "إنشاء حساب";
            case "profile": return "الملف الشخصي";
            case "home": return "الرئيسية";
            case "clubs": return "الأندية";
            case "create": return "إنشاء";
            case "manage": return "إدارة";
            case "read more": return "إقرأ المزيد";
            case "your fullname helps uniquely identifying you when participating in or organizing events": return "يساعد اسمك الكامل في تمييزك عند مشاركتك بالفعاليات أو تنظيمك لها";
            case "also send an email to all members": return "أرسل رسالة إلكترونية للأعضاء";
            case "organizers": return "المنظمون";
            case "create post": return "إنشاء النشرة";
            case "create event": return "إنشاء الفعالية";
        }
    } else {
        return str;
    }
}

if (locale == 'ar') {
    $('th').css('text-align', 'right');
}

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

function getAMPM(str) {
    let time = str.split(":");
    let hours = parseInt(time[0]);
    let minutes = parseInt(time[1]);
    if (hours > 12) {
        hours -= 12;
        if (hours < 10) {
            hours = `0${hours}`
        }
        if (minutes < 10) {
            minutes = `0${minutes}`
        }
        return `${hours}:${minutes} ${translate("PM")}`;
    }
    return `${str} ${translate("AM")}`;
}