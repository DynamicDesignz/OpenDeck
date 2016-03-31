var ENUM_Action = {
 GET_Conf_Buttons: 0
};

var fillDelay = 700,
    fadeDelay = 400,
    splashScreen = '#ripple-content';

function resetData() {
 window.currentData = undefined;
}

function resetContent()
{
    document.getElementById('content').innerHTML = '';
}

function fillData(content)
{
    document.getElementById('content').innerHTML=content;
}

function sendHelloMessage()
{
 window.skipFill = true;
 sendMessage([0xf0, 0x00, 0x53, 0x43, 0x48, 0xf7]);
}





function getDataForIndex(_index, _array) {
 return _array[_index + getZeroIndex(_array)];
}


function getZeroIndex(_array) {
 return _array.indexOf(65) + 1;
}

function flip() {
 $('.flip-container').toggleClass('hover');
}

function showContent() {
 $('#content').css('display', 'block');
 $('#edit').css('display', 'none');
}