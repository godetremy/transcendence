'use client';
import styles from './component.module.scss';
import { RefObject, useEffect, useRef, useState } from 'react';
import { CarouselSlide, SlideProps } from '@/components/carousel/CarouselSlide/CarouselSlide';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselProps {
	slides: SlideProps[];
}

export function Carousel(props: CarouselProps) {
	const SLIDE_TIMEOUT_DURATION = 8;

	const carouselRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
	const carouselContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
	const slidesContainerRef: RefObject<HTMLDivElement | null> = useRef(null);

	const nextSlideTimeoutRef = useRef(0);
	const slideTimeoutPaused = useRef(false);
	const [nextSlideTimeoutProgress, setNextSlideTimeoutProgress] = useState(0);
	const [slidesProgression, setSlidesProgression] = useState<number>(0);
	const slidesProgressionRef = useRef(slidesProgression);

	const dragBaseXPosition = useRef(0);
	const dragBaseTranslateX = useRef(0);

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
			const slideDifference = -translateX - slideWidth * (container.children.length - 1);
			translateX = slideWidth - slideDifference;
			distance = -slideWidth + slideDifference;

			container.style.transform = `translateX(${translateX}px)`;
			translateSlideInfinite(container, slideWidth);
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

		if (index === 0 && slidesProgression > props.slides.length - 1) {
			progression = Math.max(0, Math.min(1, Math.abs(slidesProgression - (props.slides.length - 1) - index)));
		}

		return progression;
	}

	function updateSlideTimeout() {
		nextSlideTimeoutRef.current = Date.now() + 1000 * SLIDE_TIMEOUT_DURATION;
	}

	function updateNextSlideTimeoutProgression(now: number) {
		const timeout = nextSlideTimeoutRef.current - now;

		setNextSlideTimeoutProgress(1 - timeout / (1000 * SLIDE_TIMEOUT_DURATION));
	}

	function beginDragEventHandler(event: MouseEvent) {
		const container = slidesContainerRef.current;
		if (!container) return;

		dragBaseXPosition.current = event.x;
		dragBaseTranslateX.current = parseTranslateX(container);
	}

	function dragEventHandler(event: MouseEvent) {
		if (event.buttons !== 1) return;

		slideTimeoutPaused.current = true;

		const container = slidesContainerRef.current;
		if (!container) return;

		const slideWidth = container.children[0].getBoundingClientRect().width;

		const progression = (event.x - dragBaseXPosition.current) / slideWidth;
		let translateX = dragBaseTranslateX.current + progression * slideWidth;

		if (translateX > 0) {
			translateX = -(slideWidth * container.children.length) + translateX;
		}
		if (translateX < -(slideWidth * container.children.length)) {
			translateX += slideWidth * container.children.length;
		}

		container.style.transform = `translateX(${translateX}px)`;
		translateSlideInfinite(container, slideWidth);

		setSlidesProgression(-(translateX / slideWidth));
	}

	function endDragEventHandler() {
		const container = slidesContainerRef.current;
		if (!container) return;

		slideTimeoutPaused.current = false;
		updateSlideTimeout();

		const slideWidth = container.children[0].getBoundingClientRect().width;
		const translateX = parseTranslateX(container);

		const targetSlide = (Math.round(-(translateX / slideWidth)) * 1.2) % container.children.length;
		goToSlide(targetSlide);
	}

	function convertTouchEventToMouseEvent(event: TouchEvent) {
		return new MouseEvent(event.type, {
			buttons: 1,
			clientX: event.touches.length > 0 ? event.touches[0]?.clientX : 0,
		});
	}

	function beginDragTouchEventHandler(event: TouchEvent) {
		event.preventDefault();
		beginDragEventHandler(convertTouchEventToMouseEvent(event));
	}
	function dragTouchEventHandler(event: TouchEvent) {
		event.preventDefault();
		dragEventHandler(convertTouchEventToMouseEvent(event));
	}
	function endDragTouchEventHandler() {
		endDragEventHandler();
	}

	useEffect(() => {
		const container = carouselContainerRef.current;
		if (!container) return;

		function createEventHandler() {
			window.addEventListener('resize', resizeEventHandler);
			container?.addEventListener('mousedown', beginDragEventHandler);
			container?.addEventListener('mousemove', dragEventHandler);
			container?.addEventListener('mouseup', endDragEventHandler);
			container?.addEventListener('touchstart', beginDragTouchEventHandler);
			container?.addEventListener('touchmove', dragTouchEventHandler);
			container?.addEventListener('touchend', endDragTouchEventHandler);
		}
		function removeEventHandler() {
			window.removeEventListener('resize', resizeEventHandler);
			container?.removeEventListener('mousedown', beginDragEventHandler);
			container?.removeEventListener('mousemove', dragEventHandler);
			container?.removeEventListener('mouseup', endDragEventHandler);
			container?.removeEventListener('touchstart', beginDragTouchEventHandler);
			container?.removeEventListener('touchmove', dragTouchEventHandler);
			container?.removeEventListener('touchend', endDragTouchEventHandler);
		}

		updateSlideTimeout();
		setInterval(() => {
			const now = Date.now();

			if (slideTimeoutPaused.current) nextSlideTimeoutRef.current += 100;

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
					{props.slides.map((slide, index) => (
						<CarouselSlide
							{...slide}
							key={`${index}-${slide}`}
							progression={calculateSlideProgression(index)}
							style={
								index === props.slides.length - 1
									? {
											transform: `translateX(-${props.slides.length}00%)`,
										}
									: undefined
							}
						/>
					))}
				</div>
			</div>
			<div className={styles.pages}>
				{props.slides.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						style={{
							opacity: 0.2 + calculateSlideProgression(index) * 0.8,
							width: 6 + (slideTimeoutPaused.current ? 0 : calculateSlideProgression(index)) * 18,
						}}
					>
						<div style={{ width: 6 + (slideTimeoutPaused.current ? 0 : nextSlideTimeoutProgress) * 18 }} />
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
