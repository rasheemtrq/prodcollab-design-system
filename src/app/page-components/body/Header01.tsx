//Use this page to edit the main page display

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Header01: React.FC = () => {
  const pathname = usePathname();

  const getPageDetails = (path: string) => {
    switch (path) {
      case '/':
        return { title: 'ProdCollab Design System', description: 'A comprehensive UI component library built with Typescript and Tailwind CSS for streamlined development.' };
      case '/components/button':
        return { title: 'Button', description: 'The Button component offers various styles, including primary, secondary, and error variants. It is designed for flexibility and ease of use, featuring customizable labels and click handlers. Ideal for actions and navigation, it ensures consistent, accessible design across the application.' };
      case '/components/input-field':
        return { title: 'Input Field', description: 'The Input Field component is a customizable input element supporting various states like error and muted. It is designed for forms and data entry, ensuring accessibility and consistent styling. Ideal for capturing user input, it enhances the overall user experience.' };
      case '/components/chip':
        return { title: 'Chip', description: 'The Chip component represents small blocks of information, such as tags or categories. It supports customizable styles and can include icons. Perfect for adding interactive elements to your UI, the Chip is ideal for filtering, selection, or categorizing content.' };
      case '/components/avatar':
        return { title: 'Avatar', description: 'The Avatar component displays user images or placeholders, supporting various sizes and shapes. Ideal for user profiles and comment sections, it includes status indicators and handles different image sources gracefully. Fully customizable, the Avatar ensures seamless integration into any application design, enhancing user representation.' };
      case '/components/alert':
        return { title: 'Alert', description: 'The Alert component conveys important messages with default, success, and error variants. Each variant has distinct styles and corresponding icons. It provides clear, concise messages without disrupting the user experience. The Alert is perfect for informing users of updates, confirming actions, or warning about errors, integrating smoothly into any layout.' };
      case '/components/accordion':
        return { title: 'Accordion', description: 'The Accordion component is a collapsible content container ideal for FAQs and segmented content. It supports default, small, and large variants, integrates with navigation links, and features smooth animations and FontAwesome icons. Accessible and responsive, it offers a clean, organized interface, enhancing user experience by allowing users to toggle content visibility easily.' };
      case '/components/card':
        return { title: 'Card', description: 'The Card component provides a versatile container for displaying content such as text, images, and actions. It supports various layouts and styles, making it perfect for presenting information in a structured, visually appealing manner. Ideal for dashboards, product listings, and more.' };
      case '/components/skeleton':
        return { title: 'Skeleton', description: 'The Skeleton component provides a placeholder while content is loading, enhancing perceived performance. It mimics the structure of the content to be loaded, offering a smooth user experience by reducing the perceived waiting time. Ideal for improving loading states.' };
        case '/components/tablist':
          return { title: 'Tablist', description: 'The TabList component is a React functional component that displays a list of tabs. It accepts tabs (an array of tab labels), sizing (optional, defaulting to xs, can be xs, sm, md, or lg to control size), and amount (optional, to limit the number of displayed tabs). Users can click tabs to set the active tab, with active and hovered tabs styled distinctly. The component is styled using Tailwind CSS classes and ensures type safety with TypeScript.' };
        case '/components/tooltip':
        return { title: 'Tooltip', description: 'The Tooltip component displays informative text when users hover over an element. It supports smooth, upward transitions with a 200ms delay for a subtle, professional effect. Ideal for providing additional information without cluttering the UI, it enhances user interactions.' };
      case '/colors':
        return { title: 'Colors', description: 'Explore our color palette.' };
      default:
        return { title: 'Page', description: 'Welcome to our page!' };
    }
  };

  const { title, description } = getPageDetails(pathname);

  return (
    <div className="mb-12">
      <h1 className="text-[4rem] tracking-tight">{title}</h1>
      <div className="h-1 overflow-hidden rounded-full">
        <Image
          className=""
          src="/images/gradient.jpg"
          alt="Colorful underline"
          width={1920}
          height={100}
        />
      </div>
      <p className="text-md text-secondary leading-5 mt-4">{description}</p>
    </div>
  );
};

export default Header01;
