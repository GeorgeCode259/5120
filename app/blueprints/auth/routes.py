from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_user, logout_user

from ...extensions import db
from ...models import User
from . import bp
from .forms import LoginForm, RegisterForm


@bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("main.home"))

    form = RegisterForm()
    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        existing = User.query.filter_by(email=email).first()
        if existing:
            flash("This email is already registered. Please sign in.", "warning")
            return redirect(url_for("auth.login"))

        user = User(email=email)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()

        flash("Account created. Please sign in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("auth/register.html", form=form)


@bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.home"))

    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(form.password.data):
            flash("Invalid email or password.", "danger")
            return render_template("auth/login.html", form=form), 401

        login_user(user)
        flash("Signed in successfully.", "success")

        next_url = request.args.get("next")
        return redirect(next_url or url_for("main.home"))

    return render_template("auth/login.html", form=form)


@bp.post("/logout")
def logout():
    logout_user()
    flash("Signed out.", "info")
    return redirect(url_for("main.home"))

