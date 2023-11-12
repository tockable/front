import Input from "../input/input";
export default function LabeledInput(props) {
  return (
    <div className="mt-2 mb-8">
      <label
        className={`${
          props.disabled == true ? "text-zinc-600" : "text-tock-blue"
        } block text-sm font-bold mb-2`}
      >
        {props.children}
      </label>
      <Input
        name={props.name}
        min={props.min}
        step={props.step}
        value={props.value}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
        required={props.required}
        disabled={props.disabled}
      />
      {props.subtitle && (
        <div className="text-zinc-400 text-xs mt-2">{props.subtitle}</div>
      )}
    </div>
  );
}
