import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Redirect to the main app
    window.location.replace('/');
  }, []);

  return null;
};

export default Index;
