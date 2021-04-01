import React from "react";
import { IButtonProps } from "../../models/presentational";

const Button: React.FC<IButtonProps> = ({ className, children, onClick }) => (
  <>
    <button className={className} onClick={onClick}>
      {children}
    </button>
  </>
);

export default Button;
