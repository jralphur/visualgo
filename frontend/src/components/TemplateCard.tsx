import { useState } from "react";

type Template = {
  title: string;
  subtitle: string;
  imgUrl: string;
};

interface TemplateCardProps {
  templates: Template[];
}

export default function TemplateCard({ templates }: TemplateCardProps) {
  const [index, setIndex] = useState(0);
  const { title, subtitle, imgUrl } = templates.at(index) ?? {
    title: "idk",
    subtitle: "idk",
    imgUrl: "idk",
  };
  return (
    <div>
      <div>
        <img src={imgUrl} aria-label="programmer art" />
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <div>
        {templates.map(({ title }, index) => (
          <button
            type="button"
            key={title + subtitle}
            onClick={() => setIndex(index)}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}
