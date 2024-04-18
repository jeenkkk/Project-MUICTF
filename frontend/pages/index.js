import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page on the client side
    router.replace('Login');
  }, []);

  // This component can be empty or include content you want to display on the root URL.

  return (
    <div>
    </div>
  );
};

export default Home;

// Path: frontend/pages/Login.js
// Compare this snippet from server.js: