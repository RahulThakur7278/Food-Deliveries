import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowLeft,
  FiShoppingBag,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiCheckCircle,
  FiTag,
  FiShield,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import { MdLocationOn, MdMyLocation, MdEdit, MdDeliveryDining } from 'react-icons/md';

import {
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
  addToCart,
  removeFromCart,
  deleteFromCart,
  clearCart,
} from '../../features/cart/cartSlice';
import { getImageUrl } from '../../utils/imageUrl';
import { useUserLocation } from '../../hooks/useUserLocation';

const AVAILABLE_COUPONS = [
  {
    code: 'HUNGERY50',
    title: 'Flat ₹50 OFF',
    description: 'Valid on orders above ₹199',
    minOrder: 199,
    discountType: 'flat',
    discountValue: 50,
  },
  {
    code: 'TASTY10',
    title: '10% OFF',
    description: 'Save up to ₹100 on orders above ₹99',
    minOrder: 99,
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 100,
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Get free delivery on orders above ₹149',
    minOrder: 149,
    discountType: 'free_delivery',
    discountValue: 40,
  },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user);
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const totalQuantity = useSelector(selectCartTotalQuantity);

  const locationHook = useUserLocation(true);

  // Component States
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'online'
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Editable delivery address state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [deliveryAddressText, setDeliveryAddressText] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Order placement state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Address computation
  const displayAddress =
    customAddress.trim() ||
    deliveryAddressText.trim() ||
    locationHook.formattedAddress ||
    (locationHook.city && locationHook.city !== 'Detecting...'
      ? `${locationHook.city}, ${locationHook.state || 'India'}`
      : 'Select or enter your delivery address');

  // Dynamic pricing calculation
  const subtotal = cartTotalAmount || 0;
  const standardDeliveryFee = subtotal > 299 ? 0 : 40;
  const platformFee = subtotal > 0 ? 10 : 0;

  // Coupon discount calculation
  let discountAmount = 0;
  let deliveryFee = standardDeliveryFee;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    } else if (appliedCoupon.discountType === 'percentage') {
      const calculated = (subtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount
        ? Math.min(calculated, appliedCoupon.maxDiscount)
        : calculated;
    } else if (appliedCoupon.discountType === 'free_delivery') {
      discountAmount = standardDeliveryFee;
      deliveryFee = 0;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee + platformFee);

  // Apply Coupon Logic
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');

    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const foundCoupon = AVAILABLE_COUPONS.find((c) => c.code === code);

    if (!foundCoupon) {
      setCouponError('Invalid coupon code. Try HUNGERY50 or TASTY10.');
      return;
    }

    if (subtotal < foundCoupon.minOrder) {
      setCouponError(`Minimum order amount of ₹${foundCoupon.minOrder} required for ${code}`);
      return;
    }

    setAppliedCoupon(foundCoupon);
    setCouponCodeInput(foundCoupon.code);
    setCouponSuccess(`Coupon ${foundCoupon.code} applied successfully!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Place Order Logic
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!displayAddress || displayAddress === 'Select or enter your delivery address') {
      alert('Please provide a valid delivery address.');
      setIsEditingAddress(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const completedOrder = {
        orderId: generatedOrderId,
        itemsCount: totalQuantity,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Prepaid)',
        deliveryAddress: displayAddress,
        deliveryNote: deliveryNote.trim(),
        estimatedTime: '30 - 40 mins',
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setOrderSuccessData(completedOrder);
      dispatch(clearCart());
      setIsSubmitting(false);
    }, 1200);
  };

  // If order is placed successfully, display confirmation view
  if (orderSuccessData) {
    return (
      <div className="min-h-screen bg-[#fffaf8] py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-emerald-500 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-md">
              <FiCheckCircle />
            </div>
            <h1 className="text-2xl font-black">Order Placed Successfully!</h1>
            <p className="text-emerald-100 text-sm mt-1">
              Thank you for ordering with HungeryHub. Your food is on its way!
            </p>
          </div>

          {/* Order Details Body */}
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Order ID
                </p>
                <p className="text-lg font-bold text-gray-800">{orderSuccessData.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Estimated Delivery
                </p>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 justify-end">
                  <FiClock className="inline" /> {orderSuccessData.estimatedTime}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm border-b border-gray-100 pb-5">
              <div className="flex justify-between text-gray-600">
                <span>Items Ordered</span>
                <span className="font-semibold text-gray-800">
                  {orderSuccessData.itemsCount} items
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Mode</span>
                <span className="font-semibold text-gray-800">
                  {orderSuccessData.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Amount</span>
                <span className="font-bold text-lg text-primary">
                  ₹{orderSuccessData.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                <MdLocationOn className="text-primary text-base" /> Delivering To:
              </p>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs leading-relaxed">
                <span className="font-semibold text-gray-800 block mb-0.5">
                  {user?.name || 'Customer'} {user?.phone ? `• ${user.phone}` : ''}
                </span>
                {orderSuccessData.deliveryAddress}
                {orderSuccessData.deliveryNote && (
                  <span className="block mt-1 text-gray-500 italic">
                    Note: "{orderSuccessData.deliveryNote}"
                  </span>
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/user-dashboard')}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-xl text-center transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MdDeliveryDining className="text-xl" /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      {/* Top Navigation Bar with Back Button */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-primary hover:bg-red-50 rounded-xl transition-all duration-200 border border-gray-200 cursor-pointer flex items-center justify-center shadow-xs"
              title="Back to previous page"
              aria-label="Back"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Checkout
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Review your items and confirm delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <FiShield className="text-sm" />
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner">
              <FiShoppingBag />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              You don't have any food items in your cart yet. Explore our menu and pick delicious
              dishes!
            </p>
            <button
              onClick={() => navigate('/user-dashboard')}
              className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Browse Food Menu
            </button>
          </div>
        ) : (
          /* Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (2 Cols) - Items, Discounts & Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items Card */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiShoppingBag className="text-primary" />
                    <span>Your Order Items ({totalQuantity})</span>
                  </h2>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100 space-y-3">
                  {cartItems.map((item) => {
                    const itemId = item._id || item.id;
                    const isVeg = item.isVeg ?? (item.food_type === 'Veg');

                    return (
                      <div
                        key={itemId}
                        className="pt-3 first:pt-0 flex items-center gap-4 group transition-all"
                      >
                        {/* Food Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-red-50">
                          <img
                            src={
                              item.images?.[0] || item.image
                                ? getImageUrl(item.images?.[0] || item.image)
                                : 'https://via.placeholder.com/100'
                            }
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Food Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div
                              className={`w-3 h-3 border flex items-center justify-center rounded-xs ${
                                isVeg ? 'border-green-600' : 'border-red-600'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isVeg ? 'bg-green-600' : 'bg-red-600'
                                }`}
                              ></div>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category || item.food_type || 'Tasty food'}
                          </p>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            ₹{item.price}{' '}
                            <span className="text-xs font-normal text-gray-400">
                              x {item.quantity} = ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Counter & Delete */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-xs">
                            <button
                              onClick={() => dispatch(removeFromCart(itemId))}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <FiMinus />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(addToCart(item))}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors cursor-pointer"
                              title="Increase quantity"
                            >
                              <FiPlus />
                            </button>
                          </div>

                          <button
                            onClick={() => dispatch(deleteFromCart(itemId))}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <FiTrash2 className="text-base" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Discount Coupons */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FiTag className="text-primary" />
                  <span>Available Offers & Coupons</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AVAILABLE_COUPONS.map((coupon) => {
                    const isApplied = appliedCoupon?.code === coupon.code;
                    const isEligible = subtotal >= coupon.minOrder;

                    return (
                      <div
                        key={coupon.code}
                        onClick={() => {
                          if (isEligible) {
                            if (isApplied) {
                              handleRemoveCoupon();
                            } else {
                              handleApplyCoupon(coupon.code);
                            }
                          }
                        }}
                        className={`border rounded-xl p-3.5 transition-all cursor-pointer relative ${
                          isApplied
                            ? 'border-primary bg-red-50/50 shadow-xs'
                            : isEligible
                            ? 'border-gray-200 hover:border-primary/60 hover:bg-gray-50/60'
                            : 'border-gray-200 opacity-60 bg-gray-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary tracking-wide">
                            {coupon.code}
                          </span>
                          {isApplied && (
                            <span className="text-xs text-primary font-bold flex items-center gap-0.5">
                              <FiCheck /> Applied
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm mt-2">{coupon.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-snug">
                          {coupon.description}
                        </p>
                        {!isEligible && (
                          <p className="text-[10px] text-amber-700 font-medium mt-2">
                            Add ₹{coupon.minOrder - subtotal} more to unlock
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Instructions (Optional) */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Delivery Instructions</h2>
                <input
                  type="text"
                  placeholder="e.g. Please leave food at front door, ring doorbell, etc."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Right Column (1 Col) - Address, Payment & Order Summary Breakdown */}
            <div className="lg:col-span-1 space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
                    <MdLocationOn className="text-primary text-xl" />
                    <span>Delivery Address</span>
                  </h2>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MdEdit /> {isEditingAddress ? 'Done' : 'Change'}
                  </button>
                </div>

                {isEditingAddress ? (
                  <div className="space-y-3 pt-1">
                    <textarea
                      rows={3}
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="Enter house no., building, street, landmark, city..."
                      className="w-full border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await locationHook.fetchLocation(true);
                          if (res?.formattedAddress) {
                            setCustomAddress(res.formattedAddress);
                          }
                        }}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-primary text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MdMyLocation /> Use GPS Location
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-800">
                        {user?.name || 'Deliver To Me'}
                      </span>
                      {user?.phone && (
                        <span className="text-[11px] text-gray-500 font-medium">{user.phone}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {displayAddress}
                    </p>
                    {locationHook.isLoading && (
                      <p className="text-[11px] text-primary mt-1">Detecting address...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method Card */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <FiCreditCard className="text-primary text-lg" />
                  <span>Payment Method</span>
                </h2>

                <div className="space-y-2.5">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-red-50/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-primary"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-gray-800">
                          Cash on Delivery (COD)
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Pay with cash or UPI when delivered
                        </div>
                      </div>
                      <FiDollarSign className="text-gray-400 text-lg" />
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-primary bg-red-50/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-primary"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-gray-800">
                          Online Payment / UPI / Card
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Instant, secure digital payment
                        </div>
                      </div>
                      <FiCreditCard className="text-gray-400 text-lg" />
                    </div>
                  </label>
                </div>
              </div>

              {/* Coupon Code Input Card */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <FiTag className="text-primary text-base" />
                  <span>Have a Promo Code?</span>
                </h2>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={couponCodeInput}
                    onChange={(e) => {
                      setCouponCodeInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={handleRemoveCoupon}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="text-[11px] text-red-600 mt-2 flex items-center gap-1 font-medium">
                    <FiAlertCircle /> {couponError}
                  </p>
                )}

                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                    <FiCheckCircle /> {couponSuccess}
                  </p>
                )}
              </div>

              {/* Bill Details / Price Breakdown Card */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-3">
                <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100">
                  Bill Summary
                </h2>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-gray-800">₹{deliveryFee.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Platform & Taxes</span>
                    <span className="font-semibold text-gray-800">₹{platformFee.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 my-2 pt-2"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total Payable</span>
                    <span className="text-xl font-black text-primary">
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0 || isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-hover hover:shadow-lg active:scale-[0.99]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>Place Order • ₹{finalTotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;