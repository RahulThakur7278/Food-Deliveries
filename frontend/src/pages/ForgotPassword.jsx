import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useSendOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } from '../features/auth/queries';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.email) return;
    
    sendOtpMutation.mutate(
      { email: formData.email },
      {
        onSuccess: () => setStep(2),
        onError: (error) => alert(error.response?.data?.message || "Failed to send OTP")
      }
    );
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!formData.otp) return;

    verifyOtpMutation.mutate(
      { email: formData.email, otp: formData.otp },
      {
        onSuccess: () => setStep(3),
        onError: (error) => alert(error.response?.data?.message || "Invalid OTP")
      }
    );
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate(
      { email: formData.email, otp: formData.otp, password: formData.newPassword },
      {
        onSuccess: () => {
          alert("Password reset successfully!");
          navigate('/login');
        },
        onError: (error) => alert(error.response?.data?.message || "Failed to reset password")
      }
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9] p-5">
      <div className="bg-white w-full max-w-[400px] p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <h1 className="text-primary text-2xl font-bold mb-2 mt-0">Forgot Password</h1>
        
        {step === 1 && (
          <>
            <p className="text-[#666] text-[14px] mb-6 leading-relaxed">
              Enter your email address to receive a verification code.
            </p>
            <form onSubmit={handleSendOtp} className="mb-6">
              <InputField 
                label="Email" 
                type="email" 
                name="email" 
                placeholder="Enter your Email" 
                value={formData.email} 
                onChange={handleChange} 
                required
              />
              <Button fullWidth type="submit" variant="primary" disabled={sendOtpMutation.isPending}>
                {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[#666] text-[14px] mb-6 leading-relaxed">
              Enter the OTP sent to your email address.
            </p>
            <form onSubmit={handleVerifyOtp} className="mb-6">
              <InputField 
                label="OTP" 
                type="text" 
                name="otp" 
                placeholder="Enter 6-digit OTP" 
                value={formData.otp} 
                onChange={handleChange} 
                required
              />
              <Button fullWidth type="submit" variant="primary" disabled={verifyOtpMutation.isPending}>
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-[#666] text-[14px] mb-6 leading-relaxed">
              Enter your new password below.
            </p>
            <form onSubmit={handleResetPassword} className="mb-6">
              <InputField 
                label="New Password" 
                type="password" 
                name="newPassword" 
                placeholder="Enter new password" 
                value={formData.newPassword} 
                onChange={handleChange} 
                required
              />
              <InputField 
                label="Confirm Password" 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm new password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required
              />
              <Button fullWidth type="submit" variant="primary" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        )}
        
        <div className="text-center text-[14px] text-[#666]">
          Remember your password? <span className="text-primary font-medium cursor-pointer transition-colors duration-200 hover:text-primary-hover" onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
