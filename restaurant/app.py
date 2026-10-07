import os
from datetime import datetime
from flask import (
    Flask, render_template, request,
    redirect, url_for, flash, jsonify, session
)
from flask_login import (
    LoginManager, login_user, logout_user,
    login_required, current_user
)
from config import Config
from models import db, User, Product, Order, OrderItem, Reservation, LoyaltyTransaction

app = Flask(__name__)
app.config.from_object(Config)

# Initialize Extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin_login'
login_manager.login_message = 'Please log in to access the executive royal portal.'
login_manager.login_message_category = 'warning'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Context Processor for Global Template Variables
@app.context_processor
def inject_global_data():
    cart = session.get('cart', {})
    cart_count = sum(item.get('quantity', 1) for item in cart.values())
    return {
        'restaurant_name': app.config.get('RESTAURANT_NAME', 'ZAIQA ROYALE'),
        'restaurant_tagline': app.config.get('RESTAURANT_TAGLINE', 'A Royal Taste of Lahore'),
        'restaurant_phone': app.config.get('RESTAURANT_PHONE', '+92 42 3587 9001'),
        'restaurant_whatsapp': app.config.get('RESTAURANT_WHATSAPP', '+923001234567'),
        'restaurant_email': app.config.get('RESTAURANT_EMAIL', 'info@zaiqaroyale.pk'),
        'restaurant_address': app.config.get('RESTAURANT_ADDRESS', '14-B, Fort Heritage Promenade, Old Lahore, Pakistan'),
        'restaurant_map_location': app.config.get('RESTAURANT_MAP_LOCATION', 'Lahore, Pakistan'),
        'restaurant_hours': app.config.get('RESTAURANT_OPENING_HOURS', 'Monday – Sunday: 12:00 PM – 1:00 AM'),
        'delivery_fee': app.config.get('DELIVERY_FEE', 250.0),
        'currency': app.config.get('CURRENCY', 'PKR'),
        'cart_count': cart_count,
        'current_year': datetime.now().year
    }

# Cart Utility Helpers
def get_cart_details():
    cart = session.get('cart', {})
    items = []
    subtotal = 0.0

    product_ids = [int(pid) for pid in cart.keys() if pid.isdigit()]
    if product_ids:
        products = Product.query.filter(Product.id.in_(product_ids)).all()
        products_by_id = {p.id: p for p in products}

        for pid_str, item_data in cart.items():
            try:
                pid = int(pid_str)
                qty = int(item_data.get('quantity', 1))
                if pid in products_by_id and qty > 0:
                    product = products_by_id[pid]
                    line_total = product.price * qty
                    subtotal += line_total
                    items.append({
                        'product': product,
                        'quantity': qty,
                        'price': product.price,
                        'total': line_total
                    })
            except (ValueError, TypeError):
                continue

    delivery_fee = app.config.get('DELIVERY_FEE', 250.0) if items else 0.0
    total = subtotal + delivery_fee
    return items, subtotal, delivery_fee, total


# ==========================================
# PUBLIC FRONTEND ROUTES
# ==========================================

