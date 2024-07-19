

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const identificacion = formData.get("identificacion");
  const address = formData.get("address");
  const account = formData.get("account");
  const id = form.dataset["userId"];

  

  try {
    const data = new FormData();
    for(let file of [identificacion, address, account]){
      data.append("files", file);
    }

    const response = await fetch(`/api/sessions/${id}/documents`, {
      method: "POST",
      body: data,
    });
    if (response.ok) {
      alert("Documentos enviados correctamente");
      location.href = "/current";
    } else {
      alert("Error al enviar los documentos");
    }

    return data;
  } catch (error) {
    console.log(error);
  }
});
