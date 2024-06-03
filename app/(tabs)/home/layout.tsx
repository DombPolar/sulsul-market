import React from "react";

const ProductsLayout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <>
      {modal}
      {children}
    </>
  );
};

export default ProductsLayout;
