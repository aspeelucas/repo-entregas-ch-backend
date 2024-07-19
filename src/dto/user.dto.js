class UserDto {
    constructor(user) {
        this.email = user.email;
        this.name = user.first_name || "-";
        this.surname = user.last_name || "-";
        this.role = user.rol;
        this.fullName = `${user.first_name} ${user.last_name}` ;
        this.cart = user.cart;
        this.id = user.id;
    }
}

export default UserDto;