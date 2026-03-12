"use client";

import {useEffect, useState} from "react";
import {User} from "@/app/models/User";
import {DisplayWebsite, InsertableDisplayWebsite} from "@/app/models/DisplayWebsite";
import {useRouter} from "next/navigation";
import {FieldsUtil} from "@/app/utils/fieldsUtil";
import {ImageUtil} from "@/app/utils/ImageUtil";
import UserService from "@/app/services/UserService";
import WebsiteService from "@/app/services/WebsiteService";
import MainPageWrapper from "@/app/components/page-elements/MainPageWrapper";
import StandardContainerForDataManagement from "@/app/components/sections/StandardContainerForDataManagement";
import Button, {ActionTypeEnum} from "@/app/components/ui-elements/Button";
import AdvancedPopup from "@/app/components/overlays/AdvancedPopup";
import Form from "@/app/components/forms-inputs/form";
import Input from "@/app/components/forms-inputs/Input";
import ImageInput from "@/app/components/forms-inputs/imageInput";
import Link from "next/link";
import Illustration from "@/app/components/ui-elements/Illustration";
import StringUtil from "@/app/utils/StringUtil";

export default function Home() {

    const [user, setUser] = useState<User | null>(null);
    const [websites, setWebsites] = useState<DisplayWebsite[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [websiteLoading, setWebsiteLoading] = useState<boolean>(true);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<string>('');
    const [popupTitle, setPopupTitle] = useState<string>('');

    const [showPopupCreateWebsite, setShowPopupCreateWebsite] = useState<boolean>(false);
    const [websiteTitle, setWebsiteTitle] = useState<string>('');
    const [newWebsiteHeroTitle, setNewWebsiteHeroTitle] = useState<string>('');
    const [newSelectedFileHeroImage, setNewSelectedFileHeroImage] = useState<File | null>(null);

    const initData = () => {
        UserService.getMyUser().then((user) => {
            setUser(user);
        }).catch((e) => {
            setPopupTitle("Something went wrong while fetching your user data");
            setPopupText(e instanceof Error ? e.message : String(e));
            setShowPopup(true);
        }).finally(() => setLoading(false));

        WebsiteService.getMyWebsites().then((websites) => {
            setWebsites(websites);
        }).catch((e) => {
            setPopupTitle("Something went wrong while fetching your websites");
            setPopupText(e instanceof Error ? e.message : String(e));
            setShowPopup(true);
        }).finally(() => setWebsiteLoading(false));
    }
    useEffect(() => {
        initData();
    }, [])

    const router = useRouter();


    const createWebsite = async () => {

        setShowPopupCreateWebsite(false);

        const displayWebsite: InsertableDisplayWebsite = {
            owner_id: user!.id,
            title: websiteTitle,
            website_domain: undefined,
            hero_title: newWebsiteHeroTitle,
        };

        const validation = FieldsUtil.checkDisplayWebsite(displayWebsite);
        if (!validation.valid) {
            setPopupTitle("Wrong input data");
            setPopupText(validation.errors.join(", "));
            setShowPopup(true);
            return;
        }
        setLoading(true);
        if (newSelectedFileHeroImage) {
            displayWebsite.hero_image_url = await ImageUtil.uploadImage(newSelectedFileHeroImage) || undefined;
        }

        try {
            await WebsiteService.createNewWebsite(displayWebsite)
        } catch (e) {
            setPopupTitle("Something went wrong while creating your website");
            setPopupText(e instanceof Error ? e.message : String(e));
            setShowPopup(true);
        } finally {
            setLoading(false);
        }

        setWebsiteLoading(true);
        setWebsites(await WebsiteService.getMyWebsites());
        setWebsiteLoading(false);
    }

    return (
        <>
            <MainPageWrapper loading={loading || websiteLoading}>

                {
                    user ? <>
                            {
                                websites.length > 0 ?
                                    <>
                                        <div className={"w-full h-full flex flex-col gap-4 items-center justify-center"}>
                                            <Illustration name={"blueprint"}/>
                                            <h2>Hello, {user.first_name}</h2>
                                            <p>Here are your websites. Feel free to create as much as you want!</p>
                                            <Button iconName={"add"} text={"Create a new website"}
                                                    onClick={() => setShowPopupCreateWebsite(true)}/>
                                        </div>
                                    </> :
                                    <div className={"w-full h-full flex flex-col gap-4 items-center justify-center mt-20"}>
                                        <Illustration name={"trex"}/>
                                        <h2>You don&apos;t have any website yet</h2>
                                        <p>Click the button below to create your first one!</p>
                                        <Button iconName={"add"} text={"Create a new website"}
                                                onClick={() => setShowPopupCreateWebsite(true)}/>
                                    </div>
                            }

                            <div className={"flex gap-4 flex-wrap md:justify-start justify-center"}>
                                {
                                    websites.map((website) => {
                                        return <StandardContainerForDataManagement
                                            key={website.id}
                                            title={website.title}
                                            actions={[
                                                {
                                                    iconName: "redirect",
                                                    text: "Visit",
                                                    actionType: ActionTypeEnum.neutral,
                                                    onClick: () => {
                                                        if (website.website_domain) {
                                                            router.push("https://" + website.website_domain);
                                                        } else {
                                                            router.push("https://prisme.maelg.fr/" + website.title.replace(" ", "%20"));
                                                        }
                                                    },
                                                },
                                                {
                                                    iconName: "arrow-right",
                                                    text: "Edit",
                                                    onClick: () => router.push("/secure/" + website.id),
                                                }
                                            ]}
                                        >
                                            {
                                                website.hero_image_url &&
                                                <img className={"w-52 h-32 object-cover rounded-lg"}
                                                     src={website.hero_image_url} alt={"hero image"}/>

                                            }
                                        </StandardContainerForDataManagement>
                                    })
                                }
                            </div>
                        </> :
                        <div className="flex flex-col gap-4 items-center justify-center h-screen w-full">
                            <h1 className={"text-center"}>Something went wrong while fetching your data</h1>
                            <p className={"text-center"}>Please try to refresh the page or log in again.</p>
                            <div className={"flex gap-4"}>
                                <Button iconName={"arrow-back"} text={"Back"} actionType={ActionTypeEnum.neutral}
                                        onClick={() => router.back()}/>
                                <Button iconName={"refresh"} text={"Try again"} onClick={() => initData()}/>
                            </div>
                        </div>
                }


            </MainPageWrapper>

            <AdvancedPopup show={showPopup} closePopup={() => setShowPopup(false)} title={popupTitle}
                           message={popupText}/>

            <AdvancedPopup
                show={showPopupCreateWebsite}
                closePopup={() => setShowPopupCreateWebsite(false)}
                title={"Create a new website"}
                actions={[
                    {
                        text: "Create",
                        isForm: true,
                        iconName: "add",
                        isDisabled: StringUtil.basicStringValidator(websiteTitle) !== null || StringUtil.basicStringValidator(newWebsiteHeroTitle) !== null,
                        onClick: () => createWebsite()
                    },
                ]}
            >

                <Form onSubmitAction={createWebsite}>
                    <Input placeholder={"Website name"} value={websiteTitle} setValueAction={setWebsiteTitle} validatorAction={StringUtil.basicStringValidator}/>

                    <h3>Home page&apos;s content</h3>
                    <Input placeholder={"title"} value={newWebsiteHeroTitle}
                           setValueAction={setNewWebsiteHeroTitle} validatorAction={StringUtil.basicStringValidator}/>
                    <ImageInput setFileAction={setNewSelectedFileHeroImage}/>
                </Form>

            </AdvancedPopup>
        </>

    )
}