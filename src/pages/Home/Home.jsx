import React from "react";
import { Footer } from "../../components/Footer/Footer";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { CategoriesSection } from "./components/CategoriesSection/CategoriesSection";
import { VideosSection } from "./components/VideosSection/VideosSection";
import { HeroVideo } from "./components/HeroVideo/HeroVideo";
import { useData } from "../../contexts/DataProvider.js";

export const Home = () => {
  const { productsLoading, categoriesLoading } = useData();
  return (
    !productsLoading && !categoriesLoading && (
      <div className="home-page">
        <div className="hero">
          <HeroVideo />
          <HeroSection />
          <VideosSection />
          <CategoriesSection />
          <Footer />
        </div>
      </div>
    )
  );
};
