export const getErrorInfo = (box, type) => {

    switch (type) {
        case 1:
            return `Datos incompletos o no validos,
            Se estaperaba:
            - Name: String, pero se recibio ${box.first_name}
            - Lastname: String, pero se recibio ${box.last_name}
            - Email: String, pero se recibio ${box.email}`;

        case 2: 
            return `Datos incompletos o no validos,
            Se esperaba:
            - Title         : Needs to be a String, received ${box.title}
            - Description   : Needs to be a String, received ${box.description}
            - Price         : Needs to be a Number, received ${box.price}
            - Code          : Needs to be a String, received ${box.code}
            - Stock         : Needs to be a Number, received ${box.stock}
            - Category      : Needs to be a String, received ${box.category}`;

        case 3:
            return `Producto (id: ${box._id}) no encontrado`;

        case 4:
            return `Codigo ${box.code} ya existe`;

        case 5:
            return `Error en la DB`;

        case 6: 
            return `Carrito id ${box.id} no existe`;
        case 7:
            return`Error al obtener productos`;
        case 8:
            return `Error al agregar producto ${box.product.title} con id ${box.product._id} por falta de datos`; 
        case 9:`Datos incompletos o no validos para actualizar,
        Se esperaba:
        - Title         : Needs to be a String, received ${box.title}
        - Description   : Needs to be a String, received ${box.description}
        - Price         : Needs to be a Number, received ${box.price}
        - Code          : Needs to be a String, received ${box.code}
        -Thumbnail      : Needs to be a String, received ${box.thumbnail}
        - Stock         : Needs to be a Number, received ${box.stock}
        - Category      : Needs to be a String, received ${box.category}
        - Status        : Needs to be a Boolean, received ${box.status}` 

        default:
            return `Error no especificado`
    }
}