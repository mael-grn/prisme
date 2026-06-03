"use client"
import WebsiteService from "@/app/services/WebsiteService";
import {useParams} from "next/navigation";
import useSWR from "swr";
import PageContent from "@/app/components/page-elements/PageContent";

export default function Page() {
    const { websiteId, path } = useParams();
    const fetcher = async () => await WebsiteService.getWebsite(websiteId as string);
    const { data: website, error, isLoading, mutate } = useSWR('website', fetcher);

    return <div className={"w-full flex flex-col gap-6"}>
        <PageContent websiteId={websiteId as string} pagePath={"/" + path}/>
    </div>
}