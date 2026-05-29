import { MapPin, Phone, Mail } from "lucide-react";

const directionsUrl = "https://maps.app.goo.gl/hnmWMkXkQscuYyar6";
const phoneNumber = "+254731030404";
const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8246468844367!2d35.88135!3d-0.222208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sen!2ske!4v1234567890`;

const LocationSection = () => {
  return (
    <section className="bg-gray-50 py-12 sm:py-20 md:py-32" itemScope itemType="https://schema.org/LocalBusiness">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Section Title */}
        <div className="mb-12 text-center animate-slide-up">
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-950">
            Visit Our Location
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Find us at our warehouse in Nakuru. We're ready to serve you with quality cement and building materials.
          </p>
        </div>

        {/* Map and Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map - Takes 2 columns on desktop */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="rounded-2xl overflow-hidden shadow-lg h-96 sm:h-[450px]">
              <iframe
                title="National Simba Cements Location - Nakuru, Kenya"
                src={mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="animate-fade-in">
            <div className="rounded-2xl bg-white shadow-lg p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-indigo-950 mb-6">Contact Info</h3>

                {/* Address */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-2">
                    <MapPin className="h-5 w-5 text-indigo-700 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600 text-sm" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <span itemProp="streetAddress">Nakuru-Nyahururu Rd</span><br />
                        <span itemProp="addressLocality">Nakuru</span>, <span itemProp="addressCountry">Kenya</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-2">
                    <Phone className="h-5 w-5 text-indigo-700 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <a
                        href={`tel:${phoneNumber}`}
                        className="text-indigo-700 hover:text-indigo-800 font-semibold transition-colors"
                        itemProp="telephone"
                      >
                        +254 731 030 404
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-8">
                  <div className="flex items-start gap-3 mb-2">
                    <Mail className="h-5 w-5 text-indigo-700 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a
                        href="mailto:info@nationalsimbacements.site"
                        className="text-indigo-700 hover:text-indigo-800 font-semibold transition-colors break-all"
                        itemProp="email"
                      >
                        info@nationalsimbacements.site
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-700 px-4 py-3 text-sm sm:text-base font-bold text-white transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Hours Section */}
        <div className="mt-12 rounded-2xl bg-white shadow-lg p-6 sm:p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-indigo-950 mb-6">Business Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
              <p className="font-semibold text-gray-900 mb-2">Weekdays (Mon - Fri)</p>
              <p className="text-gray-600">
                <meta itemProp="dayOfWeek" content="Monday" />
                <meta itemProp="dayOfWeek" content="Tuesday" />
                <meta itemProp="dayOfWeek" content="Wednesday" />
                <meta itemProp="dayOfWeek" content="Thursday" />
                <meta itemProp="dayOfWeek" content="Friday" />
                <meta itemProp="opens" content="08:00" />
                <meta itemProp="closes" content="17:00" />
                8:00 AM - 5:00 PM
              </p>
            </div>
            <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
              <p className="font-semibold text-gray-900 mb-2">Saturdays</p>
              <p className="text-gray-600">
                <meta itemProp="dayOfWeek" content="Saturday" />
                <meta itemProp="opens" content="09:00" />
                <meta itemProp="closes" content="15:00" />
                9:00 AM - 3:00 PM
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">Sundays & Holidays</p>
              <p className="text-gray-600">Closed</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">Emergency Orders</p>
              <p className="text-gray-600">Call anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
