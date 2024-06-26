import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "aspeelucas@gmail.com",
        pass: "hxqy hrxu pqav rxcx",
      },
    });
  }

  async sendEmail(user, code, amount, purchase_date, products) {
    try {
      await this.transporter.sendMail({
        from: "Ecommerce Top <aspeelucas@gmail.com>",
        to: `${user}`,
        subject: "Test email",
        html: `
        <h1>Confirmacion de compra</h1>
        <h1>Usuario : ${user}</h1>
        <h2>Codigo de compra : ${code}</h2>
        <h3>Monto : ${amount}</h3>
        <h4>Fecha de compra : ${purchase_date}</h4>
        <h5>Productos : ${products} </h5>


        `,
      });
      console.log("Email enviado con exito");
    } catch (error) {
      console.error("Error al enviar el email", error);
    }
  }

  async sendEmailResetPassword(email, first_name, token) {
    try {
      const mailOptions = {
        from: "Ecommerce Top <aspeelucas@gmail.com>",
        to: email,
        subject: "Restablecer contraseña",
        html: `
        <h1>Restablecer contraseña</h1>
        <h2>Hola ${first_name}</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña</p>
        <p>Tu token de restablecimiento es: ${token}</p>
        <p>Este codigo expirara en 1 Hora</p>
        <p>Para restablecer tu contraseña haz click en el siguiente enlace</p>
        <a href="http://localhost:8080/change-password">Restablecer contraseña</a>
        <p>Si no fuiste tu, ignora este mensaje</p>
        `,
      };
      await this.transporter.sendMail(mailOptions);
      console.log("Email enviado con exito");
    } catch (error) {
      console.error("Error al enviar el email", error);
    }
  }
}

export default EmailService;
