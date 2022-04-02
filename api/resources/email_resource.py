import os
import threading

from flask_restful import Resource, reqparse
# from helpers.emai_helper import send_emails
from helpers.email_helper_w_img import send_emails
from dotenv import load_dotenv

load_dotenv()

url_key = os.environ.get('URL_KEY')
api_key = os.environ.get('API_KEY')

_parser = reqparse.RequestParser()
_parser.add_argument('api_key', type=str, required=True, location='json')
_parser.add_argument('name', type=str, required=True, location='json')
_parser.add_argument('email', type=str, required=True, location='json')
_parser.add_argument('phone', type=str, required=True, location='json')
_parser.add_argument('message', type=str, required=True, location='json')


class SendEmail(Resource):
    @classmethod
    def post(cls, key):
        if key == url_key:
            data = _parser.parse_args()

            if data['api_key'] == api_key:
                name = data['name']
                email = data['email']
                phone = data['phone']
                message = data['message']

                send_emails(name, email, phone, message)
                # threading.Thread(target=send_emails, args=(name, email, phone, message)).start()
                return {'status': 'success'}, 200           
        return {'status': 'failed', 'message': 'Forbbiden'}, 403