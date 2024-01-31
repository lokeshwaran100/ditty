import { ReactNode } from "react";

type HeadingProps = {
    children: ReactNode;
    className?: string;
  }
  
export const PageHeading: React.FC<HeadingProps> = ({ children, className}) => {
  return (
    <h1 className={`text-3xl font-medium my-6 ${className}`}>
      {children}
    </h1>
  );
};

export const SectionHeading: React.FC<HeadingProps> = ({ children, className}) => {
    return (
      <h2 className={`text-2xl font-medium my-3 py-2 pb-5 ${className}`}>
        {children}
      </h2>
    );
  };