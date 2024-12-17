import React from "react";
import { IDashboardCtx } from "../types/dashboard.types";

export const DashboardContext = React.createContext<IDashboardCtx | undefined>(
  undefined
);

export const useDashboardContext = () => {
  const ctx = React.useContext(DashboardContext);
  if (ctx === undefined) {
    throw new Error(
      "useDashboardContext should be used inside DashboardContext"
    );
  }
  return ctx;
};