import React from "react";

const VendorWithdraw = () => {
  return (
    <div className="w-full bg-gray-100 p-4 rounded-md">
      {/* Withdraw UI */}
<div className="w-full mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Sale Product Information</h2>
        <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
            <tr>
                <th className="border px-4 py-2 text-left">SL</th>
                <th className="border px-4 py-2 text-left">Amount</th>
                <th className="border px-4 py-2 text-left">Request Time</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
            </tr>
            </thead>

          <tbody>
            <tr>
              <td className="border px-4 py-2">1</td>
              <td className="border px-4 py-2">$500.00</td>
              <td className="border px-4 py-2">October 12th, 2022</td>
              <td className="border px-4 py-2 text-red-500">Denied</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white px-4 py-1 rounded">Close</button>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">$600.00</td>
              <td className="border px-4 py-2">October 12th, 2022</td>
              <td className="border px-4 py-2 text-green-500">Approved</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white px-4 py-1 rounded">Close</button>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">3</td>
              <td className="border px-4 py-2">$500.00</td>
              <td className="border px-4 py-2">October 12th, 2022</td>
              <td className="border px-4 py-2 text-blue-500">Pending</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white px-4 py-1 rounded">Close</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorWithdraw;

