import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "node:path";


export function makeTransport() {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = port === 465; // 465=SSL, 587/2525=STARTTLS

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port,
        secure,
        auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });

    // Point to your templates folder
    const templatesDir = path.join(process.cwd(), "src", "emails");

    transporter.use(
        "compile",
        hbs({
            viewEngine: {
                extname: ".hbs",
                layoutsDir: path.join(templatesDir, "layouts"),
                partialsDir: path.join(templatesDir, "partials"),
                defaultLayout: "main",
            },
            viewPath: templatesDir,
            extName: ".hbs",
        })
    );

    return transporter;
}
