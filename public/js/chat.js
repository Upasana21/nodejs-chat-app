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

//AUTO-SCROLL
const autoScroll= ()=>{
  //new message
  const $newMessage=$messages.lastElementChild;

  //get styles list , we are doing this to get margin value dynamically and add it to the height
  const getStyles=getComputedStyle($newMessage);
  const getMargin=parseInt(getStyles.marginBottom);   

  //get new message height
  const newMessageHeight=$newMessage.offsetHeight + getMargin; 
  // $newMessage.offsetHeight provide border & padding height as integer

  //visible height on screen
  const visibleHeight=$messages.offsetHeight;

  //height of message container
  const containerHeight=$messages.scrollHeight; //this will give total height we can scroll through

  //distance scrolled from top? //$messages.scrollTop (how far )=> 0, 
  const scrollOffset= $messages.scrollTop + visibleHeight;
  
  if(containerHeight-newMessageHeight -1 <= scrollOffset){ //can use Math.round()too and remove -1
    $messages.scrollTop=$messages.scrollHeight; //this will push to downn
   
    //$messages.scrollTop =>how far down we scrolled (top:0)
    //$messages.scrollHeight => scrolle down all the way
  }
}

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username:message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
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
  autoScroll();
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