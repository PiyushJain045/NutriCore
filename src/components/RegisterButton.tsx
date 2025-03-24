
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface RegisterButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

const RegisterButton = ({ 
  variant = "secondary", 
  className = "" 
}: RegisterButtonProps) => {
  return (
    <Button 
      variant={variant} 
      className={className} 
      asChild
    >
      <Link to="/register">
        <UserPlus className="mr-2 h-4 w-4" />
        Register
      </Link>
    </Button>
  );
};

export default RegisterButton;
