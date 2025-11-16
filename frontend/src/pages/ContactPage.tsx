import React from 'react'
import { MapPin, Phone, Mail, Building } from 'lucide-react'

const ContactPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-red-700 pb-2">
        Contact
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          {/* Address */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <MapPin className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Address</h2>
                <p className="text-gray-700 leading-relaxed">
                  [INSERT ADDRESS HERE]<br />
                  Harvard Medical School<br />
                  Boston, MA [INSERT ZIP]
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Phone className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Phone</h2>
                <p className="text-gray-700">
                  [INSERT PHONE NUMBER]
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Mail className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Email</h2>
                <p className="text-gray-700">
                  <a href="mailto:[INSERT_EMAIL]" className="text-red-700 hover:text-red-800">
                    [INSERT EMAIL ADDRESS]
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Lab Location */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Building className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Lab Location</h2>
                <p className="text-gray-700">
                  [INSERT BUILDING NAME]<br />
                  [INSERT ROOM/FLOOR]
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <div className="space-y-6">
          {/* Building Entrance Photo */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Building Entrance</h2>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <img
                src="/contact-photos/building-entrance.jpg"
                alt="Building entrance"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const placeholder = e.currentTarget.parentElement
                  if (placeholder) {
                    placeholder.innerHTML = '<div class="text-gray-500 text-center p-8"><p class="text-sm">Building Entrance Photo</p><p class="text-xs mt-2">[Place image at: /public/contact-photos/building-entrance.jpg]</p></div>'
                  }
                }}
              />
            </div>
          </div>

          {/* Directions Map */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">How to Get Here</h2>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <img
                src="/contact-photos/directions-map.jpg"
                alt="Directions map"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const placeholder = e.currentTarget.parentElement
                  if (placeholder) {
                    placeholder.innerHTML = '<div class="text-gray-500 text-center p-8"><p class="text-sm">Directions Map</p><p class="text-xs mt-2">[Place image at: /public/contact-photos/directions-map.jpg]</p></div>'
                  }
                }}
              />
            </div>
          </div>

          {/* Google Maps Embed (Optional) */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Location on Map</h2>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              [Google Maps embed will go here]
              <br />
              <span className="text-xs">(Update with actual coordinates)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Visiting the Lab:</strong> [INSERT VISITING INSTRUCTIONS]
          </p>
          <p>
            <strong>Parking:</strong> [INSERT PARKING INFORMATION]
          </p>
          <p>
            <strong>Public Transportation:</strong> [INSERT TRANSIT INFORMATION]
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage