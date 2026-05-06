interface TemplateCardProps {
    title: string,
    altText?: string
    imgUrl: string,
    description: string;
}

export const TemplateCard = ({title, altText, imgUrl, description}: TemplateCardProps) => {
    return (
        <div>
            <img src={imgUrl}  alt={altText} />
            <header>{title}</header>
            <p>{description}</p>
        </div>
    )
}