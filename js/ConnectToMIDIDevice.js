
(function () {
 this.MidiGod = function () {
  this.midi = null;
  MidiGod.data = null;
  MidiGod.activeDevice = null;
  MidiGod.loader = '#loader';
  MidiGod.loaderContent = '#loader-content';
  MidiGod.main = '#main';
  MidiGod.edit = 'edit';
  MidiGod.content = 'content';
  MidiGod.skipFill = null;
  MidiGod.messageInterval = 30000;
  MidiGod.isLast = false;
  MidiGod.isReady = false;
  MidiGod.itemCount = 0;
  MidiGod.MidiMin = 0;
  MidiGod.MidiMax = 127;
  MidiGod.currentAction = -1;
  MidiGod.ButtonClass = 'commandButton';
  MidiGod.saveButtonContent = '<span>Save</span>';
  MidiGod.backButtonContent = '<span>Back</span>';
  MidiGod.disableHref = 'javascript:void(0);';
  MidiGod.indexAttr = 'data-index';

  //PingMessage
  msg_Ping = [0xf0, 0x00, 0x53, 0x43, 0x48, 0xf7];

  //Messages - GET
  //MIDI
  //Features
  msgGet_MIDI_F = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x00, 0x00, 0xf7];
  //Channels
  msgGet_MIDI_C = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x00, 0x01, 0xf7];

  //Buttons
  //Button type 
  msgGet_Button_T = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x01, 0x00, 0xf7];
  //Program change enable
  msgGet_Button_PCE = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x01, 0x01, 0xf7];
  //MIDI ID 
  msgGet_Button_MID = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x01, 0x02, 0xf7];   

  //Analog
  //Enabled state
  msgGet_Analog_ES = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x03, 0x00, 0xf7];
  //Inverted state
  msgGet_Analog_IS = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x03, 0x01, 0xf7];
  //Types
  msgGet_Analog_T = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x03, 0x02, 0xf7];
  //MIDI ID
  msgGet_Analog_MID = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x03, 0x03, 0xf7]
  //Lower CC limit
  msgGet_Analog_LCC = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x03, 0x04, 0xf7];
  //Upper CC limit 
  msgGet_Analog_UCC = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x03, 0x05, 0xf7];   
  
  //Encoders
  //Enabled state
  msgGet_Encoder_ES = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x02, 0x00, 0xf7];
  //Inverted states
  msgGet_Encoder_IS = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x02, 0x01, 0xf7];
  //Enocoding modes
  msgGet_Encoder_EM = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x02, 0x02, 0xf7];
  //MIDI ID
  msgGet_Encoder_MID = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x02, 0x03, 0xf7];  

  //LED
  //Activation notes
  msgGet_LED_AN = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x04, 0x01, 0xf7];
  //Start-up numbers
  msgGet_LED_SUN = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x04, 0x02, 0xf7];
  //RGB led enabled state
  msgGet_LED_RGB = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x04, 0x03, 0xf7];      

  //GlobalLED
  //Total LED number, blink time, start-up switch time, start-up routine, fade time
  msgGet_GlobalLED = [0xf0, 0x00, 0x53, 0x43, 0x00, 0x01, 0x04, 0x00, 0xf7];    



  //Messages - SET
  //MIDI
  //Features
  msgSet_MIDI_F = function (_standardNote, _runningStatus, _usbConvert) {
   sendMessage([0xf0, 0x00, 0x53, 0x43, 0x01, 0x01, 0x00, 0x00, _standardNote, _runningStatus, _usbConvert, 0xf7]);
  };
  //Channels
  msgSET_MIDI_C = function (_noteChannel, _programCC, _ccChannel, _inputChannel) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x01, 0x00, 0x01, _noteChannel, _programCC, _ccChannel, _inputChannel, 0xf7];
  };

  //Buttons
  //Program state
  msgSet_Button_PCE = function (_index, _programState) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x01, 0x01, _index, _programState, 0xf7];
  };
  //Button type
  msgSet_Button_T = function (_index, _buttonType) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x01, 0x00, _index, _buttonType, 0xf7]; 
  }; 
  //MIDI ID
  msgSet_Button_MID = function (_index, _midiID) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x01, 0x02, _index, _midiID, 0xf7];   
  };
 
  //Analog
  //Enabled state
  msgSet_Analog_ES = function (_index, _enabledState) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x03, 0x00, _index, _enabledState, 0xf7];
  };
  //Inverted state
  msgSet_Analog_IS = function (_index, _invertedState) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x03, 0x01, _index, _invertedState, 0xf7];
  };
  //Types
  msgSet_Analog_T = function (_index, _types) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x03, 0x02, _index, _types, 0xf7];
  };
  //MIDI ID
  msgSet_Analog_MID = function (_index, _midiID) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x03, 0x03, _index, _midiID, 0xf7];
  };
  //Lower CC limit
  msgSet_Analog_LCC = function (_index, _lowerCC) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x03, 0x04, _index, _lowerCC, 0xf7];
  };
  //Upper CC limit
  msgSet_Analog_UCC = function (_index, _upperCC) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x03, 0x05, _index, _upperCC, 0xf7];
  };
  

  //Encoders
  //Enabled state
  msgSet_Encoder_ES = function (_index, _enabledState) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x02, 0x00, _index, _enabledState, 0xf7];
  };
  //Inverted states
  msgSet_Encoder_IS = function (_index, _invertedState) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x02, 0x01, _index, _invertedState, 0xf7];
  };
  //Enocoding modes
  msgSet_Encoder_EM = function (_index, _encodingMode) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x02, 0x02, _index, _encodingMode, 0xf7];
  };
  //MIDI ID
  msgSet_Encoder_MID = function (_index, _midiID) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x02, 0x03, _index, _midiID, 0xf7];
  };

  
  //LED
  //Activation notes
  msgSet_LED_AN = function (_index, _activationNote) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x04, 0x01, _index, _activationNote, 0xf7];
  };
  //Start-up numbers
  msgSet_LED_SUN = function (_index, _startupNumber) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x04, 0x02, _index, _startupNumber, 0xf7];
  };
  //RGB led enabled state
  msgSet_LED_RGB = function (_index, _rgbEnable) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x00, 0x04, 0x03, _index, _rgbEnable, 0xf7];
  };

  //GlobalLED
  //Total LED number, blink time, start-up switch time, start-up routine, fade time
  msgSet_GlobalLED = function (_totalLED, _blinkTime, _startUpST, _startUpR, _fadeTime) {
   return [0xf0, 0x00, 0x53, 0x43, 0x01, 0x01, 0x04, 0x00, _totalLED, _blinkTime, _startUpST, _startUpR, _fadeTime, 0xf7];
  };


  sendMessage = function (_message, _skipFill) {
   if (!MidiGod.activeDevice) { return; }
   MidiGod.skipFill = _skipFill;
   var output = MidiGod.midi.outputs.get(MidiGod.activeDevice.id);
   if (output)
    output.send(_message);
  };
  
  pingMessage = function () {
   sendMessage(msg_Ping, true);
  };

  setPingMessage = function () {
   pingMessage();
   setInterval(function () { pingMessage(); }, MidiGod.messageInterval);
  };

  this.hearOurCall = function () {
   if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
     sysex: true
    }).then(onMIDISuccess, onMIDIFailure);
   } else {
    alert("No MIDI support in your browser.");
   }
  };

  onMIDISuccess = function (_midiAccess) {
   MidiGod.midi = _midiAccess;
   setupMidiDevices();
   MidiGod.midi.onstatechange = onStateChange;
  };

  onMIDIFailure = function (e) {
   alert("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
  };

  onMIDIMessage = function (_message) {
   if (MidiGod.skipFill) { MidiGod.skipFill = !MidiGod.skipFill; return; }
   if (MidiGod.data == null) { MidiGod.data = new Array; };
   MidiGod.data.push(_message.data);
   if (MidiGod.isLast) { MidiGod.isLast = !MidiGod.isLast; MidiGod.isReady = true; }
   //console.log('OnMidiMessage', 'Current action:' + window.currentAction);
   //console.log('OnMidiMessageData', data);
  };

  onStateChange = function (_event) {
   setTimeout(function () {
    if (_event.port.state == 'disconnected' && _event.port.name == 'OpenDeck') {
     MidiGod.activeDevice = null;
     $(MidiGod.loaderContent).html('Searching for device');
     $(MidiGod.main).fadeOut(MidiGod.fadeDelay, function () {
      $(MidiGod.loader).fadeIn(MidiGod.fadeDelay);
      });
    }

    if (!MidiGod.activeDevice) {
     setTimeout(function () {
      setupMidiDevices();
     }, 1000);
    }
   }, 500);
  };

  setupMidiDevices = function () {
   var inputs = MidiGod.midi.inputs.values();
   // loop over all available inputs and listen for any MIDI input
   var count = 0;
   var id;

   for (var input = inputs.next() ; input && !input.done; input = inputs.next()) {
    if (input.value.name.indexOf('OpenDeck') != -1) {
     id = input.value.id;
     count += 1;
     // each time there is a midi message call the onMIDIMessage function
     input.value.onmidimessage = onMIDIMessage;
    }
   }

   if (!MidiGod.activeDevice) {
    if (count === 1) {
     MidiGod.activeDevice = MidiGod.midi.inputs.get(id);
     setPingMessage();
     deviceFound();
    } else {
     if (count != 0) {
      $(this.loaderContent).html('Multiple devices detected. Please connect only one OpenDeck!');
     }
    }
   }
  };

  bindMenu = function () {
   document.getElementById('btn_midi').setAttribute('onclick', 'showLoading();menu();fillDataMIDI();endLoading();');
   document.getElementById('btn_btns').setAttribute('onclick', 'showLoading();menu();fillDataButton();showContent();endLoading();');
   document.getElementById('btn_enco').setAttribute('onclick', 'showLoading();menu();fillDataEncoder();showContent();endLoading();');
   document.getElementById('btn_leds').setAttribute('onclick', 'showLoading();menu();fillDataLED();showContent();endLoading();');
   document.getElementById('btn_gled').setAttribute('onclick', 'showLoading();menu();fillDataGlobalLED();endLoading();');
   document.getElementById('btn_anal').setAttribute('onclick', 'showLoading();menu();fillDataAnalog();showContent();endLoading();');
   return;
  };

  showLoading = function () {
   $(MidiGod.loaderContent).html('Loading...');
   $(MidiGod.main).css('display', 'none');
   $('#' + MidiGod.content).html('');
   $('#' + MidiGod.edit).html('');
   $(MidiGod.loader).css('display', 'block');
   return;
  };

  endLoading = function () {
   setTimeout(function () {
    $(MidiGod.loader).fadeOut(1000, function () {
     $(MidiGod.main).fadeIn();
     setContentMargin();
    });
   }, 2000);
   return;
  };

  deviceFound = function () {
   setTimeout(function () {
    $(MidiGod.loaderContent).html('Device found!');
    bindMenu();
    setTimeout(function () {
     $(MidiGod.loader).fadeOut(1000, function () {
      $(MidiGod.main).fadeIn();
      
     });
    }, 500);
   }, 500);
  };
  
  dataReset = function () {
   MidiGod.isLast = false;
   MidiGod.isReady = false;
   MidiGod.data = null;
   MidiGod.itemCount = 0;
   return;
  };

  getDataForIndex = function (_index, _array) {
   return _array[_index + getZeroIndex(_array)];
  };
  
  getZeroIndex = function (_array) {
   return _array.indexOf(65) + 1;
  }

  getLastIndex = function (_array) {
   return _array.length - 1;
  }

  getItemCount = function (_array) {
   return getLastIndex(_array) - getZeroIndex(_array);
  }
  
  showEdit = function () {
   $('#' + MidiGod.content).fadeOut(100, function () { $('#' + MidiGod.edit).fadeIn(); });
  };

  showContent = function () {
   $('#' + MidiGod.edit).fadeOut(100, function () { $('#' + MidiGod.content).fadeIn(); });
  };

  backButton = function () {
   var a = document.createElement('a');
   a.innerHTML = MidiGod.backButtonContent;
   a.onclick = showContent;
   a.setAttribute('class', MidiGod.ButtonClass);
   a.setAttribute('href', MidiGod.disableHref);
   return a;
  }

  //MIDI related functions
  //Reset data, send get messages
  getDataMIDI = function () {
   dataReset();
   sendMessage(msgGet_MIDI_F, false);
   MidiGod.isLast = true;
   sendMessage(msgGet_MIDI_C, false);
   return;
  };
  //Get data, set data
  fillDataMIDI = function () {
   setTitle('MIDI');
   getDataMIDI();
   setTimeout(function () {
    editDataMIDI();
   }, 500);
  };
  //Edit data
  editDataMIDI = function () {
   //features
   var _standardNote = getDataForIndex(0, MidiGod.data[0]);
   var _runningStatus = getDataForIndex(1, MidiGod.data[0]);
   var _usbConvert = getDataForIndex(2, MidiGod.data[0]);
   //channels
   var _noteChannel = getDataForIndex(0, MidiGod.data[1]);
   var _programChangeChannel = getDataForIndex(1, MidiGod.data[1]);
   var _ccChannel = getDataForIndex(2, MidiGod.data[1]);
   var _inputChannel = getDataForIndex(3, MidiGod.data[1]);

   var _edit = document.getElementById(MidiGod.edit);
   _edit.innerHTML = '';

   _edit.appendChild(addBlock(generateText('Global setup'), "MIDI - features"));
   _edit.appendChild(addBlock(generateSwitch('standard-note', _standardNote, 'Enabled', 'Disabled'), "Standard note"));
   _edit.appendChild(addBlock(generateSwitch('running-status', _runningStatus, 'Enabled', 'Disabled'), "Running status"));
   _edit.appendChild(addBlock(generateSwitch('usb', _usbConvert, 'Enabled', 'Disabled'), "Usb convert"));

   _edit.appendChild(addBlock(generateText('Global setup'), "MIDI - channels"));
   _edit.appendChild(addBlock(generateRange('note-channel', _noteChannel, 1, 16), "Note channel"));
   _edit.appendChild(addBlock(generateRange('program-change', _programChangeChannel, 1, 16), "Program change channel"));
   _edit.appendChild(addBlock(generateRange('cc-channel', _ccChannel, 1, 16), "CC channel"));
   _edit.appendChild(addBlock(generateRange('input-channel', _inputChannel, 1, 16), "Input channel"));

   _edit.appendChild(saveDataButton_MIDI(-1));
   //_edit.appendChild(backButton());

   showEdit();
  };
  //Set button save
  saveDataButton_MIDI = function (_index) {
   //return '<a href="' + MidiGod.disableHref + '" class="' + MidiGod.saveButtonClass + '" ' + MidiGod.indexAttr + '="' + _index + '" onclick=>' + MidiGod.saveButtonContent + '</a>'
   var a = document.createElement('a');
   a.innerHTML = MidiGod.saveButtonContent;
   a.onclick = saveDataMIDI;
   a.setAttribute('class', MidiGod.ButtonClass);
   a.setAttribute('href', MidiGod.disableHref);
   a.setAttribute(MidiGod.indexAttr, _index);
   return a;
  };
  //Save data
  saveDataMIDI = function (_sender) {
   //features
   var _standardNote = getValueSwitch('standard-note');
   var _runningStatus = getValueSwitch('running-status');
   var _usbConvert = getValueSwitch('usb');
   //channels
   var _noteChannel = getValueRange('note-channel');
   var _programChangeChannel = getValueRange('program-change');
   var _ccChannel = getValueRange('cc-channel');
   var _inputChannel = getValueRange('input-channel');

   sendMessage(msgSet_MIDI_F(_standardNote,_runningStatus,_usbConvert), true);
   sendMessage(msgSet_MIDI_C(_noteChannel,_programChangeChannel,_ccChannel,_inputChannel), true);
   
   return;
  };



  //Button related functions
  //Reset data, send get messages
  getDataButton = function () {
   dataReset();
   sendMessage(msgGet_Button_MID, false);
   sendMessage(msgGet_Button_PCE, false);
   MidiGod.isLast = true;
   sendMessage(msgGet_Button_T, false);
  };
  //Get data, set data
  fillDataButton = function () {
   setTitle('Buttons');
   getDataButton();
   setTimeout(function () {
    setDataButton();
   }, 500);
  };
  //Set data
  setDataButton = function () {
   if (!MidiGod.isReady) { setTimeout(function () { setDataButton(); }, 50); return; }
   itemCount = getItemCount(MidiGod.data[0]);

   document.getElementById(MidiGod.content).innerHTML = '';

   for (var i = 0; i < itemCount; i++) {
    var _a = document.createElement('a');
    _a.setAttribute('href', "javascript:void(0);");
    _a.setAttribute('class', 'buttonOuter');
    _a.setAttribute('onclick', 'editDataButton(' + i + ');')
    _a.innerHTML += '<span class="buttonInner">' + (i + 1) + '</span>';

    var temp = getDataForIndex(i, MidiGod.data[0]);
    _a.innerHTML += '<span class="buttonInnerLevel0">MIDI ID: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[1]);
    if (temp == 1)
     temp = 'Enabled';
    else
     temp = 'Disabled';

    _a.innerHTML += '<span class="buttonInnerLevel1">Program state: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[2]);
    if (temp == 1)
     temp = 'Latching';
    else
     temp = 'Momentary';
    _a.innerHTML += '<span class="buttonInnerLevel2">Type: ' + temp + '</span>';
    temp = null;

    document.getElementById(MidiGod.content).appendChild(_a);
    //console.log(_a)
   }
   return;
  };
  //Edit data
  editDataButton = function (_index) {
   var _m = getDataForIndex(_index, MidiGod.data[0]);
   var _p = getDataForIndex(_index, MidiGod.data[1]);
   var _b = getDataForIndex(_index, MidiGod.data[2]);

   var _edit = document.getElementById(MidiGod.edit);
   _edit.innerHTML = '';

   _edit.appendChild(addBlock(generateText(_index + 1), "Button"));
   _edit.appendChild(addBlock(generateRange('midiid', _m, MidiGod.MidiMin, MidiGod.MidiMax), "Midi ID"));
   _edit.appendChild(addBlock(generateSwitch('programstate', _p, 'Enabled', 'Disabled'), "Program state"));
   _edit.appendChild(addBlock(generateSwitch('buttontype', _b, 'Momentary', 'Latching'), "Button type"));
   _edit.appendChild(saveDataButton_Button(_index));
   _edit.appendChild(backButton());

   showEdit();


  };
  //Set button save
  saveDataButton_Button = function (_index) {
   //return '<a href="' + MidiGod.disableHref + '" class="' + MidiGod.saveButtonClass + '" ' + MidiGod.indexAttr + '="' + _index + '" onclick=>' + MidiGod.saveButtonContent + '</a>'
   var a = document.createElement('a');
   a.innerHTML = MidiGod.saveButtonContent;
   a.onclick = saveDataButton;
   a.setAttribute('class', MidiGod.ButtonClass);
   a.setAttribute('href', MidiGod.disableHref);
   a.setAttribute(MidiGod.indexAttr, _index);
   return a;
  };
  //Save data
  saveDataButton = function (_sender) {
   var _index = _sender.currentTarget.getAttribute(MidiGod.indexAttr);
   var _buttonType = getValueSwitch('buttontype');
   var _programState = getValueSwitch('programstate');
   var _midiID = getValueRange('midiid');

   sendMessage(msgSet_Button_T(_index, _buttonType),true);
   sendMessage(msgSet_Button_PCE(_index, _programState), true);
   sendMessage(msgSet_Button_MID(_index, _midiID), true);
   fillDataButton();
   return;
  };
  
  //Analog related functions
  //Reset data, send get messages
  getDataAnalog = function () {
   dataReset();
   sendMessage(msgGet_Analog_ES, false);
   sendMessage(msgGet_Analog_IS, false);
   sendMessage(msgGet_Analog_T, false);
   sendMessage(msgGet_Analog_MID, false);
   sendMessage(msgGet_Analog_LCC, false);
   MidiGod.isLast = true;
   sendMessage(msgGet_Analog_UCC, false);
  };
  //Get data, set data
  fillDataAnalog = function () {
   setTitle('Analog');
   getDataAnalog();
   setTimeout(function () {
    setDataAnalog();
   },500);
  };
  //Set data
  setDataAnalog = function () {
   if (!MidiGod.isReady) { setTimeout(function () { setDataAnalog(); }, 50); return; }
   itemCount = getItemCount(MidiGod.data[0]);

   document.getElementById(MidiGod.content).innerHTML = '';

   for (var i = 0; i < itemCount; i++) {
    var _a = document.createElement('a');
    _a.setAttribute('href', "javascript:void(0);");
    _a.setAttribute('class', 'buttonOuter');
    _a.setAttribute('onclick', 'editDataAnalog(' + i + ');')
    _a.innerHTML += '<span class="buttonInner">' + (i + 1) + '</span>';

    var temp = getDataForIndex(i, MidiGod.data[0]);
    if (temp == 1)
     temp = 'Enabled';
    else
     temp = 'Disabled';
    _a.innerHTML += '<span class="buttonInnerLevel1">En. state: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[1]);
    if (temp == 1)
     temp = 'Enabled';
    else
     temp = 'Disabled';
    _a.innerHTML += '<span class="buttonInnerLevel2">In. state: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[2]);
    if (temp == 1)
     temp = 'FSR';
    else
     temp = 'Potentiometer';
    _a.innerHTML += '<span class="buttonInnerLevel3">Type: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[3]);
    _a.innerHTML += '<span class="buttonInnerLevel0">MIDI ID: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[4]);
    _a.innerHTML += '<span class="buttonInnerLevel4">Lower-CC: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[5]);
    _a.innerHTML += '<span class="buttonInnerLevel5">Upper-CC: ' + temp + '</span>';
    temp = null;

    document.getElementById(MidiGod.content).appendChild(_a);
   }
   return;

  };
  //Edit data
  editDataAnalog = function (_index) {
   var _enabledState = getDataForIndex(_index, MidiGod.data[0]);
   var _invertedState = getDataForIndex(_index, MidiGod.data[1]);
   var _types = getDataForIndex(_index, MidiGod.data[2]);
   var _midiID = getDataForIndex(_index, MidiGod.data[3]);
   var _lowerCC = getDataForIndex(_index, MidiGod.data[4]);
   var _upperCC = getDataForIndex(_index, MidiGod.data[5]);

   var _edit = document.getElementById(MidiGod.edit);
   _edit.innerHTML = '';

   _edit.appendChild(addBlock(generateText(_index + 1), "Analog"));
   _edit.appendChild(addBlock(generateRange('midiid', _midiID, MidiGod.MidiMin, MidiGod.MidiMax), "Midi ID"));

   _edit.appendChild(addBlock(generateSwitch('enabled-state', _enabledState, 'Enabled', 'Disabled'), "Enable state"));
   _edit.appendChild(addBlock(generateSwitch('inverted-state', _invertedState, 'Enabled', 'Disabled'), "Inverted state"));
   _edit.appendChild(addBlock(generateSwitch('type', _types, 'FSR', 'Potentiometer'), "Type"));

   _edit.appendChild(addBlock(generateRange('lower-cc', _lowerCC, MidiGod.MidiMin, MidiGod.MidiMax), "Lower CC"));
   _edit.appendChild(addBlock(generateRange('upper-cc', _upperCC, MidiGod.MidiMin, MidiGod.MidiMax), "Upper CC"));

   _edit.appendChild(saveDataButton_Analog(_index));
   _edit.appendChild(backButton());

   showEdit();
  };
  //Set button save
  saveDataButton_Analog = function (_index) {
   var a = document.createElement('a');
   a.innerHTML = MidiGod.saveButtonContent;
   a.onclick = saveDataAnalog;
   a.setAttribute('class', MidiGod.ButtonClass);
   a.setAttribute('href', MidiGod.disableHref);
   a.setAttribute(MidiGod.indexAttr, _index);
   return a;
  };
  //Save data
  saveDataAnalog = function (_sender) {
   var _index = _sender.currentTarget.getAttribute(MidiGod.indexAttr);
  

   var _enabledState = getValueSwitch('enabled-state');
   var _invertedState = getValueSwitch('inverted-state');
   var _types = getValueSwitch('type');
   var _midiID = getValueRange('midiid');
   var _lowerCC = getValueRange('lower-cc');
   var _upperCC = getValueRange('upper-cc');


   sendMessage(msgSet_Analog_ES(_index, _enabledState), true);
   sendMessage(msgSet_Analog_IS(_index, _invertedState), true);
   sendMessage(msgSet_Analog_T(_index, _types), true);
   sendMessage(msgSet_Analog_MID(_index, _midiID), true);
   sendMessage(msgSet_Analog_LCC(_index, _lowerCC), true);
   sendMessage(msgSet_Analog_UCC(_index, _upperCC), true);
   setTimeout(function () {
    fillDataAnalog();
   }, 1000);
   return;
  };

  //Encoders related function
  //Reset data, send get messages
  getDataEncoder = function () {
   dataReset();
   sendMessage(msgGet_Encoder_ES, false);
   sendMessage(msgGet_Encoder_IS, false);
   sendMessage(msgGet_Encoder_EM, false);
   MidiGod.isLast = true;
   sendMessage(msgGet_Encoder_MID, false);
  };
  //Get data, set data
  fillDataEncoder = function () {
   setTitle('Encoders');
   getDataEncoder();
   setTimeout(function () {
    setDataEncoder();
   }, 500);
  };
  //Set data
  setDataEncoder = function () {
   if (!MidiGod.isReady) { setTimeout(function () { setDataEncoder(); }, 50); return; }
   itemCount = getItemCount(MidiGod.data[0]);

   document.getElementById(MidiGod.content).innerHTML = '';

   for (var i = 0; i < itemCount; i++) {
    var _a = document.createElement('a');
    _a.setAttribute('href', "javascript:void(0);");
    _a.setAttribute('class', 'buttonOuter');
    _a.setAttribute('onclick', 'editDataEncoder(' + i + ');')
    _a.innerHTML += '<span class="buttonInner">' + (i + 1) + '</span>';

    var temp = getDataForIndex(i, MidiGod.data[0]);
    if (temp == 1)
     temp = 'Enabled';
    else
     temp = 'Disabled';
    _a.innerHTML += '<span class="buttonInnerLevel1">En. state: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[1]);
    if (temp == 1)
     temp = 'Enabled';
    else
     temp = 'Disabled';
    _a.innerHTML += '<span class="buttonInnerLevel2">In. state: ' + temp + '</span>';
    temp = null;
    
    temp = getDataForIndex(i, MidiGod.data[2]); 
    if (temp == 1)
     temp = '7Fh01h';
    else
     temp = '3Fh41h';
    _a.innerHTML += '<span class="buttonInnerLevel3">Encoding: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[3]);
    _a.innerHTML += '<span class="buttonInnerLevel0">MIDI ID: ' + temp + '</span>';
    temp = null;

    document.getElementById(MidiGod.content).appendChild(_a);
   }
   return;

  };
  //Edit data
  editDataEncoder = function (_index) {
   var _enabledState = getDataForIndex(_index, MidiGod.data[0]);
   var _invertedState = getDataForIndex(_index, MidiGod.data[1]);
   var _encodingMode = getDataForIndex(_index, MidiGod.data[2]);
   var _midiID = getDataForIndex(_index, MidiGod.data[3]);
   var _edit = document.getElementById(MidiGod.edit);
   _edit.innerHTML = '';

   _edit.appendChild(addBlock(generateText(_index + 1), "Encoder"));
   _edit.appendChild(addBlock(generateRange('midiid', _midiID, MidiGod.MidiMin, MidiGod.MidiMax), "Midi ID"));
   _edit.appendChild(addBlock(generateSwitch('enabled-state', _enabledState, 'Enabled', 'Disabled'), "Enabled state"));
   _edit.appendChild(addBlock(generateSwitch('inverted-state', _invertedState, 'Enabled', 'Disabled'), "Inverted state"));
   _edit.appendChild(addBlock(generateSwitch('encoding-mode', _encodingMode, '7Fh01h', '3Fh41h'), "Encoding mode"));
   
   _edit.appendChild(saveDataButton_Encoder(_index));
   _edit.appendChild(backButton());

   showEdit();
  };
  //Set button save
  saveDataButton_Encoder = function (_index) {
   var a = document.createElement('a');
   a.innerHTML = MidiGod.saveButtonContent;
   a.onclick = saveDataEncoder;
   a.setAttribute('class', MidiGod.ButtonClass);
   a.setAttribute('href', MidiGod.disableHref);
   a.setAttribute(MidiGod.indexAttr, _index);
   return a;
  };
  //Save data
  saveDataEncoder = function (_sender) {
   var _index = _sender.currentTarget.getAttribute(MidiGod.indexAttr);

   var _enabledState = getValueSwitch('enabled-state');
   var _invertedState = getValueSwitch('inverted-state');
   var _encodingMode = getValueSwitch('encoding-mode');
   var _midiID = getValueRange('midiid');

   sendMessage(msgSet_Encoder_ES(_index, _enabledState), true);
   sendMessage(msgSet_Encoder_IS(_index, _invertedState), true);
   sendMessage(msgSet_Encoder_EM(_index, _encodingMode), true);
   sendMessage(msgSet_Encoder_MID(_index, _midiID), true);
   setTimeout(function () {
    fillDataEncoder();
   }, 1000);
   return;
  };

  //LED related functions
  //Reset data, send get messages
  getDataLED = function () {
   dataReset();
   sendMessage(msgGet_LED_AN, false);
   sendMessage(msgGet_LED_SUN, false);
   MidiGod.isLast = true;
   sendMessage(msgGet_LED_RGB, false);
  };
  //Get data, set data
  fillDataLED = function () {
   setTitle('LED');
   getDataLED();
   setTimeout(function () {
    setDataLED();
    
   }, 500);
  };
  //Set data
  setDataLED = function () {
   if (!MidiGod.isReady) { setTimeout(function () { setDataLED(); }, 50); return; }
   itemCount = getItemCount(MidiGod.data[0]);

   document.getElementById(MidiGod.content).innerHTML = '';

   for (var i = 0; i < itemCount; i++) {
    var _a = document.createElement('a');
    _a.setAttribute('href', "javascript:void(0);");
    _a.setAttribute('class', 'buttonOuter');
    _a.setAttribute('onclick', 'editDataLED(' + i + ');')
    _a.innerHTML += '<span class="buttonInner">' + (i + 1) + '</span>';

    var temp = getDataForIndex(i, MidiGod.data[0]);
    _a.innerHTML += '<span class="buttonInnerLevel0">Activation note: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[1]);

    _a.innerHTML += '<span class="buttonInnerLevel1">Start-up number: ' + temp + '</span>';
    temp = null;

    temp = getDataForIndex(i, MidiGod.data[2]);
    if (temp == 1)
     temp = 'Enabled';
    else
     temp = 'Disabled';
    _a.innerHTML += '<span class="buttonInnerLevel2">RGB: ' + temp + '</span>';
    temp = null;

    document.getElementById(MidiGod.content).appendChild(_a);
   }
   return;
  };
  //Edit data
  editDataLED = function (_index) {
   var _activationNote = getDataForIndex(_index, MidiGod.data[0]);
   var _startupNumber = getDataForIndex(_index, MidiGod.data[1]);
   var _rgbEnable = getDataForIndex(_index, MidiGod.data[2]);

   var _edit = document.getElementById(MidiGod.edit);
   _edit.innerHTML = '';

   _edit.appendChild(addBlock(generateText(_index + 1), "LED"));
   _edit.appendChild(addBlock(generateRange('activation-note', _activationNote, 0, 127), "Activation note"));
   _edit.appendChild(addBlock(generateRange('startup-number', _startupNumber, 1, 48), "Start-up number"));
   _edit.appendChild(addBlock(generateSwitch('rgb-enable', _rgbEnable, 'Enabled', 'Disabled'), "RGB"));

   _edit.appendChild(saveDataButton_LED(_index));
   _edit.appendChild(backButton());

   showEdit();
  };
  //Set button save
  saveDataButton_LED = function (_index) {
   var a = document.createElement('a');
   a.innerHTML = MidiGod.saveButtonContent;
   a.onclick = saveDataLED;
   a.setAttribute('class', MidiGod.ButtonClass);
   a.setAttribute('href', MidiGod.disableHref);
   a.setAttribute(MidiGod.indexAttr, _index);
   return a;
  };
  //Save data
  saveDataLED = function (_sender) {
   var _index = _sender.currentTarget.getAttribute(MidiGod.indexAttr);

   var _activationNote = getValueRange('activation-note');
   var _startupNumber = getValueRange('startup-number');
   var _rgbEnable = getValueSwitch('rgb-enable');

   sendMessage(msgSet_LED_AN(_index, _activationNote), true);
   sendMessage(msgSet_LED_SUN(_index, _startupNumber), true);
   sendMessage(msgSet_LED_RGB(_index, _rgbEnable), true);
   
   setTimeout(function () {
    fillDataLED();
   }, 1000);
   return;
  };

  //Global LED related functions
  //Reset data, send get messages
  getDataGlobalLED = function () {
   dataReset();
   MidiGod.isLast = true;
   sendMessage(msgGet_GlobalLED, false);
  };
  //Get data, set data
  fillDataGlobalLED = function () {
   setTitle('Global LED');
   getDataGlobalLED();
   setTimeout(function () {
    editDataGlobalLED();
   }, 500);
  };
  //Set data, edit data
  editDataGlobalLED = function () {
   if (!MidiGod.isReady) { setTimeout(function () { editDataGlobalLED(); }, 50); return; }
   
     
   var _totalLED = getDataForIndex(0, MidiGod.data[0]);
   var _blinkTime = getDataForIndex(1, MidiGod.data[0]);
   var _startUpSwitchTime = getDataForIndex(2, MidiGod.data[0]);
   var _startUpRoutine = getDataForIndex(3, MidiGod.data[0]);
   var _fadeTime = getDataForIndex(4, MidiGod.data[0]);

   var _edit = document.getElementById(MidiGod.edit);
   _edit.innerHTML = '';

   _edit.appendChild(addBlock(generateText('Global setup'), "LED"));
   _edit.appendChild(addBlock(generateRange('total-led', _totalLED, 0, 48), "Total LED number"));
   _edit.appendChild(addBlock(generateRange('blink-time', _blinkTime, 0, 15, 100), "Blink time")); // *100
   _edit.appendChild(addBlock(generateRange('startup-switch', _startUpSwitchTime, 0, 120, 10), "Start-up switch time")); //10
   _edit.appendChild(addBlock(generateRange('startup-routine', _startUpRoutine, 0, 5), "Start-up routine"));
   _edit.appendChild(addBlock(generateRange('fade', _fadeTime, 0, 10), "Fade time"));

   _edit.appendChild(saveDataButton_GlobalLED(-1));
   //_edit.appendChild(backButton());
  
   showEdit();
   return;
  };
  //Set button save
  saveDataButton_GlobalLED = function (_index) {
   var a = document.createElement('a');
   a.innerHTML = MidiGod.saveButtonContent;
   a.onclick = saveDataGlobalLED;
   a.setAttribute('class', MidiGod.ButtonClass);
   a.setAttribute('href', MidiGod.disableHref);
   a.setAttribute(MidiGod.indexAttr, _index);
   return a;
  };
  //Save data
  saveDataGlobalLED = function (_sender) {
   var _totalLED = getValueRange('total-led');
   var _blinkTime = getValueRange('blink-time');
   var _startUpSwitchTime = getValueRange('startup-switch');
   var _startUpRoutine = getValueRange('startup-routine');
   var _fadeTime = getValueRange('fade');

   sendMessage(msgSet_GlobalLED(_totalLED,_blinkTime,_startUpSwitchTime,_startUpRoutine,_fadeTime), true);
   
   return;
  };

  setTitle = function (_content) {
   $('.title').html(_content);
  }

  generateSwitch = function (_id, _selected, _valueOn, _valueOff) {
   var _checked = 'checked';
   if (_selected == 0) { _checked = ''; }
   var out = '';
   out += '<div class="switch">';
   out += '<input id="' + _id + '" class="cmn-toggle cmn-toggle-yes-no" type="checkbox" ' + _checked + '>';
   out += '<label for="' + _id + '" data-on="' + _valueOn + '" data-off="' + _valueOff + '"></label>';
   out += '</div>';
   return out;
  };

  generateRange = function (_id, _selected, _min, _max, _multiply) {
   var _val = _selected;
   if (!isNaN(_multiply)) { _val *= _multiply; }
   return '<label class="range_label">' + _val + '</label><div class="clear"></div><input id="' + _id + '" type="range" class="range" value="' + _selected + '" min="' + _min + '" max="' + _max + '" oninput="updateValue(this, ' + _multiply + ');" />'
  };


  generateText = function (_value) {
   return '<label class="edit_text">' + _value + '</label>';
  };

  updateValue = function (sender, _multiply) {
   var val = sender.value;
   if (!isNaN(_multiply)) { val = val * _multiply; }
   $(sender).parent().find('label').html(val);
  };

  getValueRange = function (_id) {
   return $('#' + _id).val();
  };

  getValueSwitch = function (_id) {
   var _checked = $('#' + _id).prop('checked');
   if (_checked) return 1;
   return 0;
  };


  addBlock = function (_value, _header) {
   var _block = document.createElement('div');
   _block.setAttribute('class', 'block');
   if (_header)
    _block.innerHTML = '<h3 class="header">' + _header + '</h3>' + _value;
   else
    _block.innerHTML = _value;
   return _block;
  };


  this.onResize = function (event) {
   setContentMargin();
  }

  setContentMargin = function () {
   setTimeout(function () {
    var maxWidth = $('#content').width() - 1;
    var elWidth = 200;
    var maxElements = Math.floor(maxWidth / elWidth);
    var margin = mesaureMargin(maxElements, maxWidth, elWidth);
    if (margin < 20) {
     margin = mesaureMargin(maxElements - 1, maxWidth, elWidth);
    }
    $('#content a').each(function () {
     $(this).css('margin', '10px ' + margin + 'px');
    });
   }, 500);
  }


  mesaureMargin = function (maxElements, maxWidth, elWidth) {
   var w = maxElements * elWidth;
   var margin = ((maxWidth - w) / maxElements) / 2;
   return margin;
  }

 }
}());


 
  

