import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mockCredentials = [
    { email: 'analyst@reviewchat.com', password: 'Analyst@2025', role: 'Analyst' },
    { email: 'admin@reviewchat.com', password: 'Admin@2025', role: 'Administrator' }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const user = mockCredentials?.find(
        cred => cred?.email === formData?.email && cred?.password === formData?.password
      );

      if (user) {
        localStorage.setItem('userRole', user?.role);
        localStorage.setItem('userEmail', user?.email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTimestamp', new Date()?.toISOString());
        
        // Redirect to role-specific profile
        if (user?.role === 'Administrator') {
          navigate('/admin-profile');
        } else {
          navigate('/analyst-profile');
        }
      } else {
        setErrors({
          general: 'Invalid credentials. Please use:\nAnalyst: analyst@reviewchat.com / Analyst@2025\nAdmin: admin@reviewchat.com / Admin@2025'
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive mb-1">Authentication Failed</p>
            <p className="text-xs text-destructive/80 whitespace-pre-line">{errors?.general}</p>
          </div>
        </div>
      )}
      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="Enter your work email"
        value={formData?.email}
        onChange={handleChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <a
          href="#"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          onClick={(e) => {
            e?.preventDefault();
            alert('Password recovery functionality will be implemented in the next phase.');
          }}
        >
          Forgot Password?
        </a>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        Sign In
      </Button>
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  );
};

export default LoginForm;