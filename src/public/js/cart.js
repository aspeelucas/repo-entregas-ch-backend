const addCart = async (idCart, idProduct) => {
  try {
    const response = await fetch(`/api/cart/${idCart}/product/${idProduct}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.status);
    const data = await response.json();
    if (response.ok) {
      Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background:
            "linear-gradient(90deg, rgba(3,2,23,1) 0%, rgba(9,23,110,1) 33%, rgba(0,212,255,1) 100%)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    } else {
      Toastify({
        text: "Error al agregar el producto al carrito",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background:
            "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(121,9,9,1) 36%, rgba(255,16,0,1) 100%)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (idCart, idProduct) => {
  try {
    const response = await fetch(`/api/cart/${idCart}/product/${idProduct}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    Toastify({
      text: "Se elimino el producto del carrito",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          "linear-gradient(90deg, rgba(3,2,23,1) 0%, rgba(9,23,110,1) 33%, rgba(0,212,255,1) 100%)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
    // location.reload();
    return data;
  } catch (error) {
    console.log(error);
  }
};



const deleteAllProducts = async (idCart) => {
  const getCart = await fetch(`/api/cart/${idCart}`);
  const data = await getCart.json();
  if (data.products.length === 0) {
    Toastify({
      text: "Carrito vacio",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(121,9,9,1) 36%, rgba(255,16,0,1) 100%)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  } else {
    try {
      const response = await fetch(`/api/cart/${idCart}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      Toastify({
        text: "Se vacio el carrito",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background:
            "linear-gradient(90deg, rgba(3,2,23,1) 0%, rgba(9,23,110,1) 33%, rgba(0,212,255,1) 100%)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
      
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  
};

const checkOut = async (idCart) => {
  try {
    const response = await fetch(`/api/cart/${idCart}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    location.replace(`/checkout/${data._id}`);
  } catch (error) {
    console.log(error);

    Toastify({
      text: "No se pudo realizar la compra",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(121,9,9,1) 36%, rgba(255,16,0,1) 100%)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
};