//function getMIDIAccess() {
//    // request MIDI access
//    if (navigator.requestMIDIAccess) {
//        navigator.requestMIDIAccess({
//            sysex: true // this defaults to 'false' and we won't be covering sysex in this article. 
//        }).then(onMIDISuccess, onMIDIFailure);
//    } else {
//        alert("No MIDI support in your browser.");
//    }
//}

// midi functions
//function onMIDISuccess(midiAccess) {
// // when we get a succesful response, run this code

// //console.log('MIDI Access Object', midiAccess);
// god.midi = midiAccess;
// //window.midiAccess = midi;
// setupMidiDevices();
// god.midi.onstatechange = onStateChange;
//}


//function setupMidiDevices()
//{
// var inputs = god.midi.inputs.values();
// // loop over all available inputs and listen for any MIDI input
// var count = 0;
// var id;

// for (var input = inputs.next() ; input && !input.done; input = inputs.next()) {
//  if (input.value.name.indexOf('OpenDeck') != -1) {
//   id = input.value.id;
//   count += 1;
//   // each time there is a midi message call the onMIDIMessage function
//   input.value.onmidimessage = onMIDIMessage;

//   //listInputs(input);
//  }
// }


// var outputs = god.midi.outputs.values();

// //for (var output = outputs.next() ; output && !output.done; output = outputs.next()) {
//  //if (output.value.name.indexOf('OpenDeck') != -1) {
//   //output.value.onmidimessage = onMIDIMessage;

