const socket = io('http://localhost:3000'); //location of where server is hosting socket app

socket.on('chat-message', data => {
    console.log(data)
});

// query DOM
const message = document.getElementById('message');
handle = document.getElementById('handle');
button = document.getElementById('submit');
output = document.getElementById('output');


// Emit events

button.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
})

// Listen to events

socket.on('chat', (data) => {
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
})

socket.on('userTyping', data => {
    typing.innerHTML = '<p><em>' + data + 'is typing.... <em><p>'
})

/*video chat*/
//get the local video and display
function getLVideo(callback) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var constraints = {
        audio: true,
        video: true
    }
    navigator.getUserMedia(constraints, callback.success, callback.error)
}
function recStream(stream, elementId) {
    var video = document.getElementById(elementId);
    video.srcObject = stream;

    window.peer_stream = stream;
}

getLVideo({
    success:function(stream){
        window.localstream = stream;
        recStream(stream,'lVideo');
    },
    error: function(err){
        alert("cannot access your camera");
        console.log(err);
    }
});

var conn;
var peer_id;

// create a peer connection with  peer obj
var peer = new Peer({key: 'lwjd5qra8257b9'});
//display peer id
// var id = document.createElement("displayId").innerHTML;
peer.on('open', function() {
    document.createElement("displayId").innerHTML = peer.id
    console.log('My peer ID is: ' + peer.id);
  });

peer.on('connection', function(connection){
    conn = connection;
    peer_id = connection.peer

    document.getElementById('connId').value = peer_id;
});
peer.on('error',function(err){
    alert("an error has happpened: " + err);
    console.log(err)
});

//onclick with connection button  =expose ice information 
document.getElementById('conn_submit').addEventListener('click', function(){
    peer_id = document.getElementById('connId').value;

    if(peer_id){
        conn = peer.connect(peer_id)
    }else{
        alert("enter an id");
        return false;
    }
});
//call on click  (offer and answer is exchanged )
peer.on('call',function(call){
    var acceptCall = confirm('Do you want to answer this call?');

    if(acceptCall){
        call.answer(window.localstream);

        call.on('stream', function(stream){
            window.peer_stream = stream;
            recStream(stream,'rVideo')
        });
        call.on('close', function(){
            alert('call has ended!!')
        });
    }else{
        console.log('call denied')
    }
});
//ask to call
document.getElementById('call_submit').addEventListener('click',function(){
    console.log('calling a peer'+ peer_id);
    console.log(peer);
    var call = peer.call(peer_id,window.localstream);
    call.on('stream', function(stream){
        window.peer_stream = stream;
        recStream(stream,'rVideo');
    })
})
//accept d cll
//display the remote and local video on the client


