import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "@lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { Quantity } from "@components/common/cart/Quantity";
import { items, setItems } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    // Define the type for the filterPosts prop
    items: Array<Post>;
    deleteItem: () => void;
}

export const CartCardMobile: Component<Props> = (props) => {
    const [newItems, setNewItems] = createSignal<Array<Post>>([]);
    const [quantity, setQuantity] = createSignal<number>(0);

    createEffect(async () => {
        if (props.items) {
            const updatedItems = await Promise.all(
                props.items.map(async (item: Post) => {
                    const newItem = { ...item };
                    newItem.image_urls
                        ? (newItem.image_url = await downloadImage(
                              newItem.image_urls.split(",")[0]
                          ))
                        : (newItem.image_url = undefined);

                    const { data: sellerImg, error: sellerImgError } =
                        await supabase
                            .from("sellerview")
                            .select("*")
                            .eq("seller_id", newItem.seller_id);

                    if (sellerImgError) {
                        console.log(sellerImgError);
                    }

                    if (sellerImg) {
                        if (sellerImg[0].image_url) {
                            newItem.seller_img = await downloadCreatorImage(
                                sellerImg[0].image_url
                            );
                        }
                    }

                    return newItem;
                })
            );

            setNewItems(updatedItems);
        }
    });

    const updateQuantity = async (quantity: number, product_id?: string) => {
        console.log("Card Card Update Quantity");
        setQuantity(quantity);
        if (product_id) {
            const updatedItems: Array<Post> = await Promise.all(
                props.items.map(async (item: Post) => {
                    if (item.product_id === product_id) {
                        item.quantity = quantity;
                    }
                    return item;
                })
            );
            setNewItems(updatedItems);
            console.log("Updated Items: " + updatedItems);

            const cartItems: Array<Post> = await Promise.all(
                props.items.map(async (oldItem: Post) => {
                    let item: Post = {
                        ...oldItem,
                        price: oldItem.price ? oldItem.price : 0,
                        quantity: oldItem.quantity ? oldItem.quantity : 0,
                    };
                    if (oldItem.product_id === product_id) {
                        item.quantity = quantity;
                    }
                    return item;
                })
            );

            setItems(cartItems);
            console.log("Cart Store: " + cartItems);
        }
    };

    const removeItem = async (product_id: string) => {
        let currentItems = items;
        currentItems = currentItems.filter(
            (item) => item.product_id !== product_id
        );
        setItems(currentItems);
        console.log("Items" + items.map((item) => item.title));
        props.deleteItem();
    };

    //REFACTOR Helper Functions
    const downloadImage = async (path: string) => {
        try {
            const { data: webpData, error: webpError } = await supabase.storage
                .from("post.image")
                .createSignedUrl(`webp/${path}.webp`, 60 * 60);
            if (webpError) {
                throw webpError;
            }
            const webpUrl = webpData.signedUrl;

            const { data: jpegData, error: jpegError } = await supabase.storage
                .from("post.image")
                .createSignedUrl(`jpeg/${path}.jpeg`, 60 * 60);
            if (jpegError) {
                throw jpegError;
            }
            const jpegUrl = jpegData.signedUrl;

            const url = { webpUrl, jpegUrl };
            return url;
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error downloading image: ", error.message);
            }
        }
    };

    //REFACTOR Helper Functions
    const downloadCreatorImage = async (path: string) => {
        try {
            const { data: webpData, error: webpError } = await supabase.storage
                .from("user.image")
                .createSignedUrl(`webp/${path}.webp`, 60 * 60);
            if (webpError) {
                throw webpError;
            }
            const webpUrl = webpData.signedUrl;

            const { data: jpegData, error: jpegError } = await supabase.storage
                .from("user.image")
                .createSignedUrl(`jpeg/${path}.jpeg`, 60 * 60);
            if (jpegError) {
                throw jpegError;
            }
            const jpegUrl = jpegData.signedUrl;

            const url = { webpUrl, jpegUrl };
            return url;
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error downloading image: ", error.message);
            }
        }
    };

    return (
        <div class="flex w-full justify-center">
            <ul class="flex w-full flex-wrap">
                {newItems().map((item: Post) => (
                    <li class=" mx-4 w-full border-b border-border1 border-opacity-50 py-4 dark:border-border1-DM">
                        <div class=" box-content flex h-full w-full flex-row  items-start justify-start">
                            <div class="mr-2 flex h-full w-24 items-center justify-center rounded-lg bg-background1 dark:bg-background1-DM">
                                {item.image_url ? (
                                    <picture>
                                        <source
                                            srcset={item.image_url.webpUrl}
                                            type="image/webp"
                                        />
                                        <img
                                            src={item.image_url.jpegUrl}
                                            alt={
                                                item.image_urls?.split(",")[0]
                                                    ? "User Image"
                                                    : "No image"
                                            }
                                            class="h-full w-full rounded-lg bg-background1 object-cover dark:bg-icon1-DM"
                                        />
                                    </picture>
                                ) : (
                                    <svg
                                        viewBox="0 0 512 512"
                                        version="1.1"
                                        class="fill-logo h-full w-full bg-gray-400 object-cover"
                                    >
                                        <g
                                            id="Page-1"
                                            stroke="none"
                                            stroke-width="1"
                                        >
                                            <g
                                                id="icon"
                                                transform="translate(64.000000, 64.000000)"
                                            >
                                                <path
                                                    d="M384,1.42108547e-14 L384,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L384,1.42108547e-14 Z M109.226667,142.933333 L42.666,249.881 L42.666,341.333 L341.333,341.333 L341.333,264.746 L277.333333,200.746667 L211.84,266.24 L109.226667,142.933333 Z M245.333333,85.3333333 C227.660221,85.3333333 213.333333,99.6602213 213.333333,117.333333 C213.333333,135.006445 227.660221,149.333333 245.333333,149.333333 C263.006445,149.333333 277.333333,135.006445 277.333333,117.333333 C277.333333,99.6602213 263.006445,85.3333333 245.333333,85.3333333 Z"
                                                    id="Combined-Shape"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>
                                )}
                            </div>

                            <div
                                id="cardContent"
                                class="flex h-full w-full justify-between pt-1 text-left"
                            >
                                <div class="grid h-full w-full grid-cols-7">
                                    <div class="col-span-5">
                                        <p class="text-md w-full overflow-hidden truncate font-bold text-ptext1 dark:text-ptext1-DM">
                                            <a
                                                href={`/${lang}/posts/${item.id}`}
                                            >
                                                {item.title}
                                            </a>
                                        </p>
                                    </div>
                                    <div class="col-span-4 col-start-1 flex items-center">
                                        <div class="inline-block">
                                            {item.seller_img ? (
                                                <picture>
                                                    <source
                                                        srcset={
                                                            item.seller_img
                                                                .webpUrl
                                                        }
                                                        type="image/webp"
                                                    />
                                                    <img
                                                        src={
                                                            item.seller_img
                                                                .jpegUrl
                                                        }
                                                        alt={
                                                            item.seller_img
                                                                ? // TODO Internationalize
                                                                  "Seller Image"
                                                                : "No image"
                                                        }
                                                        class="mr-2 h-6 w-6 rounded-full bg-background1 object-cover dark:bg-icon1-DM"
                                                    />
                                                </picture>
                                            ) : (
                                                <svg
                                                    viewBox="0 0 512 512"
                                                    version="1.1"
                                                    class="fill-logo mr-2 h-6 w-6 rounded-full bg-gray-400 object-cover"
                                                ></svg>
                                            )}
                                        </div>
                                        <p class="inline-block overflow-hidden text-sm text-ptext1 dark:text-ptext1-DM">
                                            <a
                                                href={`/${lang}/creator/${item.seller_id}`}
                                            >
                                                {item.seller_name}
                                            </a>
                                        </p>
                                    </div>
                                    <div class="col-span-4 col-start-1 flex items-center">
                                        {/* Quantity */}
                                        <Quantity
                                            quantity={item.quantity}
                                            updateQuantity={updateQuantity}
                                            product_id={item.product_id}
                                        />
                                    </div>
                                    <div class="col-span-1 col-start-7 row-start-1 flex justify-end pl-2">
                                        {/* Price */}
                                        <Show when={item.price > 0}>
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </Show>
                                        <Show when={item.price === 0}>
                                            {t("messages.free")}
                                        </Show>
                                    </div>
                                    <div class="col-start-7 row-start-3  place-content-center text-end">
                                        {/* Remove All from Cart */}
                                        <button
                                            class="rounded font-bold text-alert1 dark:text-alert1-DM"
                                            onclick={() =>
                                                removeItem(item.product_id)
                                            }
                                            aria-label={t(
                                                "ariaLabels.removeFromCart"
                                            )}
                                        >
                                            <svg
                                                class="h-6 w-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
