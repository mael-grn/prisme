"use client"
import WebsiteService from "@/app/services/WebsiteService";
import {useParams} from "next/navigation";
import useSWR from "swr";
import PageContent from "@/app/components/page-elements/PageContent";

export default function Page() {
    const { websiteId } = useParams();
    const fetcher = async () => await WebsiteService.getWebsite(websiteId as string);
    const { data: website, error, isLoading, mutate } = useSWR('website-'+websiteId, fetcher);

    return <div className={"w-full flex flex-col gap-6"}>
        <h1 className={"w-full text-5xl mt-10 mb-10 text-center font-bold"}>{website?.title}</h1>
        <PageContent websiteId={websiteId as string} pagePath={"root"}/>
    </div>
}