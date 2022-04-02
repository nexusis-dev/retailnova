import os

import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.text import MIMEText

from dotenv import load_dotenv

load_dotenv()

# GLOBALS
smtp_server = os.environ.get('SMTP_SERVER')
port = os.environ.get('EMAIL_PORT')
sender_email = os.environ.get('SENDER_EMAIL')
password = os.environ.get('EMAIL_PASSWORD')


def send_plane_email(to_email, mail_subject, text_body):
    subject = mail_subject
    body = text_body
    receiver_email = to_email

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message["From"] = f'RetailNOVA <{sender_email}>'
    message["To"] = receiver_email
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(body, "plain"))

    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, text)

def send_img_email(to_email, mail_subject, text_body):
    subject = mail_subject
    body = text_body
    receiver_email = to_email

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message["From"] = f'RetailNOVA <{sender_email}>'
    message["To"] = receiver_email
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(body, "plain"))
    message.attach(MIMEText('<img src="cid:image1">', 'html'))

    image = MIMEImage(open('img/g1459.png', 'rb').read())
    image.add_header('Content-ID', '<image1>')
    message.attach(image)

    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, text)


def send_confirmation_email(email, name):
    email_body = f'Dobrý den {name},\n\nděkujeme za kontaktování společnosti RetailNOVA. Vaším požadavkem se budeme zabývat co nevidět. Brzy se Vám ozveme.\n\nDěkujeme za pochopění a přejeme hezký den.\n\nS pozdravem,\n\nRetailNOVA s.r.o.\nVáš kvalitní retail partner\n\n'
    send_img_email(email, 'Děkujeme za zprávu - Váš Retail partner', email_body)


def send_emails(customer_name, customer_email, customer_phone, message):
    email_body = f'{customer_name} Vám zanechal zprávu prostřednictví kontakního formuláře.\n\nname: {customer_name}\n\nmessage: {message}\n\nemail: {customer_email}\n\nphone: {customer_phone}'

    # Send email self
    try:
        send_plane_email(sender_email, 'Contact form', email_body)
    except:
        print('Error sending mail from contact form')
    
    # Send confirmation email to customer
    try:
        send_confirmation_email(customer_email, customer_name)
    except Exception as e:
        print('Error sending confirmation mail to customer')
        print(e)
