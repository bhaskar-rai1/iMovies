import React, { useContext, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Show from "../../components/show/Show";
import { searchContext } from "../../context/searchContext";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/loader/Loader";
import "./style.scss";

const categories = ["Action", "Horror", "Romantic", "SciFi"];

const Home = () => {
  const { query } = useContext(searchContext);
  const { resData, error, loading } = useFetch(`/api/movie/getmovies`, { query });

  const [startIndex, setStartIndex] = useState(0);
  const movies = resData?.data?.movies || [];
  const visibleMovies = movies.slice(startIndex, startIndex + 4);

  const handleScroll = (direction) => {
    if (direction === "right" && startIndex + 4 < movies.length) {
      setStartIndex(startIndex + 4);
    } else if (direction === "left" && startIndex - 4 >= 0) {
      setStartIndex(startIndex - 4);
    }
  };

  if (error) alert("Something went wrong!");

  return (
    <>
      <Header />
      <div className="homeContainer">
        <div className="homeWrapper">
          {/* LEFT SECTION */}
          <div className="leftSection">
            <h2 className="sectionTitle">Trending Movies</h2>
            <div className="trendingCarouselWrapper">
              <button className="arrowBtn left" onClick={() => handleScroll("left")}>
                &#8592;
              </button>
              <div className="trendingCarousel">
                {loading ? (
                  <Loader />
                ) : (
                  visibleMovies.map((movie) => (
                    <Show key={movie._id} data={movie} />
                  ))
                )}
              </div>
              <button className="arrowBtn right" onClick={() => handleScroll("right")}>
                &#8594;
              </button>
            </div>

            <div className="offers">
              <h2 className="sectionTitle">Offers</h2>
              <div className="offerCard">
                Get up to <strong>60% off</strong> on bookings using <strong>Mastercard</strong>!
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="rightSection">
            <h2 className="sectionTitle">Categories</h2>
            <div className="categoryList">
              {categories.map((cat, i) => (
                <div className="categoryCard" key={i}>
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
