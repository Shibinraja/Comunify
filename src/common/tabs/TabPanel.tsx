import * as React from "react";
import { HTMLAttributes, useEffect, useState } from "react";

export function TabPanel({
  children,
  render = "idle",
  unmount = "never",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  hidden: boolean;
} & (
    | {
        render?: "always" | "idle";
        unmount?: "never";
      }
    | {
        render?: "lazy";
        unmount?: "always" | "idle" | "never";
      }
  )) {
  const [shouldRender, setShouldRender] = useState<boolean>(
    !props.hidden || render === "always"
  );

  useEffect(() => {
    if (!props.hidden || render === "always") {
      setShouldRender(true);
      // if the window of the browser goes to idle period requestIdleCallback method queues a function to perform background and low priority work on the main event loop
    } else if (render === "idle") {
      // if there is no idle periods in the browser we can call a setTimeout callback in order to run them before the timeout elapses
      ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(() =>
        setShouldRender(true)
      );
      //unmount variable to check and stop un-necessary render of the children in react. 
    } else if (unmount === "always") {
      setShouldRender(false);
      //unmount variable to check and stop un-necessary render of the children in react. 
    } else if (unmount === "idle") {
      // if there is no idle periods in the browser we can call a setTimeout callback in order to run them before the timeout elapses
      ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(() =>
        setShouldRender(false)
      );
    }
  }, [props.hidden, render, unmount]);

  return <div {...props}>{shouldRender ? children : null}</div>;
}
