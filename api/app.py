from re import A
from dotenv import load_dotenv

from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from resources.email_resource import SendEmail

load_dotenv()

app = Flask(__name__)
CORS(app)

api = Api(app)


api.add_resource(SendEmail, '/api/v1/email/<string:key>')


if __name__ == '__main__':
    app.run()

