import "nodemailer/lib/mailer";


declare module "nodemailer/lib/mailer" {
  // Extend the mail options with HBS plugin fields
  interface Options {
    template?: string;
    context?: Record<string, unknown>;
  }
}
