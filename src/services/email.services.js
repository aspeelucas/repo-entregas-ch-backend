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

  async sendEmail(user, code,amount,purchase_date,products) {
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
}

export default EmailService;
