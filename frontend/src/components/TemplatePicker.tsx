// interface TemplatePickerProps {}

import { useState } from "react";

type TemplateData = {
  id: string;
  selectedImgUrl: string;
  iconImgUrl: string;
  title: string;
  description: string;
};

// TODO: get templates from backend or somewhere cleaner
const templates = [
  {
    id: "array",
    selectedImgUrl: "",
    iconImgUrl: "",
    title: "Array",
    description:
      "A linear sequence of elements, indexable. For sorting, sliding window, etc.",
  },
  {
    id: "linked_list",
    selectedImgUrl: "",
    iconImgUrl: "",

    title: "Linked List",
    description: "A sequence of elements traversable by pointers",
  },
  {
    id: "graph",
    selectedImgUrl: "",
    iconImgUrl: "",
    title: "Graph",
    description: "A graph traversable by its connected edges.",
  },
  {
    id: "binary_tree",
    selectedImgUrl: "",
    iconImgUrl: "",
    title: "Binary Tree",
    description:
      "A tree-like graph connected from the root to its children (leaves)",
  },
];

type TemplateKeys = {
  [i: string]: number;
};

const keys = (() => {
  let k: TemplateKeys = {};

  for (let i = 0; i < templates.length; i++) {
    k = {
      [templates[i].id]: i,
      ...k,
    };
  }

  return k;
})();

export const TemplatePicker = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    templates[0].id,
  );

  const handleSetSelected = (t: string) => {
    setSelectedTemplate(t);
  };
  return (
    <div>
      <SelectedTemplate template={templates[keys[selectedTemplate]]} />
      <div>
        {templates.map((t) => (
          <AvailableTemplate
            key={t.id}
            template={t}
            setSelected={handleSetSelected}
          />
        ))}
      </div>
    </div>
  );
};

interface SelectedTemplateProps {
  template: TemplateData;
}

const SelectedTemplate = ({ template }: SelectedTemplateProps) => {
  const { title, description, selectedImgUrl } = template;
  return (
    <div>
      <img src={selectedImgUrl} alt="" />
      {title}
      {description}
      {/* TODO: change to Link */}
      <button type="button">Create</button>
    </div>
  );
};

interface AvailableTemplateProps {
  template: TemplateData;
  setSelected: (id: string) => void;
}

const AvailableTemplate = ({
  template,
  setSelected,
}: AvailableTemplateProps) => {
  const { id, iconImgUrl, title } = template;
  return (
    <button type="button" onClick={() => setSelected(id)}>
      <img src={iconImgUrl} alt="template" />
      <span>{title}</span>
    </button>
  );
};
