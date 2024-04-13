
const socket = io();

socket.on('allProducts',  (data) => {

    const listaInRealTime = document.getElementById('inRealTime');
    listaInRealTime.innerHTML = '';

    data.forEach((product) => {
        listaInRealTime.innerHTML += `
        <div class="cardProd">
        <h3> ${product.title} </h3>
        <p>Descripcion : ${product.description} </p>
        <p>Precio: ${product.price} </p>
        <img src="${product.thumbnail}" alt="imagen del producto" width="100px" height="100px">
        <p>Code: ${product.code} </p>
        <p>Stock : ${product.stock} </p>
        <p>Status : ${product.status} </p>
        <p>Id : ${product._id}</p>
        <button onclick=" 
        socket.emit('delete-product', '${product._id}')
        ">Eliminar</button>
        </div>
        `
    });
    
});

const form = document.querySelector('form');
form.addEventListener('submit', event => {
    event.preventDefault();
    const dataForm = new FormData(form);

    const post ={
        title: dataForm.get('title'),
        price: Number (dataForm.get('price')),
        description: dataForm.get('description'),
        category: dataForm.get('category'),
        thumbnail: dataForm.get('thumbnail'),
        code: Number (dataForm.get('code')),
        stock: Number (dataForm.get('stock')),
        status: dataForm.get('status')== 'on' ? true : false,
    }

    socket.emit('new-product', post);
    
    form.reset();
    });


