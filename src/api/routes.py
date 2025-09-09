"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        raise APIException("Email and password are required", 400)

    if User.query.filter_by(email=email).first():
        raise APIException("Email already registered", 409)

    user = User(email=email, is_active=True)
    user.password = password  # << setter: genera el hash
    db.session.add(user)
    db.session.commit()

    # Requisito del enunciado: tras signup se redirige al login (frontend lo hace).
    return jsonify({"msg": "User created"}), 201


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.is_active:
        raise APIException("Invalid email or password", 401)

    # si usas el helper del modelo:
    # if not user.check_password(password): ...
    if not check_password_hash(user.password_hash, password):
        raise APIException("Invalid email or password", 401)

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_active:
        raise APIException("Unauthorized", 401)
    return jsonify({"msg": f"Welcome {user.email}!", "user": user.serialize()}), 200
