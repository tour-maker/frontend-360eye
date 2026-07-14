// src/components/AnimatedLayout.jsx
import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

export const AnimatedLayout = () => {
  const location = useLocation();
  
  // Custom transitions based on route
  const routeTransitions = {
    '/': { x: 0 },
    '/showcase360': { y: 0 },
    // Add more specific transitions as needed
  };

  return (
    <motion.div
      key={location.pathname}
      initial={{ 
        opacity: 0,
        ...routeTransitions[location.pathname]?.initial || { x: 100 }
      }}
      animate={{ 
        opacity: 1,
        ...routeTransitions[location.pathname]?.animate || { x: 0 }
      }}
      exit={{ 
        opacity: 0,
        ...routeTransitions[location.pathname]?.exit || { x: -100 }
      }}
      transition={{ duration: 0.5 }}
    >
      <Outlet />
    </motion.div>
  );
};