import * as React from "react";
import { getPath, subscribe } from "./router";
export const usePathname = () => React.useSyncExternalStore(subscribe, getPath, getPath);
export const notFound = () => { throw new Error("notFound"); };
