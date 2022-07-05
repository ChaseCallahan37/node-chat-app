const socket = io();

//Elements
const $messageForm = document.getElementById("message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.getElementById("send-location");
const $messages = document.getElementById("messages");
const $sideBarDiv = document.getElementById("sidebar");

//Templates
const $messageTemplate = document.getElementById("message-template").innerHTML;
const $locationTemplate =
  document.getElementById("location-template").innerHTML;
const $sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  //New message element
  const $newMessage = $messages.lastElementChild;

  //Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //Visible height
  const visibleHeight = $messages.offsetHeight;

  //Height of messages container
  const containerHeight = $messages.scrollHeight;

  //How far have I scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (
    Math.round(containerHeight - newMessageHeight - 1) <=
    Math.round(scrollOffset)
  ) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on("message", (obj) => {
  const html = Mustache.render($messageTemplate, {
    username: obj.username,
    message: obj.message,
    createdAt: moment(obj.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (obj) => {
  const html = Mustache.render($locationTemplate, {
    username: obj.username,
    locationUrl: obj.url,
    createdAt: moment(obj.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "true");
  const input = e.target.elements.message;
  socket.emit("sendMessage", input.value, (status) => {
    console.log(status);
    $messageFormButton.removeAttribute("disabled");
    input.value = "";
  });
});

$locationButton.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return console.log("You browser does not support geolocation");
  }
  $locationButton.setAttribute("disabled", "true");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      (message) => {
        console.log(message);
        $locationButton.removeAttribute("disabled");
      }
    );
  });
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sidebarTemplate, {
    users,
    room,
  });
  $sideBarDiv.innerHTML = html;
});

socket.emit("join", { username, room }, (msg) => {
  if (msg.error) {
    alert(msg);
    location.href = "/";
  }
  console.log(msg);
});
