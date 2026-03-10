from flask import render_template

from ...models import Product
from . import bp


@bp.get("/")
def home():
    latest_products = Product.query.order_by(Product.created_at.desc()).limit(6).all()
    return render_template("home.html", latest_products=latest_products)


@bp.get("/about")
def about():
    return render_template("about.html")

