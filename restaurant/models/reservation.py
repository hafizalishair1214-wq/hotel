from datetime import datetime
from . import db

class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    guests = db.Column(db.Integer, nullable=False, default=2)
    special_request = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='Confirmed', nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def formatted_created_at(self):
        return self.created_at.strftime('%b %d, %Y - %I:%M %p') if self.created_at else ''

    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'phone': self.phone,
            'email': self.email or '',
            'date': self.date,
            'time': self.time,
            'guests': self.guests,
            'special_request': self.special_request or '',
            'status': self.status,
            'created_at': self.formatted_created_at()
        }

    def __repr__(self):
        return f'<Reservation #{self.id}: {self.customer_name} on {self.date} at {self.time} ({self.guests} guests)>'
