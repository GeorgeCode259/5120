from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ...extensions import db
from ...models import Product, Review
from . import bp


@bp.get("/")
def list_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([product.to_dict() for product in products])


@bp.post("/new")
@jwt_required()
def new_product():
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"msg": "Missing product name"}), 400

    product = Product(
        name=data.get("name").strip(),
        brand=data.get("brand", "").strip() or None,
        spf=data.get("spf"),
        pa=data.get("pa", "").strip() or None,
        kind=data.get("kind", "").strip() or None,
        description=data.get("description", "").strip() or None,
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@bp.get("/<int:product_id>")
def product_detail(product_id: int):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    reviews = (
        Review.query.filter_by(product_id=product.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    avg_rating = None
    if reviews:
        avg_rating = round(sum(r.rating for r in reviews) / len(reviews), 1)

    return jsonify({
        "product": product.to_dict(),
        "reviews": [review.to_dict() for review in reviews],
        "avg_rating": avg_rating
    })


@bp.post("/<int:product_id>/reviews")
@jwt_required()
def add_review(product_id: int):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    data = request.get_json()
    if not data or not data.get("rating"):
        return jsonify({"msg": "Missing rating"}), 400

    current_user_id = get_jwt_identity()
    review = Review(
        rating=int(data.get("rating")),
        body=data.get("body", "").strip() or None,
        user_id=int(current_user_id),
        product_id=product.id,
    )
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201

