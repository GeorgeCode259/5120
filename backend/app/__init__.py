from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask

__version__ = "0.1.0"

from .cli import register_cli
from .config import DevelopmentConfig, ProductionConfig
from .extensions import cors, db, jwt, limiter, migrate


def _coerce_database_url(url: str) -> str:
    # Some platforms still provide "postgres://" which SQLAlchemy doesn't like.
    if url.startswith("postgres://"):
        return "postgresql://" + url[len("postgres://"):]
    return url


def create_app() -> Flask:
    load_dotenv()

    app = Flask(__name__, instance_relative_config=True)

    env = os.environ.get("APP_ENV") or os.environ.get("FLASK_ENV")
    env = (env or "development").lower()
    config = ProductionConfig if env == "production" else DevelopmentConfig
    app.config.from_object(config)

    os.makedirs(app.instance_path, exist_ok=True)

    db_url = os.environ.get("DATABASE_URL", "").strip()
    if db_url:
        app.config["SQLALCHEMY_DATABASE_URI"] = _coerce_database_url(db_url)
    else:
        db_path = Path(app.instance_path) / "app.db"
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)

    from .blueprints.auth import bp as auth_bp
    from .blueprints.main import bp as main_bp
    from .blueprints.products import bp as products_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(products_bp, url_prefix="/products")

    register_cli(app)

    return app
