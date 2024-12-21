import React from "react";
import NewsSection from '../components/NewsSection';


function NewsPage() {
    return (
        <section className="news-page">
            <h1>Latest News</h1>
            <NewsSection />
        </section>
    );
}

export default NewsPage;