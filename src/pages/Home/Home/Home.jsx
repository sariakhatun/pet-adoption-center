import React from 'react';
import Banner from './Banner/Banner';
import CallToAction from './CallToActionSection';
import AboutUsSection from './AboutUsSection';
import SuccessStoriesSection from './SuccessStoriesSection';
import HowToHelpSection from './HowToHelpSection';
import PetsCategory from './PetsCategory';
import RecentPets from './RecentPets';
import NewsletterSection from './HowItWorksSection';
import HowItWorksSection from './HowItWorksSection';

const Home = () => {
    return (
        <div>
           
            <Banner></Banner>
            
            <HowItWorksSection></HowItWorksSection>
            <CallToAction></CallToAction>
            
            <AboutUsSection></AboutUsSection>
            <RecentPets></RecentPets>
            <PetsCategory></PetsCategory>
            <SuccessStoriesSection></SuccessStoriesSection>
            
            <HowToHelpSection></HowToHelpSection>
            
        </div>
    );
};

export default Home;