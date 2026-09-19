import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { FcGoogle } from 'react-icons/fc';
import { useLoginMutation, useGoogleSignInMutation } from '../features/auth/queries';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../utils/firebase';

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const googleSignInMutation = useGoogleSignInMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      googleSignInMutation.mutate(
        { email: result.user.email },
        {
          onSuccess: (response) => {
            alert("Signed in with Google successfully!");
            const role = response?.data?.role;
            if (role === 'owner') navigate('/owner-dashboard');
            else if (role === 'deliveryBoy') navigate('/delivery-dashboard');
            else navigate('/user-dashboard');
          },
          onError: (error) => {
            alert(error.response?.data?.message || "User does not exist. Please sign up first.");
          }
        }
      );
    } catch (error) {
      console.error("Firebase Google Sign-In error:", error);
      alert("Failed to authenticate with Google");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: (response) => {
        const role = response?.data?.role;
        if (role === 'owner') navigate('/owner-dashboard');
        else if (role === 'deliveryBoy') navigate('/delivery-dashboard');
        else navigate('/user-dashboard');
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

          <div className="flex justify-end mb-4">
            <span 
              className="text-[13px] text-primary cursor-pointer hover:underline"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>
          
          <Button fullWidth type="submit" variant="primary">
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <div className="mt-3">
            <Button fullWidth variant="outline" type="button" icon={<FcGoogle size={20} />} onClick={handleGoogleSignIn} disabled={googleSignInMutation.isPending}>
              {googleSignInMutation.isPending ? 'Signing in with Google...' : 'Sign in with Google'}
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
