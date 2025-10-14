import React from 'react';

const VendorProfileData = ({ vendor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Vendor Profile</h2>
        <p className="text-gray-600">Detailed information about the vendor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-700">Basic Information</h3>
            <div className="mt-2">
              <p className="text-gray-600"><strong>Name:</strong> {vendor.name}</p>
              <p className="text-gray-600"><strong>Email:</strong> {vendor.email}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {vendor.phone}</p>
              <p className="text-gray-600"><strong>Address:</strong> {vendor.address}</p>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-700">Business Information</h3>
            <div className="mt-2">
              <p className="text-gray-600"><strong>Business Name:</strong> {vendor.businessName}</p>
              <p className="text-gray-600"><strong>Business Type:</strong> {vendor.businessType}</p>
              <p className="text-gray-600"><strong>About:</strong> {vendor.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-medium text-gray-700">Social Links</h3>
        <div className="mt-2">
          {vendor.socialLinks && vendor.socialLinks.map((link, index) => (
            <p key={index} className="text-gray-600">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {link.platform}
              </a>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorProfileData;
