import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { ulid } from "ulid";

interface CarouselControlsProps {
  pageLength: number;
  previousPage: () => void;
  nextPage: () => void;
  currentIndex: number;
  setIndex: (index: number) => void;
}

export const CarouselControls = ({
  pageLength,
  previousPage,
  nextPage,
  currentIndex,
  setIndex,
}: CarouselControlsProps) => {
  const leftPage = (
    <FlipPage handleFlip={previousPage}>
      <ChevronLeft />
    </FlipPage>
  );

  const rightPage = (
    <FlipPage handleFlip={nextPage}>
      <ChevronRight />
    </FlipPage>
  );

  const selector = (
    <PageSelector
      pageLength={pageLength}
      currentIndex={currentIndex}
      setIndex={setIndex}
    />
  );

  return {
    leftPage,
    rightPage,
    selector,
  };
};

interface FlipPageProps {
  handleFlip: () => void;
  children: React.ReactNode;
}

const FlipPage = ({ handleFlip, children }: FlipPageProps) => {
  return (
    <button type="button" onClick={handleFlip}>
      {children}
    </button>
  );
};

interface PageSelectorProps {
  pageLength: number;
  currentIndex: number;
  setIndex: (index: number) => void;
}

const PageSelector = ({
  pageLength,
  currentIndex,
  setIndex,
}: PageSelectorProps) => {
  const id = ulid();
  return Array(pageLength).map((_, i) => (
    <button type="submit" key={`${id}-${ulid()}`} onClick={() => setIndex(i)}>
      <Dot color={currentIndex === i ? "#0000" : "#ABCE"} />
    </button>
  ));
};
