import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import RoleSelector from '../components/RoleSelector';
import { FcGoogle } from 'react-icons/fc';

const SignUp = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up Data:', formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9] p-5">
      <div className="bg-white w-full max-w-[400px] p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <h1 className="text-primary text-2xl font-bold mb-2 mt-0">Foodies</h1>
        <p className="text-[#666] text-[14px] mb-6 leading-relaxed">Create your account to get started with delicious food deliveries</p>

        <form onSubmit={handleSubmit} className="mb-6">
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="Enter your Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Mobile"
            name="mobile"
            placeholder="Enter your Mobile Number"
            value={formData.mobile}
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

          <RoleSelector
            options={[
              { label: 'user', value: 'user' },
              { label: 'owner', value: 'owner' },
              { label: 'deliveryBoy', value: 'deliveryBoy' }
            ]}
            selectedRole={formData.role}
            onChange={handleRoleChange}
          />

          <Button fullWidth type="submit" variant="primary">Sign Up</Button>

          <div className="mt-3">
            <Button fullWidth variant="outline" type="button" icon={<FcGoogle size={20} />}>
              Sign up with Google
            </Button>
          </div>
        </form>

        <div className="text-center text-[14px] text-[#666]">
          Already have an account? <span className="text-primary font-medium cursor-pointer transition-colors duration-200 hover:text-primary-hover" onClick={onNavigateToLogin}>Sign In</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
