from flask import abort, flash, redirect, render_template, url_for
from flask_login import current_user, login_required

from ...extensions import db
from ...models import Product, Review
from . import bp
from .forms import ProductForm, ReviewForm


@bp.get("/")
def list_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return render_template("products/list.html", products=products)


@bp.route("/new", methods=["GET", "POST"])
@login_required
def new_product():
    form = ProductForm()
    if form.validate_on_submit():
        product = Product(
            name=form.name.data.strip(),
            brand=(form.brand.data or "").strip() or None,
            spf=form.spf.data,
            pa=(form.pa.data or "").strip() or None,
            kind=(form.kind.data or "").strip() or None,
            description=(form.description.data or "").strip() or None,
        )
        db.session.add(product)
        db.session.commit()
        flash("Product added.", "success")
        return redirect(url_for("products.product_detail", product_id=product.id))

    return render_template("products/new.html", form=form)


@bp.route("/<int:product_id>", methods=["GET", "POST"])
def product_detail(product_id: int):
    product = db.session.get(Product, product_id)
    if not product:
        abort(404)

    form = ReviewForm()
    if form.validate_on_submit():
        if not current_user.is_authenticated:
            flash("Please sign in to post a review.", "warning")
            return redirect(url_for("auth.login", next=url_for("products.product_detail", product_id=product_id)))

        review = Review(
            rating=int(form.rating.data),
            body=(form.body.data or "").strip() or None,
            user_id=current_user.id,
            product_id=product.id,
        )
        db.session.add(review)
        db.session.commit()
        flash("Review posted.", "success")
        return redirect(url_for("products.product_detail", product_id=product_id))

    reviews = (
        Review.query.filter_by(product_id=product.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    avg_rating = None
    if reviews:
        avg_rating = round(sum(r.rating for r in reviews) / len(reviews), 1)

    return render_template(
        "products/detail.html",
        product=product,
        reviews=reviews,
        avg_rating=avg_rating,
        form=form,
    )

