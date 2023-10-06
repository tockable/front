import { useEffect, useState } from "react";
import styles from "./fade.module.css";

export default function Fade({ show, children }) {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onTransitionEnd = () => {
    if (!show) setRender(false);
  };

  return (
    shouldRender && (
      <div
        className={`${show ? styles.fadeIn : styles.fadeOut}`}
        onAnimationEnd={onTransitionEnd}
      >
        {children}
      </div>
    )
  );
}
