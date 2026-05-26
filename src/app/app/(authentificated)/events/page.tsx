'use client';
import styles from './page.module.scss';
import { EventItem, EventItemProps, EventItemSkeletons } from '@/components/globals/EventItem/EventItem';
import { Fragment, useEffect, useRef, useState } from 'react';

export interface EventSection {
	day: string;
	events: EventItemProps[];
}

const generateEvent = (baseDate: number, count: number): Array<EventSection> => {
	return Array.from({ length: count }, (_, index) => {
		const eventdate = new Date(baseDate + index * 24 * 3600 * 1000);
		return {
			day: `${eventdate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}`,
			events: [
				{
					date: eventdate.getTime(),
					title: 'Test',
					description: 'test',
				},
			],
		};
	});
};

export default function Page() {
	const sidebarRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const skeletonRef = useRef<HTMLDivElement | null>(null);

	const [loading, setLoading] = useState(true);
	const [scroll, setScroll] = useState<number>(0);
	const [openEvent, setOpenEvent] = useState(false);

	const [events, setEvents] = useState<Array<EventSection>>([]);
	const [containerHeight, setContainerHeight] = useState<number>(0);
	const eventsRef = useRef(events);
	const containerHeightRef = useRef<number>(containerHeight);

	useEffect(() => {
		eventsRef.current = events;
	}, [events]);
	useEffect(() => {
		containerHeightRef.current = containerHeight;
	}, [containerHeight]);

	function calculateSectionSize(eventCount: number) {
		// Text size + gap + (events * (event height + spacing))
		return 17 + 10 + eventCount * (77 + 10);
	}

	function getSizeTo(index: number) {
		let size = 0;

		for (let i = 0; i < index; i++) {
			size += calculateSectionSize(events[i].events.length);
		}

		return size;
	}

	function getTotalSize() {
		return eventsRef.current.reduce((acc, event) => {
			return acc + calculateSectionSize(event.events.length);
		}, 0);
	}

	const wheelEventHandler = (event: WheelEvent) => {
		const container = containerRef.current;
		if (!container) return;

		event.preventDefault();

		setScroll((val) => {
			const scroll = -(val - event.deltaY);
			const maxScroll = getTotalSize() + 30 - containerHeightRef.current + 252;

			return -Math.min(Math.max(0, scroll), maxScroll);
		});
	};

	const fetchEvents = () => {
		setTimeout(() => {
			const lastDate =
				events.length > 0 ? events[events.length - 1].events[0].date + 24 * 3600 * 1000 : Date.now();
			const newEvents: EventSection[] = generateEvent(lastDate, 20);
			setEvents((prev) => [...prev, ...newEvents]);
			setLoading(false);
		}, 500);
	};

	const onSkeletonShowed = async () => {
		if (loading) return;
		setLoading(true);

		fetchEvents();
	};

	useEffect(() => {
		const sidebar = sidebarRef.current;
		if (!sidebar) return;
		const container = containerRef.current;
		if (!container) return;

		function createEventHandler() {
			sidebar?.addEventListener('wheel', wheelEventHandler);
		}

		function deleteEventHandler() {
			sidebar?.removeEventListener('wheel', wheelEventHandler);
		}

		setContainerHeight(sidebar.getBoundingClientRect().height);
		createEventHandler();
		fetchEvents();
		return deleteEventHandler;
	}, []);

	return (
		<div className={styles.main}>
			<aside className={`${styles.sidebar} ${openEvent ? styles.opened : ''}`} ref={sidebarRef}>
				<div
					className={styles.eventContainer}
					ref={containerRef}
					style={{ transform: `translateY(${scroll}px)` }}
				>
					{loading && events.length == 0 && (
						<EventItemSkeletons
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
							}}
						/>
					)}
					{events.map((event, index) => {
						const OVERSCAN_SIZE = 20;

						const positionY = getSizeTo(index);
						const size = calculateSectionSize(event.events.length);

						if (-scroll > size + positionY + 10 + OVERSCAN_SIZE) return null;

						if (-scroll + containerHeight < positionY - 10 - OVERSCAN_SIZE) return null;

						if (index === events.length - 1) onSkeletonShowed();

						return (
							<Fragment key={index}>
								<section
									className={styles.eventSection}
									style={{
										top: positionY,
									}}
								>
									<span className={styles.eventSectionTitle}>{event.day}</span>
									{event.events.map((e, i) => (
										<EventItem onClick={() => setOpenEvent((p) => !p)} key={i} {...e} />
									))}
								</section>
								{index === events.length - 1 && (
									<EventItemSkeletons
										ref={skeletonRef}
										style={{
											position: 'absolute',
											top: getSizeTo(index + 1),
											left: 0,
											right: 0,
										}}
									/>
								)}
							</Fragment>
						);
					})}
				</div>
			</aside>
			<div className={`${styles.content} ${openEvent ? styles.opened : ''}`}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum
					magnis. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis
					dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue ut
					porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem
					ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis,
					pulvinar a semper sed, adipiscing id dolor.
				</p>
			</div>
		</div>
	);
}
