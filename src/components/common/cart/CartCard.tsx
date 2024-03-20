import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import supabase from "@lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import SocialModal from "@components/posts/SocialModal";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface ItemDetails {
  content: string;
  title: string;
  seller_name: string;
  image_urls: string | null;
  price?: number;
  price_id: string;
  quantity?: number;
  product_id: string;
}

interface Props {
  // Define the type for the filterPosts prop
  items: Array<ItemDetails>;
}

export const CartCard: Component<Props> = (props) => {
  const [newItems, setNewItems] = createSignal<Array<any>>([]);

  createEffect(async () => {
    if (props.items) {
      const updatedItems = await Promise.all(
        props.items.map(async (item: any) => {
          item.image_urls
            ? (item.image_url = await downloadImage(
                item.image_urls.split(",")[0]
              ))
            : (item.image_url = null);
          // Set the default quantity to 1 This should be replaced with the quantity from the quantity counter in the future
          item.quantity = 1;
          return item;
        })
      );

      setNewItems(updatedItems);
    }
  });

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("post.image")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      return url;
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  };

  return (
    <div class="flex justify-center w-full">
      <ul class="md:flex md:flex-wrap md:justify-center md:w-full">
        {newItems().map((item: any) => (
          <li class=" w-[99%]">
            <a href={`/${lang}/posts/${item.id}`}>
              <div class="mb-2 flex flex-col md:flex-row md:justify-start justify-center items-center md:items-start rounded-lg md:h-48 shadow-md shadow-shadow-LM dark:shadow-shadow-DM box-content border border-opacity-25 border-border1 dark:border-border1-DM dark:border-opacity-25 w-full">
                <div class="flex md:w-48 w-full h-80 md:h-48 md:mr-2 items-center justify-center bg-background1 dark:bg-background1-DM rounded-lg">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={
                        item.image_urls.split(",")[0]
                          ? "User Image"
                          : "No image"
                      }
                      class="bg-background1 dark:bg-icon1-DM rounded-lg w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 512 512"
                      version="1.1"
                      class="dark:bg-icon1-DM fill-logo rounded-lg w-full h-full object-cover"
                    >
                      <g id="Page-1" stroke="none" stroke-width="1">
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
                  class="flex justify-between px-1 pt-1 text-left w-full md:w-5/6 md:h-full"
                >
                  <div class="w-full">
                    <div class="grid grid-cols-4">
                      <div class="relative col-span-3 w-full flex align-top">
                        <div class="w-full">
                          <div class="truncate inline-block max-w-[58%]  md:mt-2 text-ptext2 dark:text-ptext2-DM text-sm md:text-base bg-background2 dark:bg-background2-DM  opacity-[85%] dark:opacity-100 w-fit rounded-lg px-2">
                             {/*post.major_municipality}/{post.minor_municipality*/}
                             {/*post.governing_district*/}
                          </div>
                          <div class="truncate inline-block max-w-[28%]  md:mt-2 text-ptext2 dark:text-ptext2-DM text-sm md:text-base bg-background2 dark:bg-background2-DM  opacity-[85%] dark:opacity-100 w-fit rounded-lg px-2 ml-1">
                            {item.category}
                          </div>
                        </div>
                      </div>

                      <p class="text-2xl font-bold text-ptext1 dark:text-ptext1-DM overflow-hidden max-h-14 col-span-4 pr-4 truncate">
                        {item.title}
                      </p>
                    </div>

                    <p class="overflow-hidden text-ptext1 dark:text-ptext1-DM text-base mb-1">
                      <span class="font-bold">{t("postLabels.provider")}</span>
                      {item.seller_name}
                    </p>

                    <p
                      class=" text-ptext1 dark:text-ptext1-DM text-sm max-h-[60px] line-clamp-3 mb-2 pt-0.5 overflow-hidden mr-4 prose dark:prose-invert"
                      innerHTML={item.content}
                    ></p>

                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
