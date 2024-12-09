import { useEffect, useRef, useState } from "react";
import useOutsideClick from "../Hooks/useOutsideClick";
import { themes } from "../themes";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

type Props = {
  bgColor?: string;
  selectedOption: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

const Select = ({
  bgColor,
  selectedOption: defaultSelectedValue,
  options,
  onChange,
}: Props) => {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  useOutsideClick({ ref: selectRef, setVisibility: setShowDropdown });

  const [selectedOption, setSelectedOption] =
    useState<string>(defaultSelectedValue);

  useEffect(() => {
    setSelectedOption(defaultSelectedValue);
  }, [defaultSelectedValue]);

  return (
    <div ref={selectRef} className="relative">
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className={`px-2 py-1 w-[10rem] rounded-lg cursor-pointer flex items-center justify-between ${
          showDropdown
            ? `outline outline-2 outline-offset-2 ${themes["pink"].outline.primary}`
            : ""
        } ${bgColor}`}
      >
        {options.find((option) => option.value === selectedOption)?.label ||
          "Select an option"}
        {showDropdown ? <FaAngleUp /> : <FaAngleDown />}
      </div>

      {showDropdown && (
        <div
          className={`absolute left-0 right-0 top-9 py-1 rounded-lg shadow-sm z-10 ${themes["pink"].shadow.primary} ${bgColor}`}
        >
          <div className="overflow-auto">
            {options.map(({ value, label }) => (
              <div
                key={value}
                onClick={() => {
                  onChange(value);
                  setSelectedOption(value);
                  setShowDropdown(false);
                }}
                className={`hover:cursor-pointer px-2 ${bgColor} ${
                  bgColor === "bg-white"
                    ? "hover:bg-[rgb(255,238,240)]"
                    : "hover:bg-white"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
