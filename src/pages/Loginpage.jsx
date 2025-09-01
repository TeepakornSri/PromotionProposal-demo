import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { Backdrop, CircularProgress } from "@mui/material";
import PropTypes from 'prop-types';
import LoginForm from "../features/login/LoginForm";
import ChangePass from "../components/ChangePasswordForm";
import Logo from '../assets/Logo.png';

// Subtle animated gradient background inspired by Apple
const AnimatedBackground = () => (
    <motion.div
        className="fixed inset-0 -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
    >
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"></div>
        
        {/* Subtle animated shapes */}
        <motion.div
            className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 opacity-40"
            animate={{
                scale: [1, 1.05, 1],
                x: [0, 20, 0],
                y: [0, 20, 0],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
        <motion.div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-l from-gray-50 to-blue-50 opacity-30"
            animate={{
                scale: [1.05, 1, 1.05],
                x: [0, -20, 0],
                y: [0, -20, 0],
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    </motion.div>
);

// Animated section that fades in when in view
const FadeInSection = ({ children }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, threshold: 0.2 });
    
    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);
    
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

FadeInSection.propTypes = {
    children: PropTypes.node.isRequired
};

const LogoSection = ({ isLogoLoaded }) => (
    <FadeInSection>
        <motion.div 
            className="flex flex-col justify-center items-center mb-10 md:mb-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
                scale: isLogoLoaded ? 1 : 0.9,
                opacity: isLogoLoaded ? 1 : 0
            }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
            <motion.img 
                src={Logo} 
                alt="Company Logo" 
                className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] object-contain drop-shadow-2xl"
                animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.03, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.h2 
                className="mt-6 text-xl md:text-2xl font-light text-gray-600 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
            >
                Promotion Proposal System
            </motion.h2>
        </motion.div>
    </FadeInSection>
);

LogoSection.propTypes = {
    isLogoLoaded: PropTypes.bool.isRequired
};

const LoginFormSection = ({ onOpenChangePass }) => (
    <FadeInSection>
        <motion.div
            className="flex flex-col px-8 py-10 bg-white/90 rounded-3xl shadow-2xl border border-gray-100 w-[350px] md:w-[400px]"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <motion.h1 
                className="text-center font-medium text-3xl mb-2 text-gray-800 tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Welcome
            </motion.h1>
            <motion.p 
                className="text-center text-gray-500 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Sign in to access your account
            </motion.p>
            <LoginForm />
            <motion.button
                className="text-center text-gray-500 font-medium text-sm mt-6 hover:text-blue-600 transition-all duration-300 py-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenChangePass}
            >
                Forgot Password?
            </motion.button>
        </motion.div>
    </FadeInSection>
);

LoginFormSection.propTypes = {
    onOpenChangePass: PropTypes.func.isRequired
};

const LoadingBackdrop = ({ loading }) => (
    <Backdrop
        sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'rgba(255, 255, 255, 0.7)'
        }}
        open={loading}
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <CircularProgress color="primary" />
        </motion.div>
    </Backdrop>
);

LoadingBackdrop.propTypes = {
    loading: PropTypes.bool.isRequired
};

const ChangePasswordModal = ({ isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white/95 p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl border border-gray-100"
                    initial={{ scale: 0.85, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ChangePass onClose={onClose} />
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

ChangePasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default function LoginPage() {
    const [isChangepassOpen, setIsChangepassOpen] = useState(false);
    const [loading] = useState(false);
    const [isLogoLoaded, setIsLogoLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLogoLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full p-4 overflow-hidden">
            <AnimatedBackground />
            
            <motion.div 
                className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <LogoSection isLogoLoaded={isLogoLoaded} />
                <LoginFormSection onOpenChangePass={() => setIsChangepassOpen(true)} />
            </motion.div>

            <motion.div 
                className="absolute bottom-4 text-center text-gray-400 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                © {new Date().getFullYear()} FNU Group. All rights reserved.
            </motion.div>

            <LoadingBackdrop loading={loading} />
            <ChangePasswordModal 
                isOpen={isChangepassOpen} 
                onClose={() => setIsChangepassOpen(false)} 
            />
        </div>
    );
}
