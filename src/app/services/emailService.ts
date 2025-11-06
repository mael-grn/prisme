import {emailData} from "@/app/models/emailData";


export interface EmailResponse {
    success: boolean;
    message: string;
}

export default class EmailService{
    static async sendEmail(data : emailData): Promise<EmailResponse> {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return await response.json();
    }
}
