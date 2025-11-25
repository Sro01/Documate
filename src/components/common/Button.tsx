interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'red';
  size?: 'small' | 'medium' | 'large';
}

function Button({ children, variant, size = 'medium', className = '', ...props }: ButtonProps) {
  // rounded 클래스를 className에서 추출
  const hasRoundedClass = className.includes('rounded');
  const baseClasses = hasRoundedClass
    ? "font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
    : "font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md";

  let variantClasses = "";
  let sizeClasses = "";

  switch (variant) {
    case 'primary':
      variantClasses = "bg-blue-300 hover:bg-blue-400 text-black cursor-pointer";
      break;
    case 'secondary':
      variantClasses = "bg-gray-300 hover:bg-gray-400 text-black cursor-pointer";
      break;
    case 'outline':
      variantClasses = "border-2 border-blue-400 text-blue-500 hover:bg-gray-100 cursor-pointer";
      break;
    case 'white':
      variantClasses = "bg-white hover:bg-gray-300 text-black cursor-pointer";
      break;
    case 'red':
      variantClasses = "bg-red-400 hover:bg-red-500 text-white cursor-pointer";
      break;
    default:
      variantClasses = "bg-[#e9eef6] hover:bg-gray-300 text-black cursor-pointer";
  }

  switch (size) {
    case 'small':
      sizeClasses = "text-sm py-2 px-4";
      break;
    case 'large':
      sizeClasses = "text-lg py-3 px-6";
      break;
    default: // medium
      sizeClasses = "text-base py-2.5 px-5";
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
