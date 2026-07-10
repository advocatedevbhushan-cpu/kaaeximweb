'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, MapPin, Truck, Shield, CreditCard, Check, AlertTriangle, ArrowLeft, Loader2, ChevronRight, Package, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import type { ShippingCity } from '@/types';

interface FormData {
  full_name: string;
  mobile: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: string;
  delivery_instructions: string;
  gst_number: string;
  business_name: string;
}

interface FormErrors {
  full_name?: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  payment_method?: string;
}

type OrderType = 'small' | 'bulk' | 'mixed';

function getItemOrderType(item: { quantity: number; max_small_qty: number; min_bulk_qty: number }): 'small' | 'bulk' | 'invalid' {
  if (item.quantity <= item.max_small_qty) return 'small';
  if (item.quantity >= item.min_bulk_qty) return 'bulk';
  return 'invalid';
}

function getCartOrderType(items: { quantity: number; max_small_qty: number; min_bulk_qty: number }[]): { type: OrderType | 'invalid'; hasInvalid: boolean } {
  let hasSmall = false;
  let hasBulk = false;
  let hasInvalid = false;

  for (const item of items) {
    const t = getItemOrderType(item);
    if (t === 'small') hasSmall = true;
    else if (t === 'bulk') hasBulk = true;
    else hasInvalid = true;
  }

  if (hasInvalid) return { type: 'invalid', hasInvalid: true };
  if (hasSmall && hasBulk) return { type: 'mixed', hasInvalid: false };
  if (hasBulk) return { type: 'bulk', hasInvalid: false };
  return { type: 'small', hasInvalid: false };
}

interface DeliveryValidation {
  valid: boolean;
  errorMessage: string | null;
  deliveryCharge: number;
}

function validateDelivery(
  city: ShippingCity | null,
  items: { quantity: number; max_small_qty: number; min_bulk_qty: number }[]
): DeliveryValidation {
  if (!city) {
    return { valid: false, errorMessage: null, deliveryCharge: 0 };
  }

  const { type, hasInvalid } = getCartOrderType(items);

  if (hasInvalid) {
    return {
      valid: false,
      errorMessage: 'Some items have invalid quantities. Please adjust quantities to either small or bulk range.',
      deliveryCharge: 0,
    };
  }

  if (type === 'small') {
    if (city.small_order_allowed) {
      return { valid: true, errorMessage: null, deliveryCharge: city.small_delivery_charge };
    }
    return {
      valid: false,
      errorMessage: 'Small quantity delivery is currently available only in Ayodhya.',
      deliveryCharge: 0,
    };
  }

  if (type === 'bulk') {
    if (city.bulk_order_allowed) {
      return { valid: true, errorMessage: null, deliveryCharge: city.bulk_delivery_charge };
    }
    return {
      valid: false,
      errorMessage: 'Bulk delivery is currently available only in Lucknow, Barabanki, and Ayodhya.',
      deliveryCharge: 0,
    };
  }

  if (type === 'mixed') {
    if (city.small_order_allowed && city.bulk_order_allowed) {
      return { valid: true, errorMessage: null, deliveryCharge: city.bulk_delivery_charge };
    }
    return {
      valid: false,
      errorMessage: 'Some items in your cart are not available for delivery to the selected city.',
      deliveryCharge: 0,
    };
  }

  return { valid: false, errorMessage: null, deliveryCharge: 0 };
}

function ProgressStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: 'Cart', icon: ShoppingCart },
    { label: 'Checkout', icon: MapPin },
    { label: 'Confirmation', icon: Check },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        return (
          <div key={step.label} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-accent/10 text-accent' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isCompleted ? 'bg-green-100 text-green-700' :
                isActive ? 'bg-accent text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="hidden sm:inline font-medium text-sm">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-10 h-0.5 mx-1 rounded ${
                index < currentStep ? 'bg-green-500' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [cities, setCities] = useState<ShippingCity[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<ShippingCity | null>(null);

  const [form, setForm] = useState<FormData>({
    full_name: '',
    mobile: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'cod',
    delivery_instructions: '',
    gst_number: '',
    business_name: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then((data: ShippingCity[]) => {
        setCities(data);
        setLoadingCities(false);
      })
      .catch(() => {
        setLoadingCities(false);
      });
  }, []);

  const cartOrderType = useMemo(() => {
    if (items.length === 0) return null;
    const result = getCartOrderType(items);
    if (result.hasInvalid) return 'invalid' as const;
    return result.type;
  }, [items]);

  const deliveryValidation = useMemo(() => {
    return validateDelivery(selectedCity, items);
  }, [selectedCity, items]);

  useEffect(() => {
    if (!form.city) {
      setSelectedCity(null);
      setErrors(prev => {
        const next = { ...prev };
        delete next.city;
        return next;
      });
      return;
    }

    const city = cities.find(c => c.city_name === form.city) || null;
    setSelectedCity(city);

    if (city) {
      setForm(prev => ({ ...prev, state: city.state }));
    }

    if (city) {
      const validation = validateDelivery(city, items);
      if (!validation.valid && validation.errorMessage) {
        setErrors(prev => ({ ...prev, city: validation.errorMessage || undefined }));
        return;
      }
    }

    setErrors(prev => {
      const next = { ...prev };
      delete next.city;
      return next;
    });
  }, [form.city, cities, items]);

  const isBulkOrder = cartOrderType === 'bulk' || cartOrderType === 'mixed';

  const orderTypeLabel = useMemo(() => {
    if (cartOrderType === 'small') return 'Small Order';
    if (cartOrderType === 'bulk') return 'Bulk Order';
    if (cartOrderType === 'mixed') return 'Mixed Order';
    return null;
  }, [cartOrderType]);

  const gstAmount = useMemo(() => {
    return isBulkOrder ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  }, [isBulkOrder, subtotal]);

  const totalAmount = useMemo(() => {
    return subtotal + deliveryValidation.deliveryCharge + gstAmount;
  }, [subtotal, deliveryValidation.deliveryCharge, gstAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[name as keyof FormErrors];
      return next;
    });
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!form.full_name.trim()) errs.full_name = 'Full name is required';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile.trim())) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email address';
    if (!form.address.trim()) errs.address = 'Complete address is required';
    if (!form.city.trim()) errs.city = 'Please select a city';
    if (!form.pincode.trim()) errs.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = 'Enter a valid 6-digit PIN code';
    if (!form.payment_method.trim()) errs.payment_method = 'Please select a payment method';

    if (form.city && deliveryValidation && !deliveryValidation.valid) {
      errs.city = deliveryValidation.errorMessage || 'Selected city is not available for delivery';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const formErrors = validate();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    if (!deliveryValidation.valid) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.full_name.trim(),
          customer_mobile: form.mobile.trim(),
          customer_email: form.email.trim(),
          delivery_address: form.address.trim(),
          city: form.city,
          state: form.state,
          pincode: form.pincode.trim(),
          landmark: form.landmark.trim() || null,
          order_type: cartOrderType,
          subtotal,
          delivery_charge: deliveryValidation.deliveryCharge,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          payment_method: form.payment_method,
          delivery_instructions: form.delivery_instructions.trim() || null,
          gst_number: form.gst_number.trim() || null,
          business_name: form.business_name.trim() || null,
          items: items.map(item => ({
            product_id: item.product_id,
            product_name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to place order. Please try again.');
      }

      const order = await res.json();
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setSubmitError(message);
      toast({ title: 'Order Failed', description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products before proceeding to checkout.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={1} />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">
            {/* Delivery Details */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="full_name" className="label">Full Name <span className="text-danger">*</span></label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    className="input-field"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && <p className="text-xs text-danger mt-1">{errors.full_name}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="label">Mobile Number <span className="text-danger">*</span></label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    className="input-field"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.mobile && <p className="text-xs text-danger mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="label">Email Address <span className="text-danger">*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="label">Complete Address <span className="text-danger">*</span></label>
                  <textarea
                    id="address"
                    name="address"
                    className="input-field resize-none"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / Flat / Street / Area / Landmark"
                    rows={3}
                  />
                  {errors.address && <p className="text-xs text-danger mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="landmark" className="label">Landmark</label>
                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    className="input-field"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="label">City <span className="text-danger">*</span></label>
                  <select
                    id="city"
                    name="city"
                    className="input-field"
                    value={form.city}
                    onChange={handleChange}
                    disabled={loadingCities}
                  >
                    <option value="">
                      {loadingCities ? 'Loading cities...' : 'Select a city'}
                    </option>
                    {cities.map(city => (
                      <option key={city.id} value={city.city_name}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-xs text-danger mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="label">State <span className="text-danger">*</span></label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="input-field bg-muted"
                    value={form.state}
                    readOnly
                    placeholder="Auto-filled from city"
                  />
                </div>

                <div>
                  <label htmlFor="pincode" className="label">PIN Code <span className="text-danger">*</span></label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    className="input-field"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-xs text-danger mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Payment & Additional Info */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment & Additional Info
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="payment_method" className="label">Payment Method <span className="text-danger">*</span></label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    className="input-field"
                    value={form.payment_method}
                    onChange={handleChange}
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="pay_on_confirmation">Pay on Confirmation</option>
                    <option value="manual_upi">Manual UPI Payment</option>
                    <option value="bank_transfer">Bank Transfer for Bulk Orders</option>
                  </select>
                  {errors.payment_method && <p className="text-xs text-danger mt-1">{errors.payment_method}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="delivery_instructions" className="label">Delivery Instructions</label>
                  <textarea
                    id="delivery_instructions"
                    name="delivery_instructions"
                    className="input-field resize-none"
                    value={form.delivery_instructions}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery (optional)"
                    rows={3}
                  />
                </div>

                {isBulkOrder && (
                  <>
                    <div>
                      <label htmlFor="gst_number" className="label">GST Number</label>
                      <input
                        id="gst_number"
                        name="gst_number"
                        type="text"
                        className="input-field"
                        value={form.gst_number}
                        onChange={handleChange}
                        placeholder="GSTIN (optional for bulk orders)"
                      />
                    </div>
                    <div>
                      <label htmlFor="business_name" className="label">Business Name</label>
                      <input
                        id="business_name"
                        name="business_name"
                        type="text"
                        className="input-field"
                        value={form.business_name}
                        onChange={handleChange}
                        placeholder="Business name (optional for bulk orders)"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="card p-6 sticky top-24 space-y-5">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Order Summary
              </h2>

              {/* Order Type Badge */}
              {orderTypeLabel && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  cartOrderType === 'small' ? 'bg-green-50 text-green-700' :
                  cartOrderType === 'bulk' ? 'bg-blue-50 text-blue-700' :
                  'bg-purple-50 text-purple-700'
                }`}>
                  <Package className="w-4 h-4" />
                  {orderTypeLabel}
                </div>
              )}

              {/* Items List */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Items ({items.length})
                </h3>
                <div className="divide-y divide-border max-h-64 overflow-y-auto scrollbar-hide">
                  {items.map(item => (
                    <div key={item.product_id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} &times; {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-foreground shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Delivery Charge
                  </span>
                  <span className="font-semibold">
                    {selectedCity ? formatPrice(deliveryValidation.deliveryCharge) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </span>
                </div>

                {isBulkOrder && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      GST (5%)
                    </span>
                    <span className="font-semibold">{formatPrice(gstAmount)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Delivery validation warning */}
              {form.city && !deliveryValidation.valid && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{deliveryValidation.errorMessage || 'Delivery not available to this city.'}</span>
                </div>
              )}

              {cartOrderType === 'invalid' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Please adjust item quantities to either small or bulk range before placing the order.</span>
                </div>
              )}

              {/* Delivery info notice */}
              <div className="p-3 bg-muted rounded-md text-xs text-muted-foreground flex items-start gap-2">
                <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {!selectedCity
                    ? 'Select a city to see delivery charges and availability.'
                    : deliveryValidation.valid
                      ? `Delivery available to ${selectedCity.city_name}.`
                      : 'Delivery not available to the selected city.'}
                </span>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !deliveryValidation.valid ||
                  cartOrderType === 'invalid' ||
                  Object.keys(errors).length > 0
                }
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="btn-outline w-full flex items-center justify-center gap-2 py-3 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
