from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from ...extensions import db
from ...models import User
from . import bp


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Missing email or password"}), 400

    email = data.get("email").strip().lower()
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"msg": "Email already registered"}), 400

    user = User(email=email)
    user.set_password(data.get("password"))
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Missing email or password"}), 400

    email = data.get("email").strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(data.get("password")):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email
        }
    }), 200


@bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    return jsonify({
        "id": user.id,
        "email": user.email
    }), 200

