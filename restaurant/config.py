import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Zaiqa Royale Restaurant Configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'zaiqa-royale-lahore-secret-key-2026-royal-taste'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Restaurant Brand Details
    RESTAURANT_NAME = 'ZAIQA ROYALE'
    RESTAURANT_TAGLINE = 'A Royal Taste of Lahore'
    RESTAURANT_PHONE = '+92 42 3587 9001'
    RESTAURANT_WHATSAPP = '+923001234567'  # Easily changeable WhatsApp number
    RESTAURANT_EMAIL = 'info@zaiqaroyale.pk'
    RESTAURANT_ADDRESS = '14-B, Fort Heritage Promenade, Old Lahore, Pakistan'
    RESTAURANT_MAP_LOCATION = 'Lahore, Pakistan'  # Configurable Google Maps location
    RESTAURANT_OPENING_HOURS = 'Monday – Sunday: 12:00 PM – 1:00 AM'
    DELIVERY_FEE = 250.0  # PKR
    CURRENCY = 'PKR'
