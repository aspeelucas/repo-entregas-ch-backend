const addCart = async (idCart,idProduct) => {

  try {
    const response = await fetch(`/api/cart/${idCart}/product/${idProduct}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    alert("Producto agregado correctamente");
    return data;
  } catch (error) {
    console.log(error);
  }
};



const deleteProduct = async (idCart,idProduct) => {
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