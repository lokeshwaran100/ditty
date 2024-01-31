import React, { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}



export const ProfileContainer: React.FC<ContainerProps> = ({ children, className, style}) => {
  return (
    <div className={`relative max-w-[44rem] mx-auto py-2 w-full ${className}`} style={style}>
      {children}
    </div>
  );
};


  
export const Container: React.FC<ContainerProps> = ({ children, className }) => {
    return (
      <div className={`relative max-w-10xl mx-auto px-2 w-full ${className}`}>
        {children}
      </div>
    );
};

export const NavContainer: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    
    <header className="relative z-10">
        <Container>
            <nav className={`flex justify-between items-center px-2 py-2 ${className}`}>
                {children}
            </nav>
        </Container>
    </header>
  );
};



