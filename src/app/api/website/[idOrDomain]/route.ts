import axios from "axios";
import {NextResponse} from "next/server";

export async function GET(request: Request, {params}: { params: Promise<{ idOrDomain: string }> }) {
    try {
        const {idOrDomain} = await params;
        const response = await axios.get(`https://admin.maelg.fr/api/websites/${idOrDomain}?recursive=true`)
        if (response.status===404) {
            return NextResponse.json({error: "Website not found"}, {status: 404});
        } else if (response.status!==200) {
            return NextResponse.json({error: "Error fetching website"}, {status: response.status});
        }
        return NextResponse.json(response.data.data, {status: 200});
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({error: error.response.data}, {status: error.response.status});
        }
        return NextResponse.json(error, {status: 500});
    }
}
