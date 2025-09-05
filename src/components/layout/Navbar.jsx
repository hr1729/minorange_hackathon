import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Settings, LogOut, User } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">SecurityScanner</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center space-x-2">
                <Avatar.Root className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Avatar.Image
                    src="https://github.com/shadcn.png"
                    alt="User"
                    className="w-full h-full rounded-full"
                  />
                  <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                    <User className="w-4 h-4" />
                  </Avatar.Fallback>
                </Avatar.Root>
                <span className="font-medium">John Doe</span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-white rounded-md shadow-lg p-1 mt-2"
                sideOffset={5}
              >
                <Link to="/profile">
                  <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </DropdownMenu.Item>
                </Link>
                <Link to="/settings">
                  <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenu.Item>
                </Link>
                <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer text-red-600">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
