"use client";

import React, { createContext, useState } from "react";

export const GBContext = createContext({});

const GlobalizeBreadcrumb = ({ children }: any) => {
  const [title, setTitle] = useState("");
  return (
    <GBContext.Provider value={{ title, setTitle }}>
      {children}
    </GBContext.Provider>
  );
};

export default GlobalizeBreadcrumb;
