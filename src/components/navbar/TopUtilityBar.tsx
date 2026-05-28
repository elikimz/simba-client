import { Mail, Phone, MapPin } from "lucide-react";

const TopBar = () => {
  const phoneNumber = "+254731030404";
  const email = "info@nationalsimbacements.site";
  
  return (
    <div className="w-full border-b bg-slate-50">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-2 text-xs font-medium text-slate-600 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-indigo-600" />
            <span>Call us: <a href={`tel:${phoneNumber}`} className="font-bold text-slate-900 hover:text-indigo-600">{phoneNumber}</a></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-indigo-600" />
            <a href={`mailto:${email}`} className="hover:text-indigo-600">{email}</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-indigo-600" />
            <span>Nakuru-Nyahururu Rd, Nakuru, Kenya</span>
          </div>
          <div className="hidden h-3 w-px bg-slate-300 md:block"></div>
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-indigo-600">Wholesale Cement Distributor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
