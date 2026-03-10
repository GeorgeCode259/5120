from flask import jsonify

from ...models import Product
from . import bp


@bp.get("/")
def home():
    latest_products = Product.query.order_by(Product.created_at.desc()).limit(6).all()
    return jsonify([product.to_dict() for product in latest_products])


@bp.get("/about")
def about():
    return jsonify({"msg": "Welcome to Sunscreen Review API"})

