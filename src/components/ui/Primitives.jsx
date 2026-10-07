import { forwardRef } from "react";
import styles from "./primitives.module.css";

function classes(...values) {
  return values.filter(Boolean).join(" ");
}

export const Button = forwardRef(function Button({
  as: Component = "button",
  variant = "default",
  size = "default",
  className,
  type,
  children,
  ...props
}, ref) {
  return (
    <Component
      ref={ref}
      className={classes(styles.button, styles[variant], styles[size], className)}
      type={Component === "button" ? type ?? "button" : type}
      {...props}
    >
      <span className={styles.buttonLabel}>{children}</span>
    </Component>
  );
});

export function Badge({ variant = "secondary", className, ...props }) {
  return <span className={classes(styles.badge, styles[variant], className)} {...props} />;
}

export const Card = forwardRef(function Card({ as: Component = "div", className, ...props }, ref) {
  return <Component ref={ref} className={classes(styles.card, className)} {...props} />;
});

export function CardHeader({ className, ...props }) {
  return <div className={classes(styles.cardHeader, className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={classes(styles.cardContent, className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={classes(styles.cardFooter, className)} {...props} />;
}
