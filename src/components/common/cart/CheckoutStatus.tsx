import type { Component } from "solid-js";
import {
  Show,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { items, setItems } from "@components/common/cart/AddToCartButton";
import type Stripe from "stripe";
import supabase from "@lib/supabaseClient";
import type { Post } from "@lib/types";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CheckoutStatus: Component = () => {
  const [session, setSession] = createSignal<Stripe.Checkout.Session>();
  const [products, setProducts] = createSignal<Partial<Post>[]>([]);

  onMount(async () => {
    await CurrentCheckoutStatus();
  });

  async function CurrentCheckoutStatus() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    const response = await fetch(
      `/api/getCheckoutStatus?session_id=${sessionId}`,
      {
        method: "GET",
      }
    );
    const res = await response.json();
    const session = res.session as Stripe.Checkout.Session;
    if (session) {
      setSession(session);
    }

    if (session.status === "open") {
      window.location.replace(`/${lang}/checkout`);
    } else if (session.status === "complete") {
      console.log(session);
      await fetchOrderedItems();
      document.getElementById("success")?.classList.remove("hidden");
      document.getElementById("success")?.classList.add("flex");
      localStorage.removeItem("cartItems");
      setItems([]);
    }
  }

  async function fetchOrderedItems() {
    console.log(session());
    const { data: orderedItems, error } = await supabase
      .from("order_details")
      .select("*")
      .eq("order_number", session()?.metadata?.orderId);
    if (error) {
      console.log("Order Details Error: " + error.code + " " + error.message);
      return;
    }
    const orderedItemsIds = orderedItems?.map((item) => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from("seller_post")
      .select("title, resource_urls")
      .in("id", orderedItemsIds);
    if (productsError) {
      console.log(
        "Products Error: " + productsError.code + " " + productsError.message
      );
      return;
    }
    console.log(products);
    setProducts(products);
  }

  return (
    <div>
      <div class="flex-col items-center bg-btn1 text-white hidden" id="success">
        <svg
          viewBox="0 0 24 24"
          id="check-mark-circle"
          class="text-btn1 w-16 h-16"
        >
          <circle cx="12" cy="12" r="10" fill="white"></circle>
          <path
            d="M11,15.5a1,1,0,0,1-.71-.29l-3-3a1,1,0,1,1,1.42-1.42L11,13.09l4.29-4.3a1,1,0,0,1,1.42,1.42l-5,5A1,1,0,0,1,11,15.5Z"
            fill="currentColor"
          ></path>
        </svg>
        {/* <p>{t("checkout.success")}</p> TODO: Internationalize*/}
        <p class="text-3xl font-bold">Success!</p>
        {/* <p>{t("checkout.thanks")}</p> TODO: Internationalize*/}
        <p class="italic">Thank you for your order</p>
      </div>
      <div class="border border-red-500">
        {/* TODO: Internationalize */}
        <div>Order ID: {session()?.metadata?.orderId}</div>
        {/* TODO: Internationalize */}
        <div>
          Total: ${" "}
          {session()?.amount_total
            ? (session()!.amount_total! / 100).toFixed(2)
            : 0}
        </div>
        <div>
          {/* TODO: Clean up rendering */}
          {products().map((item) => (
            <p>{item.title}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
