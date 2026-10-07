from datetime import datetime
from . import db

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Registered customer link
    customer_name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(100), nullable=False, default='Lahore')
    order_notes = db.Column(db.Text, nullable=True)
    subtotal = db.Column(db.Float, nullable=False, default=0.0)
    delivery_fee = db.Column(db.Float, nullable=False, default=250.0)
    discount_amount = db.Column(db.Float, nullable=False, default=0.0)  # Loyalty points discount
    total = db.Column(db.Float, nullable=False, default=0.0)
    payment_method = db.Column(db.String(50), nullable=False, default='Cash on Delivery')
    status = db.Column(db.String(50), nullable=False, default='New', index=True)
    points_earned = db.Column(db.Integer, nullable=False, default=0)
    points_redeemed = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    def formatted_date(self):
        return self.created_at.strftime('%b %d, %Y - %I:%M %p') if self.created_at else ''

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'customer_name': self.customer_name,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'city': self.city,
            'order_notes': self.order_notes,
            'subtotal': self.subtotal,
            'delivery_fee': self.delivery_fee,
            'discount_amount': self.discount_amount,
            'total': self.total,
            'payment_method': self.payment_method,
            'status': self.status,
            'points_earned': self.points_earned,
            'points_redeemed': self.points_redeemed,
            'created_at': self.formatted_date(),
            'items': [item.to_dict() for item in self.items]
        }

    def __repr__(self):
        return f'<Order #{self.id} by {self.customer_name} - PKR {self.total} ({self.status})>'


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Float, nullable=False)

    product = db.relationship('Product', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Item',
            'product_image': self.product.image if self.product else '',
            'quantity': self.quantity,
            'price': self.price,
            'total': self.price * self.quantity
        }

    def __repr__(self):
        return f'<OrderItem {self.id}: Order #{self.order_id}, Product {self.product_id} x{self.quantity}>'
