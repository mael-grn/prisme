// typescript
import {InsertableWebsite} from "../models/Website";
import {InsertablePage} from "@/app/models/Page";
import {InsertableElement} from "@/app/models/Element";
import {InsertableTag} from "../models/Tag";
import {InvalidFieldsError} from "@/app/errors/InvalidFieldsError";

export type ValidationResult = { valid: boolean; errors: string[] };

/**
 * Check if newly created entities are in correct format
 */
export class FieldsUtil {
    private static isNonEmptyString(v: unknown) {
        return typeof v === "string" && v.trim().length > 0;
    }

    private static isInteger(v: unknown) {
        return typeof v === "number" && Number.isInteger(v);
    }

    private static isHexColor(v: unknown) {
        if (typeof v !== "string") return false;
        // accepts #RRGGBB or #RGB
        const re = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
        return re.test(v);
    }

    private static isPositiveInteger(v: unknown) {
        return this.isInteger(v) && (v as number) > 0;
    }

    private static isValidEmail(email: string) {
        // simple regex but useful for basic validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        return re.test(email);
    }

    private static isValidDomain(domain: string) {
        // accepts "example.com" or "sub.example.co"
        const re = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
        return re.test(domain);
    }

    private static isValidUrl(url: string) {
        try {
            // accepts http(s) and valid data
            const u = new URL(url);
            return u.protocol === "http:" || u.protocol === "https:";
        } catch {
            return false;
        }
    }




    public static checkWebsite(w: InsertableWebsite): ValidationResult {
        const errors: string[] = [];
        if (!w) return {valid: false, errors: ["display website is required"]};

        if (w.title === "secure" || w.title === "api" || w.title === "dashboard") {
            errors.push("You cannot name a website with secure or api or dashboard.");
        }

        if (!this.isPositiveInteger(w.owner_id)) {
            errors.push("ownerId is required and must be a positive integer (referencing users)");
        }

        if (!this.isNonEmptyString(w.title)) {
            errors.push("the website must have a name");
        }

        if (this.isNonEmptyString(w.website_domain)) {
            const domain = w.website_domain!;
            if (!this.isValidDomain(domain) && !this.isValidDomain(domain)) {
                errors.push("domain must be a valid domain name (e.g., example.com) or a URL");
            }
            if (domain.endsWith("/")) {
                errors.push("domain must not end with '/'");
            }
        }

        if (w.image_src !== undefined && w.image_src !== null && w.image_src !== "") {
            if (typeof w.image_src !== "string") {
                errors.push("heroImageUrl must be a string if provided");
            } else if (!this.isValidUrl(w.image_src)) {
                errors.push("heroImageUrl must be a valid URL (http(s)://...)");
            }
        }

        return {valid: errors.length === 0, errors};
    }

    public static checkPage(p: InsertablePage): ValidationResult {
        const errors: string[] = [];
        if (!p) return {valid: false, errors: ["page is required"]};

        if (!this.isNonEmptyString(p.path)) {
            errors.push("path is required and must be a non-empty string");
        } else {
            // logic: path must start with '/'
            if (!p.path.startsWith("/")) {
                errors.push("path should start with '/'");
            }
            if (/\s/.test(p.path)) {
                errors.push("path must not contain spaces");
            }
            if (p.path.length > 500) {
                errors.push("path is too long");
            }
        }

        if (!this.isPositiveInteger(p.website_id)) {
            errors.push("websiteId is required and must be a positive integer (referencing display_websites)");
        }

        // title (mandatory)
        if (!this.isNonEmptyString(p.title)) {
            errors.push("title is required and must be a non-empty string");
        } else if (p.title.length > 300) {
            errors.push("title is too long (recommended limit 300 characters)");
        }

        // icon_svg (optional) — if provided must be a string
        if (p.icon_svg !== undefined && p.icon_svg !== null && p.icon_svg !== "") {
            if (typeof p.icon_svg !== "string") {
                errors.push("icon_svg must be a string if provided");
            } else {
                const svgRe = /^\s*(<\?xml[\s\S]*?\?>\s*)?(<svg\b[^>]*>[\s\S]*?<\/svg>|<svg\b[^>]*\/>)\s*$/i;
                if (!svgRe.test(p.icon_svg)) {
                    errors.push("icon_svg must be a valid SVG");
                } else if (p.icon_svg.length > 2000) {
                    errors.push("icon_svg is too long");
                }
            }
        }

        return {valid: errors.length === 0, errors};
    }

    public static checkElement(e: InsertableElement): ValidationResult {
        const errors: string[] = [];
        if (!e) return {valid: false, errors: ["element is required"]};

        if (!this.isPositiveInteger(e.page_id)) {
            errors.push("sectionId is required and must be a positive integer (referencing sections)");
        }

        if (!this.isNonEmptyString(e.element_type)) {
            errors.push("type is required and must be a non-empty string (element_type in DB)");
        } else if (e.element_type.length > 100) {
            errors.push("type is too long");
        }

        if (e.element_type === "image") return {valid: errors.length === 0, errors};

        if (!this.isNonEmptyString(e.content)) {
            errors.push("content is required and must be a non-empty string");
        }

        switch (e.element_type) {
            case "lien":
                if (!this.isValidUrl(e.content)) {
                    errors.push("url is required for a link");
                }
                break;
            case "titre":
                if (e.content.length > 50) {
                    errors.push("the title must not exceed 50 characters");
                }
        }

        return {valid: errors.length === 0, errors};
    }

    public static checkCategory(c: InsertableTag): ValidationResult {
        const errors: string[] = [];
        if (!c) return {valid: false, errors: ["category is required"]};

        if (!this.isNonEmptyString(c.name)) {
            errors.push("name is required and must be a non-empty string");
        } else if (c.name.length > 200) {
            errors.push("name is too long");
        }

        return {valid: errors.length === 0, errors};
    }

    public static checkFieldsOrThrow<T>(validationFunction: (obj: T) => ValidationResult, obj: T) {
        // call the validation function with `FieldsUtil` as `this` to preserve access
        const validation = validationFunction.call(FieldsUtil, obj);
        if (!validation.valid) {
            throw new InvalidFieldsError();
        }
    }
}