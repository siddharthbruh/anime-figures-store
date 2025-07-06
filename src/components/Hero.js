import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function Hero() {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="hero" ref={ref}>
            {/* Animated Background Pattern */}
            <div className="hero-background">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="floating"
                        style={{
                            position: 'absolute',
                            width: Math.random() * 4 + 2 + 'px',
                            height: Math.random() * 4 + 2 + 'px',
                            background: `linear-gradient(45deg, 
                                hsl(${240 + Math.random() * 60}, 70%, 60%), 
                                hsl(${300 + Math.random() * 60}, 70%, 70%))`,
                            borderRadius: '50%',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                            filter: 'blur(1px)',
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="container">
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    <motion.h1 
                        className="hero-title"
                        variants={itemVariants}
                    >
                        Premium Anime Figures
                    </motion.h1>
                    
                    <motion.p 
                        className="hero-subtitle"
                        variants={itemVariants}
                    >
                        Discover the most detailed and authentic collectibles from your favorite anime series. 
                        Each figure is crafted with precision and passion for true collectors.
                    </motion.p>
                    
                    <motion.div 
                        className="hero-cta"
                        variants={itemVariants}
                    >
                        <motion.button
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Explore Collection
                        </motion.button>
                        
                        <motion.button
                            className="btn btn-secondary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default Hero;
