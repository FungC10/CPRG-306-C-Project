/**
 * Type override to fix duplicate index signature error in @types/node
 * This file extends the NodeJS namespace to fix the TypeScript error
 */
declare namespace NodeJS {
    // Override Dict to fix duplicate index signature
    interface Dict<T> {
        [key: string]: T | undefined;
    }

    // Override ReadOnlyDict to fix duplicate index signature  
    interface ReadOnlyDict<T> {
        readonly [key: string]: T | undefined;
    }
}

