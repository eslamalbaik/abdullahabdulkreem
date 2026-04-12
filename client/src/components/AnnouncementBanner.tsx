import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Megaphone, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SiteConfig {
    key: string;
    value: string;
}

export const AnnouncementBanner: React.FC = () => {
    const { data: configs = [] } = useQuery<SiteConfig[]>({
        queryKey: ["/api/site-configs"],
    });

    const [isVisible, setIsVisible] = React.useState(true);

    const configMap = configs.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
    }, {} as Record<string, string>);

    if (configMap.banner_enabled !== 'true' || !isVisible) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-primary text-primary-foreground relative z-[60] overflow-hidden"
            >
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-foreground/10 to-primary pointer-events-none" />
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-6 py-3 relative">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white/10 rounded-md">
                                <Megaphone className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{configMap.banner_title}</span>
                        </div>
                        
                        <p className="text-sm font-medium opacity-90">
                            {configMap.banner_message}
                        </p>

                        {configMap.banner_cta && configMap.banner_link && (
                            <Link 
                                to={configMap.banner_link}
                                className="inline-flex items-center gap-2 bg-white text-primary px-4 py-1 rounded-full text-xs font-bold hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                            >
                                {configMap.banner_cta}
                                <ArrowLeft className="w-3 h-3" />
                            </Link>
                        )}
                    </div>

                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
