import React from 'react';
import Button from '../../../components/ui/Button';

const AuthToggle = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex bg-muted rounded-lg p-1 mb-8">
      <Button
        variant={activeMode === 'login' ? 'default' : 'ghost'}
        onClick={() => onModeChange('login')}
        className="flex-1 rounded-md"
      >
        Sign In
      </Button>
      <Button
        variant={activeMode === 'register' ? 'default' : 'ghost'}
        onClick={() => onModeChange('register')}
        className="flex-1 rounded-md"
      >
        Create Account
      </Button>
    </div>
  );
};

export default AuthToggle;