import TabBar from "@/components/tab-bar";
import React from "react";

const TabLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <TabBar />
    </>
  );
};

export default TabLayout;
