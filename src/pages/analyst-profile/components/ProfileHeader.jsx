import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ userData, onImageUpload, onEditProfile }) => {
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
            <Image
              src={userData?.profileImage}
              alt={userData?.profileImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="profile-image-upload"
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Icon name="Camera" size={16} />
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            {userData?.name}
          </h1>
          <p className="text-muted-foreground mb-2">{userData?.email}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {userData?.role}
            </span>
            <span className="text-muted-foreground">
              Member since {userData?.memberSince}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          iconName="Edit"
          iconPosition="left"
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>

        <Button
          variant="destructive"
          iconName="LogOut"
          iconPosition="left"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
