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
      alert("Producto agregado correctamente");
    } else {
      alert("Error al agregar el producto");
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
    alert("Producto eliminado correctamente");
    location.reload();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteAllProducts = async (idCart) => {
  try {
    const response = await fetch(`/api/cart/${idCart}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    alert("Productos eliminados correctamente");
    location.reload();
    return data;
  } catch (error) {
    console.log(error);
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
    alert("Error al realizar la compra");
  }
};
