const changeRole = async (id) => {
  try {
    const response = await fetch(`/api/sessions/premium/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      Toastify({
        text: `Rol cambiado correctamente`,
        duration: 3000,
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#1FC40B",
        },
        onClick: function () {},
      }).showToast();
      setTimeout(function () {
        location.reload();
      }, 1000);
    } else {
      Toastify({
        text: `Error . ${await response.text()}`,
        duration: 3000,
        destination: "/premium-documents",
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "red",
        },
        onClick: function () {},
      }).showToast();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const changeRoleForAdm = async (id) => {
  try {
    const response = await fetch(`/api/sessions/admin/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      Toastify({
        text: `Rol cambiado correctamente`,
        duration: 3000,
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#1FC40B",
        },
        onClick: function () {},
      }).showToast();
      setTimeout(function () {
        location.reload();
      }, 1000);
    } else {
      Toastify({
        text: `Error . ${await response.text()}`,
        duration: 3000,
        destination: "/premium-documents",
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "red",
        },
        onClick: function () {},
      }).showToast();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (email) => {
  try {
    const response = await fetch(`/api/sessions/${email}`, {
      method: "DELETE",
    });

    if (response.ok) {
      Toastify({
        text: ` ${await response.text()} .`,
        duration: 3000,
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#1FC40B",
        },
        onClick: function () {},
      }).showToast();
      setTimeout(function () {
        location.reload();
      }, 1000);
    } else {
      Toastify({
        text: `Error . ${await response.text()}`,
        duration: 3000,
        destination: "/premium-documents",
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "red",
        },
        onClick: function () {},
      }).showToast();
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUsers = async () => {
  try {
    const response = await fetch(`/api/sessions/`, {
      method: "DELETE",
    });

    if (response.ok) {
      Toastify({
        text: `${await response.text()}`,
        duration: 3000,
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#1FC40B",
        },
        onClick: function () {},
      }).showToast();
      setTimeout(function () {
        location.reload();
      }, 2000);
    } else {
      Toastify({
        text: `Error . ${await response.text()}`,
        duration: 3000,
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "red",
        },
        onClick: function () {},
      }).showToast();
    }
  } catch (error) {
    console.log(error);
  }
};
