

const addCart = async (idCart, idProduct) => {
  try {
    const quantity = document.getElementById(idProduct).value;
    const response = await fetch(`/api/cart/${idCart}/product/${idProduct}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({quantity: quantity}),
    });
    const data = await response.json();
    if (response.ok) {
      Toastify({
        text:"Producto agregado al carrito" ,
        duration: 3000,
        newWindow: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background:
            "#1FC40B",
        },
        onClick: function () {}, 
      }).showToast();
    } else {
      Toastify({
        text: "Error al agregar el producto al carrito",
        duration: 3000,
        newWindow: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background:
            "red",
        },
        onClick: function () {}, 
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
      newWindow: true,
      gravity: "top", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background:
          "#1FC40B",
      },
      onClick: function () {}, 
    }).showToast();
    setTimeout(function(){
      location.reload();
  }, 1000)
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
      newWindow: true,
      gravity: "top", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background:
          "red",
      },
      onClick: function () {}, 
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
        newWindow: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background:
            "#1FC40B",
        },
        onClick: function () {}, 
      }).showToast();
      setTimeout(function(){
        location.reload();
    }, 1000)
      
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
      newWindow: true,
      gravity: "top", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background:
          "red",
      },
      onClick: function () {}, 
    }).showToast();
  }
};





let buttonValue;

decreseNumber = (id) => {
 buttonValue = parseInt(document.getElementById(`${id}`).value) - 1;
  if (buttonValue < 1) {
    buttonValue = 1;
  }
  document.getElementById(`${id}`).value = buttonValue;
  
}

increaseNumber = (stock,id) => {
  buttonValue = parseInt(document.getElementById(`${id}`).value) + 1;
  if (buttonValue > stock) {
    buttonValue = stock;
  }
  document.getElementById(`${id}`).value = buttonValue;
  
}


