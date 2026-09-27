import * as React from "react";
import { navigate } from "./router";
type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
export default function Link({ href, onClick, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={href.startsWith("#") ? href : `#${href.replace(/^\/?#/, "")}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