@app.route('/')
def index():
    """Home page with hero, featured dishes, categories, about, gallery, reviews & location"""
    featured_dishes = Product.query.filter_by(featured=True, availability=True).limit(6).all()
    if not featured_dishes:
        featured_dishes = Product.query.filter_by(availability=True).limit(6).all()

    categories = [
        {'name': 'Pakistani', 'icon': 'utensils', 'desc': 'Heritage slow-cooked curries & tandoor'},
        {'name': 'BBQ', 'icon': 'flame', 'desc': 'Charcoal smoked seekh kebabs & malai boti'},
        {'name': 'Karahi', 'icon': 'sparkles', 'desc': 'Sizzling iron wok specialities with desi butter'},
        {'name': 'Handi', 'icon': 'soup', 'desc': 'Creamy boneless curries in terracotta clay'},
        {'name': 'Biryani', 'icon': 'wheat', 'desc': 'Aromatic long-grain Dum Pukht saffron rice'},
        {'name': 'Chinese', 'icon': 'chef-hat', 'desc': 'Desi Chinese fusion shashlik & hot soups'},
        {'name': 'Desserts', 'icon': 'cake', 'desc': 'Pistachio Shahi Kheer & Gajar Halwa'},
        {'name': 'Drinks', 'icon': 'glass-water', 'desc': 'Signature Mint Margarita & Royal Sherbet'}
    ]

    gallery = [
        {'image': 'hero.jpg', 'title': 'The Royal Feast Banquet'},
        {'image': 'restaurant-interior.jpg', 'title': 'Mughal Architecture Hall'},
        {'image': 'restaurant-exterior.jpg', 'title': 'Courtyard Under the Stars'},
        {'image': 'karahi.jpg', 'title': 'Sizzling Shinwari Karahi'},
        {'image': 'biryani.jpg', 'title': 'Dum Pukht Basmati Heritage'},
        {'image': 'bbq.jpg', 'title': 'Signature Charcoal Grill'},
        {'image': 'handi.jpg', 'title': 'Clay Pot Handi Tradition'},
        {'image': 'kebab.jpg', 'title': 'Royal Seekh Kebab Platter'},
        {'image': 'dessert.jpg', 'title': 'Shahi Pistachio Kheer'}
    ]

    reviews = [
        {
            'name': 'Hamza Tariq',
            'role': 'Lahore Food Connoisseur',
            'date': 'September 2026',
            'rating': 5,
            'comment': 'The Shinwari Mutton Karahi and Dum Pukht Biryani transported our family back to the golden era of Lahori royalty. The brick arches and ambient candlelight created an unforgettable dining evening.',
            'badge': 'Verified Dine-in Guest'
        },
        {
            'name': 'Dr. Ayesha Malik',
            'role': 'Culinary Traveler',
            'date': 'August 2026',
            'rating': 5,
            'comment': 'Zaiqa Royale is the pinnacle of Pakistani fine dining in Lahore. The Malai Boti melted like butter, and the live table service was immaculate. Highly recommended for special occasions.',
            'badge': 'Verified Reservation'
        },
        {
            'name': 'Bilal Farooq',
            'role': 'Executive Host',
            'date': 'August 2026',
            'rating': 5,
            'comment': 'We hosted a 20-person corporate banquet in their private Mughal hall. Flawless presentation, piping hot roghni naans right from the clay tandoor, and impeccable service from start to finish.',
            'badge': 'Corporate Event Guest'
        }
    ]

    return render_template('index.html',
                           featured_dishes=featured_dishes,
                           categories=categories,
                           gallery=gallery,
                           reviews=reviews)


@app.route('/menu')
def menu():
    """Full database-driven menu with category filters and search"""
    category_filter = request.args.get('category', '').strip()
    search_query = request.args.get('q', '').strip()

    query = Product.query

    if category_filter and category_filter != 'All':
        query = query.filter_by(category=category_filter)

    if search_query:
        query = query.filter(
            (Product.name.ilike(f'%{search_query}%')) |
            (Product.description.ilike(f'%{search_query}%'))
        )

    products = query.order_by(Product.featured.desc(), Product.name.asc()).all()

    # Pre-defined categories
    categories = ['All', 'Pakistani', 'BBQ', 'Karahi', 'Handi', 'Biryani', 'Chinese', 'Desserts', 'Drinks']

    return render_template('menu.html',
                           products=products,
                           categories=categories,
                           active_category=category_filter or 'All',
                           search_query=search_query)


@app.route('/cart')
def cart():
    """Shopping cart page with item management, subtotal, delivery fee, and WhatsApp generator"""
    items, subtotal, delivery_fee, total = get_cart_details()

    # Generate pre-filled WhatsApp message
    whatsapp_text = ""
    if items:
        lines = [f"*ORDER FROM ZAIQA ROYALE WEBSITE*"]
        for it in items:
            lines.append(f"• {it['quantity']}x {it['product'].name} — PKR {int(it['total']):,}")
        lines.append(f"------------------------")
        lines.append(f"*Subtotal:* PKR {int(subtotal):,}")
        lines.append(f"*Delivery Fee:* PKR {int(delivery_fee):,}")
        lines.append(f"*Total Amount:* PKR {int(total):,}")
        lines.append("\n*Customer Details:*")
        lines.append("Name: ")
        lines.append("Phone: ")
        lines.append("Complete Address (Lahore): ")
        lines.append("Special Instructions: ")
        whatsapp_text = "\n".join(lines)

    return render_template('cart.html',
                           items=items,
                           subtotal=subtotal,
                           delivery_fee=delivery_fee,
                           total=total,
                           whatsapp_text=whatsapp_text)


# ==========================================
# CART AJAX API ENDPOINTS
# ==========================================

