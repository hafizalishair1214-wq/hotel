from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(50), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), default='customer', nullable=False)  # 'customer' or 'admin'
    
    # Loyalty Points System
    loyalty_points = db.Column(db.Integer, default=100, nullable=False)  # 100 welcome bonus points
    lifetime_points = db.Column(db.Integer, default=100, nullable=False)
    membership_tier = db.Column(db.String(50), default='Silver', nullable=False)  # Silver, Gold, Platinum
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True)
    transactions = db.relationship('LoyaltyTransaction', backref='user', lazy=True, cascade='all, delete-orphan', order_by='desc(LoyaltyTransaction.created_at)')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'

    def update_tier(self):
        """Update tier based on lifetime points accumulated"""
        if self.lifetime_points >= 2500:
            self.membership_tier = 'Royal Platinum'
        elif self.lifetime_points >= 1000:
            self.membership_tier = 'Gold'
        else:
            self.membership_tier = 'Silver'

    def add_points(self, points, description="Order reward points", order_id=None):
        """Credit loyalty points and log transaction"""
        if points <= 0:
            return
        self.loyalty_points += points
        self.lifetime_points += points
        self.update_tier()
        
        tx = LoyaltyTransaction(
            user_id=self.id,
            order_id=order_id,
            points_change=points,
            balance_after=self.loyalty_points,
            action_type='earned',
            description=description
        )
        db.session.add(tx)

    def redeem_points(self, points, description="Redeemed for order discount", order_id=None):
        """Debit loyalty points and log transaction"""
        if points <= 0 or points > self.loyalty_points:
            return False
        self.loyalty_points -= points
        
        tx = LoyaltyTransaction(
            user_id=self.id,
            order_id=order_id,
            points_change=-points,
            balance_after=self.loyalty_points,
            action_type='redeemed',
            description=description
        )
        db.session.add(tx)
        return True

    def tier_perks(self):
        if self.membership_tier == 'Royal Platinum':
            return {
                'multiplier': '2.0x',
                'discount': '10% on banquets',
                'seating': 'VIP Rooftop Courtyard Reservation Priority',
                'gift': 'Complimentary Shahi Kheer & Peshawari Kahwa on every visit'
            }
        elif self.membership_tier == 'Gold':
            return {
                'multiplier': '1.5x',
                'discount': '5% on banquets',
                'seating': 'Preferred Table Seating',
                'gift': 'Complimentary Tandoori Roghni Naan basket'
            }
        else:
            return {
                'multiplier': '1.0x',
                'discount': 'Earn 1 point per PKR 100',
                'seating': 'Standard Table Reservation',
                'gift': '100 Welcome Points'
            }

    def points_to_next_tier(self):
        if self.membership_tier == 'Royal Platinum':
            return 0
        elif self.membership_tier == 'Gold':
            return max(0, 2500 - self.lifetime_points)
        else:
            return max(0, 1000 - self.lifetime_points)

    def tier_progress_percent(self):
        if self.membership_tier == 'Royal Platinum':
            return 100
        elif self.membership_tier == 'Gold':
            # Range 1000 to 2500 (1500 span)
            current_in_tier = max(0, self.lifetime_points - 1000)
            return min(100, int((current_in_tier / 1500) * 100))
        else:
            # Range 0 to 1000
            return min(100, int((self.lifetime_points / 1000) * 100))

    def __repr__(self):
        return f'<User {self.email} ({self.role}) - Tier: {self.membership_tier}, Points: {self.loyalty_points}>'


class LoyaltyTransaction(db.Model):
    __tablename__ = 'loyalty_transactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=True)
    points_change = db.Column(db.Integer, nullable=False)  # positive for earned, negative for redeemed
    balance_after = db.Column(db.Integer, nullable=False)
    action_type = db.Column(db.String(50), default='earned')  # 'earned', 'redeemed', 'bonus'
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def formatted_date(self):
        return self.created_at.strftime('%b %d, %Y - %I:%M %p')

    def __repr__(self):
        return f'<LoyaltyTransaction User {self.user_id}: {self.points_change} pts ({self.description})>'
