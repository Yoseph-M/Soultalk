import React, { useState } from 'react';
import { Mail, Lock, User, FileText, Eye, EyeOff, ArrowRight, ChevronDown, Calendar as CalendarIcon, Hash } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Logo from '../assets/images/stlogo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';
import { countries } from '../data/countries';
import { Metadata, type CountryCode } from 'libphonenumber-js';
import metadata from 'libphonenumber-js/metadata.min.json';

const metadataObj = new Metadata(metadata);

const Auth: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [isProfessional, setIsProfessional] = useState(searchParams.get('role') === 'professional');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+1',
    dob: '',
    idType: '',
    idNumber: '',
    issuingAuthority: '',
    specialization: '',
  });
  // Update proStep default and total steps
  const [proStep, setProStep] = useState(1);
  const totalProSteps = 5;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  type ErrorsType = {
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  };
  const [errors, setErrors] = useState<ErrorsType>({});

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File | null>(null);
  const [idImage, setIdImage] = useState<File | null>(null);
  const [showStepErrors, setShowStepErrors] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isIdTypeDropdownOpen, setIsIdTypeDropdownOpen] = useState(false);
  const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { user, login, signup, isLoading: isAuthLoading } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (!isAuthLoading && user) {
      console.log('User already logged in, checking redirect:', { role: user.role, verified: user.verified });
      if (user.role === 'professional' || user.role === 'listener') {
        if (user.verified) {
          navigate('/professionals');
        } else {
          navigate('/verification-pending');
        }
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isAuthLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (showStepErrors) setShowStepErrors(false); // Clear errors on change
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCountry = countries.find(c => c.dial_code === formData.countryCode);
    let limit = 15;

    if (selectedCountry) {
      try {
        const m = new Metadata(metadata);
        m.selectNumberingPlan(selectedCountry.code as CountryCode);
        const lengths = m.numberingPlan.possibleLengths();
        if (lengths && lengths.length > 0) {
          limit = Math.max(...lengths);
        }
      } catch (err) {
        limit = 15;
      }
    }

    const value = e.target.value.replace(/\D/g, '').slice(0, limit);
    setFormData(prev => ({ ...prev, phone: value }));
    if (showStepErrors) setShowStepErrors(false);
  };

  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 8) value = value.slice(0, 8);

    let formatted = '';
    if (value.length > 0) {
      formatted += value.slice(0, 2);
      if (value.length > 2) {
        formatted += '/' + value.slice(2, 4);
        if (value.length > 4) {
          formatted += '/' + value.slice(4, 8);
        }
      }
    }

    // For DatePicker selected prop, we need a Date object or null
    // We update the display value via raw input if possible, or just parse it
    if (value.length === 8) {
      const day = parseInt(value.slice(0, 2));
      const month = parseInt(value.slice(2, 4)) - 1;
      const year = parseInt(value.slice(4, 8));
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        const isoDate = date.toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, dob: isoDate }));
      }
    } else {
      // Keep track of the partial date string if needed, but for now we'll let DatePicker handle it
      // Actually, we should probably store the raw string in formData for the input display
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Account
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.password &&
          formData.password.length >= 8 &&
          formData.confirmPassword &&
          (formData.password === formData.confirmPassword)
        );
      case 2: // Personal
        if (!formData.phone || !formData.dob) return false;
        const birthDate = new Date(formData.dob);
        const ageLimit = new Date();
        ageLimit.setFullYear(ageLimit.getFullYear() - 18);
        return birthDate <= ageLimit;
      case 3: // ID Check
        return !!(formData.idType && idImage);
      case 4: // Professional
        return !!(formData.specialization);
      case 5: // Documents
        return !!(profilePhoto && certificates);
      default:
        return false;
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!isLogin && !formData.firstName) newErrors.firstName = 'First name is required';
    if (!isLogin && !formData.lastName) newErrors.lastName = 'Last name is required';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For professionals on final step, validate all steps instead of basic validate
    if (isProfessional && !isLogin && proStep === totalProSteps) {
      // Validate all steps
      console.log('Validating all steps...');
      console.log('Step 1 (Account):', validateStep(1), { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword });
      console.log('Step 2 (Personal):', validateStep(2), { phone: formData.phone, dob: formData.dob });
      console.log('Step 3 (ID):', validateStep(3), { idType: formData.idType, idImage: idImage?.name });
      console.log('Step 4 (Professional):', validateStep(4), { specialization: formData.specialization });
      console.log('Step 5 (Documents):', validateStep(5), { profilePhoto: profilePhoto?.name, certificates: certificates?.name });

      const allStepsValid = [1, 2, 3, 4, 5].every(step => validateStep(step));
      if (!allStepsValid) {
        console.log('Validation failed!');
        alert('Please ensure all steps are completed correctly before submitting.');
        setShowStepErrors(true);
        return;
      }
      console.log('All validations passed!');
    } else {
      if (!validate()) return;
    }

    try {
      if (isLogin) {
        const loggedInUser = await login(formData.email, formData.password);
        if (loggedInUser) {
          console.log('Login result:', loggedInUser);

          // If the user wasn't fully signed in (unverified pro), pass details via state
          if (loggedInUser.notSignedIn) {
            navigate('/verification-pending', {
              state: {
                status: loggedInUser.verificationStatus,
                reason: loggedInUser.rejectionReason,
                reasonType: loggedInUser.rejectionReasonType,
                email: loggedInUser.email
              }
            });
            return;
          }

          if (loggedInUser.role === 'professional' || loggedInUser.role === 'listener') {
            if (loggedInUser.verified) {
              navigate('/professionals');
            } else {
              navigate('/verification-pending');
            }
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        if (isProfessional) {
          if (proStep === totalProSteps) {
            console.log('Starting signup process...');
            await signup({
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              userType: 'professional',
              phone: `${formData.countryCode} ${formData.phone}`,
              dob: formData.dob,
              idType: formData.idType,
              idNumber: formData.idNumber,
              issuingAuthority: formData.issuingAuthority,
              specialization: formData.specialization,
              profilePhotoFile: profilePhoto,
              singleDocFile: certificates,
              idImageFile: idImage,
              skipLogin: true
            });
            console.log('Signup successful, navigating to verification-pending...');
            // Manual navigation since we skipped auto-login
            navigate('/verification-pending');
          }
        } else {
          await signup({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            userType: 'client'
          });
          // Redirection will be handled by the useEffect
        }
      }
    } catch (error) {
      console.error(error);

      // Parse backend error messages
      if (error instanceof Error) {
        try {
          const errorObj = JSON.parse(error.message);

          // Handle specific error cases
          if (errorObj.email && errorObj.email.includes('This field must be unique.')) {
            alert('This email is already registered. Please use a different email or try logging in.');
            setErrors(prev => ({ ...prev, email: 'This email is already registered. Please use a different email or try logging in.' }));
            if (isProfessional && !isLogin) { // Only for professional signup
              setProStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else if (errorObj.username && errorObj.username.includes('already exists')) {
            alert('This email is already registered. Please use a different email or try logging in.');
            setErrors(prev => ({ ...prev, email: 'This email is already registered. Please use a different email or try logging in.' }));
            if (isProfessional && !isLogin) { // Only for professional signup
              setProStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            // Generic error message
            const errorMsg = 'Registration failed. Please check your information and try again.';
            alert(errorMsg);
            setErrors(prev => ({ ...prev, email: errorMsg }));
          }
        } catch {
          // If error message is not JSON
          const errorMsg = 'Authentication failed. Please check your credentials.';
          alert(errorMsg);
          setErrors(prev => ({ ...prev, email: errorMsg }));
        }
      } else {
        const errorMsg = 'An unexpected error occurred. Please try again.';
        alert(errorMsg);
        setErrors(prev => ({ ...prev, email: errorMsg }));
      }
    }
  };

  const handleProNext = () => {
    if (validateStep(proStep)) {
      if (proStep < totalProSteps) {
        setProStep(proStep + 1);
        setShowStepErrors(false);
      }
    } else {
      setShowStepErrors(true);
    }
  };

  const handleProBack = () => {
    if (proStep > 1) setProStep(proStep - 1);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificates(e.target.files[0]);
      setShowStepErrors(false);
    }
  };

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdImage(e.target.files[0]);
      setShowStepErrors(false);
    }
  };

  const stepTitles = ['Account', 'Personal', 'ID Check', 'Professional', 'Documents'];

  // Force light mode styles for inputs with improved UI
  const baseInputStyles = "!w-full !py-3.5 !border !rounded-xl !focus:ring-4 !focus:ring-[#25A8A0]/10 !focus:border-[#25A8A0] !transition-all !duration-200 !bg-gray-50 hover:!bg-white focus:!bg-white !text-gray-900 !border-gray-200 placeholder:text-gray-400 !shadow-sm font-medium";

  const inputClasses = (hasError: boolean = false) => `${baseInputStyles} !px-4 ${hasError ? '!border-red-500 !ring-red-500/20' : ''}`;
  const inputClassesWithIcon = (hasError: boolean = false) => `${baseInputStyles} !pl-11 !pr-4 ${hasError ? '!border-red-500 !ring-red-500/20' : ''}`;
  const inputClassesWithRightIcon = (hasError: boolean = false) => `${baseInputStyles} !pl-11 !pr-12 ${hasError ? '!border-red-500 !ring-red-500/20' : ''}`;
  const simpleInputClassesWithRightIcon = (hasError: boolean = false) => `${baseInputStyles} !px-4 !pr-12 ${hasError ? '!border-red-500 !ring-red-500/20' : ''}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#25A8A0] via-[#1e8a82] to-[#177a73] flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #111827 !important;
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Left Side - Clean Branding */}
          <div className="hidden md:flex flex-col text-white space-y-12 pr-8">


            <div className="space-y-6">
              <h2 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
                Your Journey to<br />
                <span className="text-white/60">Mental Wellness</span><br />
                Starts Here
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-md font-medium">
                Connect with licensed professionals in a safe, confidential environment.
                Experience compassionate care tailored to your unique needs.
              </p>
            </div>

            {/* Premium Trust Indicators */}
            <div className="grid gap-4 max-w-md">
              <div className="group flex items-center gap-5 p-5 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-[#25A8A0] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#25A8A0]/20 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg text-white">100% Confidential</div>
                  <div className="text-white/50 text-sm">Your privacy is our top priority</div>
                </div>
              </div>

              <div className="group flex items-center gap-5 p-5 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-[#25A8A0] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#25A8A0]/20 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg text-white">Expert Care</div>
                  <div className="text-white/50 text-sm">Verified and licensed therapists</div>
                </div>
              </div>
            </div>


          </div>

          {/* Right Side - Auth Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-5 md:p-6">


            {/* Form Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-gray-600 text-xs">
                {isLogin ? 'Sign in to continue your journey' : 'Create your account in minutes'}
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setIsProfessional(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 text-xs ${isProfessional === false
                  ? 'bg-white text-[#25A8A0] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Client
              </button>
              <button
                onClick={() => setIsProfessional(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 text-xs ${isProfessional === true
                  ? 'bg-white text-[#25A8A0] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Professional
              </button>
            </div>

            {/* Social Login - Only for Login */}
            {isLogin && (
              <div className="space-y-3 mb-5">
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-bold text-gray-700 bg-white shadow-sm">
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </button>
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Client/Simple Professional Form */}
            {(!isProfessional || isLogin) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={inputClassesWithIcon(!!errors.firstName)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      {errors.firstName && <span className="text-red-500 text-xs mt-0.5 block">{errors.firstName}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={inputClassesWithIcon(!!errors.lastName)}
                          placeholder="Enter your last name"
                        />
                      </div>
                      {errors.lastName && <span className="text-red-500 text-xs mt-0.5 block">{errors.lastName}</span>}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputClassesWithIcon(!!errors.email)}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && <span className="text-red-500 text-xs mt-0.5 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={inputClassesWithRightIcon(!!errors.password)}
                      placeholder="Must be at least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <span className="text-red-500 text-xs mt-0.5 block">{errors.password}</span>}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={inputClassesWithRightIcon(!!errors.confirmPassword)}
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="text-red-500 text-xs mt-0.5 block">{errors.confirmPassword}</span>}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className={`w-full bg-gradient-to-r from-[#25A8A0] to-[#1e8a82] text-white py-3 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-2 group mt-5 ${isAuthLoading ? 'opacity-70 cursor-not-allowed shadow-none' : 'hover:shadow-xl'}`}
                >
                  {isAuthLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {isLogin && (
                  <div className="text-center">
                    <a href="#" className="text-sm text-[#25A8A0] hover:text-[#1e8a82] font-medium">
                      Forgot your password?
                    </a>
                  </div>
                )}
              </form>
            )}

            {/* Professional Multi-Step Form */}
            {!isLogin && isProfessional && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  {stepTitles.map((_, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center relative">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white transition-all duration-300 text-sm ${proStep === idx + 1 ? 'bg-[#25A8A0] scale-110 shadow-lg' : idx + 1 < proStep ? 'bg-[#25A8A0]/80' : 'bg-gray-300'}`}>
                        {idx + 1}
                      </div>
                      {idx < stepTitles.length - 1 && (
                        <div className={`absolute top-4 left-1/2 w-full h-0.5 ${idx + 1 < proStep ? 'bg-[#25A8A0]' : 'bg-gray-300'}`} style={{ zIndex: -1 }}></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Account */}
                {proStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={inputClasses(showStepErrors && !formData.firstName)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={inputClasses(showStepErrors && !formData.lastName)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={inputClasses(showStepErrors && !formData.email)}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={simpleInputClassesWithRightIcon(showStepErrors && !formData.password)}
                          placeholder="Must be at least 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={simpleInputClassesWithRightIcon(showStepErrors && (!formData.confirmPassword || formData.password !== formData.confirmPassword))}
                          placeholder="Re-enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#25A8A0] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Details */}
                {proStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="w-1/3 relative">
                          <button
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className={`${inputClasses(false)} flex items-center justify-between pr-2`}
                          >
                            {(() => {
                              const selected = countries.find(c => c.dial_code === formData.countryCode);
                              return (
                                <span className="truncate flex items-center gap-2">
                                  <span className="text-lg leading-none">{selected?.flag}</span>
                                  <span className="text-gray-900 font-medium">{selected?.dial_code}</span>
                                </span>
                              );
                            })()}
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isCountryDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsCountryDropdownOpen(false)}
                              />
                              <div className="absolute top-full left-0 w-[300px] mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto custom-scrollbar">
                                {countries.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                    onClick={() => {
                                      handleInputChange({ target: { name: 'countryCode', value: c.dial_code } } as any);
                                      setIsCountryDropdownOpen(false);
                                    }}
                                  >
                                    <span className="text-2xl">{c.flag}</span>
                                    <span className="text-gray-900 font-medium truncate flex-1">{c.name}</span>
                                    <span className="text-gray-500 text-sm font-semibold">{c.dial_code}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className={`${inputClasses(showStepErrors && (!formData.phone || formData.phone.length < 5))} flex-1`}
                          placeholder="Phone number"
                          maxLength={(() => {
                            const selected = countries.find(c => c.dial_code === formData.countryCode);
                            if (selected) {
                              try {
                                const m = new Metadata(metadata);
                                m.selectNumberingPlan(selected.code as CountryCode);
                                const numberingPlan = m.numberingPlan;
                                if (numberingPlan) {
                                  const lengths = numberingPlan.possibleLengths();
                                  if (lengths && lengths.length > 0) {
                                    return Math.max(...lengths);
                                  }
                                }
                              } catch (err) {
                                return 15;
                              }
                            }
                            return 15;
                          })()}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.dob ? new Date(formData.dob) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              const isoDate = date.toISOString().split('T')[0];
                              setFormData(prev => ({ ...prev, dob: isoDate }));
                            } else {
                              setFormData(prev => ({ ...prev, dob: '' }));
                            }
                          }}
                          dateFormat="dd/MM/yyyy"
                          className={inputClassesWithIcon(showStepErrors && (
                            !formData.dob || new Date(formData.dob) > new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                          ))}
                          placeholderText="DD/MM/YYYY"
                          showYearDropdown
                          showMonthDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          minDate={new Date(1900, 0, 1)}
                          maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                          isClearable
                          autoComplete="off"
                          popperPlacement="top-start"
                          onChangeRaw={(e) => {
                            if (!e || !e.target || typeof e.target.value !== 'string') return;
                            let input = e.target.value.replace(/\D/g, '');
                            if (input.length > 8) input = input.slice(0, 8);

                            let d = input.slice(0, 2);
                            let m = input.slice(2, 4);
                            let y = input.slice(4, 8);

                            // Validate months and days
                            if (d && parseInt(d) > 31) d = '31';
                            if (m && parseInt(m) > 12) m = '12';

                            // Prevent month 0 or day 0 if they enter two digits
                            if (d.length === 2 && parseInt(d) === 0) d = '01';
                            if (m.length === 2 && parseInt(m) === 0) m = '01';

                            let formatted = d;
                            if (input.length > 2) {
                              formatted += '/' + m;
                              if (input.length > 4) {
                                formatted += '/' + y;
                              }
                            }

                            e.target.value = formatted;

                            if (input.length === 8) {
                              const dayNum = parseInt(d);
                              const monthNum = parseInt(m) - 1;
                              const yearNum = parseInt(y);

                              if (yearNum >= 1900) {
                                const date = new Date(yearNum, monthNum, dayNum);
                                // Strict date validation (no date rollover)
                                if (!isNaN(date.getTime()) && date.getFullYear() === yearNum && date.getMonth() === monthNum && date.getDate() === dayNum) {
                                  // Final check for 18+ and min year 1900
                                  const eighteenYearsAgo = new Date();
                                  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

                                  if (date <= eighteenYearsAgo && yearNum >= 1900) {
                                    const isoDate = date.toISOString().split('T')[0];
                                    setFormData(prev => ({ ...prev, dob: isoDate }));
                                  }
                                }
                              } else {
                                // If year is < 1900, don't update state
                              }
                            }
                          }}
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      </div>
                      {showStepErrors && formData.dob && new Date(formData.dob) > new Date(new Date().setFullYear(new Date().getFullYear() - 18)) && (
                        <p className="text-red-500 text-xs mt-1">You must be 18 years or older.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: ID Verification */}
                {proStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Type</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsIdTypeDropdownOpen(!isIdTypeDropdownOpen)}
                          className={`${inputClassesWithIcon(showStepErrors && !formData.idType)} text-left flex items-center justify-between`}
                        >
                          <span className={formData.idType ? 'text-gray-900' : 'text-gray-400'}>
                            {formData.idType ?
                              ['Passport', 'National ID', 'Professional ID', "Driver's License"].find(
                                (_, i) => ['passport', 'national_id', 'professional_id', 'drivers_license'][i] === formData.idType
                              )
                              : 'Select ID Type'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isIdTypeDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />

                        {isIdTypeDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsIdTypeDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                              {[
                                { value: 'passport', label: 'Passport' },
                                { value: 'national_id', label: 'National ID' },
                                { value: 'professional_id', label: 'Professional ID' },
                                { value: 'drivers_license', label: "Driver's License" }
                              ].map((item) => (
                                <button
                                  key={item.value}
                                  type="button"
                                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between transition-colors text-sm font-medium text-gray-700"
                                  onClick={() => {
                                    handleInputChange({ target: { name: 'idType', value: item.value } } as any);
                                    setIsIdTypeDropdownOpen(false);
                                  }}
                                >
                                  {item.label}
                                  {formData.idType === item.value && (
                                    <div className="w-2 h-2 rounded-full bg-[#25A8A0]"></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload ID Image</label>
                      <div className={`border-2 border-dashed ${showStepErrors && !idImage ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-xl p-4 text-center hover:border-[#25A8A0] transition-all cursor-pointer relative overflow-hidden group`}>
                        {idImage ? (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-50">
                            <img src={URL.createObjectURL(idImage)} alt="ID Preview" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <span className="text-[#25A8A0] font-medium">Click to upload ID</span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={handleIdImageChange}
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          id="id-upload"
                        />
                      </div>
                      {idImage && (
                        <div className="mt-2 text-sm text-green-600 font-medium text-center">{idImage.name}</div>
                      )}
                      {!idImage && showStepErrors && (
                        <p className="text-red-500 text-xs mt-2 text-center">ID image is required</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 text-center">Please upload a clear image of your selected ID type.</p>
                    </div>
                  </div>
                )}

                {/* Step 4: Professional Info */}
                {proStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsSpecializationDropdownOpen(!isSpecializationDropdownOpen)}
                          className={`${inputClasses(showStepErrors && !formData.specialization)} text-left flex items-center justify-between`}
                        >
                          <span className={formData.specialization ? 'text-gray-900' : 'text-gray-400'}>
                            {formData.specialization ?
                              ['Anxiety', 'Depression', 'Trauma', 'Relationships', 'Addiction', 'Family Therapy', 'Child Psychology', 'PTSD', 'Stress Management', 'Grief Counseling'].find(
                                (_, i) => ['anxiety', 'depression', 'trauma', 'relationships', 'addiction', 'family_therapy', 'child_psychology', 'ptsd', 'stress_management', 'grief_counseling'][i] === formData.specialization
                              )
                              : 'Select your specialization'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSpecializationDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSpecializationDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsSpecializationDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden max-h-64 overflow-y-auto">
                              {[
                                { value: 'anxiety', label: 'Anxiety' },
                                { value: 'depression', label: 'Depression' },
                                { value: 'trauma', label: 'Trauma' },
                                { value: 'relationships', label: 'Relationships' },
                                { value: 'addiction', label: 'Addiction' },
                                { value: 'family_therapy', label: 'Family Therapy' },
                                { value: 'child_psychology', label: 'Child Psychology' },
                                { value: 'ptsd', label: 'PTSD' },
                                { value: 'stress_management', label: 'Stress Management' },
                                { value: 'grief_counseling', label: 'Grief Counseling' }
                              ].map((item) => (
                                <button
                                  key={item.value}
                                  type="button"
                                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between transition-colors text-sm font-medium text-gray-700"
                                  onClick={() => {
                                    handleInputChange({ target: { name: 'specialization', value: item.value } } as any);
                                    setIsSpecializationDropdownOpen(false);
                                  }}
                                >
                                  {item.label}
                                  {formData.specialization === item.value && (
                                    <div className="w-2 h-2 rounded-full bg-[#25A8A0]"></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Documents */}
                {proStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Recent Profile Photo</label>
                      <div className={`border-2 border-dashed ${showStepErrors && !profilePhoto ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-xl p-4 text-center hover:border-[#25A8A0] transition-all cursor-pointer relative overflow-hidden group`}>
                        {profilePhoto ? (
                          <div className="relative aspect-square w-24 mx-auto rounded-full overflow-hidden bg-gray-50 border-2 border-gray-100 shadow-sm">
                            <img src={URL.createObjectURL(profilePhoto)} alt="Profile Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-[10px] font-medium">Change</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-2">
                            <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-[#25A8A0] font-medium">Upload Photo</span>
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={handlePhotoChange}
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          id="photo-upload"
                        />
                      </div>
                      {profilePhoto && (
                        <div className="mt-2 text-sm text-green-600 font-medium text-center">{profilePhoto.name}</div>
                      )}
                      {!profilePhoto && showStepErrors && (
                        <p className="text-red-500 text-xs mt-1 text-center font-medium">Profile photo is required</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Certificates</label>
                      <div className={`border-2 border-dashed ${showStepErrors && !certificates ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-xl p-4 text-center hover:border-[#25A8A0] transition-all cursor-pointer relative overflow-hidden group`}>
                        {certificates ? (
                          certificates.type.startsWith('image/') ? (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                              <img src={URL.createObjectURL(certificates)} alt="Certificate Preview" className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-sm font-medium">Change Image</span>
                              </div>
                            </div>
                          ) : (
                            <div className="py-4 flex flex-col items-center">
                              <FileText className="w-10 h-10 text-[#25A8A0] mb-2" />
                              <span className="text-xs font-medium text-gray-700 truncate w-48">{certificates.name}</span>
                              <span className="text-[10px] text-gray-500 mt-1 uppercase">PDF Document</span>
                            </div>
                          )
                        ) : (
                          <div className="py-2">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-[#25A8A0] font-medium">Upload Certificate</span>
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={handleCertificateChange}
                          accept=".pdf,image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          id="cert-upload"
                        />
                      </div>
                      {certificates && (
                        <div className="mt-2 text-sm text-green-600 font-medium text-center">{certificates.name}</div>
                      )}
                      {!certificates && showStepErrors && (
                        <p className="text-red-500 text-xs mt-1 text-center font-medium">Certificate is required</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-3">
                  {proStep > 1 && (
                    <button
                      type="button"
                      onClick={handleProBack}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={proStep === totalProSteps ? handleSubmit : handleProNext}
                    disabled={isAuthLoading}
                    className={`flex-1 bg-gradient-to-r from-[#25A8A0] to-[#1e8a82] text-white py-2.5 rounded-xl transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 ${isAuthLoading ? 'opacity-70 cursor-not-allowed shadow-none' : 'hover:shadow-xl'}`}
                  >
                    {isAuthLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {proStep === totalProSteps
                          ? (isAuthLoading ? 'Uploading documents...' : 'Complete Registration')
                          : 'Continue'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    // Preserve isProfessional state when toggling
                    setProStep(1);
                  }}
                  className="ml-2 text-[#25A8A0] hover:text-[#1e8a82] font-semibold transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
