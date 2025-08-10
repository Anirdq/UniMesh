import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfilePhotoUpload = ({ currentPhoto, onPhotoChange, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          onPhotoChange(e?.target?.result);
          setIsUploading(false);
        };
        reader?.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const file = e?.dataTransfer?.files?.[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    handleFileSelect(file);
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
  };

  return (
    <div className={`bg-card rounded-lg p-6 border border-border ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Profile Photo</h3>
      <div className="flex flex-col items-center">
        {/* Photo Display */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-border">
            {currentPhoto ? (
              <Image
                src={currentPhoto}
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="User" size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>
          
          {currentPhoto && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
              onClick={handleRemovePhoto}
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={`w-full max-w-sm border-2 border-dashed rounded-lg p-6 text-center transition-smooth cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary hover:bg-muted/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef?.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground mb-1">
                Drop your photo here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 5MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Camera Button for Mobile */}
        <div className="mt-4 sm:hidden">
          <Button variant="outline" size="sm">
            <Icon name="Camera" size={16} className="mr-2" />
            Take Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;