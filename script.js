const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");

registerbtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
  container.classList.remove("active");
});
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Show the button when scrolled down 100px
window.onscroll = function () {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
};

// Scroll to the top when the button is clicked
scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Smooth scrolling effect
  });
});

// Mock user login state
let isLoggedIn = false; // Change this to true if the user is logged in

// Function to handle the My Profile button click
function handleProfileClick() {
  const userData = {
    // Collect user data here
    name: "John Doe",
    email: "john.doe@example.com"
  };

  fetch('http://localhost:3000/storeUserData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // Handle success
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle error
  });
}

document.getElementById("profileButton").addEventListener("click", function() {
    // Check if user is logged in by looking for user data in localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
        // User is not logged in - show login prompt
        alert('Please login to access your profile');
        // Optionally focus on login section
        container.classList.remove("active");
        document.getElementById("loginEmail").focus();
    } else {
        // User is logged in - redirect to profile page
        window.location.href = 'profile.html';
    }
});

document.getElementById("signupForm").addEventListener("submit", handleSignup);
document.getElementById("loginForm").addEventListener("submit", handleLogin);

function showError(message) {
  const errorContainer = document.getElementById('error-container');
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  
  // Hide error after 3 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 3000);
}

function validateSignupForm(formData) {
  const errors = [];
  
  // Full Name validation
  if (formData.fullName.length < 3) {
    errors.push('Name must be at least 3 characters long');
  }
  if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
    errors.push('Name should only contain letters and spaces');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (formData.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/(?=.*[a-z])/.test(formData.password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(formData.password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(formData.password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
    errors.push('Password must contain at least one special character');
  }

  // Mobile Number validation
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(formData.mobileNumber)) {
    errors.push('Please enter a valid 10-digit Indian mobile number');
  }

  // Age validation
  const age = parseInt(formData.age);
  if (isNaN(age) || age < 18 || age > 120) {
    errors.push('Age must be between 18 and 120 years');
  }

  // Gender validation
  if (!['male', 'female', 'other'].includes(formData.gender)) {
    errors.push('Please select a valid gender');
  }

  return errors;
}

function handleSignup(event) {
  event.preventDefault();

  const formData = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    mobileNumber: document.getElementById("mobileNumber").value.trim(),
    gender: document.getElementById("gender").value,
    age: document.getElementById("age").value
  };

  const validationErrors = validateSignupForm(formData);
  
  if (validationErrors.length > 0) {
    showError(validationErrors[0]);
    return;
  }

  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'User registered successfully') {
      alert('Registration successful! Please login.');
      container.classList.remove("active");
    } else {
      showError(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showError('Registration failed. Please try again.');
  });
}

// Add these functions to handle password reset flow
function showForgotPassword() {
  document.querySelector('.sign-in').style.display = 'none';
  document.querySelector('.forgot-password').style.display = 'block';
}

function showResetPassword() {
  document.querySelector('.forgot-password').style.display = 'none';
  document.querySelector('.reset-password').style.display = 'block';
}

function showLogin() {
  document.querySelector('.forgot-password').style.display = 'none';
  document.querySelector('.reset-password').style.display = 'none';
  document.querySelector('.sign-in').style.display = 'block';
}

function validateSignin(email, password) {
  const errors = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  }

  return errors;
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  fetch('http://localhost:3000/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.type === 'password_error') {
      document.getElementById("loginPassword").value = '';
      showError(data.message);
    } else if (data.type === 'email_error') {
      showError(data.message);
    } else if (data.message === 'Signin successful') {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'profile.html';
    } else {
      showError(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showError('Login failed. Please try again.');
  });
}

// Add new function for password-specific error styling
function showPasswordError(message) {
  const alertContainer = document.getElementById('alert-container');
  alertContainer.textContent = message;
  alertContainer.style.display = 'block';
  alertContainer.style.backgroundColor = '#fff3cd'; // Light yellow background
  alertContainer.style.color = '#856404'; // Dark yellow text
  alertContainer.style.border = '1px solid #ffeeba'; // Light yellow border
  
  setTimeout(() => {
    alertContainer.style.display = 'none';
    // Reset styles
    alertContainer.style.backgroundColor = '#f8d7da';
    alertContainer.style.color = '#721c24';
    alertContainer.style.border = '1px solid #f5c6cb';
  }, 3000);
}

// Add handlers for password reset
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value;
  const mobileNumber = document.getElementById('resetMobile').value;

  try {
    const response = await fetch('http://localhost:3000/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, mobileNumber })
    });
    const data = await response.json();
    
    if (data.message === 'OTP sent successfully') {
      showResetPassword();
    } else {
      showError(data.message);
    }
  } catch (error) {
    showError('Error sending OTP. Please try again.');
  }
});

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value;
  const otp = document.getElementById('otpInput').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await response.json();
    
    if (data.message === 'Password reset successful') {
      showError('Password reset successful. Please login with your new password.');
      showLogin();
    } else {
      showError(data.message);
    }
  } catch (error) {
    showError('Error resetting password. Please try again.');
  }
});

// Add event listeners for back buttons
document.querySelectorAll('.back-to-login').forEach(button => {
  button.addEventListener('click', showLogin);
});

// Update the forgot password link
document.querySelector('a[href="#"]').addEventListener('click', (e) => {
  e.preventDefault();
  showForgotPassword();
});

// Add real-time validation for inputs
document.getElementById('fullName').addEventListener('input', function(e) {
  const input = e.target;
  const inputGroup = input.parentElement;
  const name = input.value.trim();
  
  if (name.length < 3) {
    setError(inputGroup, 'Name must be at least 3 characters long');
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    setError(inputGroup, 'Name should only contain letters and spaces');
  } else {
    setSuccess(inputGroup);
  }
});

// Similar event listeners for other inputs

function setError(inputGroup, message) {
  inputGroup.classList.remove('success');
  inputGroup.classList.add('error');
  inputGroup.querySelector('.validation-message').textContent = message;
}

function setSuccess(inputGroup) {
  inputGroup.classList.remove('error');
  inputGroup.classList.add('success');
  inputGroup.querySelector('.validation-message').textContent = '';
}

function checkHeart() {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    
    if (!userData) {
        alert('Please login to access heart check service');
        // Focus on login section
        container.classList.remove("active");
        document.getElementById("loginEmail").focus();
    } else {
        // Redirect to contact page
        window.location.href = 'contact-us.html';
    }
}

// Add smooth scroll function for Services button
function scrollToServices() {
    const servicesSection = document.getElementById('service');
    const headerOffset = 80; // Adjust this value based on your header height
    
    if (servicesSection) {
        const elementPosition = servicesSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Optional: Add highlight effect
        servicesSection.classList.add('highlight');
        setTimeout(() => {
            servicesSection.classList.remove('highlight');
        }, 1000);
    }
}
