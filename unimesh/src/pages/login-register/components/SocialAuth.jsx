import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';


const SocialAuth = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSuccess?.();
      navigate('/discovery-feed');
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          loading={loadingProvider === 'google'}
          iconName="Chrome"
          iconPosition="left"
          className={cn("w-full")}
        >
          Google
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialLogin('microsoft')}
          loading={loadingProvider === 'microsoft'}
          iconName="Square"
          iconPosition="left"
          className={cn("w-full")}
        >
          Microsoft
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <button className="text-primary hover:text-primary/80 transition-smooth">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:text-primary/80 transition-smooth">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default SocialAuth;