const socket = io()
const messagetemplate = $('#message-template').html();
const locationmessagetemplate = $('#location-message-template').html();
const staticmessagetemplate = $('#static-message-template').html();
const navbartemplate = $('#navbar-template').html();
const mymessage = document.querySelector('.mymessage')
const mystaticmessage = document.querySelector('.mystaticmessage')
const {username , room} = Qs.parse(location.search,{ignoreQueryPrefix: true})
const autoscroll = ()=>{
            mymessage.scrollTop = mymessage.scrollHeight;
       
}
socket.on('othermessages',(message)=>{
    const html = Mustache.render(staticmessagetemplate,{
        message:message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    });
        (mymessage.insertAdjacentHTML('beforeend',html))
        autoscroll()
})

socket.on('message',(message)=>{
    const html = Mustache.render(messagetemplate,{
        username: message.username,
        message:message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    });
        (mymessage.insertAdjacentHTML('beforeend',html))
        autoscroll();
})
socket.on('locationmessage',(message)=>{
    const html2 = Mustache.render(locationmessagetemplate,{
        username: message.username,
        url:message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    });
    console.log(mymessage);
    mymessage.insertAdjacentHTML('beforeend',html2)  
     autoscroll();
})
socket.on('userdata' ,({room,userlist})=>{
    const html = Mustache.render(navbartemplate,{
        room,
        userlist
    })
    document.querySelector('.userlist').innerHTML = html;
})
$("#send").click((e)=>{
    e.preventDefault();
    const message = $("#sentmessage").val();
    socket.emit('sendmessage',message,()=>{
            console.log('message deliverd')
        })
})
let shown = 0
let screennotclicked = true;
$('#attachment').click((e)=>{
    e.preventDefault();
    if(shown == 0)
    {
        $('.icon-bar').fadeIn();
        shown = 1;
        screennotclicked = false;
    }
    else
    {
        $('.icon-bar').fadeOut()
        shown = 0;

    }
})
$("#location").click((e)=>{
    e.preventDefault();
    $('.icon-bar').hide()
        shown = 0;
    if(!navigator.geolocation)
    {
        return alert('Your browzer do not support sending location')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendlocation',{
            latitude: position.coords.latitude,
            longitude : position.coords.longitude
        },()=>{
            console.log('Location shared')
        })
    }),{
        enableHighAccuracy : true
    }
})
socket.emit('join',{username , room},(error)=>{
    if(error)
    {
        alert(error);
        location.href = ('/')
    }
});
$("#create").click((e)=>{
    e.preventDefault();
    console.log("wswed")
    $('#joinform').hide()  ;
    $('#createform').show();
})