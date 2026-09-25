import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import { orderService } from "@/features/orders/orderService";

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .list()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-3 px-4 py-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-card bg-ink/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Your orders</h1>
      {orders.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-soft">
          No orders yet —{" "}
          <Link to="/" className="text-primary hover:underline">
            start browsing
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-card border border-line bg-paper-raised p-4 shadow-stall hover:shadow-stall-hover"
            >
              <div>
                <p className="font-mono text-sm font-medium text-ink">{order.order_number}</p>
                <p className="text-xs text-ink-soft">{order.vendor_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-ink">{formatPrice(order.subtotal)}</span>
                <Badge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_STEPS = ["pending", "accepted", "processing", "shipped", "delivered"];

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .retrieve(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-2xl animate-pulse px-4 py-10">
      <div className="h-40 rounded-card bg-ink/5" />
    </div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-ink-soft">
        Couldn't find that order.
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/orders" className="mb-6 inline-block text-sm text-ink-soft hover:text-ink">
        ← All orders
      </Link>

      <div className="rounded-card border border-line bg-paper-raised p-6 shadow-stall">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-sm text-ink-soft">{order.order_number}</p>
            <h1 className="mt-1 font-display text-xl font-bold text-ink">{order.vendor_name}</h1>
          </div>
          <Badge status={order.status} />
        </div>

        {currentStepIndex >= 0 && (
          <div className="mt-6 flex items-center gap-1.5">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 items-center gap-1.5">
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= currentStepIndex ? "bg-success" : "bg-ink/10"
                  }`}
                />
              </div>
            ))}
          </div>
        )}
        {order.tracking_number && (
          <p className="mt-2 font-mono text-xs text-ink-soft">
            Tracking: {order.tracking_number}
          </p>
        )}

        <div className="mt-6 divide-y divide-line border-y border-line">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <div>
                <p className="text-ink">{item.product_name}</p>
                {item.variant_label && (
                  <p className="text-xs text-ink-soft">{item.variant_label}</p>
                )}
                <p className="text-xs text-ink-soft">Qty {item.quantity}</p>
              </div>
              <span className="font-mono text-ink">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between font-medium text-ink">
          <span>Total</span>
          <span className="font-mono">{formatPrice(order.subtotal)}</span>
        </div>

        {order.cancellation_reason && (
          <p className="mt-4 rounded-lg bg-danger-light p-3 text-sm text-danger-dark">
            Cancelled: {order.cancellation_reason}
          </p>
        )}
      </div>
    </div>
  );
}
