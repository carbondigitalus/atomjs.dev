import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function Home() {
    return (
        <div
            className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
        >
            <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-2xl'>
                <h1 className='font-mono list-inside list-decimal text-3xl text-center sm:text-left'>
                    Welcome to AtomJS!
                </h1>
                <p className='mb-2 tracking-[-.01em]'>Build with Atom – The fundamental building blocks of UI</p>
                <p className='tracking-[-.01em]'>
                    AtomJS is a class-based React alternative that combines the best aspects of React&apos;s component
                    model with Vue&apos;s simplicity, built from the ground up with TypeScript.
                </p>
                <p className='tracking-[-.01em]'>
                    We are in the process of building out our docs. Once that is life, you will see them here. In the
                    meantime, you can actively start using AtomJS.
                </p>
                <div className='flex gap-4 items-center flex-col sm:flex-row'>
                    <a
                        className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto'
                        href='https://github.com/carbondigitalus/atom-core/'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        View Github Repo
                    </a>
                </div>
            </main>
        </div>
    );
}
