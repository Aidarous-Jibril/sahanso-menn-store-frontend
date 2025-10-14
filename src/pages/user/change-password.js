import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import ProfileSideBar from '@/components/user/layout/ProfileSideBar';
import styles from '@/styles/styles';
import ChangePassword from '@/components/user/ChangePassword';

const ChangePasswordPage = () => {
  const [active, setActive] = useState(6);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <div className="w-[100px] 800px:w-[330px] bg-white">
          <ProfileSideBar active={6}  />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChangePassword  />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
