import ImageInput from "@/app/components/forms-inputs/imageInput";
import {ImageUtil} from "@/app/utils/ImageUtil";
import {useState} from "react";
import LoadingIcon from "@/app/components/ui-elements/LoadingIcon";

export interface imageInputUploaderProps {
    setLinkAction: (link: string) => void;
    initialImage?: string;
}
export default function ImageInputUploader(props: imageInputUploaderProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const upload = async (file: File) => {
        setLoading(true);
        try {
            const link = await ImageUtil.uploadImage(file);
            props.setLinkAction(link);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    }
    return <div className={"h-fit w-full rounded-2xl overflow-hidden relative"}>

        <ImageInput setFileAction={upload} error={error ? error : undefined} initialValue={props.initialImage} />
        {
            loading && <div className={"absolute w-full h-full top-0 left-0 bg-background/80 flex justify-center items-center"}>
                <LoadingIcon/>
            </div>
        }
    </div>
}