@app.route('/api/cart/add', methods=['POST'])
def api_cart_add():
    """Add product to cart session"""
    data = request.get_json(silent=True) or request.form
    product_id = str(data.get('product_id'))
    try:
        quantity = int(data.get('quantity', 1))
    except (ValueError, TypeError):
        quantity = 1

    if not product_id or quantity <= 0:
        return jsonify({'success': False, 'message': 'Invalid product or quantity'}), 400

    product = Product.query.get(int(product_id))
    if not product:
        return jsonify({'success': False, 'message': 'Product not found'}), 404

    cart = session.get('cart', {})
    if product_id in cart:
        cart[product_id]['quantity'] = cart[product_id].get('quantity', 0) + quantity
    else:
        cart[product_id] = {
            'quantity': quantity,
            'name': product.name,
            'price': product.price
        }

    session['cart'] = cart
    session.modified = True

    total_count = sum(item.get('quantity', 1) for item in cart.values())
    return jsonify({
        'success': True,
        'message': f'{product.name} added to royal cart',
        'cart_count': total_count
    })


@app.route('/api/cart/update', methods=['POST'])
def api_cart_update():
    """Update item quantity in cart session"""
    data = request.get_json(silent=True) or request.form
    product_id = str(data.get('product_id'))
    try:
        quantity = int(data.get('quantity', 1))
    except (ValueError, TypeError):
        quantity = 1

    cart = session.get('cart', {})
    if product_id in cart:
        if quantity > 0:
            cart[product_id]['quantity'] = quantity
        else:
            del cart[product_id]
        session['cart'] = cart
        session.modified = True

    items, subtotal, delivery_fee, total = get_cart_details()
    cart_count = sum(item.get('quantity', 1) for item in cart.values())

    return jsonify({
        'success': True,
        'cart_count': cart_count,
        'subtotal': subtotal,
        'delivery_fee': delivery_fee,
        'total': total
    })


@app.route('/api/cart/remove', methods=['POST'])
def api_cart_remove():
    """Remove item from cart"""
    data = request.get_json(silent=True) or request.form
    product_id = str(data.get('product_id'))

    cart = session.get('cart', {})
    if product_id in cart:
        del cart[product_id]
        session['cart'] = cart
        session.modified = True

    items, subtotal, delivery_fee, total = get_cart_details()
    cart_count = sum(item.get('quantity', 1) for item in cart.values())

    return jsonify({
        'success': True,
        'cart_count': cart_count,
        'subtotal': subtotal,
        'delivery_fee': delivery_fee,
        'total': total
    })


@app.route('/api/cart/clear', methods=['POST'])
def api_cart_clear():
    """Clear all items from cart"""
    session['cart'] = {}
    session.modified = True
    return jsonify({'success': True, 'cart_count': 0})


# ==========================================
# CHECKOUT & ORDER SUBMISSION WITH LOYALTY
# ==========================================

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    """Checkout page: user details, loyalty point redemption, payment selection, saves Order into SQLite"""
    items, subtotal, delivery_fee, total = get_cart_details()

    if not items and request.method == 'GET':
        flash('Your royal feast cart is currently empty. Please select dishes from our menu.', 'info')
        return redirect(url_for('menu'))

    if request.method == 'POST':
        customer_name = request.form.get('customer_name', '').strip()
        phone = request.form.get('phone', '').strip()
        email = request.form.get('email', '').strip()
        address = request.form.get('address', '').strip()
        city = request.form.get('city', 'Lahore').strip()
        order_notes = request.form.get('order_notes', '').strip()
        payment_method = request.form.get('payment_method', 'Cash on Delivery').strip()
        redeem_points_requested = request.form.get('redeem_loyalty_points') == 'on'

        # Simple robust validation
        if not customer_name or not phone or not address:
            flash('Please provide your name, contact phone, and delivery address.', 'danger')
            return render_template('checkout.html', items=items, subtotal=subtotal,
                                   delivery_fee=delivery_fee, total=total)

        if not items:
            flash('Your cart is empty. Please add dishes before placing an order.', 'warning')
            return redirect(url_for('menu'))

        try:
            # Handle Loyalty Points Redemption
            discount_amount = 0.0
            points_redeemed = 0
            user_id = None

            if current_user.is_authenticated and not current_user.is_admin():
                user_id = current_user.id
                if redeem_points_requested and current_user.loyalty_points > 0:
                    points_redeemed = min(current_user.loyalty_points, int(subtotal))
                    discount_amount = float(points_redeemed)

            final_total = max(0.0, subtotal - discount_amount) + delivery_fee
            # Calculate points earned (1 point per PKR 100 spent on dishes)
            points_earned = int((subtotal - discount_amount) / 100) if user_id else 0

            # Create Order in SQLite
            order = Order(
                user_id=user_id,
                customer_name=customer_name,
                phone=phone,
                email=email or (current_user.email if current_user.is_authenticated else 'guest@zaiqaroyale.pk'),
                address=address,
                city=city or 'Lahore',
                order_notes=order_notes,
                subtotal=subtotal,
                delivery_fee=delivery_fee,
                discount_amount=discount_amount,
                total=final_total,
                points_earned=points_earned,
                points_redeemed=points_redeemed,
                payment_method=payment_method,
                status='New'
            )
            db.session.add(order)
            db.session.flush()  # To populate order.id

            # Add OrderItems
            for item in items:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item['product'].id,
                    quantity=item['quantity'],
                    price=item['price']
                )
                db.session.add(order_item)

            # Apply points deduction & credit to customer account
            if user_id:
                if points_redeemed > 0:
                    current_user.redeem_points(
                        points_redeemed,
                        description=f"Redeemed for PKR {int(discount_amount)} discount on Order #{order.id}",
                        order_id=order.id
                    )
                if points_earned > 0:
                    current_user.add_points(
                        points_earned,
                        description=f"Earned from royal feast Order #{order.id}",
                        order_id=order.id
                    )

            db.session.commit()

            # Clear cart session
            session['cart'] = {}
            session.modified = True

            flash('Your royal order has been received by our head chef!', 'success')
            return redirect(url_for('order_success', order_id=order.id))

        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred while saving your order: {str(e)}', 'danger')
            return render_template('checkout.html', items=items, subtotal=subtotal,
                                   delivery_fee=delivery_fee, total=total)

    return render_template('checkout.html',
                           items=items,
                           subtotal=subtotal,
                           delivery_fee=delivery_fee,
                           total=total)


