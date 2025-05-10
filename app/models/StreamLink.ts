import Quality from "@/app/enum/QualityEnum";

export default interface StreamLink {
    quality: Quality
    magnetLink: string
}