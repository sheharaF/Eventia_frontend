import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card py-12 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              © 2025 Eventia. All Rights Reserved.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Colombo, Sri Lanka</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@eventia.com</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+94 77 123 4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;