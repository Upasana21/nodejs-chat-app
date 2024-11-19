const socket = io(); //this socket variable will receive and emit data

const $messageForm = document.querySelector("#form");
const $messageInput = $messageForm.querySelector("input");
const $messageButton = $messageForm.querySelector("button");
const $location = document.querySelector("#location");
const $messages = document.querySelector("#messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML;

//url query
const { username,room } = Qs.parse(location.search,{ignoreQueryPrefix:true})

// console.log(Qs.parse(location.search,{ignoreQueryPrefix:true}))

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username:message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

//GET CHATROOM USERS DATA
socket.on('roomData',({ room, users })=>{
  const html=Mustache.render(sidebarTemplate,{
    room,
    users
  })
  /*replace the data that's already there and not insert it adjacently to what already exists 
  unlike insertAdjacentHTML*/
  document.querySelector('#sidebar').innerHTML=html;
  
})

$messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  $messageButton.setAttribute("disabled", "disabled");

  let message = event.target.elements.message.value;
  // let message = $messageInput.value;

  socket.emit("sendMessages", message, (error) => {
    $messageButton.removeAttribute("disabled");
    if (error) {
      return console.log(error);
    }
    // console.log("Message Delivered!!!"); 
    //acknowledge from client to server
  });
  $messageInput.value = "";
  $messageInput.focus();
});

//location
socket.on("locationMessage", (message) => {
  const html = Mustache.render(locationTemplate, { 
    //template will get data(username,msg0), n display in html
    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm a') 
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

//sending coordinates to server
$location.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your Browser Doesn`t support geolocatin");
  }
  $location.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $location.removeAttribute("disabled");
        //acknowldegment fn
        // console.log("Location Shared!!!");
      }
    );
  });
});

socket.emit('join',{username,room},(error)=>{
  if(error){
    alert(error);
    location.href='/'
  }
})