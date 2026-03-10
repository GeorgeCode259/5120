from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask

from .cli import register_cli
from .config import DevelopmentConfig, ProductionConfig
from .extensions import csrf, db, login_manager, migrate
from .models import User


def _coerce_database_url(url: str) -> str:
    # Some platforms still provide "postgres://" which SQLAlchemy doesn't like.
    if url.startswith("postgres://"):
        return "postgresql://" + url[len("postgres://") :]
    return url


def create_app() -> Flask:
    load_dotenv()

    app = Flask(__name__, instance_relative_config=True)

    env = (os.environ.get("APP_ENV") or os.environ.get("FLASK_ENV") or "development").lower()
    app.config.from_object(ProductionConfig if env == "production" else DevelopmentConfig)

    os.makedirs(app.instance_path, exist_ok=True)

    db_url = os.environ.get("DATABASE_URL", "").strip()
    if db_url:
        app.config["SQLALCHEMY_DATABASE_URI"] = _coerce_database_url(db_url)
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{Path(app.instance_path) / 'app.db'}"

    db.init_app(app)
    migrate.init_app(app, db)
    csrf.init_app(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id: str) -> User | None:
        return db.session.get(User, int(user_id))

    from .blueprints.auth import bp as auth_bp
    from .blueprints.main import bp as main_bp
    from .blueprints.products import bp as products_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(products_bp, url_prefix="/products")

    register_cli(app)

    return app

