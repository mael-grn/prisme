'use client';

import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";


export default function MainPageWrapper({children, loading = false}: {children: React.ReactNode, loading?: boolean}) {

    return (
        <main className={`min-h-screen min-w-full`}>

            <div className={"relative flex flex-col gap-6 p-6 pt-16 z-20"}>
                {loading ? <div className={"w-full h-screen flex justify-center items-center flex-col gap-4"}>
                    <LoadingIcon/>
                    <p>Loading your content...</p>
                </div> : children}
            </div>

        </main>
    );
}