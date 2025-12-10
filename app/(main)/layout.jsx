import React from "react";

const MainLayout = ({ children }) => {
  return <div className="container mx-auto my-20" suppressHydrationWarning>{children}</div>;
};

export default MainLayout;