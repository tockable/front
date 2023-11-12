import { useTimer } from "react-timer-hook";

const variants = {
  start: "text-tock-green border border-tock-green rounded-xl",
  end: "text-blue-400 border border-blue-400 rounded-xl",
};

export default function CountDown({ exts, variant }) {
  const _expiryTimestamp = new Date();

  const utc = Date.UTC(
    _expiryTimestamp.getUTCFullYear(),
    _expiryTimestamp.getUTCMonth(),
    _expiryTimestamp.getUTCDate(),
    _expiryTimestamp.getUTCHours(),
    _expiryTimestamp.getUTCMinutes()
  );

  const expiryTimestamp = utc + exts;

  const { seconds, minutes, hours, days, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => pause(),
  });

  return (
    <div className="flex justify-center">
      <TimeBox time={days} variant={variant} />
      <Dellimeter variant={variant} />
      <TimeBox time={hours} variant={variant} />
      <Dellimeter variant={variant} />
      <TimeBox time={minutes} variant={variant} />
      <Dellimeter variant={variant} />
      <TimeBox time={seconds} variant={variant} />
    </div>
  );
}

function TimeBox({ time, variant }) {
  return (
    <p className={`p-2 mx-2 w-12 text-center ${variants[variant]}`}>{time}</p>
  );
}

function Dellimeter({ variant }) {
  return (
    <p
      className={`${variant === "start" && "text-tock-green"} ${
        variant === "end" && "text-blue-400"
      }`}
    >
      :
    </p>
  );
}
