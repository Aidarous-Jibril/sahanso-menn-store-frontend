import Image from "next/image";
import Link from "next/link";

const TopSellers = ({ vendors = [] }) => {
  const bannerSrc = "/images/store.png";
  const backupLogo = "/images/store-backup.png";

  // Only take the top 5 vendors
  const topVendors = vendors.slice(0, 5);

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl px-2 sm:px-4 md:px-8 lg:px-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Top Sellers</h2>
            <Link href="/vendors" className="text-blue-500 hover:underline">
              View All <i className="fas fa-chevron-right" />
            </Link>
          </div>

          <div className="flex overflow-x-auto space-x-4 pb-4">
            {topVendors.map((seller, index) => (
              <Link href={`/vendor/dashboard/${seller._id}`} key={seller._id}>
                <div className="bg-white rounded-lg shadow p-4 relative min-w-[260px] max-w-[300px]">
                  {/* Banner Image */}
                  <div className="relative group">
                    <Image
                      src={bannerSrc}
                      alt={`${seller.name} banner`}
                      width={400}
                      height={100}
                      className="rounded-t-lg w-full h-24 object-cover"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    {/* Vendor Avatar */}
                    <div className="absolute left-4 -bottom-14 bg-white p-2 rounded-full border border-gray-200 shadow-lg">
                      <Image
                        src={seller.avatar?.url || backupLogo}
                        alt={`${seller.name} logo`}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="mt-12 text-center">
                    <h3 className="text-lg font-bold hover:text-blue-800 truncate">{seller.name}</h3>

                    <div className="flex items-center justify-center text-gray-500 text-sm">
                      <span>{seller.rating}</span>
                      <i className="fas fa-star text-yellow-500 ml-1" />
                      <span className="ml-1">Rating</span>
                    </div>

                    <div className="flex justify-between mt-4 text-sm text-gray-600">
                      <div className="text-center">
                        <p className="font-bold">{seller.reviews}</p>
                        <p>Reviews</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{seller.products}</p>
                        <p>Products</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellers;
