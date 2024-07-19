const changeRole = async (id) => {
  try {
    const response = await fetch(`/api/sessions/premium/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.ok) {
      alert("Rol cambiado correctamente");
      location.reload();
    } else {
      alert(`Error al cambiar el rol. ${await response.text()}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
