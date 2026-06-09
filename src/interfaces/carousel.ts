export interface CarouselImage {
  src: string;
  alt: string;
}

export interface ProjectCarouselProps {
  images: CarouselImage[];
  fullWidth?: boolean;
  height: number;
  ariaLabel?: string;
  dataId?: string;
}
