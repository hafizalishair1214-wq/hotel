# 👑 ZAIQA ROYALE — A Royal Taste of Lahore
### Premium Full-Stack Pakistani Restaurant & Gastronomy Portal

Zaiqa Royale is a complete, production-grade full-stack Pakistani restaurant web application. Built with **Python 3, Flask, SQLite, SQLAlchemy, Flask-Login, and Jinja2**, it delivers an authentic, opulent dining experience inspired by the culinary grandeur and Mughal heritage of Lahore.

---

## 🌟 Key Features

1. **Database-Driven Menu Engine**
   - Categorized by tradition: *Pakistani, BBQ, Karahi, Handi, Biryani, Chinese, Desserts, Drinks*.
   - Live availability tracking, real-time search, and featured dish flags managed directly via SQLite.

2. **Real-Time Feast Shopping Cart**
   - Seamless add-to-cart, quantity adjustments, and removal.
   - Dynamic calculation of subtotal, Lahore delivery fee (PKR 250), and grand total.

3. **Multi-Channel Checkout & WhatsApp Ordering**
   - **Order on WhatsApp**: Generates formatted, itemized WhatsApp order messages with single-click dispatch to the configurable restaurant number.
   - **Online Checkout**: Customer name, phone, email, and Lahore sector delivery addresses recorded directly into `orders` and `order_items` tables in SQLite.
   - **Integrated Points Redemption**: Logged-in patrons can redeem accumulated Royal Points directly at checkout for rupee discounts.
   - Support for **Cash on Delivery**, **Direct Bank Transfer**, and a clearly marked **Online Payment Gateway Placeholder**.

4. **Royal Rewards & Loyalty Points Tracking Program (`/loyalty`)**
   - **Shahi Dastarkhwan Club**: Automatic points earning (1 point per PKR 100 spent).
   - **Instant Welcome Gift**: +100 Bonus Royal Points credited upon patron registration.
   - **Embossed Digital Membership Card**: Displays member name, ID, current tier, and treasury balance.
   - **Nobility Tiers**: *Silver Noble* (1.0x), *Gold Aristocrat* (1.5x + 5% banquet discount), *Royal Platinum* (2.0x + 10% banquet discount + complimentary chef tasting).
   - **Real-Time Points Ledger**: Detailed ledger tracking every points transaction (+earned, -redeemed, +bonus).
   - **Order History & Vouchers**: Complete order receipts and redeemable culinary voucher cards.

5. **Table Reservation System (Book a Table)**
   - Online table reservation with date, time slots, guest party sizes (1–20+), and special requests (anniversaries, terrace views, private dining).
   - Stored in SQLite with instantaneous booking reference generation.

6. **Executive Admin Dashboard (`/admin`)**
   - Secured with **Flask-Login** and hashed password authentication (`admin@zaiqaroyale.com` / `admin123`).
   - Real-time business metrics (Gross Revenue, Total Orders, Active Menu Catalog, Table Bookings).
   - **Product Management**: Add new dishes, edit prices, descriptions, categories, update images, and toggle stock availability or featured status.
   - **Order Processing**: Live status transitions (*New ➔ Confirmed ➔ Preparing ➔ Ready ➔ Out for Delivery ➔ Delivered ➔ Cancelled*).
   - **Reservation Desk**: Review guest party requests, confirm, or cancel table reservations.

7. **Cinematic Royal Aesthetics**
   - Dark obsidian and charcoal palette (`#0A0B0D`, `#121418`) with warm Mughal gold accents (`#D4AF37`) and cream typography.
   - Premium culinary photography generated specifically for Zaiqa Royale (documented in `IMAGE_SOURCES.md`).
   - Integrated Google Maps of Lahore, Pakistan with configurable `RESTAURANT_MAP_LOCATION`.

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Python 3.10+
- pip (Python package installer)

### Installation Steps

1. **Clone or Navigate to the Project Root**:
   ```bash
   cd restaurant
   ```

2. **Create and Activate a Virtual Environment** *(Recommended)*:
   ```bash
   # On macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Launch the Application**:
   ```bash
   python app.py
   ```

5. **Open in Your Browser**:
   ```
   http://127.0.0.1:5000
   ```

The SQLite database (`database.db`) will automatically initialize and seed:
- 18 royal Pakistani signature dishes across all categories.
- Default administrator account.

---

## 🔐 Account Credentials
 
### Executive Administration Portal
- **URL**: `http://127.0.0.1:5000/admin/login`
- **Email**: `admin@zaiqaroyale.com`
- **Password**: `admin123`

### Demo Patron Loyalty Account (Gold Tier, 450 Points)
- **URL**: `http://127.0.0.1:5000/customer/login` (or click "Sign In" in top bar)
- **Email**: `patron@zaiqaroyale.com`
- **Password**: `patron123`
*(Or register a new account to receive +100 bonus welcome points immediately!)*

---

## 📁 Project Architecture

```
restaurant/
│
├── app.py                  # Main Flask application, routes, cart API & seeding
├── config.py               # Restaurant details, WhatsApp number & DB configuration
├── requirements.txt        # Python dependency manifest
├── README.md               # Setup and architecture documentation
├── IMAGE_SOURCES.md        # Royalty-free & original image provenance
├── database.db             # SQLite relational database
│
├── models/
│   ├── __init__.py         # SQLAlchemy initialization & model export
│   ├── user.py             # User model with password hashing & Flask-Login
│   ├── product.py          # Product catalog model
│   ├── order.py            # Order and OrderItem models
│   └── reservation.py      # Table reservation model
│
├── templates/
│   ├── base.html           # Luxury master layout, SEO schema & nav contract
│   ├── index.html          # Homepage (Hero, 6 Featured Dishes, About, Gallery, Reviews, Map)
│   ├── menu.html           # Database-driven menu with categories & search
│   ├── cart.html           # Shopping cart with WhatsApp order generator
│   ├── checkout.html       # Checkout form with payment selection
│   ├── order_success.html  # Order invoice & tracking confirmation
│   ├── reservation.html    # Book a Table form & instant confirmation
│   ├── contact.html        # Heritage location, map & contact form
│   └── admin/
│       ├── login.html      # Secure admin login
│       ├── dashboard.html  # Analytics overview & recent activity
│       ├── products.html   # Product catalog CRUD & stock toggles
│       ├── orders.html     # Order queue & status changer
│       └── reservations.html # Table booking management
│
└── static/
    ├── css/
    │   └── style.css       # Custom luxury dark-cinematic stylesheet
    ├── js/
    │   └── main.js         # AJAX cart, toast notices, mobile drawer
    └── images/             # Original culinary & architectural photography
```

---

## ⚙️ Configuration Variables (`config.py`)

All key restaurant parameters can be adjusted from one single file:
- `RESTAURANT_WHATSAPP`: The WhatsApp number for click-to-chat and instant orders.
- `RESTAURANT_MAP_LOCATION`: Google Maps search query and embed center.
- `RESTAURANT_PHONE`: Direct restaurant telephone.
- `RESTAURANT_ADDRESS`: Physical dining street address.
- `DELIVERY_FEE`: Flat delivery rate in PKR.
- `SECRET_KEY`: Flask session security secret.

---

## 🛡️ Security Best Practices
- Passwords hashed using Werkzeug (`scrypt` / `pbkdf2:sha256`).
- Session-based authentication with Flask-Login and `@login_required` guards on all admin endpoints.
- Parameterized database operations through SQLAlchemy to prevent SQL injection.
- Zero mock payment deception: online payment options are clearly designated as integration placeholders.
