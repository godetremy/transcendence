'use client';
import styles from './component.module.scss';
import { ReactElement, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CarouselSlide } from '@/components/carousel/CarouselSlide/CarouselSlide';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselProps {
	children: ReactElement<typeof CarouselSlide>[];
}

export function Carousel(props: CarouselProps) {
	const SLIDE_TIMEOUT_DURATION = 8;

	const carouselRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
	const carouselContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
	const slidesContainerRef: RefObject<HTMLDivElement | null> = useRef(null);

	const nextSlideTimeoutRef = useRef(0);
	const [nextSlideTimeoutProgress, setNextSlideTimeoutProgress] = useState(0);
	const [slidesProgression, setSlidesProgression] = useState<number>(0);
	const slidesProgressionRef = useRef(slidesProgression);

	useEffect(() => {
		slidesProgressionRef.current = slidesProgression;
	});

	function scrollToWithAnimation(position: number) {
		const container = slidesContainerRef.current;
		if (!container) return;

		const slideWidth = container.children[0].getBoundingClientRect().width;
		let translateX = parseTranslateX(container);
		let distance = position - translateX;

		if (distance >= slideWidth * (container.children.length - 1)) {
			container.style.transform = `translateX(${slideWidth}px)`;
			translateSlideInfinite(container, slideWidth);

			translateX = slideWidth;
			distance = -slideWidth;
		}

		const animationDuration = 600;
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / animationDuration, 1);
			const easeOutCubic = 1 - Math.pow(1 - progress, 3);

			const currentX = translateX + distance * easeOutCubic;

			const fakedCurrentX = currentX > 0 ? currentX - slideWidth * container.children.length : currentX;
			setSlidesProgression((fakedCurrentX / slideWidth) * -1);

			container.style.transform = `translateX(${currentX}px)`;
			translateSlideInfinite(container, slideWidth);

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};

		animate();
	}

	function parseTranslateX(slide: HTMLDivElement): number {
		const currentTransform = slide.style.transform;
		return currentTransform ? parseInt(currentTransform.match(/translateX\(([^)]+)px\)/)?.[1] || '0') : 0;
	}

	function translateSlideInfinite(container: HTMLDivElement, slideWidth: number) {
		for (let i = 0; i < container.children.length; i++) {
			const slide: HTMLDivElement = container.children[i] as HTMLDivElement;
			const slideLeft = slide.getBoundingClientRect().x;
			const slideRight = slideLeft + slideWidth;
			const currentTranslateX = parseTranslateX(slide);

			if (slideRight < 0) {
				slide.style.transform = `translateX(${currentTranslateX + slideWidth * container.children.length}px)`;
			} else if (slideRight > slideWidth * container.children.length) {
				slide.style.transform = `translateX(${currentTranslateX - slideWidth * container.children.length}px)`;
			}
		}
	}

	function getSlideIndex(): number {
		const container = slidesContainerRef.current;
		if (!container) return 0;

		const slideWidth = container.children[0].getBoundingClientRect().width;
		const translateX = parseTranslateX(container);

		return Math.round(translateX / slideWidth) * -1;
	}

	function goToSlide(page: number) {
		const container = slidesContainerRef.current;
		if (!container) return;

		const slideWidth = container.children[0].getBoundingClientRect().width;

		scrollToWithAnimation(-(slideWidth * page));
		updateSlideTimeout();
		setNextSlideTimeoutProgress(0);
	}

	function previousSlide() {
		const container = slidesContainerRef.current;
		if (!container) return;

		goToSlide((getSlideIndex() - 1) % container.children.length);
	}

	function nextSlide() {
		const container = slidesContainerRef.current;
		if (!container) return;

		goToSlide((getSlideIndex() + 1) % container.children.length);
	}

	function resizeEventHandler() {
		const container = slidesContainerRef.current;
		if (!container) return;

		const slideWidth = container.children[0].getBoundingClientRect().width;

		container.style.transform = `translateX(${-(slideWidth * slidesProgressionRef.current)}px)`;

		translateSlideInfinite(container, slideWidth);
	}

	function calculateSlideProgression(index: number): number {
		let progression = Math.max(0, Math.min(1, 1 - Math.abs(slidesProgression - index)));

		if (index === 0 && slidesProgression > props.children.length - 1) {
			progression = Math.max(0, Math.min(1, Math.abs(slidesProgression - (props.children.length - 1) - index)));
		}

		return progression;
	}

	function updateSlideTimeout() {
		const timeout = Date.now() + 1000 * SLIDE_TIMEOUT_DURATION;

		nextSlideTimeoutRef.current = timeout;
	}

	function updateNextSlideTimeoutProgression(now: number) {
		const timeout = nextSlideTimeoutRef.current - now;

		setNextSlideTimeoutProgress(1 - timeout / (1000 * SLIDE_TIMEOUT_DURATION));
	}

	useEffect(() => {
		function createEventHandler() {
			window.addEventListener('resize', resizeEventHandler);
		}
		function removeEventHandler() {
			window.removeEventListener('resize', resizeEventHandler);
		}

		updateSlideTimeout();
		setInterval(() => {
			const now = Date.now();

			updateNextSlideTimeoutProgression(now);
			if (now >= nextSlideTimeoutRef.current) {
				nextSlide();
			}
		}, 100);
		createEventHandler();
		return removeEventHandler;
	}, []);

	return (
		<div role={'group'} aria-roledescription={'carousel'} className={styles.carousel} ref={carouselRef}>
			<div aria-atomic={false} aria-live={'off'} className={styles.slideContainer} ref={carouselContainerRef}>
				<div aria-atomic={false} aria-live={'off'} className={styles.slides} ref={slidesContainerRef}>
					{props.children.map((slide, index) => (
						<CarouselSlide
							title={`Slide ${index}`}
							key={`${index}-${slide}`}
							progression={calculateSlideProgression(index)}
							style={
								index === props.children.length - 1
									? {
											transform: `translateX(-${props.children.length}00%)`,
										}
									: undefined
							}
						/>
					))}
				</div>
			</div>
			<div className={styles.pages}>
				{props.children.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						style={{
							opacity: 0.2 + calculateSlideProgression(index) * 0.8,
							width: 6 + calculateSlideProgression(index) * 18,
						}}
					>
						<div style={{ width: 6 + nextSlideTimeoutProgress * 18 }} />
					</button>
				))}
			</div>
			<button onClick={previousSlide} className={styles.direction} style={{ left: 20, paddingRight: 1.1 }}>
				<ChevronLeft color={'currentColor'} />
			</button>
			<button onClick={nextSlide} className={styles.direction} style={{ right: 20, paddingLeft: 1.1 }}>
				<ChevronRight color={'currentColor'} />
			</button>
		</div>
	);
}
