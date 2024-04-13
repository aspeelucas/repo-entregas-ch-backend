const socket = io();

console.log("EN VENTANA DE CHAT");

let user;

const chatBox = document.getElementById("chatBox");

const { value: email } = Swal.fire({
  title: "Ingresa tu correo electronico para continuar",
  input: "email",
  inputLabel: "correo electronico:",
  inputPlaceholder: "Escribe tu correo electronico",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  console.log("user", user);
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messagesLogs");
  let mensajes = "";
  data.forEach((mensaje) => {
    mensajes += `<div class="message">
    <strong>${mensaje.user} dice:</strong>
    <p>${mensaje.message}</p>
    </div>`;
  });
  log.innerHTML = mensajes;
});
