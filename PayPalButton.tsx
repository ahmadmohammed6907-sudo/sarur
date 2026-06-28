"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypal?: any;
  }
}

interface PayPalButtonProps {
  /** Amount in US dollars (e.g. 49.99) */
  amount: number;
  currency?: string;
  sellerId: string;
  serviceId?: string;
  projectId?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (err: string) => void;
}

export function PayPalButton({
  amount,
  currency = "USD",
  sellerId,
  serviceId,
  projectId,
  description,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const renderedRef = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setStatus("error");
      setMessage("PayPal Client ID غير مضبوط. أضف NEXT_PUBLIC_PAYPAL_CLIENT_ID في .env.local");
      return;
    }

    // Load PayPal SDK script once
    const existingScript = document.getElementById("paypal-sdk");
    const loadPayPal = () => {
      if (renderedRef.current || !containerRef.current) return;
      renderedRef.current = true;

      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay",
          },
          createOrder: async () => {
            setStatus("loading");
            const res = await fetch("/api/payments/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sellerId,
                serviceId,
                projectId,
                amount,
                currency,
                description,
              }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "فشل إنشاء الطلب");
            setStatus("idle");
            return data.paypalOrderId;
          },
          onApprove: async (data: { orderID: string }) => {
            setStatus("loading");
            const res = await fetch("/api/payments/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paypalOrderId: data.orderID }),
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
              const errMsg = result.error ?? "فشل تأكيد الدفع";
              setStatus("error");
              setMessage(errMsg);
              onError?.(errMsg);
              return;
            }
            setStatus("success");
            setMessage("تم الدفع بنجاح!");
            onSuccess?.(result.payment?.id ?? "");
          },
          onError: (err: unknown) => {
            const msg = err instanceof Error ? err.message : "حدث خطأ في PayPal";
            setStatus("error");
            setMessage(msg);
            onError?.(msg);
          },
          onCancel: () => {
            setStatus("idle");
          },
        })
        .render(containerRef.current);
    };

    if (existingScript) {
      if (window.paypal) loadPayPal();
      else existingScript.addEventListener("load", loadPayPal);
    } else {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
      script.onload = loadPayPal;
      script.onerror = () => {
        setStatus("error");
        setMessage("فشل تحميل PayPal SDK");
      };
      document.body.appendChild(script);
      setStatus("idle");
    }
  }, [amount, currency, sellerId, serviceId, projectId, description, onSuccess, onError]);

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        <p className="text-sm font-semibold text-emerald-300">{message}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-rose-400" />
        <p className="text-sm text-rose-300">{message}</p>
        <button
          className="mt-2 rounded-lg bg-rose-500/20 px-4 py-1.5 text-xs text-rose-300 hover:bg-rose-500/30"
          onClick={() => {
            setStatus("idle");
            renderedRef.current = false;
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {status === "loading" && (
        <div className="flex items-center justify-center gap-2 text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">جاري التحميل…</span>
        </div>
      )}
      <div ref={containerRef} className="min-h-[48px]" />
      <p className="text-center text-xs text-zinc-500">
        آمن ومشفر بواسطة PayPal
      </p>
    </div>
  );
}
