const BUTTON_VARIANTS = {
  primary:
    "disabled:bg-zinc-400 transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack text-sm font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white",
  secondary:
    "disabled:bg-zinc-400 transition ease-in-out mr-4 hover:bg-sky-400 duration-300 bg-sky-600 text-tock-blue text-sm font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-tock-semiblack",
  warning:
    "disabled:bg-zinc-400 transition ease-in-out mr-4 hover:bg-orange-300 duration-300 bg-tock-orange text-tock-blue text-sm font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-tock-semiblack",
};

export default function Button(props) {
  return (
    <button
      id={props.id}
      className={`${props.variant && BUTTON_VARIANTS[props.variant]} ${
        props.className
      }`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
