import axios from "axios";
import {NextResponse} from "next/server";

export async function GET(request: Request, {params}: { params: Promise<{ idOrDomain: string }> }) {
    try {
        const {idOrDomain} = await params;
        const response = await axios.get(`https://admin.maelg.fr/api/websites/${idOrDomain}?recursive=true`)
        return NextResponse.json(response.data.data, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, {status: 500});
    }
}
