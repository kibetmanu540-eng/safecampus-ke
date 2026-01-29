import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, FileWarning, BookOpen, Menu, X, ShieldCheck, User } from 'lucide-react';
import { Button } from './ui/button';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/report', label: 'Report', icon: FileWarning },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/my-story', label: 'My Story', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-purple-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="SafeCampus KE logo" className="h-16 w-16 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SafeCampus KE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(path) 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'hover:bg-purple-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Campaign Badge */}
          <div className="hidden md:flex items-center bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-900">Speak Up Safely</span>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-purple-100">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  className={`w-full justify-start flex items-center space-x-2 ${
                    isActive(path) 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'hover:bg-purple-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
            <div className="flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-lg mt-4">
              <ShieldCheck className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-900">Speak Up Safely</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
