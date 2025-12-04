import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandHeader from './components/SecurityBadge';
import LoginForm from './components/LoginForm';
import RoleAccessInfo from './components/RoleAccessInfo';
import SecurityBadge from './components/SecurityBadge';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/analytics-dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <BrandHeader />
          
          <LoginForm />
          
          <RoleAccessInfo />
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground mb-4">
              Enterprise-Grade Security
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <SecurityBadge icon="Lock" text="256-bit SSL Encryption" />
              <SecurityBadge icon="Shield" text="SOC 2 Certified" />
              <SecurityBadge icon="CheckCircle" text="GDPR Compliant" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date()?.getFullYear()} ReviewChat Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;