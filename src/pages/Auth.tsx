import React, { useState } from 'react';
import { Mail, Lock, User, Phone, FileText, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Logo from '../assets/images/stlogo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const Auth: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [isProfessional, setIsProfessional] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    license: '',
    specialization: '',
    experience: ''
  });
  const [proStep, setProStep] = useState(1);
  const totalProSteps = 4;
  const [showPassword, setShowPassword] = useState(false); // default: hidden
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // default: hidden
  const [errors, setErrors] = useState({});
  // Only keep state for selected document type and file
  const [selectedDocType, setSelectedDocType] = useState('idDocument');
  const [singleDocFile, setSingleDocFile] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validation helper
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && !formData.fullName) newErrors.fullName = 'Full name is required';
    if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Handle form submission
    console.log('Form submitted:', formData);
    if (isLogin) {
      navigate('/dashboard');
    }
  };

  // Helper for stepper
  const stepTitles = [
    'Account Information',
    'Professional Details',
    'Document Upload',
    'Review & Submit',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Logo Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#25A8A0] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-white">
          <div className="flex flex-col items-center justify-center mb-6 w-full">
            <img src={Logo} alt="SoulTalk Logo" className="w-44 h-44 mb-4" />
            <h1 className="text-7xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Montserrat, sans-serif' }}>SoulTalk</h1>
          </div>
          <p className="text-2xl opacity-90 max-w-lg leading-relaxed text-center">
            Connect with licensed mental health professionals for confidential support
          </p>
        </div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Half - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center mb-4 lg:hidden bg-[#25A8A0] w-full h-32">
              <img src={Logo} alt="SoulTalk Logo" className="w-20 h-20 mb-2" />
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Montserrat, sans-serif' }}>SoulTalk</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* User Type Toggle */}
          {!isLogin && (
            <div className="mb-6">
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIsProfessional(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    !isProfessional
                      ? 'bg-[#25A8A0] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfessional(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    isProfessional
                      ? 'bg-[#25A8A0] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Professional
                </button>
              </div>
            </div>
          )}

          {/* Login/Sign Up Card (not professional multi-step) */}
          {(!isProfessional || isLogin) && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto animate-fade-in">
              <div className="flex flex-col items-center mb-6">
                <h1 className="text-2xl font-bold text-[#25A8A0]" style={{ fontFamily: 'Poppins, Inter, Montserrat, sans-serif' }}>SoulTalk</h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {isLogin ? 'Welcome Back!' : 'Create Your Account'}
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
              </p>
              {/* Social Login (only on login page) */}
              {isLogin && (
                <>
                  <div className="flex flex-col gap-3 mb-6">
                    <button type="button" className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 shadow-sm">
                      <FcGoogle className="w-5 h-5" />
                      Continue with Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 shadow-sm">
                      <FaApple className="w-5 h-5" />
                      Continue with Apple
                    </button>
                  </div>
                  <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-200"></div>
                    <span className="mx-4 text-gray-400 text-sm">or continue with</span>
                    <div className="flex-grow h-px bg-gray-200"></div>
                  </div>
                </>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name (Sign Up only) */}
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.fullName ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base`}
                      required
                      placeholder="Full Name"
                    />
                    {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName}</span>}
                  </div>
                )}
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base`}
                    required
                    placeholder="Email Address"
                  />
                  {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                </div>
                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base`}
                    required
                    placeholder="Password"
                  />
                  <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0]" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                </div>
                {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base`}
                      required
                      placeholder="Confirm Password"
                    />
                    <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0]" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#25A8A0] text-white py-3 px-4 rounded-xl hover:bg-[#1e8a82] focus:ring-2 focus:ring-[#25A8A0] focus:ring-offset-2 transition-all font-bold text-lg mt-2 shadow-lg animate-bounce-once"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
                {isLogin && (
                  <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-[#25A8A0] hover:text-[#1e8a82] transition-all">
                      Forgot your password?
                    </a>
                  </div>
                )}
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-[#25A8A0] hover:text-[#1e8a82] font-medium transition-all"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Professional Multi-Step Sign Up */}
          {!isLogin && isProfessional && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              {/* Stepper */}
              <div className="flex items-center justify-between mb-8">
                {stepTitles.map((title, idx) => (
                  <div key={title} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white mb-1 transition-all duration-300 ${proStep === idx+1 ? 'bg-[#25A8A0] scale-110 shadow-lg' : idx+1 < proStep ? 'bg-[#25A8A0]/80' : 'bg-gray-300'}`}>{idx+1}</div>
                    <span className={`text-xs text-center ${proStep === idx+1 ? 'text-[#25A8A0]' : 'text-gray-400'}`}>{title}</span>
                  </div>
                ))}
              </div>
              {/* Step 1: Account Information */}
              {proStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-[#25A8A0] mb-4">Account Information</h3>
                  <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                  required
                />
              </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                required
              />
              <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0]" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                  required
                />
                <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0]" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
                    </div>
              </div>
            )}
                {/* Step 2: Professional Details */}
                {proStep === 2 && (
                  <div>
                    <h3 className="text-xl font-bold text-[#25A8A0] mb-4">Professional Details</h3>
                    <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                    required
                  />
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="license"
                    placeholder="License Number"
                    value={formData.license}
                    onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                    required
                  />
                </div>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                  required
                >
                  <option value="">Select Specialization</option>
                  <option value="clinical-psychology">Clinical Psychology</option>
                  <option value="counseling">Counseling</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="social-work">Social Work</option>
                  <option value="marriage-family">Marriage & Family Therapy</option>
                  <option value="addiction">Addiction Counseling</option>
                </select>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25A8A0] focus:border-transparent text-base"
                  required
                >
                  <option value="">Years of Experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                    </div>
                  </div>
                )}
                {/* Step 3: Document Upload */}
                {proStep === 3 && (
                  <div>
                    <h3 className="text-xl font-bold text-[#25A8A0] mb-4">Document Upload</h3>
                    <div className="space-y-4">
                      {/* Radio buttons for document type */}
                      <div className="flex flex-col gap-2 mb-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="docType" value="idDocument" checked={selectedDocType === 'idDocument'} onChange={() => setSelectedDocType('idDocument')} className="accent-[#25A8A0]" />
                          <span>Government ID</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="docType" value="licenseDocument" checked={selectedDocType === 'licenseDocument'} onChange={() => setSelectedDocType('licenseDocument')} className="accent-[#25A8A0]" />
                          <span>Professional License</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="docType" value="certificationDocument" checked={selectedDocType === 'certificationDocument'} onChange={() => setSelectedDocType('certificationDocument')} className="accent-[#25A8A0]" />
                          <span>Certification/Diploma</span>
                    </label>
                  </div>
                      {/* Single file upload for selected type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedDocType === 'idDocument' && 'Government ID'}
                          {selectedDocType === 'licenseDocument' && 'Professional License'}
                          {selectedDocType === 'certificationDocument' && 'Certification/Diploma'}
                    </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#25A8A0] transition-colors bg-gray-50">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setSingleDocFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="singleDocUpload"
                          />
                          <label htmlFor="singleDocUpload" className="cursor-pointer block">
                            {singleDocFile ? (
                              <span className="text-[#25A8A0] font-medium">{singleDocFile.name}</span>
                            ) : (
                              <span className="text-gray-400">Drag & drop or click to upload</span>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Step 4: Review & Submit */}
                {proStep === 4 && (
                  <div>
                    <h3 className="text-xl font-bold text-[#25A8A0] mb-4">Review & Submit</h3>
                    <div className="space-y-4 text-base">
                      <div><span className="font-semibold">Full Name:</span> {formData.fullName}</div>
                      <div><span className="font-semibold">Email:</span> {formData.email}</div>
                      <div><span className="font-semibold">Phone:</span> {formData.phone}</div>
                      <div><span className="font-semibold">License:</span> {formData.license}</div>
                      <div><span className="font-semibold">Specialization:</span> {formData.specialization}</div>
                      <div><span className="font-semibold">Experience:</span> {formData.experience}</div>
                      <div><span className="font-semibold">Document Type:</span> {selectedDocType === 'idDocument' ? 'Government ID' : selectedDocType === 'licenseDocument' ? 'Professional License' : 'Certification/Diploma'}</div>
                      <div><span className="font-semibold">Document File:</span> {singleDocFile ? singleDocFile.name : 'Not uploaded'}</div>
                  </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Verification Process</p>
                      <p>Your documents will be reviewed within 24-48 hours. You'll receive an email confirmation once approved.</p>
                    </div>
                  </div>
                </div>
                  </div>
            )}
                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 mt-8">
                  {proStep > 1 && (
                    <button
                      type="button"
                      className="flex-1 py-3 rounded-lg font-semibold text-lg transition-all duration-300 border border-gray-300 text-gray-700 hover:border-[#25A8A0] hover:bg-[#25A8A0]/10 hover:text-[#25A8A0]"
                      onClick={() => proStep > 1 && setProStep(proStep - 1)}
                      disabled={proStep === 1}
                    >
                      Back
                    </button>
            )}
                  {proStep < totalProSteps ? (
            <button
                      type="button"
                      className="flex-1 py-3 rounded-lg font-semibold text-lg transition-all duration-300 bg-[#25A8A0] text-white shadow-lg hover:bg-[#1e8a82]"
                      onClick={() => proStep < totalProSteps && setProStep(proStep + 1)}
            >
                      Next
            </button>
                  ) : (
              <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg font-semibold text-lg transition-all duration-300 bg-[#25A8A0] text-white shadow-lg hover:bg-[#1e8a82]"
              >
                      Submit for Verification
              </button>
                  )}
          </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?
                  <button
                    onClick={() => { setIsLogin(true); setIsProfessional(false); }}
                    className="ml-1 text-[#25A8A0] hover:text-[#1e8a82] font-medium transition-all"
                  >
                    Sign in
                  </button>
                </p>
          </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;