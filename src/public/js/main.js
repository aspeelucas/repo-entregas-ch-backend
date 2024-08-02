const socket = io();
socket.on("connection", () => {
  console.log("conectado al servidor");
});

socket.on("allProducts", (data) => {
  const listaInRealTime = document.getElementById("inRealTime");
  listaInRealTime.innerHTML = "";

  data.forEach((product) => {
    listaInRealTime.innerHTML += `
    <div class="card" style="width: 20rem;">
    <div class="containerCardImg">
     <img src="${product.thumbnail}" class="card-img-top" alt="...">
    </div>
        <div class="card-body">
        <h3 class="card-title"> ${product.title} </h3>
        <p class=" fontSize">Descripcion : ${product.description} </p>
        <p class="card-text">Precio: ${product.price} </p>
        <p class="card-text">Code: ${product.code} </p>
        <p class="card-text">Stock : ${product.stock} </p>
        <p class="card-text">Status : ${product.status} </p>
        <p class="card-text">Categoria : ${product.category} </p>
        <p class="card-text">Id : ${product._id}</p>
        <p class="card-text">Owner : ${product.owner}</p>
        <button class="btn btn-danger widthButtonAdd" onclick=" 
        socket.emit('delete-product', '${product._id}', alert('Producto Eliminado'))
        ">Eliminar <i class="bi bi-trash3"></i></button>


        <button class="btn btn-primary widthButtonAdd"  onclick=" 
        socket.emit('get-product', '${product._id}')
        "
        class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        >Editar <i class="bi bi-pencil"></i></button>  
    </div>
</div>

  `;
  });
});

socket.on("allProductsOwner", (data) => {
  const listaInRealTimee = document.getElementById("inRealTimeee");
  listaInRealTimee.innerHTML = "";

  data.forEach((product) => {
    listaInRealTimee.innerHTML += `
        <div class="card" style="width: 20rem;">
        <div class="containerCardImg">
        <img src="${product.thumbnail}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
        <h3 class="card-title"> ${product.title} </h3>
        <p class="card-text">Descripcion : ${product.description} </p>
        <p class="card-text">Precio: ${product.price} </p> 
        <p class="card-text">Code: ${product.code} </p>
        <p class="card-text">Stock : ${product.stock} </p>
        <p class="card-text">Status : ${product.status} </p>
        <p class="card-text">Id : ${product._id}</p>
        <p class="card-text">Owner : ${product.owner}</p>
        <button class="btn btn-danger widthButtonAdd" onclick=" 
        socket.emit('delete-owner-products',{_id: '${product._id}', email: '${product.owner}'
        },alert('Producto Eliminado'))
        ">Eliminar <i class="bi bi-trash3"></i></button>
        <button  onclick=" 
        socket.emit('get-product', '${product._id}')
        "
        class="btn btn-primary widthButtonAdd" data-bs-toggle="modal" data-bs-target="#exampleModal"
        >Editar <i class="bi bi-pencil"></i></button>  
       </div> 

</div>

  `;
  });
});

getProductsByOwner = (email) => {
  socket.emit("ownerPro", { email });
};

const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const dataForm = new FormData(form);

  const post = {
    title: dataForm.get("title"),
    price: Number(dataForm.get("price")),
    description: dataForm.get("description"),
    category: dataForm.get("category"),
    thumbnail: dataForm.get("thumbnail"),
    code: Number(dataForm.get("code")),
    stock: Number(dataForm.get("stock")),
    status: dataForm.get("status") == "on" ? true : false,
    owner: dataForm.get("owner"),
  };

  socket.emit("new-product", post);
  
   await Toastify({
    text: "Producto agregado con exito",
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

  form.reset();
});

socket.on("product", (data) => {
  const modal = document.getElementById("modal");
  modal.innerHTML = `
  <div>
  <form id="updateForm">
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Titulo</label>
    <input required type="text" name="title" class="form-control" id="exampleInputEmail1" value="${data.title}"  aria-describedby="emailHelp">
  </div>
  <div class="mb-3">
  <label for="exampleInputEmail1" class="form-label">Precio</label>
  <input required type="number" name="price" class="form-control" id="exampleInputEmail1" value="${data.price}"  aria-describedby="emailHelp">
</div>
<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Descripcion</label>
<input required type="text" name="description" class="form-control" id="exampleInputEmail1" value= "${data.description}" aria-describedby="emailHelp">
</div>
<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Categorias</label>
<select required name="category" class="form-select" aria-label="Default select example">
  <option selected >${data.category}</option>
  <option value="computadoras">computadoras</option>
  <option value="celulares">celulares</option>
  <option value="electrodomesticos">electrodomesticos</option>
</select>
</div>
<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Imagen URL</label>
<input  type="url"  name="thumbnail" class="form-control" id="exampleInputEmail1" value= "${data.thumbnail}" aria-describedby="emailHelp">
</div>
<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Code</label>
<input required type="number"  name="code" class="form-control" id="exampleInputEmail1" value="${data.code}"  aria-describedby="emailHelp">
</div>
<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Stock</label>
<input required type="number" name="stock" class="form-control" id="exampleInputEmail1" value="${data.stock}"  aria-describedby="emailHelp">
</div>

<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Id</label>
<input required type="text" disabled  name="id" class="form-control" id="exampleInputEmail1" value= "${data._id}" aria-describedby="emailHelp">
</div>
<div class="mb-3">
<label for="exampleInputEmail1" class="form-label">Owner</label>
<input required type="text" disabled  name="owner" class="form-control" id="exampleInputEmail1" value= "${data.owner}" aria-describedby="emailHelp">
</div>


  <div class="mb-3 form-check">
    <input required type="checkbox"  " name="status" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Estado</label>
  </div>
  <div class="saveChangeBtn">
  <button type="submit" class="btn btn-primary" >Guardar Cambios</button>
  </div>
</form>
  </div>
    `;
  const updateForm = document.getElementById("updateForm");
  updateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const dataForm = new FormData(updateForm);
    const id = event.target.id.value;
    const owner = event.target.owner.value;
    const post = {
      title: dataForm.get("title"),
      price: Number(dataForm.get("price")),
      description: dataForm.get("description"),
      category: dataForm.get("category"),
      thumbnail: dataForm.get("thumbnail"),
      code: Number(dataForm.get("code")),
      stock: Number(dataForm.get("stock")),
      status: dataForm.get("status") == "on" ? true : false,
      owner: owner,
    };
    socket.emit("update-product", { id, data: post });
    Toastify({
      text: "Producto actualizado con exito",
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
    
  });
});
