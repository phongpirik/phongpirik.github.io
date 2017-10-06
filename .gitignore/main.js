const socket = io('https://pirikstream.herokuapp.com/');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE',arrUserInfo => {
	$('#div-chat').show();
	$('#div-dang-ki').hide();
	arrUserInfo.forEach(user => {
		const {ten, peerId} = user;
		$('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
	});

	socket.on('CO_NGUOI_DUNG_MOI',user=>{
		const {ten, peerId} = user;
		$('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
	});

	socket.on('AI_DO_NGAT_KET_NOI',peerId=>{
		$(`#${peerId}`).remove();
	});

});
socket.on('DANG_KY_THAT_BAI',()=>{
	alert('chon username khac');
});

function openStream() {
	const config = {audio:true, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}

// openStream()
// .then(stream => playStream('localStream',stream));
const peer = new Peer({key: '868kz8csla24kj4i'});

peer.on('open',id=>{
	$('#my-peer').append(id);
	$('#btnSignUp').click(()=>{
		const username = $('#txtUsename').val();
		socket.emit('NGUOI_DUNG_DANG_KI', {ten:username, peerId:id});
	});
});

//Caller
$('#btnCall').click(()=>{
	const id = $('#remoteId').val();
	openStream()
	.then(stream => {
		playStream('localStream',stream);
		const call = peer.call(id,stream);
		call.on('stream',mediaStream => playStream('remoteStream',mediaStream));
	});
});

//callee

peer.on('call',call => {
	
	openStream()
	.then(stream => {
		call.answer(stream);
		playStream('localStream',stream);
		call.on('stream',mediaStream => playStream('remoteStream',mediaStream));

	});
});

$('#ulUser').on('click','li', function(){
	const id =($(this).attr('id'));
	openStream()
	.then(stream => {
		playStream('localStream',stream);
		const call = peer.call(id,stream);
		call.on('stream',mediaStream => playStream('remoteStream',mediaStream));
	});
});
