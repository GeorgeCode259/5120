import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-change-me")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-change-me")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Helpful for long-lived connections (e.g., AWS RDS)
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False

