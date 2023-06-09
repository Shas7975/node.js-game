var socket = io();
var USER = 'unknown';

socket.on('receive', function (msg) {
	addText(msg, 'remote');
});

socket.on('join-room', function (msglog) {
	for(var i = 0; i < msglog.length; i++) {
		var source = (msglog[i].name == USER)? 'local' : 'remote';
		addText(msglog[i], source);
	}
});

input = document.getElementById('input-field');
input.addEventListener('keydown', function (event) {
	if(event.key == 'Enter') {
		if (input.value != "") {
			var msg = {
				name: USER,
				contents: input.value
			};
			socket.emit('send', msg);
			addText(msg, 'local');
			input.value = null
		}
	}
});

username = document.getElementById('username-field');
username.addEventListener('keydown', function(event) {
	if(event.key == 'Enter') {
		var value = username.value;
		if(value != "") {
			USER = value;
			hideModal();
			socket.emit('new-user', USER);
		}
	}
});


function addText(msg, source) {
	var textContainer = document.getElementById('received-texts');
	var name = document.createElement('div');
	var text = document.createElement('div');
	var textBox = document.createElement('div');
	text.innerText = msg.contents;
	name.innerText = msg.name;

	textBox.classList.add(source);
	name.classList.add('name');
	text.classList.add('text');

	textBox.appendChild(name);
	textBox.appendChild(text);

	textContainer.appendChild(textBox);
	textContainer.scrollTop = textContainer.scrollHeight;
}

function hideModal() {
	var backdrop = document.getElementsByClassName('modal-backdrop')[0];
	var modal = document.getElementsByClassName('modal')[0];
	backdrop.classList.add('hidden');
	modal.classList.add('hidden');
}