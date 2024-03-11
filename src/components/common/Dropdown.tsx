import { createSignal } from "solid-js";
import type { Component } from "solid-js";

interface Props {
  options: HTMLOptionElement[];
  selectedOption: HTMLOptionElement;
  setSelectedOption: (option: HTMLOptionElement) => void;
}

const Dropdown: Component<Props> = (Props: Props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  function handleOptionClick(option: HTMLOptionElement) {
    Props.setSelectedOption(option);
    setIsOpen(false);
  }

  return (
    <div class="relative inline-block ml-2">
      {/* Dropdown button */}
      <button
        class="flex rounded mb-4 focus:border-highlight1 dark:focus:border-highlight1-DM border border-inputBorder1 dark:border-inputBorder1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
        onClick={() => setIsOpen(!isOpen())}
      >
        <div class="inline-block ml-2">
            {Props.selectedOption || "Select an option"}
        </div>
        {/* Dropdown icon */}
        <div class="inline-block">
            <svg
          class={`h-5 w-5 inline-block transition-transform transform dark:fill-white 
          ${isOpen() ? "rotate-180" : ""}`}
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
        </div>
      </button>
      {isOpen() && (
        <div
          class="absolute ml-2 rounded mb-4 
        focus:border-highlight1 dark:focus:border-highlight1-DM 
        border border-inputBorder1 dark:border-inputBorder1-DM 
        focus:border-2 focus:outline-none 
        bg-background1 dark:bg-background2-DM 
        text-ptext1 dark:text-ptext2-DM
        max-w-md whitespace-normal"
        >
          {Props.options.map((option) => (
            <div
              class="py-2 px-4 cursor-pointer hover:bg-gray-100 whitespace-normal"
              onClick={() => handleOptionClick(option)}
            >
              {option}
              <div class="border border-border1 dark:border-border1-DM rounded text-xs p-2">
              {option.dataset.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
