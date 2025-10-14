import { RxPerson } from 'react-icons/rx';
import { AiOutlineMessage, AiOutlineLogout } from 'react-icons/ai';
import { MdPayment } from 'react-icons/md';
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from 'react-icons/hi';
import { MdOutlineTrackChanges } from 'react-icons/md';
import { TbAddressBook } from 'react-icons/tb';
import { RiLockPasswordLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/slices/userSlice';


const ProfileSideBar = ({ active }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = async () => {
    await dispatch(logoutUser()); 
    toast.success("User logged out");
    router.push("/user/login");
  };
  

  const linkStyle = (index) =>
    `flex items-center cursor-pointer w-full mb-8 ${
      active === index ? 'text-[red]' : ''
    }`;

  const iconColor = (index) => (active === index ? 'red' : '');

  return (
    <div className="w-full h-full bg-white shadow-sm rounded-[10px] p-4 pt-8 flex flex-col justify-between">
      {/* Navigation links */}
      <div>
        <Link href="/user/profile" legacyBehavior>
          <a className={linkStyle(1)}>
            <RxPerson size={20} color={iconColor(1)} />
            <span className="pl-3 hidden md:block">Profile</span>
          </a>
        </Link>
        <Link href="/user/orders" legacyBehavior>
          <a className={linkStyle(2)}>
            <HiOutlineShoppingBag size={20} color={iconColor(2)} />
            <span className="pl-3 hidden md:block">Orders</span>
          </a>
        </Link>
        <Link href="/user/orders/track-order" legacyBehavior>
          <a className={linkStyle(3)}>
            <MdOutlineTrackChanges size={20} color={iconColor(3)} />
            <span className="pl-3 hidden md:block">Track Order</span>
          </a>
        </Link>
        <Link href="/user/orders/refund-orders" legacyBehavior>
          <a className={linkStyle(4)}>
            <HiOutlineReceiptRefund size={20} color={iconColor(4)} />
            <span className="pl-3 hidden md:block">Refunds</span>
          </a>
        </Link>
        <Link href="/user/inbox" legacyBehavior>
          <a className={linkStyle(5)}>
            <AiOutlineMessage size={20} color={iconColor(5)} />
            <span className="pl-3 hidden md:block">Inbox</span>
          </a>
        </Link>
        <Link href="/user/change-password" legacyBehavior>
          <a className={linkStyle(6)}>
            <RiLockPasswordLine size={20} color={iconColor(6)} />
            <span className="pl-3 hidden md:block">Change Password</span>
          </a>
        </Link>
        <Link href="/user/address" legacyBehavior>
          <a className={linkStyle(7)}>
            <TbAddressBook size={20} color={iconColor(7)} />
            <span className="pl-3 hidden md:block">Address</span>
          </a>
        </Link>
        <Link href="/user/payment-method" legacyBehavior>
          <a className={linkStyle(8)}>
            <MdPayment size={20} color={iconColor(8)} />
            <span className="pl-3 hidden md:block">Payment Method</span>
          </a>
        </Link>
      </div>

      {/* Logout button */}
      <div
        className="flex items-center cursor-pointer w-full pt-4 border-t mt-4"
        onClick={logoutHandler}
      >
        <AiOutlineLogout size={20} color="red" />
        <span className="pl-3 hidden md:block text-[red]">Logout</span>
      </div>
    </div>
  );
};

export default ProfileSideBar;