//  //}
// //}


// if (god.activeDevice == undefined) {
//  if (count == 1) {
//   god.activeDevice = god.midi.inputs.get(id);
//   setHelloMessage();
//   deviceFounded();
//  } else {
//   if (count != 0) {
//    $(splashScreen).html('Multiple devices detected. Please connect only one OpenDeck!');
//   }
//  }
// }

//}

//function onStateChange(event) {
// //if (event.srcElement.inputs.size == 0) {

// //}
// setTimeout(function () {
//  if (event.port.state == 'disconnected' && event.port.name == 'OpenDeck') {
//   activeDevice = undefined;
//   $(splashScreen).html('Searching for device');
//   $('#main').fadeOut(fadeDelay, function () {
//    $('#loader').fadeIn(fadeDelay);
//    $('.flip-container').removeClass('hover');
//   });
//  }

//  if (activeDevice == undefined) {
//   setTimeout(function () {
//    setupMidiDevices();
//   }, 1000);
//  }
// }, 500);
//}


//function onSingleInputStateChange(event) {
// var i;
//}

//function onSingleOutputStateChange(event) {
// var i;
//}

//function showChoice() {

//}

//function deviceFounded() {
// flip();
// setTimeout(function () {
//  $(splashScreen).html('Device found!');
//  setTimeout(function () {
//   $('#loader').fadeOut(1000, function () {
//    $('#main').fadeIn();
    
//   });
//  }, 500);
// }, 500);
//}

//function setHelloMessage() {
 
//}

//function listInputs(inputs) {
//    var input = inputs.value;
//    //device.textContent = input.name.replace(/port.*/i, '');
//    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
//            "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
//            "' version: '" + input.version + "']");
//}



//function onMIDIFailure(e) {
//    // when we get a failed response, run this code
//    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
//}


//function onMIDIMessage(message) {
// if (skipFill) { skipFill = !skipFill; return; }
// data = message.data;
// if (window.currentData == undefined) { window.currentData = new Array; };
// window.currentData.push(data);
// //console.log('OnMidiMessage', 'Current action:' + window.currentAction);
// //console.log('OnMidiMessageData', data);
//}

//function sendMessage(message) {
// if (activeDevice == undefined) { return; }
// var output = midi.outputs.get(activeDevice.id);
// if (output)
//    output.send(message);   
//}