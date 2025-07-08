import React from 'react';
import Banner from './Banner/Banner';
import CallToAction from './CallToActionSection';
import AboutUsSection from './AboutUsSection';
import SuccessStoriesSection from './SuccessStoriesSection';
import HowToHelpSection from './HowToHelpSection';

const Home = () => {
    return (
        <div>
           
            <Banner></Banner>
            <CallToAction></CallToAction>
            <AboutUsSection></AboutUsSection>
            <SuccessStoriesSection></SuccessStoriesSection>
            <HowToHelpSection></HowToHelpSection>
        </div>
    );
};

export default Home;