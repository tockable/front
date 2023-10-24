export default function Input(props) {
  return (
    <input
      className="disabled:bg-zinc-800 text-sm appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
      value={props.value}
      id={props.id}
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      required={props.required}
      name={props.name}
      min={props.min}
      step={props.step}
      disabled={props.disabled}
    />
  );
}
