import React, { useRef } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Item from './Item';
import { List as ListType } from '../typing';

interface Props {
    list: ListType;
}

const Lists: React.FC<Props> = ({ list }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const handleClick = (direction: string) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth
                : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="pl-1">
            <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200">
                {list.title}
            </h2>
            <div className="group relative md:ml-2">
                <HiChevronLeft
                    className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 group-hover:opacity-100`}
                    onClick={() => handleClick('left')}
                />
                <div
                    className="flex items-center space-x-0.5 overflow-x-scroll overflow-y-hidden scrollbar-hide"
                    ref={rowRef}
                >
                    {list.items && list.items.map((item) => (
                        <Item key={item.id} item={item} />
                    ))}
                </div>
                <HiChevronRight
                    className={`absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 group-hover:opacity-100`}
                    onClick={() => handleClick('right')}
                />
            </div>
        </div>
    );
};

export default Lists;
