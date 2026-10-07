from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User, LoyaltyTransaction
from .product import Product
from .order import Order, OrderItem
from .reservation import Reservation
