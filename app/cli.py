from __future__ import annotations

import click
from flask import Flask

from .extensions import db
from .models import Product


def register_cli(app: Flask) -> None:
    @app.cli.command("create-db")
    def create_db() -> None:
        """Create all database tables (dev convenience)."""
        db.create_all()
        click.echo("Database tables created.")

    @app.cli.command("seed")
    def seed() -> None:
        """Insert a few sample sunscreen products."""
        if Product.query.count() > 0:
            click.echo("Seed skipped: products already exist.")
            return

        samples = [
            Product(
                name="Daily UV Shield",
                brand="SunCare",
                spf=50,
                pa="PA++++",
                kind="lotion",
                description="Lightweight daily sunscreen for face and neck.",
            ),
            Product(
                name="Outdoor Sport Spray",
                brand="BeachPro",
                spf=60,
                pa="PA+++",
                kind="spray",
                description="Water-resistant spray for outdoor activities.",
            ),
            Product(
                name="Mineral Calm Cream",
                brand="DermaSoft",
                spf=30,
                pa="PA+++",
                kind="cream",
                description="Mineral sunscreen for sensitive skin.",
            ),
        ]
        db.session.add_all(samples)
        db.session.commit()
        click.echo("Seed data inserted.")

