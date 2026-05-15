import { Carousel } from '@/components/carousel/Carousel/Carousel';
import { CarouselSlide } from '@/components/carousel/CarouselSlide/CarouselSlide';

export default function Page() {
	return (
		<>
			<Carousel>
				{[1, 2, 3, 4].map((item: number, index: number) => (
					<CarouselSlide title={`Slide ${item}`} key={index} />
				))}
			</Carousel>
		</>
	);
}
