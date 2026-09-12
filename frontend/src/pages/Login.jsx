import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { FcGoogle } from 'react-icons/fc';
import { useLoginMutation } from '../features/auth/queries';

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: () => {
        // Handle successful login navigation
        // navigate('/dashboard'); 
      },
      onError: (error) => {
        console.error('Login failed', error);
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9] p-5">
      <div className="bg-white w-full max-w-[400px] p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <h1 className="text-primary text-2xl font-bold mb-2 mt-0">Hungry world</h1>
        <p className="text-[#666] text-[14px] mb-6 leading-relaxed">Welcome back! Please login to your account.</p>
        
        {loginMutation.isError && (
           <p className="text-red-500 text-sm mb-4">Login failed. Please check your credentials.</p>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <InputField 
            label="Email" 
            type="email" 
            name="email" 
            placeholder="Enter your Email" 
            value={formData.email} 
            onChange={handleChange} 
          />
          
          <InputField 
            label="Password" 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange} 
          />
          
          <Button fullWidth type="submit" variant="primary">
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <div className="mt-3">
            <Button fullWidth variant="outline" type="button" icon={<FcGoogle size={20} />}>
              Sign in with Google
            </Button>
          </div>
        </form>
        
        <div className="text-center text-[14px] text-[#666]">
          Don't have an account? <span className="text-primary font-medium cursor-pointer transition-colors duration-200 hover:text-primary-hover" onClick={() => navigate('/register')}>Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
