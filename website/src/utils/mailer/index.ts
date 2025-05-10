import ejs, { Data } from "ejs";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import path from "path";

const vars = JSON.parse(process.env.MAIL_VARIABLES_JSON!);

/**
 * Renders the text content with variables
 *
 * @param text Text content to render with variables
 * @param params Variables used to render content
 *
 * @example
 * render("Hello world <%= myvar %>" ,  {  myvar : "!" })
 * > "Hello world !"
 */
export const render = (text: string, params: Data) => {
  return ejs.render(text, params);
};

/**
 *
 * @param filename Name of file located in templates folder
 * @param params Key value pair object must contain all the variables values defined in template file
 *
 * @example
 * renderFile("filename_here", {
 * [key]: value,
 * ...
 * })
 *
 */
export const renderFile = async (filename: string, params: Data) => {
  const pathToFile = path.resolve(
    process.cwd(),
    process.env.MAIL_TEMPLATES_DIR ?? "src/utils/mailer/templates",
    filename
  );
  return await ejs.renderFile(pathToFile, params);
};

interface MailParams {
  content: string;
  subject: string;
  senderName: string;
  receivers: string[];
  senderEmailAddress: string;
  replyTo: "no-reply@domain.com" | string;
  attachments: Mail.Attachment[] | null;
}

/**
 * Sends mail using the rendered content
 * @example
 * sendMail({
 * content : "Hello world !",
 * subject :"Test mail",
 * senderName: "System",
 * senderEmailAddress: "sender@domain.com",
 * })
 */
export const sendMail = async ({
  content,
  subject,
  senderName,
  receivers,
  senderEmailAddress,
  attachments = null,
  replyTo = "no-reply@domain.com",
}: MailParams) => {
  const transporter = nodemailer.createTransport({
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    port: 465,
    service: "gmail",
    secure: true,
  });

  const response = await transporter.sendMail({
    from: {
      name: senderName,
      address: senderEmailAddress,
    },
    to: [...receivers],
    subject,
    replyTo,
    html: content,
    attachments: attachments ?? [],
  });

  return response;
};

interface TemplateMailParams {
  template: "base" | "otp" | "password-reset-request";
  receivers: string[];
  subject: string;
  params: any;
  senderEmailAddress?: string;
  senderName?: string;
  replyTo?: string;
  attachments?: Mail.Attachment[] | null;
}

/**
 * Sends templatized mail by rendering the template specified
 *
 * @example
 * sendMail({
 * template: "template_file_name",
 * subject :"Test mail",
 * senderName: "System",
 * senderEmailAddress: "sender@domain.com",
 * params:  {
 * [key]: value,
 * ...
 * },
 * attachments: []
 * })
 */
export const sendTemplateEmail = async ({
  template,
  receivers,
  subject,
  params = {},
  senderEmailAddress = process.env.SMTP_USER!,
  senderName = "Team Visionate",
  replyTo = `${vars.REPLY_EMAIL}` || "no-reply@domain.com",
  attachments = null,
}: TemplateMailParams) => {
  const baseProps = {
    subject,
    __GLOBAL__: vars,
  };
  let content = "";
  switch (template) {
    case "otp":
      break;
    case "base":
      break;
    case "password-reset-request":
      break;

    default:
      throw new Error("Template file not registered");
  }

  content = await renderFile(template + ".ejs", {
    ...params,
    ...baseProps,
    SUBJECT: subject,
  });

  await sendMail({
    content,
    receivers: [...receivers],
    senderEmailAddress,
    subject,
    senderName,
    replyTo,
    attachments: attachments ?? [],
  });
};