@app.route('/order-success/<int:order_id>')
def order_success(order_id):
    """Order confirmation page with invoice summary and tracking details"""
    order = Order.query.get_or_404(order_id)
    return render_template('order_success.html', order=order)


# ==========================================
# ROYAL REWARDS & CUSTOMER AUTHENTICATION
# ==========================================

@app.route('/loyalty')
def loyalty():
    """Royal Rewards & Loyalty Points Hub"""
    return render_template('loyalty.html')


@app.route('/customer/register', methods=['GET', 'POST'])
def customer_register():
    """Register for Shahi Club, earn +100 bonus welcome points"""
    if current_user.is_authenticated and not current_user.is_admin():
        return redirect(url_for('loyalty'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        phone = request.form.get('phone', '').strip()
        password = request.form.get('password', '')

        if not name or not email or not password:
            flash('Please complete all required fields.', 'danger')
            return render_template('customer_register.html')

        existing = User.query.filter_by(email=email).first()
        if existing:
            flash('An account with this email is already registered. Please sign in.', 'warning')
            return redirect(url_for('customer_login', next=request.args.get('next')))

        # Create patron with 100 welcome bonus points
        user = User(
            name=name,
            email=email,
            phone=phone,
            role='customer',
            loyalty_points=100,
            lifetime_points=100,
            membership_tier='Silver'
        )
        user.set_password(password)
        db.session.add(user)
        db.session.flush()

        # Log Welcome Bonus Transaction
        welcome_tx = LoyaltyTransaction(
            user_id=user.id,
            points_change=100,
            balance_after=100,
            action_type='bonus',
            description="Welcome Bonus for joining Shahi Club"
        )
        db.session.add(welcome_tx)
        db.session.commit()

        login_user(user, remember=True)
        flash(f'Marhaba, {user.name}! 100 Welcome Royal Points have been added to your treasury.', 'success')

        next_url = request.args.get('next')
        return redirect(next_url or url_for('loyalty'))

    return render_template('customer_register.html')


@app.route('/customer/login', methods=['GET', 'POST'])
def customer_login():
    """Customer patron sign in"""
    if current_user.is_authenticated and not current_user.is_admin():
        return redirect(url_for('loyalty'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user, remember=True)
            flash(f'Welcome back, {user.name}. Your Shahi Club benefits are active.', 'success')
            next_url = request.args.get('next')
            if user.is_admin():
                return redirect(next_url or url_for('admin_dashboard'))
            return redirect(next_url or url_for('loyalty'))
        else:
            flash('Invalid email or password. Please check your credentials.', 'danger')

    return render_template('customer_login.html')


@app.route('/customer/logout')
def customer_logout():
    """Customer sign out"""
    logout_user()
    flash('You have safely signed out of your Royal Rewards account.', 'info')
    return redirect(url_for('index'))


# ==========================================
# RESERVATION SYSTEM
# ==========================================

@app.route('/reservation', methods=['GET', 'POST'])
def reservation():
    """Book a Table form and SQLite persistence with confirmation"""
    if request.method == 'POST':
        customer_name = request.form.get('customer_name', '').strip()
        phone = request.form.get('phone', '').strip()
        email = request.form.get('email', '').strip()
        date = request.form.get('date', '').strip()
        time = request.form.get('time', '').strip()
        guests_str = request.form.get('guests', '2').strip()
        special_request = request.form.get('special_request', '').strip()

        if not customer_name or not phone or not date or not time:
            flash('Please complete all required fields (Name, Phone, Date, and Time).', 'danger')
            return render_template('reservation.html')

        try:
            guests = int(guests_str) if guests_str.isdigit() else 2
            booking = Reservation(
                customer_name=customer_name,
                phone=phone,
                email=email,
                date=date,
                time=time,
                guests=guests,
                special_request=special_request,
                status='Confirmed'
            )
            db.session.add(booking)
            db.session.commit()

            return render_template('reservation.html',
                                   booking_success=True,
                                   booking=booking)
        except Exception as e:
            db.session.rollback()
            flash(f'Error reserving your table: {str(e)}', 'danger')

    return render_template('reservation.html', booking_success=False)


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact information, opening hours, location map, and message form"""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        flash(f'Thank you {name}. Your inquiry has been relayed to our executive royal hospitality team.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')


# ==========================================
# ADMIN PANEL (PROTECTED)
# ==========================================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Admin authentication"""
    if current_user.is_authenticated:
        return redirect(url_for('admin_dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password) and user.is_admin():
            login_user(user)
            flash(f'Welcome back, {user.name}. Royal Administration active.', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('admin_dashboard'))
        else:
            flash('Invalid credentials or unauthorized account.', 'danger')

    return render_template('admin/login.html')


@app.route('/admin/logout')
@login_required
def admin_logout():
    """Admin logout"""
    logout_user()
    flash('You have safely exited the royal administration portal.', 'info')
    return redirect(url_for('admin_login'))


@app.route('/admin')
@login_required
def admin_dashboard():
    """Admin Dashboard with summary statistics, recent orders, and recent bookings"""
    total_orders = Order.query.count()
    total_revenue = db.session.query(db.func.sum(Order.total)).scalar() or 0.0
    total_reservations = Reservation.query.count()
    total_products = Product.query.count()

    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(8).all()
    recent_reservations = Reservation.query.order_by(Reservation.created_at.desc()).limit(6).all()

    return render_template('admin/dashboard.html',
                           total_orders=total_orders,
                           total_revenue=total_revenue,
                           total_reservations=total_reservations,
                           total_products=total_products,
                           recent_orders=recent_orders,
                           recent_reservations=recent_reservations)


@app.route('/admin/products')
@login_required
def admin_products():
    """Admin menu product catalog management"""
    category_filter = request.args.get('category', 'All')
    if category_filter and category_filter != 'All':
        products = Product.query.filter_by(category=category_filter).order_by(Product.id.desc()).all()
    else:
        products = Product.query.order_by(Product.id.desc()).all()

    categories = ['All', 'Pakistani', 'BBQ', 'Karahi', 'Handi', 'Biryani', 'Chinese', 'Desserts', 'Drinks']
    available_images = [
        'hero.jpg', 'karahi.jpg', 'biryani.jpg', 'bbq.jpg',
        'handi.jpg', 'kebab.jpg', 'naan.jpg', 'dessert.jpg',
        'drinks.jpg', 'restaurant-interior.jpg', 'restaurant-exterior.jpg'
    ]

    return render_template('admin/products.html',
                           products=products,
                           categories=categories,
                           active_category=category_filter,
                           available_images=available_images)


@app.route('/admin/products/add', methods=['POST'])
@login_required
def admin_product_add():
    """Add a new dish to the database"""
    name = request.form.get('name', '').strip()
    category = request.form.get('category', 'Pakistani').strip()
    description = request.form.get('description', '').strip()
    try:
        price = float(request.form.get('price', 0.0))
    except (ValueError, TypeError):
        flash('Please enter a valid numeric price.', 'danger')
        return redirect(url_for('admin_products'))

    image = request.form.get('image', 'karahi.jpg').strip()
    stock_status = request.form.get('stock_status', 'In Stock').strip()
    availability = True if stock_status == 'In Stock' else False
    featured = True if request.form.get('featured') == 'on' else False

    if name and price > 0:
        product = Product(
            name=name,
            category=category,
            description=description,
            price=price,
            image=image or 'karahi.jpg',
            stock_status=stock_status,
            availability=availability,
            featured=featured
        )
        db.session.add(product)
        db.session.commit()
        flash(f'Dish "{name}" successfully added to the royal menu.', 'success')
    else:
        flash('Please provide valid name and price.', 'danger')

    return redirect(url_for('admin_products'))


@app.route('/admin/products/<int:product_id>/edit', methods=['POST'])
@login_required
def admin_product_edit(product_id):
    """Edit existing dish in the database"""
    product = Product.query.get_or_404(product_id)
    product.name = request.form.get('name', product.name).strip()
    product.category = request.form.get('category', product.category).strip()
    product.description = request.form.get('description', product.description).strip()
    try:
        product.price = float(request.form.get('price', product.price))
    except (ValueError, TypeError):
        flash('Please enter a valid numeric price.', 'danger')
        return redirect(url_for('admin_products'))

    product.image = request.form.get('image', product.image).strip()
    product.stock_status = request.form.get('stock_status', product.stock_status).strip()
    product.availability = True if product.stock_status == 'In Stock' else False
    product.featured = True if request.form.get('featured') == 'on' else False

    db.session.commit()
    flash(f'Dish "{product.name}" updated successfully.', 'success')
    return redirect(url_for('admin_products'))


@app.route('/admin/products/<int:product_id>/delete', methods=['POST'])
@login_required
def admin_product_delete(product_id):
    """Delete dish from menu"""
    product = Product.query.get_or_404(product_id)
    dish_name = product.name
    db.session.delete(product)
    db.session.commit()
    flash(f'Dish "{dish_name}" deleted from menu database.', 'info')
    return redirect(url_for('admin_products'))


@app.route('/admin/products/<int:product_id>/toggle-stock', methods=['POST'])
@login_required
def admin_product_toggle_stock(product_id):
    """Quick toggle stock availability"""
    product = Product.query.get_or_404(product_id)
    product.availability = not product.availability
    product.stock_status = 'In Stock' if product.availability else 'Out of Stock'
    db.session.commit()
    flash(f'Availability for "{product.name}" is now {product.stock_status}.', 'success')
    return redirect(url_for('admin_products'))


@app.route('/admin/products/<int:product_id>/toggle-featured', methods=['POST'])
@login_required
def admin_product_toggle_featured(product_id):
    """Quick toggle featured status"""
    product = Product.query.get_or_404(product_id)
    product.featured = not product.featured
    db.session.commit()
    flash(f'Featured state for "{product.name}" toggled.', 'success')
    return redirect(url_for('admin_products'))


@app.route('/admin/orders')
@login_required
def admin_orders():
    """View and filter all customer orders"""
    status_filter = request.args.get('status', 'All').strip()
    if status_filter and status_filter != 'All':
        orders = Order.query.filter_by(status=status_filter).order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.order_by(Order.created_at.desc()).all()

    statuses = ['All', 'New', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']
    return render_template('admin/orders.html', orders=orders, statuses=statuses, active_status=status_filter)


@app.route('/admin/orders/<int:order_id>/status', methods=['POST'])
@login_required
def admin_order_status(order_id):
    """Update order delivery status"""
    order = Order.query.get_or_404(order_id)
    new_status = request.form.get('status', '').strip()
    valid_statuses = ['New', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']
    if new_status in valid_statuses:
        order.status = new_status
        db.session.commit()
        flash(f'Order #{order.id} status changed to {new_status}.', 'success')
    return redirect(url_for('admin_orders'))


@app.route('/admin/reservations')
@login_required
def admin_reservations():
    """View and manage table bookings"""
    status_filter = request.args.get('status', 'All').strip()
    if status_filter and status_filter != 'All':
        reservations = Reservation.query.filter_by(status=status_filter).order_by(Reservation.created_at.desc()).all()
    else:
        reservations = Reservation.query.order_by(Reservation.created_at.desc()).all()

    statuses = ['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed']
    return render_template('admin/reservations.html',
                           reservations=reservations,
                           statuses=statuses,
                           active_status=status_filter)


@app.route('/admin/reservations/<int:res_id>/status', methods=['POST'])
@login_required
def admin_reservation_status(res_id):
    """Change reservation status"""
    booking = Reservation.query.get_or_404(res_id)
    new_status = request.form.get('status', '').strip()
    if new_status in ['Confirmed', 'Pending', 'Cancelled', 'Completed']:
        booking.status = new_status
        db.session.commit()
        flash(f'Reservation #{booking.id} updated to {new_status}.', 'success')
    return redirect(url_for('admin_reservations'))


@app.route('/admin/reservations/<int:res_id>/delete', methods=['POST'])
@login_required
def admin_reservation_delete(res_id):
    """Delete a reservation"""
    booking = Reservation.query.get_or_404(res_id)
    db.session.delete(booking)
    db.session.commit()
    flash(f'Reservation #{res_id} deleted.', 'info')
    return redirect(url_for('admin_reservations'))


# ==========================================
# ERROR HANDLERS (404, 500)
# ==========================================

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


# ==========================================
# DATABASE INITIALIZATION & SEEDING
# ==========================================

def seed_initial_data():
    """Seed default administrator, demo loyalty patron, and authentic Lahori menu catalog"""
    with app.app_context():
        db.create_all()

        # Database Column Migration Check for existing SQLite tables
        from sqlalchemy import text
        try:
            with db.engine.connect() as conn:
                # Check users table
                user_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(users)"))]
                if 'phone' not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(50)"))
                if 'loyalty_points' not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN loyalty_points INTEGER DEFAULT 100"))
                if 'lifetime_points' not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN lifetime_points INTEGER DEFAULT 100"))
                if 'membership_tier' not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN membership_tier VARCHAR(50) DEFAULT 'Silver'"))
                if 'created_at' not in user_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN created_at DATETIME"))

                # Check orders table
                order_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(orders)"))]
                if 'user_id' not in order_cols:
                    conn.execute(text("ALTER TABLE orders ADD COLUMN user_id INTEGER"))
                if 'discount_amount' not in order_cols:
                    conn.execute(text("ALTER TABLE orders ADD COLUMN discount_amount FLOAT DEFAULT 0.0"))
                if 'points_earned' not in order_cols:
                    conn.execute(text("ALTER TABLE orders ADD COLUMN points_earned INTEGER DEFAULT 0"))
                if 'points_redeemed' not in order_cols:
                    conn.execute(text("ALTER TABLE orders ADD COLUMN points_redeemed INTEGER DEFAULT 0"))
        except Exception as mig_err:
            print("Migration note:", mig_err)

        # 1. Create Default Admin if missing
        admin = User.query.filter_by(email='admin@zaiqaroyale.com').first()
        if not admin:
            admin = User(
                name='Executive Royal Chef & GM',
                email='admin@zaiqaroyale.com',
                role='admin',
                loyalty_points=1000,
                lifetime_points=1000,
                membership_tier='Royal Platinum'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print(">>> Default Administrator seeded: admin@zaiqaroyale.com / admin123")

        # 2. Create Demo Loyal Patron if missing
        patron = User.query.filter_by(email='patron@zaiqaroyale.com').first()
        if not patron:
            patron = User(
                name='Sardar Tariq Khan',
                email='patron@zaiqaroyale.com',
                phone='0300-9876543',
                role='customer',
                loyalty_points=450,
                lifetime_points=1250,
                membership_tier='Gold'
            )
            patron.set_password('patron123')
            db.session.add(patron)
            db.session.flush()

            # Seed sample transactions for patron
            tx1 = LoyaltyTransaction(
                user_id=patron.id,
                points_change=100,
                balance_after=100,
                action_type='bonus',
                description='Welcome Bonus for joining Shahi Club'
            )
            tx2 = LoyaltyTransaction(
                user_id=patron.id,
                points_change=350,
                balance_after=450,
                action_type='earned',
                description='Earned on Royal Charcoal BBQ Feast'
            )
            db.session.add_all([tx1, tx2])
            db.session.commit()
            print(">>> Demo Customer Patron seeded: patron@zaiqaroyale.com / patron123 (450 Royal Points, Gold Tier)")

        # 3. Seed Products if catalog is empty
        if Product.query.count() == 0:
            sample_dishes = [
                # Karahi
                Product(
                    name='Mutton Shinwari Karahi (Desi Ghee)',
                    category='Karahi',
                    description='Tender prime mutton cuts prepared in a smoking iron wok with ripe tomatoes, green chilies, julienned ginger, and pure churned desi ghee. Authentic Khyber Shinwari style.',
                    price=2850.0,
                    image='karahi.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=True
                ),
                Product(
                    name='Chicken White Makhni Karahi',
                    category='Karahi',
                    description='Delicate boneless chicken morsels simmered in velvety white cream, cracked white pepper, crushed green cardamom, and mild green chillies.',
                    price=1950.0,
                    image='karahi.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),

                # Biryani
                Product(
                    name='Royal Mutton Dum Pukht Biryani',
                    category='Biryani',
                    description='Fragrant long-grain aged basmati rice layered with slow-cooked spiced mutton, Kashmiri saffron, fried golden onions, dried plums, and sealed with dough in a clay handi.',
                    price=1950.0,
                    image='biryani.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=True
                ),
                Product(
                    name='Zaiqa Special Chicken Biryani',
                    category='Biryani',
                    description='Classic Lahori chicken biryani infused with aromatic whole spices, kewra essence, golden potatoes, and topped with crisp caramelized shallots.',
                    price=1450.0,
                    image='biryani.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),

                # BBQ
                Product(
                    name='Royal Charcoal Mixed BBQ Platter',
                    category='BBQ',
                    description='A grand feast of Beef Bihari Kababs, Chicken Malai Boti, Lamb Chops, Seekh Kebabs, and Fish Tikka served over glowing coals with mint raita and naan.',
                    price=3450.0,
                    image='bbq.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=True
                ),
                Product(
                    name='Smoked Beef Seekh Kebabs (6 Pcs)',
                    category='BBQ',
                    description='Minced beef blended with crushed spices, green chili paste, and fresh mint, char-grilled on iron skewers over burning tamarind coals.',
                    price=1650.0,
                    image='kebab.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=True
                ),
                Product(
                    name='Chicken Reshmi Malai Boti',
                    category='BBQ',
                    description='Silky chicken breast cubes marinated overnight in fresh cream, cashew paste, green cardamom, and gently roasted over charcoal.',
                    price=1800.0,
                    image='bbq.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),

                # Handi
                Product(
                    name='Murgh Desi Makhni Handi',
                    category='Handi',
                    description='Boneless succulent chicken simmered in an earthenware clay pot with butter gravy, crushed cashew cream, and fragrant kasuri methi fenugreek.',
                    price=2150.0,
                    image='handi.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=True
                ),
                Product(
                    name='Paneer Makhni Royale Handi',
                    category='Handi',
                    description='Soft artisanal cottage cheese cubes immersed in a rich, buttery tomato gravy with ginger julienne and fresh coriander.',
                    price=1650.0,
                    image='handi.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),

                # Pakistani Heritage
                Product(
                    name='Shahi Beef Nihari Khas',
                    category='Pakistani',
                    description='Overnight slow-cooked beef shank in velvety spiced gravy with bone marrow, served with lemon wedges, slivered ginger, and chopped green chilies.',
                    price=2250.0,
                    image='karahi.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),
                Product(
                    name='Mutton Kunna Chinioti',
                    category='Pakistani',
                    description='Traditional Chiniot heritage delicacy of clay-pot braised mutton shanks slow-simmered in rich gravy with whole black cumin.',
                    price=2650.0,
                    image='handi.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),
                Product(
                    name='Tandoori Roghni Naan Royale',
                    category='Pakistani',
                    description='Leavened fine flour bread baked on hot clay tandoor walls, brushed with pure desi butter and sprinkled with white sesame seeds.',
                    price=180.0,
                    image='naan.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),

                # Chinese
                Product(
                    name='Chicken Shashlik with Egg Fried Rice',
                    category='Chinese',
                    description='Tender chicken skewers with bell peppers and onions coated in sweet and tangy tomato sauce, served alongside wok-tossed egg fried rice.',
                    price=1750.0,
                    image='hero.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),
                Product(
                    name='Imperial Hot & Sour Soup',
                    category='Chinese',
                    description='Classic spicy chicken and mushroom broth thickened with egg ribbons, vinegar, white pepper, and fresh black wood ear mushrooms.',
                    price=950.0,
                    image='handi.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),

                # Desserts
                Product(
                    name='Shahi Pistachio Kheer in Kasora',
                    category='Desserts',
                    description='Slow-simmered rich rice and milk pudding flavored with green cardamom, roasted pistachios, saffron strands, and delicate edible silver vark leaf.',
                    price=750.0,
                    image='dessert.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=True
                ),
                Product(
                    name='Gajar Ka Halwa Desi Ghee',
                    category='Desserts',
                    description='Fresh winter red carrots braised in pure country milk, desi ghee, and mawa khoya, topped with toasted cashew and almond slivers.',
                    price=850.0,
                    image='dessert.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),

                # Drinks
                Product(
                    name='Signature Lahori Mint Margarita',
                    category='Drinks',
                    description='Fresh crushed garden mint leaves, fresh lemon juice, rock black salt, and sparkling soda served ice-cold with salted glass rim.',
                    price=550.0,
                    image='drinks.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),
                Product(
                    name='Royal Rooh Afza Sharbat-e-Bahar',
                    category='Drinks',
                    description='Heritage herbal rose elixir infused with basil seeds (tukh malanga), chilled milk or lemon water, and slivered almonds.',
                    price=420.0,
                    image='drinks.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                ),
                Product(
                    name='Peshawari Saffron Kahwa',
                    category='Drinks',
                    description='Traditional green tea brewed with cardamom pods, cinnamon bark, pure saffron filaments, and crushed almonds with rock sugar.',
                    price=380.0,
                    image='drinks.jpg',
                    stock_status='In Stock',
                    availability=True,
                    featured=False
                )
            ]
            db.session.bulk_save_objects(sample_dishes)
            db.session.commit()
            print(">>> 18 Royal Pakistani dishes seeded successfully!")


# Call seed on startup
seed_initial_data()

if __name__ == '__main__':
    # When running standalone locally, listen on port 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
