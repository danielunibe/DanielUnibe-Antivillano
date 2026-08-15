import 'react';

declare module 'react' {
    interface CSSProperties {
        // Permite variables CSS personalizadas en el estilo inline
        [key: `--${string}`]: string | number;
    }

    // Fix: Augmenting ImgHTMLAttributes without re-extending to avoid lookup issues for HTMLAttributes
    interface ImgHTMLAttributes<T> {
        // Soporte para fetchPriority
        fetchPriority?: 'high' | 'low' | 'auto';
    }
}