/**
 * ZAIQA ROYALE — ROYAL JAVASCRIPT CONTROLLER
 * Handles client-side cart interactions, WhatsApp message creation,
 * mobile drawer navigation, and real-time updates.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('show');
    });
  }

  // Flash Message Auto Dismiss & Manual Close
  const flashAlerts = document.querySelectorAll('.flash-alert');
  flashAlerts.forEach(alert => {
    const closeBtn = alert.querySelector('.flash-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => alert.remove());
    }
    setTimeout(() => {
      if (alert && alert.parentElement) {
        alert.style.opacity = '0';
        alert.style.transition = 'opacity 0.5s ease';
        setTimeout(() => alert.remove(), 500);
      }
    }, 6000);
  });

  // Global Add to Cart Handler (Form or Button)
  document.body.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.btn-add-cart');
    if (addBtn) {
      e.preventDefault();
      const productId = addBtn.getAttribute('data-product-id');
      const qtyInput = document.querySelector(`#qty-${productId}`);
      const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

      addBtn.disabled = true;
      const originalText = addBtn.innerHTML;
      addBtn.innerHTML = '<span>Adding...</span>';

      fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ product_id: productId, quantity: quantity })
      })
      .then(res => res.json())
      .then(data => {
        addBtn.disabled = false;
        addBtn.innerHTML = originalText;
        if (data.success) {
          updateCartBadge(data.cart_count);
          showToast(data.message || 'Dish added to royal cart', 'success');
        } else {
          showToast(data.message || 'Could not add dish', 'danger');
        }
      })
      .catch(err => {
        addBtn.disabled = false;
        addBtn.innerHTML = originalText;
        showToast('Network error adding to cart', 'danger');
      });
    }
  });

  // Cart Page Item Actions
  const cartTable = document.querySelector('.cart-table');
  if (cartTable) {
    // Quantity increment / decrement
    cartTable.addEventListener('click', function (e) {
      const qtyBtn = e.target.closest('.cart-qty-btn');
      if (qtyBtn) {
        const action = qtyBtn.getAttribute('data-action');
        const productId = qtyBtn.getAttribute('data-product-id');
        const valSpan = document.querySelector(`.qty-val-${productId}`);
        let currentQty = parseInt(valSpan.textContent) || 1;

        if (action === 'increase') currentQty += 1;
        if (action === 'decrease') currentQty -= 1;

        if (currentQty <= 0) {
          removeCartItem(productId);
          return;
        }

        updateCartQuantity(productId, currentQty, valSpan);
      }

      // Remove single item
      const removeBtn = e.target.closest('.cart-remove-btn');
      if (removeBtn) {
        const productId = removeBtn.getAttribute('data-product-id');
        removeCartItem(productId);
      }
    });

    // Clear entire cart
    const clearBtn = document.querySelector('.btn-clear-cart');
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you wish to clear all dishes from your feast?')) {
          fetch('/api/cart/clear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          .then(res => res.json())
          .then(data => {
            window.location.reload();
          });
        }
      });
    }
  }

  function updateCartQuantity(productId, newQty, valSpan) {
    fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity: newQty })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        valSpan.textContent = newQty;
        updateCartBadge(data.cart_count);
        updateOrderSummary(data.subtotal, data.delivery_fee, data.total);
        const itemRow = document.querySelector(`#cart-row-${productId}`);
        if (itemRow) {
          const itemPrice = parseFloat(itemRow.getAttribute('data-price')) || 0;
          const lineTotalCell = itemRow.querySelector('.line-total');
          if (lineTotalCell) {
            lineTotalCell.textContent = 'PKR ' + (itemPrice * newQty).toLocaleString();
          }
        }
      }
    });
  }

  function removeCartItem(productId) {
    fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const itemRow = document.querySelector(`#cart-row-${productId}`);
        if (itemRow) itemRow.remove();
        updateCartBadge(data.cart_count);
        updateOrderSummary(data.subtotal, data.delivery_fee, data.total);
        if (data.cart_count === 0) {
          window.location.reload();
        }
      }
    });
  }

  function updateCartBadge(count) {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function updateOrderSummary(subtotal, deliveryFee, total) {
    const subtotalEl = document.querySelector('#summary-subtotal');
    const deliveryEl = document.querySelector('#summary-delivery');
    const totalEl = document.querySelector('#summary-total');

    if (subtotalEl) subtotalEl.textContent = 'PKR ' + Math.round(subtotal).toLocaleString();
    if (deliveryEl) deliveryEl.textContent = 'PKR ' + Math.round(deliveryFee).toLocaleString();
    if (totalEl) totalEl.textContent = 'PKR ' + Math.round(total).toLocaleString();
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('#royal-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'royal-toast-container';
      toastContainer.style.position = 'fixed';
      toastContainer.style.bottom = '24px';
      toastContainer.style.right = '24px';
      toastContainer.style.zIndex = '9999';
      toastContainer.style.display = 'flex';
      toastContainer.style.flexDirection = 'column';
      toastContainer.style.gap = '10px';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `flash-alert flash-${type}`;
    toast.style.minWidth = '280px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
    toast.style.animation = 'slideInRight 0.3s ease';
    toast.innerHTML = `
      <span>${message}</span>
      <button class="flash-close" style="margin-left: 12px; cursor: pointer;">&times;</button>
    `;

    toast.querySelector('.flash-close').addEventListener('click', () => toast.remove());
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  window.showToast = showToast;

  // Real-Time Menu Search Filter (Instant live filtering as user types)
  const searchInput = document.getElementById('menu-live-search');
  const clearBtn = document.getElementById('menu-search-clear');
  const feedbackEl = document.getElementById('menu-search-feedback');
  const noResultsEl = document.getElementById('menu-no-results');
  const noResultsText = document.getElementById('menu-no-results-text');
  const resetBtn = document.getElementById('menu-reset-search-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  if (searchInput && dishCards.length > 0) {
    function filterDishesRealtime() {
      const term = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      if (clearBtn) {
        clearBtn.style.display = term.length > 0 ? 'flex' : 'none';
      }

      dishCards.forEach(card => {
        const titleEl = card.querySelector('.dish-title');
        const descEl = card.querySelector('.dish-desc');
        const catBadge = card.querySelector('.dish-category-badge');

        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const desc = descEl ? descEl.textContent.toLowerCase() : '';
        const cat = catBadge ? catBadge.textContent.toLowerCase() : '';

        const matches = !term || title.includes(term) || desc.includes(term) || cat.includes(term);

        if (matches) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (term.length > 0) {
        if (feedbackEl) {
          feedbackEl.style.display = 'block';
          feedbackEl.textContent = `Showing ${visibleCount} dish${visibleCount === 1 ? '' : 'es'} matching "${searchInput.value.trim()}"`;
        }
        if (visibleCount === 0) {
          if (noResultsEl) {
            noResultsEl.style.display = 'block';
            if (noResultsText) {
              noResultsText.textContent = `No dishes found matching "${searchInput.value.trim()}". Try searching for karahi, biryani, bbq, handi, or dessert.`;
            }
          }
        } else {
          if (noResultsEl) noResultsEl.style.display = 'none';
        }
      } else {
        if (feedbackEl) feedbackEl.style.display = 'none';
        if (noResultsEl) noResultsEl.style.display = 'none';
      }
    }

    // Filter in real-time as user types
    searchInput.addEventListener('input', filterDishesRealtime);
    searchInput.addEventListener('keyup', filterDishesRealtime);

    // Clear search button
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        filterDishesRealtime();
        searchInput.focus();
      });
    }

    // Reset button in empty state
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        searchInput.value = '';
        filterDishesRealtime();
        searchInput.focus();
      });
    }

    // If loaded with a query, apply immediate filter
    if (searchInput.value.trim().length > 0) {
      filterDishesRealtime();
    }
  }
});
